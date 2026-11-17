/**
 * Seed 30 pengguna dummy ke Firestore (agar papan peringkat terlihat ramai).
 *
 *   npm run seed:users
 *
 * - Idempotent: dokumen dummy lama (dummy == true) dihapus lalu dibuat ulang.
 * - Akun dummy TIDAK bisa dipakai login (passwordHash tidak valid).
 * - Kredensial dibaca seperti di app: FIREBASE_SERVICE_ACCOUNT_JSON atau
 *   FIREBASE_SERVICE_ACCOUNT_PATH (default ./serviceAccountKey.json).
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// --- baca .env sederhana (tanpa dependensi) ---
if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const account = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
  : JSON.parse(
      readFileSync(path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? "serviceAccountKey.json"), "utf8"),
    );

const app = getApps()[0] ?? initializeApp({ credential: cert(account) });
const db = getFirestore(app);

// --- util ---
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20261117); // deterministik
const int = (min, max) => Math.floor(rnd() * (max - min + 1)) + min;

const today = (offset = 0) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date(Date.now() + offset * 86_400_000));

const idFromEmail = (email) => createHash("sha256").update(email).digest("hex").slice(0, 32);

const NAMES = [
  "Rina Sari", "Budi Jaya", "Dimas Wicaksono", "Siti Rahma", "Andi Pratama", "Putri Ayu", "Fajar Nugroho",
  "Nadia Safitri", "Rizky Ramadhan", "Dewi Lestari", "Agus Setiawan", "Maya Anggraini", "Hendra Gunawan",
  "Citra Kirana", "Yoga Permana", "Lestari Wulandari", "Bagas Saputra", "Intan Permata", "Eko Prasetyo",
  "Salsabila Putri", "Rangga Aditya", "Ayu Ningsih", "Taufik Hidayat", "Mega Puspita", "Ilham Maulana",
  "Fitri Handayani", "Doni Kurniawan", "Anisa Rahmawati", "Reza Firmansyah", "Karina Dewi",
];
const COSTUMES = ["hat", "headband", "magic"];

const users = NAMES.slice(0, 30).map((name, i) => {
  // XP menurun dari peringkat atas ke bawah dengan sedikit variasi
  const xp = Math.max(25, Math.round(1900 * Math.pow(0.9, i) + int(-30, 30)));
  const completedCount = Math.min(48, Math.floor(xp / 40) + int(0, 2));
  const completed = Array.from({ length: completedCount }, (_, n) => `u${Math.floor(n / 6) + 1}-l${(n % 6) + 1}`);
  const active = rnd() > 0.2; // 80% aktif hari ini / kemarin
  const streak = active ? int(1, Math.min(60, 4 + Math.floor(xp / 60))) : 0;
  const owned = COSTUMES.filter(() => rnd() < Math.min(0.7, xp / 2500));
  const month = today().slice(0, 7);
  const dayNow = Number(today().slice(8, 10));
  const goalCount = Math.min(dayNow, int(1, Math.max(1, Math.min(dayNow, Math.round(xp / 70)))));
  const goalDays = Array.from({ length: goalCount }, (_, d) => `${month}-${String(dayNow - d).padStart(2, "0")}`);
  const slug = name.toLowerCase().replace(/[^a-z]+/g, ".");
  const email = `${slug}@dummy.cakapin.test`;

  return [
    idFromEmail(email),
    {
      name,
      email,
      passwordHash: "!", // tidak valid → tidak bisa login
      xp,
      gems: int(10, 600),
      hearts: int(2, 5),
      streak,
      streakFreezes: int(0, 2),
      lastActiveDate: streak > 0 ? today(rnd() > 0.5 ? 0 : -1) : today(-int(3, 20)),
      completed,
      daily: { date: today(), xp: active ? int(0, 60) : 0, lessons: active ? int(0, 3) : 0, perfect: 0, claimed: [] },
      createdAt: Date.now() - int(5, 120) * 86_400_000,
      language: "en",
      xpBoostUntil: 0,
      owned,
      equipped: owned.length ? owned[int(0, owned.length - 1)] : null,
      goalDays,
      monthlyClaimed: "",
      perfectTotal: int(0, Math.max(1, Math.floor(completedCount / 3))),
      dummy: true,
    },
  ];
});

// --- tulis ---
const old = await db.collection("users").where("dummy", "==", true).get();
const batch = db.batch();
old.docs.forEach((d) => batch.delete(d.ref));
users.forEach(([id, data]) => batch.set(db.collection("users").doc(id), data));
await batch.commit();

console.log(`Selesai: hapus ${old.size} dummy lama, buat ${users.length} dummy baru.`);
console.log("Top 5:", users.slice(0, 5).map(([, u]) => `${u.name} (${u.xp} XP)`).join(", "));
