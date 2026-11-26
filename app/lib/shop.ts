// Katalog toko, liga, dan paket modul pembelajaran Cakapin
import type { IconName } from "../components/game-icon";

export const SHOP = {
  freeze: { cost: 100, max: 2 },
  hearts: { cost: 50 },
  xp2x: { cost: 80, minutes: 30 },
} as const;
export type ShopItem = keyof typeof SHOP;

export const COSTUMES = [
  {
    id: "interview",
    name: "Modul Wawancara Kerja",
    desc: "Panduan praktis menjawab 15 pertanyaan interview bahasa Inggris paling sering ditanyakan.",
    cost: 300,
    icon: "hat",
    tag: "Karir & Bisnis",
  },
  {
    id: "travel",
    name: "Travel Emergency Phrases",
    desc: "Kumpulan frasa darurat di bandara, imigrasi, hotel, dan memesan makanan di luar negeri.",
    cost: 250,
    icon: "headband",
    tag: "Wisata",
  },
  {
    id: "slang",
    name: "Slang & Idiom Populer",
    desc: "Pelajari ungkapan kasual sehari-hari yang sering digunakan di podcast dan film barat.",
    cost: 350,
    icon: "magic",
    tag: "Percakapan",
  },
] as const satisfies readonly { id: string; name: string; desc: string; cost: number; icon: IconName; tag: string }[];

export const MONTHLY_TARGET = 30;
export const MONTHLY_REWARD = 500;

export const LEAGUES = [
  { name: "Liga Perunggu", min: 0 },
  { name: "Liga Perak", min: 100 },
  { name: "Liga Emas", min: 300 },
  { name: "Liga Safir", min: 700 },
  { name: "Liga Berlian", min: 1500 },
] as const;

export function leagueFor(xp: number) {
  let idx = 0;
  LEAGUES.forEach((l, i) => {
    if (xp >= l.min) idx = i;
  });
  return { current: LEAGUES[idx], next: LEAGUES[idx + 1] ?? null };
}

/** Tanggal terakhir bulan ini → sisa hari (WIB, pembulatan sederhana). */
export function daysLeftInMonth(todayStr: string): number {
  const [y, m, d] = todayStr.split("-").map(Number);
  const last = new Date(y, m, 0).getDate();
  return last - d;
}
