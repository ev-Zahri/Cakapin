"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { DAILY_XP_GOAL, type Unit, type Lesson } from "../../lib/curriculum";
import { StatBar } from "../../components/stats";
import { GameIcon } from "../../components/game-icon";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import type { User } from "../../lib/users";

interface BelajarViewProps {
  user: User;
  currentLesson: Lesson | undefined;
  rank: number;
  units: Unit[];
}

export function BelajarView({ user, currentLesson, rank, units }: BelajarViewProps) {
  return (
    <div className="flex flex-col gap-8 py-6 lg:flex-row">
      {/* Kolom Utama: Roadmap Milestone Belajar */}
      <section className="flex-1">
        <div className="mb-6">
          <StatBar user={user} />
        </div>

        <div className="flex flex-col gap-10">
          {units.map((unit) => {
            const completedCount = unit.lessons.filter((l) => user.completed.includes(l.id)).length;
            const totalLessons = unit.lessons.length;
            const isUnitFinished = completedCount === totalLessons && totalLessons > 0;
            const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

            return (
              <div key={unit.number} className="flex flex-col gap-4">
                {/* Station Banner Header */}
                <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-300">
                      <span className="icon text-sm">bookmark</span> Chapter {unit.number}
                    </span>
                    <span className="text-xs font-extrabold text-slate-300">
                      {completedCount} dari {totalLessons} Selesai ({progressPct}%)
                    </span>
                  </div>

                  <h2 className="text-2xl font-black tracking-tight">{unit.title}</h2>
                  <p className="mt-1 text-sm font-medium text-slate-300">Kuasai materi {unit.title.toLowerCase()} untuk meningkatkan kelancaran bahasa Inggris kamu.</p>

                  {/* Clean Thin Progress Bar */}
                  <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-700/60">
                    <motion.div
                      className="h-full rounded-full bg-emerald-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Vertical Milestone Timeline */}
                <div className="flex flex-col gap-3 pl-2 sm:pl-4">
                  {unit.lessons.map((lesson, idx) => {
                    const isDone = user.completed.includes(lesson.id);
                    const isCurrent = currentLesson?.id === lesson.id;
                    const isOpen = (idx === 0 || user.completed.includes(unit.lessons[idx - 1].id)) && lesson.questions.length > 0;
                    const isSoon = lesson.questions.length === 0;

                    return (
                      <div key={lesson.id} className="relative flex items-center gap-4">
                        {/* Garis konektor vertikal */}
                        {idx < unit.lessons.length - 1 && (
                          <div
                            className={`absolute left-5 top-11 -bottom-4 w-0.5 ${
                              isDone ? "bg-emerald-500" : "bg-slate-200"
                            }`}
                          />
                        )}

                        {/* Node Bulat Station */}
                        <div
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 transition-all ${
                            isDone
                              ? "bg-emerald-500 border-emerald-600 text-white shadow-xs"
                              : isCurrent
                              ? "bg-white border-emerald-500 text-emerald-600 ring-4 ring-emerald-100"
                              : isOpen
                              ? "bg-white border-slate-300 text-slate-600"
                              : "bg-slate-100 border-slate-200 text-slate-400"
                          }`}
                        >
                          {isDone ? (
                            <span className="icon text-xl font-bold">check</span>
                          ) : isCurrent ? (
                            <span className="icon text-xl animate-pulse">play_arrow</span>
                          ) : isOpen ? (
                            <span className="text-xs font-black">{lesson.level}</span>
                          ) : (
                            <span className="icon text-base">lock</span>
                          )}
                        </div>

                        {/* Station Card Modul */}
                        <div className="flex-1">
                          {isOpen ? (
                            <Link href={`/lesson/${lesson.id}`}>
                              <Card
                                className={`flex items-center justify-between p-4 transition-all hover:border-slate-300 hover:shadow-xs cursor-pointer ${
                                  isCurrent ? "border-emerald-500/80 bg-emerald-50/20" : ""
                                }`}
                              >
                                <div className="flex flex-col gap-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black uppercase text-ink-muted">
                                      Modul {lesson.level}
                                    </span>
                                    {isCurrent && (
                                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                                        Sedang Dipelajari
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="text-base font-black text-ink">{lesson.title}</h3>
                                  <p className="text-xs font-medium text-ink-muted">
                                    {lesson.questions.length} Latihan interaktif • +15 XP
                                  </p>
                                </div>

                                <Button
                                  variant={isCurrent ? "primary" : isDone ? "outline" : "outline"}
                                  size="sm"
                                  className="shrink-0"
                                >
                                  {isDone ? "Ulangi" : isCurrent ? "Mulai" : "Buka"}
                                </Button>
                              </Card>
                            </Link>
                          ) : (
                            <div className="flex items-center justify-between rounded-2xl border border-dashed border-slate-200 bg-surface-low/50 p-4 opacity-75">
                              <div>
                                <span className="text-xs font-bold text-ink-muted">Modul {lesson.level}</span>
                                <h3 className="text-sm font-bold text-ink-muted">{lesson.title}</h3>
                              </div>
                              <span className="text-xs font-bold text-ink-muted flex items-center gap-1">
                                <span className="icon text-base">lock</span> {isSoon ? "Segera hadir" : "Terkunci"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sidebar Kanan: Info & Progress Ringkas */}
      <aside className="flex w-full flex-col gap-5 lg:sticky lg:top-6 lg:h-fit lg:w-[320px]">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <span className="icon text-2xl">trophy</span>
            </div>
            <div>
              <h3 className="text-base font-black text-ink">Klasemen Liga</h3>
              <p className="text-xs font-medium text-ink-muted">
                Peringkat <strong className="text-ink">#{rank}</strong> ({user.xp} XP)
              </p>
            </div>
          </div>
          <Link href="/leaderboard" className="mt-4 block">
            <Button variant="outline" size="sm" className="w-full">
              Lihat Klasemen
            </Button>
          </Link>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="icon text-amber-500 text-xl">bolt</span>
              <h3 className="text-base font-black text-ink">Target Harian</h3>
            </div>
            <span className="text-xs font-black text-ink-muted">
              {Math.min(user.daily.xp, DAILY_XP_GOAL)} / {DAILY_XP_GOAL} XP
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(100, (user.daily.xp / DAILY_XP_GOAL) * 100)}%` }}
            />
          </div>

          <Link href="/quests" className="mt-4 block">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              Buka Misi Harian →
            </Button>
          </Link>
        </Card>
      </aside>
    </div>
  );
}
