import { createHash } from "node:crypto";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db } from "./firebase";
import { MAX_HEARTS } from "./curriculum";
import { getSessionUid } from "./session";

export type Daily = { date: string; xp: number; lessons: number; perfect: number; claimed: string[] };

export type UserDoc = {
  name: string;
  email: string;
  passwordHash: string;
  xp: number;
  gems: number;
  hearts: number;
  streak: number;
  streakFreezes: number;
  lastActiveDate: string | null;
  completed: string[];
  daily: Daily;
  createdAt: number;
  // --- fitur toko, misi & tantangan bulanan ---
  language: string;
  xpBoostUntil: number; // epoch ms; XP 2x aktif selama sekarang < nilai ini
  owned: string[]; // id kostum yang dimiliki
  equipped: string | null; // id kostum yang dipakai
  goalDays: string[]; // tanggal (YYYY-MM-DD) saat target harian tercapai
  monthlyClaimed: string; // "YYYY-MM" bulan yang hadiahnya sudah diklaim
  perfectTotal: number; // total pelajaran tanpa salah
  dummy?: boolean;
};

export type User = Omit<UserDoc, "passwordHash"> & { id: string };

export const users = () => db.collection("users");

/** Tanggal hari ini (zona waktu WIB) format YYYY-MM-DD. */
export function today(offsetDays = 0): string {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(d);
}

export const thisMonth = () => today().slice(0, 7);

export const emptyDaily = (): Daily => ({ date: today(), xp: 0, lessons: 0, perfect: 0, claimed: [] });

/** ID dokumen = hash email → menjamin email unik lewat `create()`. */
export const userIdFromEmail = (email: string) =>
  createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 32);

export function newUserDoc(name: string, email: string, passwordHash: string, language = "en"): UserDoc {
  return withDefaults({
    name,
    email: email.trim().toLowerCase(),
    passwordHash,
    xp: 0,
    gems: 0,
    hearts: MAX_HEARTS,
    streak: 0,
    streakFreezes: 0,
    lastActiveDate: null,
    completed: [],
    daily: emptyDaily(),
    createdAt: Date.now(),
    language,
  });
}

/** Isi field baru untuk dokumen lama yang dibuat sebelum fitur tersebut ada. */
export function withDefaults(d: Partial<UserDoc> & Pick<UserDoc, "name" | "email" | "passwordHash">): UserDoc {
  return {
    xp: 0,
    gems: 0,
    hearts: MAX_HEARTS,
    streak: 0,
    streakFreezes: 0,
    lastActiveDate: null,
    completed: [],
    daily: emptyDaily(),
    createdAt: Date.now(),
    language: "en",
    xpBoostUntil: 0,
    owned: [],
    equipped: null,
    goalDays: [],
    monthlyClaimed: "",
    perfectTotal: 0,
    ...d,
  };
}

function toUser(id: string, raw: UserDoc): User {
  const { passwordHash: _omit, ...rest } = withDefaults(raw);
  void _omit;
  // Hapus field non-plain object seperti Firestore Timestamp (updatedAt dsb)
  // agar aman dioper dari Server Component ke Client Component
  const cleanRest = { ...rest };
  delete (cleanRest as Record<string, unknown>).updatedAt;

  // reset progres harian jika hari sudah berganti
  const daily = cleanRest.daily?.date === today() ? cleanRest.daily : emptyDaily();
  return { id, ...cleanRest, daily };
}

export async function getUser(uid: string): Promise<User | null> {
  await connection();
  const snap = await users().doc(uid).get();
  return snap.exists ? toUser(snap.id, snap.data() as UserDoc) : null;
}

/** Dipakai oleh halaman terproteksi. Panggil di dalam <Suspense>. */
export async function requireUser(): Promise<User> {
  await connection();
  const uid = await getSessionUid();
  if (!uid) redirect("/masuk");
  const user = await getUser(uid);
  if (!user) redirect("/masuk");
  return user;
}

export async function getLeaderboard(limit = 20): Promise<User[]> {
  await connection();
  const snap = await users().orderBy("xp", "desc").limit(limit).get();
  return snap.docs.map((d) => toUser(d.id, d.data() as UserDoc));
}

export async function getRank(xp: number): Promise<number> {
  await connection();
  const snap = await users().where("xp", ">", xp).count().get();
  return snap.data().count + 1;
}

export { toUser };
