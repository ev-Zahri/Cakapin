"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { DAILY_XP_GOAL, type Unit, type Lesson } from "../../lib/curriculum";
import { StatBar, unitBg } from "../../components/stats";
import { GameIcon } from "../../components/game-icon";
import type { User } from "../../lib/users";

// Posisi horizontal zigzag tiap node (dalam px dari sumbu tengah X=170)
const X_OFFSETS = [0, -64, -96, -64, 0, 64];

interface BelajarViewProps {
  user: User;
  currentLesson: Lesson | undefined;
  rank: number;
  units: Unit[];
}

export function BelajarView({ user, currentLesson, rank, units }: BelajarViewProps) {
  return (
    <div className="flex flex-col gap-6 py-6 lg:flex-row">
      <section className="flex-1">
        <div className="mb-6">
          <StatBar user={user} />
        </div>

        {units.map((unit) => {
          const completedCount = unit.lessons.filter((l) => user.completed.includes(l.id)).length;
          const totalLessons = unit.lessons.length;

          return (
            <div key={unit.number} className="mb-14">
              {/* Unit Header Card */}
              <div className={`${unitBg[unit.color]} mb-8 rounded-3xl p-6 text-white shadow-md relative overflow-hidden`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                    Unit {unit.number}
                  </span>
                  <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full">
                    {completedCount} / {totalLessons} Selesai
                  </span>
                </div>
                <h2 className="text-2xl font-black">{unit.title}</h2>

                {/* Progress bar di header unit */}
                <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-black/20 p-0.5">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500 shadow-sm"
                    style={{ width: `${(completedCount / totalLessons) * 100}%` }}
                  />
                </div>
              </div>

              {/* Pathway Snake Trail Container */}
              <UnitPath unit={unit} user={user} currentLesson={currentLesson} />
            </div>
          );
        })}
      </section>

      {/* Sidebar Kanan */}
      <aside className="flex w-full flex-col gap-5 lg:sticky lg:top-6 lg:h-fit lg:w-[340px]">
        <div className="card">
          <h3 className="flex items-center gap-2 text-lg font-black">
            <GameIcon name="crown" size={28} /> Peringkat kamu
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            Kamu di posisi <strong className="text-ink">#{rank}</strong> dengan {user.xp} XP.
          </p>
          <Link href="/peringkat" className="btn btn-ghost mt-3 w-full !py-2 text-sm">
            Lihat klasemen
          </Link>
        </div>

        <div className="card">
          <h3 className="flex items-center gap-2 text-lg font-black">
            <GameIcon name="bolt" size={28} /> Target harian
          </h3>
          <div className="mt-3 flex justify-between text-sm font-extrabold">
            <span>Dapatkan {DAILY_XP_GOAL} XP</span>
            <span>
              {Math.min(user.daily.xp, DAILY_XP_GOAL)} / {DAILY_XP_GOAL}
            </span>
          </div>
          <div className="mt-2 h-4 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.min(100, (user.daily.xp / DAILY_XP_GOAL) * 100)}%` }}
            />
          </div>
          <Link href="/misi" className="btn btn-ghost mt-3 w-full !py-2 text-sm">
            Semua misi
          </Link>
        </div>
      </aside>
    </div>
  );
}

function UnitPath({
  unit,
  user,
  currentLesson,
}: {
  unit: Unit;
  user: User;
  currentLesson: Lesson | undefined;
}) {
  const NODE_HEIGHT = 145; // jarak vertikal antar node
  const totalNodes = unit.lessons.length;
  const svgHeight = totalNodes * NODE_HEIGHT;

  // Bangun titik koordinat jalur SVG (tengah = 170)
  const coords = unit.lessons.map((_, i) => ({
    x: 170 + X_OFFSETS[i % X_OFFSETS.length],
    y: 50 + i * NODE_HEIGHT,
  }));

  // Buat path kurva melengkung (Cubic Bezier curve halus)
  let d = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const c1 = coords[i];
    const c2 = coords[i + 1];
    const midY = (c1.y + c2.y) / 2;
    d += ` C ${c1.x} ${midY}, ${c2.x} ${midY}, ${c2.x} ${c2.y}`;
  }

  // Hitung seberapa jauh garis hijau (completed path) sudah terbuka
  const lastDoneIndex = unit.lessons.reduce((acc, l, idx) => (user.completed.includes(l.id) ? idx : acc), -1);
  const progressRatio = lastDoneIndex >= 0 ? Math.min(1, (lastDoneIndex + 0.5) / (totalNodes - 1 || 1)) : 0;

  return (
    <div className="relative w-full flex flex-col items-center py-6 select-none" style={{ minHeight: svgHeight + 60 }}>
      {/* SVG Curving Track / Path Jalur Belajar */}
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[340px] pointer-events-none z-0 overflow-visible"
        style={{ height: svgHeight + 80 }}
        viewBox={`0 0 340 ${svgHeight + 80}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Track Latar Abu-abu (Belum selesai) */}
        <path
          d={d}
          fill="none"
          stroke="#E5E5E5"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Track Aktif Berwarna Hijau (Dengan Animasi Mengisi) */}
        {progressRatio > 0 && (
          <motion.path
            d={d}
            fill="none"
            stroke="#58CC02"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progressRatio }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        )}
      </svg>

      {/* Stepping Stone Nodes */}
      {unit.lessons.map((lesson, i) => {
        const isDone = user.completed.includes(lesson.id);
        const isCurrent = currentLesson?.id === lesson.id;
        const isOpen = (i === 0 || user.completed.includes(unit.lessons[i - 1].id)) && lesson.questions.length > 0;
        const isSoon = (i === 0 || user.completed.includes(unit.lessons[i - 1].id)) && lesson.questions.length === 0;

        const xOffset = X_OFFSETS[i % X_OFFSETS.length];

        return (
          <div
            key={lesson.id}
            className="relative z-10 flex flex-col items-center"
            style={{
              height: NODE_HEIGHT,
              transform: `translateX(${xOffset}px)`,
            }}
          >
            {/* Popover Callout Dialog Mengambang untuk Pelajaran Aktif */}
            {isCurrent && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute -top-16 z-30 flex flex-col items-center bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-line whitespace-nowrap animate-bounce"
              >
                <div className="flex items-center gap-1.5 font-black text-sm text-primary">
                  <span>Mulai Level {lesson.level}</span>
                  <span className="bg-streak/20 text-streak-edge text-[11px] px-2 py-0.5 rounded-full uppercase">
                    +15 XP
                  </span>
                </div>
                <div className="w-3 h-3 bg-white rotate-45 border-r-2 border-b-2 border-line absolute -bottom-1.5" />
              </motion.div>
            )}

            {/* Tombol Node Stepping Stone */}
            {isOpen ? (
              <Link href={`/pelajaran/${lesson.id}`}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.94 }}
                  className={`relative flex h-20 w-20 items-center justify-center rounded-full cursor-pointer transition-shadow ${
                    isDone
                      ? "bg-primary shadow-[0_8px_0_var(--color-primary-edge)] text-white"
                      : "bg-primary shadow-[0_8px_0_var(--color-primary-edge)] text-white pulse-ring"
                  }`}
                >
                  {isDone ? (
                    <GameIcon name="crown" size={44} alt="Selesai" />
                  ) : (
                    <span className="icon text-4xl">play_arrow</span>
                  )}

                  {/* Bintang pencapaian jika selesai */}
                  {isDone && (
                    <div className="absolute -bottom-2 bg-streak px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm text-white">
                      <span className="icon text-[12px]">star</span>
                      <span className="icon text-[12px]">star</span>
                      <span className="icon text-[12px]">star</span>
                    </div>
                  )}
                </motion.div>
              </Link>
            ) : (
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-surface-high shadow-[0_6px_0_var(--color-line-strong)] text-ink-muted cursor-not-allowed">
                <span className="icon text-3xl">{isSoon ? "hourglass_top" : "lock"}</span>
              </div>
            )}

            {/* Label Judul Level */}
            <span
              className={`mt-3 max-w-44 rounded-full px-3 py-0.5 text-center text-xs font-black shadow-xs ${
                isCurrent
                  ? "bg-primary-soft text-primary-dark border border-primary/20"
                  : "bg-surface-low text-ink-muted"
              }`}
            >
              {lesson.level}. {lesson.title}
            </span>
            {isSoon && <span className="text-[11px] font-bold text-ink-muted mt-0.5">Segera hadir</span>}
          </div>
        );
      })}
    </div>
  );
}
