"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { GameIcon } from "../../components/game-icon";
import { StatBar } from "../../components/stats";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import type { User } from "../../lib/users";

export interface PeringkatProps {
  user: User;
  board: User[];
  rank: number;
  leagueName: string;
}

export function PeringkatView({ user, board, rank, leagueName }: PeringkatProps) {
  // Temukan peserta tepat 1 peringkat di atas user untuk perbandingan Rival
  const rivalIndex = Math.max(0, rank - 2);
  const rival = board[rivalIndex] && board[rivalIndex].id !== user.id ? board[rivalIndex] : board[0];
  const xpDifference = rival ? Math.max(1, rival.xp - user.xp) : 0;

  // Zona Promosi (Top 7)
  const promotionZone = board.slice(0, 7);
  // Zona Bertahan (Peringkat 8 - 24)
  const safeZone = board.slice(7, 24);
  // Zona Degradasi (Peringkat 25 - 30)
  const demotionZone = board.slice(24);

  return (
    <div className="w-full py-6">
      <div className="mb-6">
        <StatBar user={user} />
      </div>

      {/* Top League Hero Banner Modern */}
      <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-r from-slate-900 to-slate-800 p-6 sm:p-8 text-white shadow-md mb-8">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300">
              <span className="icon text-4xl sm:text-5xl">military_tech</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-amber-400/20 border border-amber-300/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
                  Divisi Aktif
                </span>
                <span className="text-xs font-bold text-slate-300">Periode Mingguan</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{leagueName}</h1>
              <p className="mt-1 text-xs sm:text-sm font-medium text-slate-300">
                Amankan posisi 7 besar teratas sebelum hari Minggu untuk promosi ke kasta liga berikutnya!
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end rounded-2xl bg-slate-800/80 border border-slate-700/80 px-5 py-3.5 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-rose-400 mb-0.5">
              <span className="icon text-base">timer</span> Sisa Waktu Liga
            </div>
            <span className="text-xl font-black text-white">1 Hari 14 Jam</span>
            <span className="text-[11px] font-medium text-slate-400">Reset Senin 00:00 WIB</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Tabel Peringkat + Sidebar Interaktif */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Tabel Peserta (8 Kolom) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="icon text-primary text-2xl">leaderboard</span>
              <div>
                <h2 className="text-base font-black text-ink">Klasemen Peserta Grup</h2>
                <p className="text-xs font-medium text-ink-muted">30 Siswa yang setara di grup mingguanmu</p>
              </div>
            </div>
            <span className="rounded-full bg-surface-low px-3 py-1 text-xs font-black text-ink">
              Top 30
            </span>
          </Card>

          {/* Table Header Legend */}
          <div className="grid grid-cols-12 px-5 py-1 text-xs font-black uppercase tracking-wider text-ink-muted">
            <div className="col-span-2 text-center">Posisi</div>
            <div className="col-span-6">Pengguna</div>
            <div className="col-span-2 text-right">Poin XP</div>
            <div className="col-span-2 text-center">Status</div>
          </div>

          {/* Kontainer Scroll Internal agar pas dengan Sidebar */}
          <div className="flex flex-col gap-4 max-h-[720px] overflow-y-auto pr-1">
            {/* 1. Zona Promosi (Top 7) */}
            <div className="flex flex-col gap-2 p-3 rounded-3xl bg-emerald-50/50 border border-emerald-200">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-emerald-800">
                  <span className="icon text-base text-emerald-600">arrow_upward</span> ZONA PROMOSI (TOP 7)
                </span>
                <span className="text-[11px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                  Naik Kasta Liga
                </span>
              </div>
              {promotionZone.map((u, i) => (
                <UserRow key={u.id} user={u} rank={i + 1} isCurrentUser={u.id === user.id} status="promo" />
              ))}
            </div>

            {/* 2. Zona Bertahan */}
            {safeZone.length > 0 && (
              <div className="flex flex-col gap-2 p-3 rounded-3xl bg-white border border-line">
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-ink-muted">
                    <span className="icon text-base text-slate-400">shield</span> ZONA BERTAHAN
                  </span>
                  <span className="text-[11px] font-black text-ink-muted bg-surface-low px-2 py-0.5 rounded-full">
                    Peringkat 8 - 24
                  </span>
                </div>
                {safeZone.map((u, i) => (
                  <UserRow key={u.id} user={u} rank={i + 8} isCurrentUser={u.id === user.id} status="safe" />
                ))}
              </div>
            )}

            {/* 3. Zona Degradasi */}
            {demotionZone.length > 0 && (
              <div className="flex flex-col gap-2 p-3 rounded-3xl bg-rose-50/40 border border-rose-200">
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-rose-800">
                    <span className="icon text-base text-rose-600">arrow_downward</span> ZONA DEGRADASI (TERBAWAH)
                  </span>
                  <span className="text-[11px] font-black text-rose-700 bg-white px-2 py-0.5 rounded-full border border-rose-200">
                    Turun Kasta
                  </span>
                </div>
                {demotionZone.map((u, i) => (
                  <UserRow key={u.id} user={u} rank={i + 25} isCurrentUser={u.id === user.id} status="demote" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Head-to-Head Rival & Hadiah Liga (4 Kolom) */}
        <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-6 lg:h-fit">
          {/* Head-to-Head Rival Card (Pembeda Kuat & Pendorong Belajar) */}
          {rival && (
            <Card className="p-5 border-amber-300/80 bg-gradient-to-br from-amber-50/40 to-white shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200/60">
                <span className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-800">
                  <span className="icon text-base text-amber-500">sports_kabaddi</span> Rival Terdekat
                </span>
                <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Target Salip
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white font-black text-sm">
                    {rival.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-ink">{rival.name}</h4>
                    <span className="text-xs font-extrabold text-slate-500">{rival.xp} XP</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-xs font-black text-rose-600">+{xpDifference} XP</span>
                  <span className="text-[10px] font-bold text-ink-muted">Jarak Selisih</span>
                </div>
              </div>

              <p className="text-xs font-medium text-slate-600 mb-4 leading-relaxed">
                Hanya butuh sekitar <strong>{Math.ceil(xpDifference / 15)} sesi latihan</strong> lagi untuk melompati rivalmu di papan klasemen!
              </p>

              <Link href="/learn" className="block">
                <Button variant="primary" size="md" className="w-full">
                  Kejar Sekarang (+15 XP)
                </Button>
              </Link>
            </Card>
          )}

          {/* Hadiah Papan Peringkat Mingguan */}
          <Card className="p-5">
            <div className="flex items-center gap-2 pb-3 border-b border-line mb-3">
              <span className="icon text-amber-500 text-xl">military_tech</span>
              <h3 className="text-sm font-black uppercase tracking-wider text-ink">Hadiah Akhir Pekan</h3>
            </div>

            <div className="flex flex-col gap-2.5 text-xs font-bold text-slate-700">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/50">
                <span className="flex items-center gap-2 font-black text-amber-900">
                  <span className="icon text-base text-amber-500">looks_one</span> Juara 1
                </span>
                <span className="font-black text-amber-700">+500 Permata</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="flex items-center gap-2 font-black text-slate-800">
                  <span className="icon text-base text-slate-400">looks_two</span> Juara 2
                </span>
                <span className="font-black text-slate-700">+300 Permata</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="flex items-center gap-2 font-black text-slate-800">
                  <span className="icon text-base text-amber-700">looks_3</span> Juara 3
                </span>
                <span className="font-black text-slate-700">+150 Permata</span>
              </div>
            </div>

            <p className="mt-3 text-[11px] font-medium text-ink-muted leading-relaxed">
              *Hadiah permata akan dikreditkan otomatis setiap hari Senin pukul 00:00 WIB.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function UserRow({
  user,
  rank,
  isCurrentUser,
  status,
}: {
  user: User;
  rank: number;
  isCurrentUser: boolean;
  status: "promo" | "safe" | "demote";
}) {
  return (
    <div
      className={`grid grid-cols-12 items-center px-4 py-3 rounded-2xl border transition-all ${
        isCurrentUser
          ? "border-emerald-500 bg-emerald-50/80 shadow-xs"
          : "border-slate-200/80 bg-white hover:border-slate-300"
      }`}
    >
      <div className="col-span-2 text-center">
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black ${
            rank === 1
              ? "bg-amber-400 text-white"
              : rank === 2
              ? "bg-slate-300 text-slate-800"
              : rank === 3
              ? "bg-amber-600 text-white"
              : "text-ink-muted"
          }`}
        >
          {rank}
        </span>
      </div>

      <div className="col-span-6 flex items-center gap-2.5 min-w-0 pr-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-low text-xs font-black text-ink uppercase">
          {user.name.slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-black text-ink">
            {user.name} {isCurrentUser && <span className="text-emerald-700 font-extrabold">(Kamu)</span>}
          </p>
          <span className="text-[10px] font-bold text-ink-muted">{user.streak} Hari Streak</span>
        </div>
      </div>

      <div className="col-span-2 text-right">
        <span className="text-xs font-black text-ink">{user.xp}</span>
        <span className="block text-[9px] font-bold text-ink-muted uppercase">XP</span>
      </div>

      <div className="col-span-2 text-center">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
            status === "promo"
              ? "bg-emerald-100 text-emerald-800"
              : status === "demote"
              ? "bg-rose-100 text-rose-800"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {status === "promo" ? "Naik" : status === "demote" ? "Turun" : "Tetap"}
        </span>
      </div>
    </div>
  );
}
