"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState, useTransition } from "react";
import { finishLesson, type FinishResult } from "../../actions";
import { GameIcon, type IconName } from "../../components/game-icon";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import type { Lesson } from "../../lib/curriculum";

type Feedback = { correct: boolean; answer: string } | null;

export function LessonPlayer({ lesson, hearts }: { lesson: Lesson; hearts: number }) {
  const total = lesson.questions.length;
  const [index, setIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [chosen, setChosen] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [result, setResult] = useState<FinishResult | null>(null);
  const [pending, start] = useTransition();

  const q = lesson.questions[index];
  const heartsLeft = Math.max(0, hearts - mistakes);
  const outOfHearts = heartsLeft === 0;

  function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  function check() {
    if (q.type === "choice") {
      if (!picked) return;
      const correct = picked === q.answer;
      setFeedback({ correct, answer: q.answer });
      if (correct) speak(q.answer);
    } else {
      if (chosen.length === 0) return;
      const correct = chosen.join(" ") === q.answer.join(" ");
      setFeedback({ correct, answer: q.answer.join(" ") });
      if (correct) speak(q.answer.join(" "));
    }
  }

  function next() {
    const wasWrong = feedback && !feedback.correct;
    const newMistakes = mistakes + (wasWrong ? 1 : 0);
    setMistakes(newMistakes);
    setFeedback(null);
    setPicked(null);
    setChosen([]);

    const dead = hearts - newMistakes <= 0;
    if (index + 1 >= total || dead) {
      start(async () => setResult(await finishLesson(lesson.id, newMistakes)));
      if (dead) setIndex(total);
    } else {
      setIndex((i) => i + 1);
    }
  }

  /* ---------- Selesai / Kalah ---------- */
  if (index >= total || outOfHearts) {
    return (
      <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <GameIcon
            name={outOfHearts ? "mascotSad" : "mascotCelebrate"}
            size={160}
            alt={outOfHearts ? "Kehabisan nyawa" : "Selesai"}
            priority
          />
        </motion.div>

        <div>
          <h1 className="text-3xl font-black text-ink">
            {outOfHearts ? "Nyawa Kamu Habis!" : "Pelajaran Selesai!"}
          </h1>
          <p className="mt-2 text-sm font-medium text-ink-muted">
            {outOfHearts
              ? "Jangan putus asa! Isi ulang nyawa di Toko Permata atau istirahat sejenak."
              : `Kamu telah menyelesaikan latihan "${lesson.title}". Kerja bagus!`}
          </p>
        </div>

        {!result ? (
          <p className="font-extrabold text-ink-muted">Menyimpan progres kamu…</p>
        ) : !result.ok ? (
          <p className="font-bold text-ruby">{result.error}</p>
        ) : (
          <>
            <motion.div
              className="grid w-full grid-cols-3 gap-3"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            >
              <Stat icon="bolt" label="Total XP" value={`+${result.xp}`} tone="text-streak-edge" />
              <Stat icon="gem" label="Permata" value={`+${result.gems}`} tone="text-gem-edge" />
              <Stat icon="flame" label="Streak" value={`${result.streak} Hari`} tone="text-streak-edge" />
            </motion.div>

            {result.boosted && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex items-center gap-2 font-black text-streak-edge text-sm">
                <GameIcon name="bolt" size={24} /> XP Boost 2x Aktif!
              </motion.p>
            )}
            {result.perfect && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex items-center gap-2 font-black text-primary text-sm">
                <span className="icon text-xl">award_star</span> Latihan Sempurna, Tanpa Salah!
              </motion.p>
            )}
          </>
        )}
        <Link href="/learn" className="w-full">
          <Button variant="primary" size="lg" className="w-full">
            Kembali ke Beranda
          </Button>
        </Link>
      </main>
    );
  }

  /* ---------- Soal ---------- */
  const bank = q.type === "arrange" ? q.words.filter((w, i) => !usedIndexes(q.words, chosen).has(i)) : [];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8">
      {/* Top Header: Progress & Stamina */}
      <header className="mb-10 flex items-center gap-4">
        <Link href="/learn" aria-label="Keluar" className="flex h-10 w-10 items-center justify-center rounded-2xl border border-line text-ink-muted hover:bg-surface-low hover:text-ink transition-colors">
          <span className="icon text-2xl">close</span>
        </Link>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full rounded-full bg-emerald-500"
            initial={false}
            animate={{ width: `${(index / total) * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 font-black text-xs text-rose-600">
          <span className="icon text-base">favorite</span> {heartsLeft}
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.section
          key={index}
          className="flex-1 flex flex-col justify-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-8">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              Latihan {index + 1} dari {total}
            </span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black text-ink tracking-tight">
              {q.prompt}
            </h1>
          </div>

          {q.type === "choice" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {q.options.map((opt, i) => {
                const isSelected = picked === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => setPicked(opt)}
                    className={`flex items-center gap-3.5 p-4 rounded-2xl border-2 text-left font-extrabold text-base transition-all cursor-pointer ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/50 text-emerald-950 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300 text-ink"
                    }`}
                  >
                    <span className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black shrink-0 ${
                      isSelected ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Tempat menyusun kata */}
              <div className="flex min-h-[110px] flex-wrap content-start items-center gap-2.5 rounded-3xl border-2 border-dashed border-slate-200 bg-surface-low/80 p-5">
                {chosen.length === 0 && (
                  <span className="text-sm font-medium text-slate-400 select-none">
                    Pilih kata-kata di bawah untuk menyusun kalimat yang tepat…
                  </span>
                )}
                {chosen.map((w, i) => (
                  <button
                    key={`${w}-${i}`}
                    disabled={!!feedback}
                    onClick={() => setChosen(chosen.filter((_, j) => j !== i))}
                    className="rounded-2xl border-2 border-emerald-500 bg-white px-4 py-2 font-extrabold text-emerald-700 shadow-xs cursor-pointer hover:bg-emerald-50 transition-colors"
                  >
                    {w}
                  </button>
                ))}
              </div>

              {/* Bank Kata */}
              <div className="flex flex-wrap justify-center gap-2.5">
                {bank.map((w, i) => (
                  <button
                    key={`${w}-${i}`}
                    disabled={!!feedback}
                    onClick={() => setChosen([...chosen, w])}
                    className="rounded-2xl border border-b-3 border-slate-200 bg-white px-4 py-2.5 font-extrabold text-ink hover:border-slate-300 active:translate-y-0.5 active:border-b cursor-pointer transition-all shadow-xs"
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.section>
      </AnimatePresence>

      {/* Floating Bottom Action Bar */}
      <footer className="mt-10 pt-4">
        {feedback ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={feedback.correct ? { y: 0, opacity: 1 } : { y: 0, opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
            className={`rounded-3xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
              feedback.correct
                ? "border-emerald-200 bg-emerald-50/80 text-emerald-950"
                : "border-rose-200 bg-rose-50/80 text-rose-950"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                feedback.correct ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
              }`}>
                <span className="icon text-2xl">{feedback.correct ? "check" : "close"}</span>
              </div>
              <div>
                <h2 className="text-lg font-black">
                  {feedback.correct ? "Tepat Sekali!" : "Jawaban yang Tepat:"}
                </h2>
                {!feedback.correct && <p className="text-sm font-bold opacity-90">{feedback.answer}</p>}
              </div>
            </div>
            <Button
              onClick={next}
              disabled={pending}
              variant={feedback.correct ? "primary" : "danger"}
              size="lg"
              className="w-full sm:w-auto px-8"
            >
              {feedback.correct ? "Lanjut" : "Mengerti"}
            </Button>
          </motion.div>
        ) : (
          <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setFeedback({ correct: false, answer: q.type === "choice" ? q.answer : q.answer.join(" ") })}
            >
              Lewati Soal
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={check}
              disabled={q.type === "choice" ? !picked : chosen.length === 0}
              className="px-8"
            >
              Periksa Jawaban
            </Button>
          </div>
        )}
      </footer>
    </main>
  );
}

function usedIndexes(words: string[], chosen: string[]): Set<number> {
  const used = new Set<number>();
  for (const c of chosen) {
    const i = words.findIndex((w, idx) => w === c && !used.has(idx));
    if (i >= 0) used.add(i);
  }
  return used;
}

function Stat({ icon, label, value, tone }: { icon: IconName; label: string; value: string; tone: string }) {
  return (
    <Card className="flex flex-col items-center p-3 text-center">
      <GameIcon name={icon} size={32} />
      <p className={`mt-1 text-xl font-black ${tone}`}>{value}</p>
      <p className="text-[10px] font-black uppercase tracking-wider text-ink-muted">{label}</p>
    </Card>
  );
}
