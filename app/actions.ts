"use server";

import { redirect } from "next/navigation";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import {
  DAILY_XP_GOAL,
  GEMS_PER_LESSON,
  MAX_HEARTS,
  XP_PER_QUESTION,
  getLesson,
  sessionSize,
} from "./lib/curriculum";
import { COSTUMES, MONTHLY_REWARD, MONTHLY_TARGET, SHOP, type ShopItem } from "./lib/shop";
import { db } from "./lib/firebase";
import { createSession, destroySession, hashPassword, readSessionUid, verifyPassword } from "./lib/session";
import {
  emptyDaily,
  newUserDoc,
  thisMonth,
  today,
  userIdFromEmail,
  users,
  withDefaults,
  type UserDoc,
} from "./lib/users";

export type FormState = { error?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LANGS = ["en"]; // baru bahasa Inggris yang tersedia

/* ---------- Auth ---------- */
export async function signup(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const language = String(formData.get("language") ?? "en");

  if (name.length < 2) return { error: "Nama minimal 2 karakter." };
  if (!EMAIL_RE.test(email)) return { error: "Format email tidak valid." };
  if (password.length < 8) return { error: "Kata sandi minimal 8 karakter." };
  if (!LANGS.includes(language)) return { error: "Bahasa belum tersedia." };
  if (formData.get("terms") !== "on") return { error: "Setujui Ketentuan Layanan dan Kebijakan Privasi." };

  const uid = userIdFromEmail(email);
  try {
    await users().doc(uid).create(newUserDoc(name, email, await hashPassword(password), language));
  } catch (e) {
    if ((e as { code?: number }).code === 6) return { error: "Email sudah terdaftar. Silakan masuk." };
    throw e;
  }
  await createSession(uid);
  redirect("/belajar");
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";
  const invalid = { error: "Email atau kata sandi salah." };

  if (!EMAIL_RE.test(email) || !password) return invalid;
  const uid = userIdFromEmail(email);
  const snap = await users().doc(uid).get();
  if (!snap.exists) return invalid;
  if (!(await verifyPassword(password, (snap.data() as UserDoc).passwordHash))) return invalid;

  await createSession(uid, remember);
  redirect("/belajar");
}

export async function logout() {
  await destroySession();
  redirect("/masuk");
}

/* ---------- Gameplay ---------- */
export type FinishResult =
  | { ok: true; xp: number; gems: number; streak: number; perfect: boolean; boosted: boolean }
  | { ok: false; error: string };

export async function finishLesson(lessonId: string, mistakes: number): Promise<FinishResult> {
  const uid = await readSessionUid();
  if (!uid) return { ok: false, error: "Sesi berakhir, silakan masuk lagi." };
  const lesson = getLesson(lessonId);
  if (!lesson || lesson.questions.length === 0) return { ok: false, error: "Pelajaran tidak ditemukan." };

  const m = Math.max(0, Math.min(Math.floor(mistakes) || 0, sessionSize(lesson)));
  const perfect = m === 0;

  const res = await tx(uid, (u) => {
    // Nyawa habis di tengah pelajaran → pelajaran tidak dianggap selesai.
    if (m >= u.hearts) {
      return {
        result: { ok: true as const, xp: 0, gems: 0, streak: u.streak, perfect: false, boosted: false },
        patch: { hearts: 0 },
      };
    }
    const first = !u.completed.includes(lessonId);
    const boosted = u.xpBoostUntil > Date.now();
    const base = first ? Math.max(5, sessionSize(lesson) * XP_PER_QUESTION - m * 5) : 5;
    const xp = boosted ? base * 2 : base;
    const gems = first ? GEMS_PER_LESSON + (perfect ? 5 : 0) : 0;

    const t = today();
    let streak = u.streak;
    let freezes = u.streakFreezes;
    if (u.lastActiveDate !== t) {
      if (u.lastActiveDate === today(-1)) streak = u.streak + 1;
      else if (u.lastActiveDate === today(-2) && freezes > 0) {
        streak = u.streak + 1; // pelindung rangkaian menyelamatkan 1 hari yang terlewat
        freezes -= 1;
      } else streak = 1;
    }
    const daily = u.daily?.date === t ? u.daily : emptyDaily();
    const dailyAfter = {
      ...daily,
      xp: daily.xp + xp,
      lessons: daily.lessons + 1,
      perfect: daily.perfect + (perfect ? 1 : 0),
    };
    // catat hari saat target harian tercapai (untuk tantangan bulanan)
    const goalDays =
      dailyAfter.xp >= DAILY_XP_GOAL && !u.goalDays.includes(t) ? [...u.goalDays, t].slice(-62) : u.goalDays;

    return {
      result: { ok: true as const, xp, gems, streak, perfect, boosted },
      patch: {
        xp: u.xp + xp,
        gems: u.gems + gems,
        hearts: Math.max(0, u.hearts - m),
        streak,
        streakFreezes: freezes,
        lastActiveDate: t,
        completed: first ? [...u.completed, lessonId] : u.completed,
        daily: dailyAfter,
        goalDays,
        perfectTotal: u.perfectTotal + (perfect ? 1 : 0),
      },
    };
  });
  revalidatePath("/", "layout");
  return res;
}

/* ---------- Toko ---------- */
type Result = { error?: string };

export async function buyItem(item: ShopItem): Promise<Result> {
  const uid = await readSessionUid();
  if (!uid) return { error: "Silakan masuk lagi." };
  const def = SHOP[item];
  if (!def) return { error: "Item tidak dikenal." };

  const res = await tx<Result>(uid, (u) => {
    if (u.gems < def.cost) return { result: { error: "Permata tidak cukup." }, patch: null };
    if (item === "hearts") {
      if (u.hearts >= MAX_HEARTS) return { result: { error: "Nyawa sudah penuh." }, patch: null };
      return { result: {}, patch: { gems: u.gems - def.cost, hearts: MAX_HEARTS } };
    }
    if (item === "freeze") {
      if (u.streakFreezes >= SHOP.freeze.max) return { result: { error: "Maksimal tersimpan." }, patch: null };
      return { result: {}, patch: { gems: u.gems - def.cost, streakFreezes: u.streakFreezes + 1 } };
    }
    // xp2x: perpanjang bila masih aktif
    const from = Math.max(Date.now(), u.xpBoostUntil);
    return {
      result: {},
      patch: { gems: u.gems - def.cost, xpBoostUntil: from + SHOP.xp2x.minutes * 60_000 },
    };
  });
  revalidatePath("/", "layout");
  return res;
}

export async function buyCostume(id: string): Promise<Result> {
  const uid = await readSessionUid();
  if (!uid) return { error: "Silakan masuk lagi." };
  const costume = COSTUMES.find((c) => c.id === id);
  if (!costume) return { error: "Kostum tidak dikenal." };

  const res = await tx<Result>(uid, (u) => {
    if (u.owned.includes(id)) return { result: { error: "Sudah dimiliki." }, patch: null };
    if (u.gems < costume.cost) return { result: { error: "Permata tidak cukup." }, patch: null };
    return { result: {}, patch: { gems: u.gems - costume.cost, owned: [...u.owned, id], equipped: id } };
  });
  revalidatePath("/", "layout");
  return res;
}

export async function equipCostume(id: string | null): Promise<Result> {
  const uid = await readSessionUid();
  if (!uid) return { error: "Silakan masuk lagi." };

  const res = await tx<Result>(uid, (u) => {
    if (id !== null && !u.owned.includes(id)) return { result: { error: "Kostum belum dimiliki." }, patch: null };
    return { result: {}, patch: { equipped: id } };
  });
  revalidatePath("/", "layout");
  return res;
}

/* ---------- Misi ---------- */
const QUESTS: Record<string, { target: (d: ReturnType<typeof emptyDaily>) => boolean; gems: number }> = {
  xp: { target: (d) => d.xp >= DAILY_XP_GOAL, gems: 10 },
  lessons: { target: (d) => d.lessons >= 2, gems: 10 },
  perfect: { target: (d) => d.perfect >= 1, gems: 15 },
};

export async function claimQuest(id: string): Promise<Result> {
  const uid = await readSessionUid();
  if (!uid) return { error: "Silakan masuk lagi." };
  const quest = QUESTS[id];
  if (!quest) return { error: "Misi tidak dikenal." };

  const res = await tx<Result>(uid, (u) => {
    const daily = u.daily?.date === today() ? u.daily : emptyDaily();
    if (!quest.target(daily)) return { result: { error: "Misi belum selesai." }, patch: null };
    if (daily.claimed.includes(id)) return { result: { error: "Sudah diklaim." }, patch: null };
    return {
      result: {},
      patch: { gems: u.gems + quest.gems, daily: { ...daily, claimed: [...daily.claimed, id] } },
    };
  });
  revalidatePath("/", "layout");
  return res;
}

export async function claimMonthly(): Promise<Result> {
  const uid = await readSessionUid();
  if (!uid) return { error: "Silakan masuk lagi." };

  const res = await tx<Result>(uid, (u) => {
    const month = thisMonth();
    const days = u.goalDays.filter((d) => d.startsWith(month)).length;
    if (days < MONTHLY_TARGET) return { result: { error: "Tantangan belum selesai." }, patch: null };
    if (u.monthlyClaimed === month) return { result: { error: "Hadiah sudah diklaim." }, patch: null };
    return { result: {}, patch: { gems: u.gems + MONTHLY_REWARD, monthlyClaimed: month } };
  });
  revalidatePath("/", "layout");
  return res;
}

/* ---------- helper transaksi ---------- */
async function tx<R>(
  uid: string,
  fn: (u: UserDoc) => { result: R; patch: Partial<UserDoc> | null },
): Promise<R> {
  const ref = users().doc(uid);
  return db.runTransaction(async (t) => {
    const snap = await t.get(ref);
    if (!snap.exists) throw new Error("User tidak ditemukan");
    const { result, patch } = fn(withDefaults(snap.data() as UserDoc));
    if (patch) t.update(ref, { ...patch, updatedAt: FieldValue.serverTimestamp() });
    return result;
  });
}
