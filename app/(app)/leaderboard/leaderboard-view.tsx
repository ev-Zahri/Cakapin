"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { GameIcon } from "../../components/game-icon";
import { StatBar } from "../../components/stats";
import type { User } from "../../lib/users";

export interface PeringkatProps {
  user: User;
  board: User[];
  rank: number;
  leagueName: string;
}

export function PeringkatView({ user, board, rank, leagueName }: PeringkatProps) {
  // Pastikan user masuk ke list tampilan jika di luar 20 besar
  const userInTop = board.some((b) => b.id === user.id);

  // Zona Promosi (Top 7)
  const promotionZone = board.slice(0, 7);
  // Zona Bertahan (Peringkat 8 - 24)
  const safeZone = board.slice(7, 24);
  // Zona Degradasi (Peringkat 25 - 30)
  const demotionZone = board.slice(24);

  return (
    <div className="w-full max-w-6xl mx-auto py-6">
      <div className="mb-6">
        <StatBar user={user} />
      </div>

      {/* Top League Hero Banner dengan 3D tactile style */}
      <div className="relative overflow-hidden rounded-3xl bg-white border-2 border-line p-6 sm:p-8 shadow-sm mb-8">
        <div className="absolute -right-16 -top-20 w-80 h-80 rounded-full bg-gem-soft/50 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-20 w-64 h-64 rounded-full bg-streak/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 sm:gap-6">
            {/* 3D League Emblem Trophy */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ translateY: 4 }}
              className="relative flex-shrink-0 cursor-pointer"
            >
              <div className="w-24 h-24 rounded-3xl bg-gem-soft flex items-center justify-center p-3 border-2 border-gem shadow-inner">
                <GameIcon name="crown" size={68} alt="League Crown" />
              </div>
              <div className="absolute -bottom-2 -right-1 bg-streak text-white font-black text-xs px-2.5 py-0.5 rounded-full shadow-sm">
                DIVISI I
              </div>
            </motion.div>

            {/* Title & Info */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="bg-gem-soft text-gem-edge font-black text-xs px-3 py-1 rounded-full">
                  Minggu Ini
                </span>
                <span className="bg-primary-soft text-primary-dark font-black text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="icon text-[16px]">military_tech</span> Zona Promosi Terbuka
                </span>
              </div>
              <h1 className="text-3xl font-black text-on-surface tracking-tight">
                {leagueName}
              </h1>
              <p className="text-sm font-bold text-ink-muted mt-1 max-w-xl">
                Raih posisi 7 teratas untuk promosi langsung ke kasta liga berikutnya minggu depan!
              </p>
            </div>
          </div>

          {/* Sisa Waktu Liga Box */}
          <div className="flex flex-col items-center md:items-end bg-surface-low px-6 py-4 rounded-2xl border-2 border-line w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-ink-muted text-xs font-black uppercase tracking-wider mb-1">
              <span className="icon text-ruby-edge text-sm">timer</span> Sisa Waktu Liga
            </div>
            <span className="text-2xl font-black text-on-surface tracking-wide">
              1 Hari 14 Jam
            </span>
            <span className="text-xs font-bold text-ink-muted mt-0.5">Reset setiap Senin 00:00 WIB</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Tabel Peringkat + Sidebar Panduan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Tabel Peserta (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Table Header Bar */}
          <div className="bg-white px-6 py-4 rounded-2xl border-2 border-line shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                <span className="icon text-xl">leaderboard</span>
              </div>
              <div>
                <span className="font-black text-base text-on-surface">Papan Peringkat Peserta</span>
                <p className="text-xs text-ink-muted font-bold">30 Pembelajar terpilih dalam grup mingguan Anda</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-surface-low p-1 rounded-full">
              <span className="px-3 py-1 text-xs font-black bg-white text-on-surface rounded-full shadow-xs">
                Mingguan
              </span>
            </div>
          </div>

          {/* Table Column Legend */}
          <div className="grid grid-cols-12 px-6 py-1 text-ink-muted text-xs font-black uppercase tracking-wider">
            <div className="col-span-2 text-center">Peringkat</div>
            <div className="col-span-6">Pengguna</div>
            <div className="col-span-2 text-right">Poin XP</div>
            <div className="col-span-2 text-center">Status</div>
          </div>

          {/* 1. ZONA PROMOSI (Top 1 - 7) */}
          <div className="flex flex-col gap-2.5 p-3 rounded-3xl bg-primary-soft/30 border-2 border-primary/20">
            <div className="flex items-center justify-between px-3 pt-1 pb-1">
              <div className="flex items-center gap-2 text-primary-dark font-black text-xs uppercase tracking-wide">
                <span className="icon text-lg">workspace_premium</span>
                <span>ZONA PROMOSI (TOP 7)</span>
              </div>
              <span className="text-xs font-black text-ink-muted bg-white px-2.5 py-0.5 rounded-full shadow-xs">
                Peringkat 1 - 7
              </span>
            </div>

            {promotionZone.map((u, i) => (
              <UserRow key={u.id} user={u} rank={i + 1} isCurrentUser={u.id === user.id} status="promo" />
            ))}
          </div>

          {/* 2. ZONA BERTAHAN (Peringkat 8 - 24) */}
          {safeZone.length > 0 && (
            <div className="flex flex-col gap-2 p-3 rounded-3xl bg-white border-2 border-line">
              <div className="flex items-center justify-between px-3 pt-1 pb-1">
                <div className="flex items-center gap-2 text-ink-muted font-black text-xs uppercase tracking-wide">
                  <span className="icon text-lg">shield</span>
                  <span>ZONA BERTAHAN</span>
                </div>
                <span className="text-xs font-black text-ink-muted bg-surface-low px-2.5 py-0.5 rounded-full">
                  Peringkat 8 - 24
                </span>
              </div>

              {safeZone.map((u, idx) => (
                <UserRow key={u.id} user={u} rank={idx + 8} isCurrentUser={u.id === user.id} status="stay" />
              ))}
            </div>
          )}

          {/* 3. ZONA DEGRADASI (Peringkat 25 - 30) */}
          {demotionZone.length > 0 && (
            <div className="flex flex-col gap-2 p-3 rounded-3xl bg-ruby-soft/40 border-2 border-ruby/30">
              <div className="flex items-center justify-between px-3 pt-1 pb-1">
                <div className="flex items-center gap-2 text-ruby-edge font-black text-xs uppercase tracking-wide">
                  <span className="icon text-lg">warning</span>
                  <span>ZONA DEGRADASI (5 TERBAWAH)</span>
                </div>
                <span className="text-xs font-black text-ruby-edge bg-white px-2.5 py-0.5 rounded-full shadow-xs">
                  Peringkat 25 - 30
                </span>
              </div>

              {demotionZone.map((u, idx) => (
                <UserRow key={u.id} user={u} rank={idx + 25} isCurrentUser={u.id === user.id} status="down" />
              ))}
            </div>
          )}

          {/* Bar jika user berada di luar 30 besar */}
          {!userInTop && (
            <div className="mt-4 p-4 rounded-2xl bg-primary text-white font-black flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-black">
                  #{rank}
                </span>
                <span>{user.name} (Kamu)</span>
              </div>
              <span>{user.xp} XP</span>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Panduan & Sidebar (4 Cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
          {/* Card Boost CTA */}
          <div className="rounded-3xl border-2 border-b-4 border-streak bg-gradient-to-br from-streak/20 to-white p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-streak flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <span className="icon text-3xl">bolt</span>
              </div>
              <div>
                <h3 className="font-black text-lg text-on-surface">Tingkatkan XP Kamu!</h3>
                <p className="text-xs text-ink-muted font-bold">Amankan posisimu di zona promosi liga.</p>
              </div>
            </div>
            <Link
              href="/belajar"
              className="btn btn-primary w-full !py-3.5 flex items-center justify-center gap-2 text-sm"
            >
              <span className="icon text-xl">play_arrow</span> MULAI BELAJAR SEKARANG
            </Link>
          </div>

          {/* Card Panduan & Aturan Liga */}
          <div className="rounded-3xl border-2 border-line bg-white p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-line">
              <span className="icon text-gem text-2xl">help</span>
              <h3 className="font-black text-lg text-on-surface">Panduan &amp; Aturan Liga</h3>
            </div>
            <ul className="flex flex-col gap-3.5 text-xs font-bold text-ink-muted">
              <li className="flex items-start gap-2.5">
                <span className="icon text-primary text-lg mt-0.5">check_circle</span>
                <span>
                  <strong className="text-ink">Top 7:</strong> Dipromosikan ke kasta liga berikutnya serta mendapat bonus permata.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="icon text-gem text-lg mt-0.5">check_circle</span>
                <span>
                  <strong className="text-ink">Peringkat 8 - 24:</strong> Bertahan di liga saat ini untuk minggu depan.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="icon text-ruby-edge text-lg mt-0.5">warning</span>
                <span>
                  <strong className="text-ink">Peringkat 25 - 30:</strong> Didegradasi ke liga yang lebih rendah.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="icon text-streak-edge text-lg mt-0.5">local_fire_department</span>
                <span>
                  <strong className="text-ink">Rangkaian Streak:</strong> Belajar konsisten setiap hari untuk menjaga momentum XP ganda!
                </span>
              </li>
            </ul>
          </div>
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
  status: "promo" | "stay" | "down";
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`grid grid-cols-12 items-center p-3.5 rounded-2xl border-2 transition-all ${
        isCurrentUser
          ? "bg-primary text-white border-primary-edge shadow-md"
          : "bg-white hover:bg-surface-low border-line shadow-xs"
      }`}
    >
      {/* Kolom Peringkat */}
      <div className="col-span-2 flex items-center justify-center">
        {rank === 1 ? (
          <span className="w-8 h-8 rounded-full bg-streak text-white font-black text-base flex items-center justify-center shadow-xs">
            1
          </span>
        ) : rank === 2 ? (
          <span className="w-8 h-8 rounded-full bg-surface-high text-on-surface font-black text-base flex items-center justify-center shadow-xs">
            2
          </span>
        ) : rank === 3 ? (
          <span className="w-8 h-8 rounded-full bg-[#E5A500] text-white font-black text-base flex items-center justify-center shadow-xs">
            3
          </span>
        ) : (
          <span className={`font-black text-base ${isCurrentUser ? "text-white" : "text-ink-muted"}`}>
            {rank}
          </span>
        )}
      </div>

      {/* Kolom User */}
      <div className="col-span-6 flex items-center gap-3 min-w-0">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-base uppercase shrink-0 ${
            isCurrentUser ? "bg-white text-primary" : "bg-gem-soft text-gem-edge"
          }`}
        >
          {user.name.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 truncate">
            <span className={`font-black text-sm truncate ${isCurrentUser ? "text-white" : "text-on-surface"}`}>
              {isCurrentUser ? `${user.name} (Kamu)` : user.name}
            </span>
            {rank === 1 && <span className="icon text-streak text-sm">crown</span>}
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold ${isCurrentUser ? "text-white/80" : "text-ink-muted"}`}>
            <span className="icon text-[13px] text-streak">local_fire_department</span>
            <span>{user.streak} Hari</span>
          </div>
        </div>
      </div>

      {/* Kolom XP */}
      <div className="col-span-2 text-right">
        <span className={`font-black text-sm ${isCurrentUser ? "text-white" : "text-primary"}`}>
          {user.xp.toLocaleString("id-ID")}
        </span>
        <span className={`block text-[10px] font-bold ${isCurrentUser ? "text-white/80" : "text-ink-muted"}`}>
          XP
        </span>
      </div>

      {/* Kolom Status Badge */}
      <div className="col-span-2 flex justify-center">
        {status === "promo" ? (
          <span
            className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-black ${
              isCurrentUser ? "bg-white text-primary-dark" : "bg-primary-soft text-primary-dark"
            }`}
          >
            <span className="icon text-xs">arrow_upward</span> Naik
          </span>
        ) : status === "down" ? (
          <span
            className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-black ${
              isCurrentUser ? "bg-white text-ruby-edge" : "bg-ruby-soft text-ruby-edge"
            }`}
          >
            <span className="icon text-xs">arrow_downward</span> Turun
          </span>
        ) : (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black ${
              isCurrentUser ? "bg-white/20 text-white" : "bg-surface-low text-ink-muted"
            }`}
          >
            Tetap
          </span>
        )}
      </div>
    </motion.div>
  );
}
