"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState, useTransition } from "react";
import { finishLesson, type FinishResult } from "../../actions";
import { GameIcon, type IconName } from "../../components/game-icon";
import type { Lesson } from "../../lib/curriculum";

type Feedback = { correct: boolean; answer: string } | null;

export function LessonPlayer({ lesson, hearts }: { lesson: Lesson; hearts: number }) {
  const total = lesson.questions.length;
  const [index, setIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [picked, setPicked] = useState<string | null>(null); // pilihan ganda
  const [chosen, setChosen] = useState<string[]>([]); // susun kata
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
      if (dead) setIndex(total); // tandai berakhir
    } else {
      setIndex(index + 1);
    }
  }

  /* ---------- Layar hasil ---------- */
  if (result || index >= total) {
    const failed = outOfHearts && index >= total && mistakes >= hearts;
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        {!result ? (
          <>
            <GameIcon name="mascotThink" size={140} alt="Maskot berpikir" />
            <p className="text-ink-muted">Menyimpan progres…</p>
          </>
        ) : !result.ok ? (
          <>
            <h1 className="text-2xl font-black text-ruby">Gagal menyimpan</h1>
            <p>{result.error}</p>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 12 }}
            >
              <GameIcon name={failed ? "mascotSad" : "mascotCelebrate"} size={200} alt="" priority />
            </motion.div>
            <h1 className="text-3xl font-black">{failed ? "Nyawa habis!" : "Pelajaran Selesai!"}</h1>
            <motion.div
              className="grid w-full grid-cols-3 gap-3"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }}
            >
              <Stat icon="bolt" label="XP" value={`+${result.xp}`} tone="text-streak-edge" />
              <Stat icon="gem" label="Permata" value={`+${result.gems}`} tone="text-gem-edge" />
              <Stat icon="flame" label="Rangkaian" value={`${result.streak}`} tone="text-ruby-edge" />
            </motion.div>
            {result.perfect && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex items-center gap-2 font-black text-primary-dark">
                <GameIcon name="badgePerfect" size={36} /> Sempurna, tanpa salah!
              </motion.p>
            )}
          </>
        )}
        <Link href="/belajar" className="btn btn-primary mt-4 w-full">Lanjut</Link>
      </main>
    );
  }

  /* ---------- Soal ---------- */
  const bank = q.type === "arrange" ? q.words.filter((w, i) => !usedIndexes(q.words, chosen).has(i)) : [];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6">
      <header className="mb-8 flex items-center gap-4">
        <Link href="/belajar" aria-label="Keluar" className="icon text-3xl text-ink-muted">close</Link>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${(index / total) * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
        <motion.span
          key={heartsLeft}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-1 font-black text-ruby-edge"
        >
          <GameIcon name="heart" size={28} alt="Nyawa" /> {heartsLeft}
        </motion.span>
      </header>

      <AnimatePresence mode="wait">
      <motion.section
        key={index}
        className="flex-1"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-6 flex items-center gap-3">
          <GameIcon name="mascotSpeak" size={72} alt="" />
          <h1 className="text-2xl font-black">{q.prompt}</h1>
        </div>

        {q.type === "choice" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {q.options.map((opt, i) => (
              <motion.button
                key={opt}
                whileTap={{ scale: 0.97 }}
                disabled={!!feedback}
                onClick={() => setPicked(opt)}
                className={`card flex items-center gap-3 text-left font-extrabold transition ${
                  picked === opt ? "!border-gem bg-gem-soft text-gem-edge" : ""
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-line text-sm">{i + 1}</span>
                {opt}
              </motion.button>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6 flex min-h-[110px] flex-wrap content-start items-center gap-2.5 rounded-2xl border-2 border-dashed border-line-strong bg-surface-low p-4">
              {chosen.length === 0 && <span className="italic text-ink-muted">Ketuk kata di bawah untuk menyusun jawaban…</span>}
              {chosen.map((w, i) => (
                <button
                  key={`${w}-${i}`}
                  disabled={!!feedback}
                  onClick={() => setChosen(chosen.filter((_, j) => j !== i))}
                  className="rounded-2xl border-2 border-gem bg-white px-4 py-2.5 font-extrabold text-gem-edge"
                >
                  {w}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2.5">
              {bank.map((w, i) => (
                <button
                  key={`${w}-${i}`}
                  disabled={!!feedback}
                  onClick={() => setChosen([...chosen, w])}
                  className="rounded-2xl border-2 border-b-4 border-line bg-white px-4 py-2.5 font-extrabold active:translate-y-0.5 active:border-b-2"
                >
                  {w}
                </button>
              ))}
            </div>
          </>
        )}
      </motion.section>
      </AnimatePresence>

      <footer
        className={`mt-8 rounded-3xl p-5 ${
          feedback ? (feedback.correct ? "bg-primary-soft" : "bg-ruby-soft") : "border-t-2 border-line"
        }`}
      >
        {feedback ? (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={feedback.correct ? { y: 0, opacity: 1 } : { y: 0, opacity: 1, x: [0, -8, 8, -6, 6, 0] }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-3">
              <GameIcon name={feedback.correct ? "mascotCelebrate" : "mascotSad"} size={72} alt="" />
              <div>
                <h2 className={`text-xl font-black ${feedback.correct ? "text-primary-dark" : "text-ruby-edge"}`}>
                  {feedback.correct ? "Luar biasa!" : "Jawaban yang benar:"}
                </h2>
                {!feedback.correct && <p className="font-extrabold">{feedback.answer}</p>}
              </div>
            </div>
            <button onClick={next} disabled={pending} className={`btn ${feedback.correct ? "btn-primary" : "btn-ruby"} w-full sm:w-auto`}>
              {feedback.correct ? "Lanjut" : "Mengerti"}
            </button>
          </motion.div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setFeedback({ correct: false, answer: q.type === "choice" ? q.answer : q.answer.join(" ") })}
              className="rounded-2xl px-4 py-3 font-extrabold uppercase text-ink-muted hover:bg-surface-low"
            >
              Lompati
            </button>
            <button onClick={check} disabled={q.type === "choice" ? !picked : chosen.length === 0} className="btn btn-primary">
              Periksa
            </button>
          </div>
        )}
      </footer>
    </main>
  );
}

/** Indeks kata di `words` yang sudah dipakai (menangani kata duplikat). */
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
    <motion.div
      className="card !p-3"
      variants={{ hidden: { opacity: 0, y: 20, scale: 0.8 }, show: { opacity: 1, y: 0, scale: 1 } }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      <GameIcon name={icon} size={36} />
      <p className={`text-2xl font-black ${tone}`}>{value}</p>
      <p className="text-xs font-bold uppercase text-ink-muted">{label}</p>
    </motion.div>
  );
}
