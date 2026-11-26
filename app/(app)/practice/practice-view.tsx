"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { GameIcon } from "../../components/game-icon";
import { StatBar } from "../../components/stats";
import type { User } from "../../lib/users";
import type { Lesson } from "../../lib/curriculum";

interface WordItem {
  word: string;
  meaning: string;
  level: "weak" | "mastered";
  mastery: number; // 0 - 100
}

// Koleksi kosakata interaktif dari materi babak dasar
const VOCABULARY_LIST: WordItem[] = [
  { word: "Good morning", meaning: "Selamat pagi", level: "mastered", mastery: 100 },
  { word: "Good afternoon", meaning: "Selamat siang / sore", level: "mastered", mastery: 85 },
  { word: "Good night", meaning: "Selamat malam / tidur", level: "mastered", mastery: 90 },
  { word: "Where are you from?", meaning: "Kamu berasal dari mana?", level: "weak", mastery: 45 },
  { word: "Subject pronouns", meaning: "Kata ganti subjek (I, You, They, We)", level: "mastered", mastery: 80 },
  { word: "Doctor", meaning: "Dokter", level: "mastered", mastery: 100 },
  { word: "Student", meaning: "Siswa / pelajar", level: "mastered", mastery: 95 },
  { word: "Awkward", meaning: "Canggung / kikuk", level: "weak", mastery: 30 },
  { word: "Thorough", meaning: "Menyeluruh / teliti", level: "weak", mastery: 40 },
  { word: "Accomplish", meaning: "Mencapai / menuntaskan", level: "mastered", mastery: 80 },
];

export interface LatihanProps {
  user: User;
  doneLessons: Lesson[];
  firstLessonId: string;
}

export function LatihanView({ user, doneLessons, firstLessonId }: LatihanProps) {
  const [filter, setFilter] = useState<"all" | "weak" | "mastered">("all");

  const filteredWords = VOCABULARY_LIST.filter((w) => {
    if (filter === "all") return true;
    return w.level === filter;
  });

  const weakCount = VOCABULARY_LIST.filter((w) => w.level === "weak").length;
  const masteredCount = VOCABULARY_LIST.filter((w) => w.level === "mastered").length;

  // Latih suara (SpeechSynthesis)
  const speakWord = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      window.speechSynthesis.speak(u);
    }
  };

  const targetLessonId = doneLessons[0]?.id ?? firstLessonId;

  return (
    <div className="w-full max-w-7xl mx-auto py-6">
      <div className="mb-6">
        <StatBar user={user} />
      </div>

      {/* Top Practice Hub Hero Header Card */}
      <div className="w-full bg-white rounded-3xl border-2 border-line p-4 shadow-sm mb-4 relative overflow-hidden">
        {/* <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary-soft/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-48 -bottom-16 w-48 h-48 bg-gem-soft/50 rounded-full blur-xl pointer-events-none" /> */}

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="pl-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-primary-soft text-primary-dark rounded-full mb-3 text-xs font-black tracking-wider">
              <span className="icon text-lg">bolt</span>
              <span>Pusat Latihan Cepat</span>
            </div>
            <h1 className="text-xl font-black text-on-surface tracking-tight">
              Pusat Latihan Mandiri
            </h1>
            <p className="text-sm text-ink-muted">
              Asah kemampuanmu, tinjau kembali kata-kata yang sulit, atau dapatkan hati tambahan secara cuma-cuma!
            </p>
          </div>

          {/* Daily Practice Goal Progress Capsule */}
          <div className="w-full md:w-80 bg-surface-low px-4 py-6 rounded-xl border-1 border-line flex flex-col gap-2 shadow-xs shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <GameIcon name="crown" size={24} alt="Target" />
                <span className="font-black text-xs text-on-surface">Target Latihan Hari Ini</span>
              </div>
              <span className="font-black text-xs text-primary-dark bg-primary-soft px-2.5 py-0.5 rounded-full">
                +40 XP
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-ink-muted mt-1">
              <span>{Math.min(user.daily.lessons, 3)} dari 3 Sesi Selesai</span>
              <span className="text-primary-dark font-black">
                {Math.round((Math.min(user.daily.lessons, 3) / 3) * 100)}%
              </span>
            </div>
            {/* Tactile Glossy Progress Tube */}
            <div className="w-full h-3.5 bg-line rounded-full overflow-hidden p-0.5 relative shadow-inner">
              <motion.div
                className="h-full bg-primary rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${(Math.min(user.daily.lessons, 3) / 3) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/40 rounded-full" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout (2 Columns: Main Hub 8 Cols + Right Sidebar 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Training Modes & Word Bank (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="icon text-primary text-2xl">fitness_center</span>
              <h2 className="text-xl font-black text-on-surface">Mode Latihan Unggulan</h2>
            </div>
            <span className="text-xs font-black text-ink-muted uppercase tracking-wider">
              Pilih jenis latihan harianmu
            </span>
          </div>

          {/* 4 Primary Training Mode Bento Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Card 1: Latihan Hati */}
            <div className="bg-white rounded-3xl border-2 border-line p-6 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-14 h-14 rounded-2xl bg-ruby-soft/60 flex items-center justify-center border-2 border-ruby/20">
                    <GameIcon name="heart" size={36} alt="Hati" />
                  </div>
                  <div className="grid gap-1">
                    <span className="px-3 py-1 bg-green/50 border border-line font-black text-xs text-ink-muted rounded-full flex items-center gap-1">
                      <span className="icon text-green-600 text-sm">favorite</span> +1 Setiap 30 Menit
                    </span>
                    <span className="px-3 py-1 bg-surface-low border border-line font-black text-xs text-ink-muted rounded-full flex items-center gap-1">
                      <span className="icon text-yellow-600 text-sm">watch_later</span> Tiap 30 Menit
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-black text-on-surface mb-1">Latihan Pemulihan Hati</h3>
                <p className="text-xs font-bold text-ink-muted mb-3 leading-relaxed">
                  Selesaikan sesi kilat tanpa batas untuk memulihkan 1 Hati cadangan tanpa menunggu timer reset.
                </p>
              </div>
              <Link
                href={`/lesson/${targetLessonId}`}
                className={`w-full btn ${user.hearts >= 5 ? "btn-ghost opacity-70" : "btn-ruby"} !py-3 text-sm`}
              >
                <span className="icon text-lg">{user.hearts >= 5 ? "check_circle" : "favorite"}</span>
                {user.hearts >= 5 ? "Hati Sudah Penuh (+10 XP)" : "Latih Hati (+10 XP)"}
              </Link>
            </div>

            {/* Card 2: Review Kosakata Lemah */}
            <div className="bg-white rounded-3xl border-2 border-line p-6 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-14 h-14 rounded-2xl bg-streak/20 flex items-center justify-center border-2 border-streak/40">
                    <span className="icon text-streak-edge text-3xl">target</span>
                  </div>
                  <div className="grid gap-1">
                    <span className="px-3 py-1 bg-surface-low border border-line font-black text-xs text-ink-muted rounded-full flex items-center gap-1">
                      <span className="icon text-streak-edge text-sm">target</span> {weakCount} Perlu Diulang
                    </span>
                    <span className="px-3 py-1 bg-surface-low border border-line font-black text-xs text-ink-muted rounded-full flex items-center gap-1">
                      <span className="icon text-streak-edge text-sm">watch_later</span> Tiap 1 Jam
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-black text-on-surface mb-1">Tinjau Kesalahan</h3>
                <p className="text-xs font-bold text-ink-muted mb-3 leading-relaxed">
                  Kosakata yang sempat keliru pada kuis sebelumnya membutuhkan perhatian khusus agar terekam optimal.
                </p>
              </div>
              <Link
                href={`/lesson/${targetLessonId}`}
                className="w-full btn btn-primary !py-3 text-sm flex items-center justify-center gap-1.5"
              >
                <span className="icon text-lg">replay</span> Tinjau Kesalahan (+15 XP)
              </Link>
            </div>

            {/* Card 3: Latihan Mendengarkan & Pengucapan */}
            <div className="bg-white rounded-3xl border-2 border-line p-6 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gem-soft flex items-center justify-center border-2 border-gem/30">
                    <span className="icon text-gem-edge text-3xl">graphic_eq</span>
                  </div>
                  <span className="px-3 py-1 bg-gem-soft text-gem-edge font-black text-xs rounded-full">
                    Audio &amp; Bicara
                  </span>
                </div>
                <h3 className="text-lg font-black text-on-surface mb-1">Mendengar &amp; Bicara</h3>
                <p className="text-xs font-bold text-ink-muted mb-6 leading-relaxed">
                  Tingkatkan aksen, intonasi, dan kepekaan telinga dengan latihan audio interaktif langsung dari sistem speech synthesis.
                </p>
              </div>
              <Link
                href={`/lesson/${targetLessonId}`}
                className="w-full btn btn-gem !py-3 text-sm flex items-center justify-center gap-1.5"
              >
                <span className="icon text-lg">mic</span> Latih Suara (+20 XP)
              </Link>
            </div>

            {/* Card 4: Tantangan Kilat Waktu */}
            <div className="bg-white rounded-3xl border-2 border-line p-6 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary-soft flex items-center justify-center border-2 border-primary/30">
                    <GameIcon name="bolt" size={32} alt="Speed" />
                  </div>
                  <span className="px-3 py-1 bg-surface-low border border-line font-black text-xs text-ink-muted rounded-full">
                    Refleks Cepat
                  </span>
                </div>
                <h3 className="text-lg font-black text-on-surface mb-1">Tantangan Kilat</h3>
                <p className="text-xs font-bold text-ink-muted mb-6 leading-relaxed">
                  Cocokkan kosakata dan artinya secepat mungkin sebelum waktu habis. Pacu refleks berpikir bahasamumu!
                </p>
              </div>
              <Link
                href={`/lesson/${targetLessonId}`}
                className="w-full btn btn-primary !py-3 text-sm flex items-center justify-center gap-1.5"
              >
                <span className="icon text-lg">speed</span> Mulai Kilat (+25 XP)
              </Link>
            </div>
          </div>

          {/* Section: Koleksi Kosakata Terpelajari (Vocabulary Vault) */}
          <div className="bg-white rounded-3xl border-2 border-line p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-on-surface">Koleksi Kosakata Terpelajari</h3>
                <p className="text-xs font-bold text-ink-muted">Pantau kekuatan memori dari kata-kata yang telah kamu kuasai</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-surface-low p-1 rounded-2xl border border-line">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                    filter === "all" ? "bg-white text-on-surface shadow-xs" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  Semua ({VOCABULARY_LIST.length})
                </button>
                <button
                  onClick={() => setFilter("weak")}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                    filter === "weak" ? "bg-white text-on-surface shadow-xs" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  Perlu Diulang ({weakCount})
                </button>
                <button
                  onClick={() => setFilter("mastered")}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                    filter === "mastered" ? "bg-white text-on-surface shadow-xs" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  Dikuasai ({masteredCount})
                </button>
              </div>
            </div>

            {/* Words List Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {filteredWords.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-surface-low border border-line/60 rounded-2xl hover:bg-surface-container transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => speakWord(item.word)}
                      title="Dengarkan pengucapan"
                      className="w-9 h-9 rounded-full bg-white border border-line flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-xs"
                    >
                      <span className="icon text-base">volume_up</span>
                    </button>
                    <div>
                      <div className="font-black text-sm text-on-surface flex items-center gap-1.5">
                        <span>{item.word}</span>
                        {item.level === "weak" ? (
                          <span className="text-[10px] font-black text-ruby-edge bg-ruby-soft px-1.5 py-0.2 rounded-md">
                            Lemah
                          </span>
                        ) : (
                          <span className="text-[10px] font-black text-primary-dark bg-primary-soft px-1.5 py-0.2 rounded-md">
                            Dikuasai
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-ink-muted">{item.meaning}</div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((bar) => {
                        const filled = item.mastery >= bar * 25;
                        return (
                          <span
                            key={bar}
                            className={`w-2 h-1.5 rounded-full ${
                              filled
                                ? item.level === "weak"
                                  ? "bg-ruby"
                                  : "bg-primary"
                                : "bg-line"
                            }`}
                          />
                        );
                      })}
                    </div>
                    <span
                      className={`text-[11px] font-black ${
                        item.level === "weak" ? "text-ruby-edge" : "text-primary-dark"
                      }`}
                    >
                      {item.mastery}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mascot Recommendation & Weekly Practice Analytics (4 Cols) */}
        <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
          {/* Mascot Advice Card with Speech Bubble */}
          <div className="bg-white rounded-3xl border-2 border-line p-6 shadow-xs flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-streak/20 text-streak-edge font-black text-xs rounded-full uppercase tracking-wider">
                Tips Maskot Cakapin
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-primary-soft flex items-center justify-center p-1 border-2 border-primary/20 shadow-xs">
                <GameIcon name="mascotSpeak" size={48} alt="Maskot" />
              </div>
              {/* Speech Bubble */}
              <div className="bg-surface-low border border-line p-3.5 rounded-2xl rounded-tl-none relative shadow-xs">
                <p className="text-xs font-bold text-on-surface leading-snug">
                  “Kamu hebat dalam tata bahasa! Coba fokus pada{" "}
                  <span className="text-gem-edge font-black">Latihan Suara &amp; Mendengarkan</span> hari ini agar skor ligamu makin melesat naik!”
                </p>
              </div>
            </div>

            <Link
              href={`/lesson/${targetLessonId}`}
              className="w-full btn btn-primary !py-3 text-sm flex items-center justify-center gap-2"
            >
              <span className="icon text-xl">play_circle</span> Ikuti Saran Maskot
            </Link>
          </div>

          {/* Weekly Practice Analytics Card */}
          <div className="bg-white rounded-3xl border-2 border-line p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-1 border-b-2 border-line">
              <h3 className="font-black text-base text-on-surface">Statistik Pekan Ini</h3>
              <span className="icon text-ink-muted text-xl">insights</span>
            </div>

            {/* Metric 1 */}
            <div className="flex items-center justify-between p-3 bg-surface-low rounded-2xl border border-line">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gem-soft text-gem-edge flex items-center justify-center">
                  <span className="icon text-xl">schedule</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-ink-muted">Waktu Latihan</div>
                  <div className="font-black text-sm text-on-surface">45 Menit</div>
                </div>
              </div>
              <span className="text-xs font-black text-primary-dark bg-primary-soft px-2 py-0.5 rounded-full">
                +12% vs lalu
              </span>
            </div>

            {/* Metric 2 */}
            <div className="flex items-center justify-between p-3 bg-surface-low rounded-2xl border border-line">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary-dark flex items-center justify-center">
                  <span className="icon text-xl">verified</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-ink-muted">Akurasi Rata-rata</div>
                  <div className="font-black text-sm text-on-surface">92%</div>
                </div>
              </div>
              <span className="text-xs font-black text-primary-dark bg-primary-soft px-2 py-0.5 rounded-full">
                Luar biasa!
              </span>
            </div>

            {/* Metric 3 */}
            <div className="flex items-center justify-between p-3 bg-surface-low rounded-2xl border border-line">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-streak/20 text-streak-edge flex items-center justify-center">
                  <span className="icon text-xl">school</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-ink-muted">Kosakata Dikuasai</div>
                  <div className="font-black text-sm text-on-surface">+{VOCABULARY_LIST.length} Kata</div>
                </div>
              </div>
              <span className="text-xs font-black text-streak-edge bg-streak/20 px-2 py-0.5 rounded-full">
                Minggu ini
              </span>
            </div>

            {/* 7-Day Consistency Bars */}
            <div className="pt-2 flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-black">
                <span className="text-ink-muted">Konsistensi 7 Hari</span>
                <span className="text-primary-dark font-black">{Math.min(user.streak, 7)} Hari Aktif 🔥</span>
              </div>
              <div className="flex items-end justify-between h-14 pt-2 px-2 bg-surface-low rounded-2xl border border-line">
                {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day, i) => {
                  const active = i < Math.min(user.streak, 7);
                  return (
                    <div key={day} className="flex flex-col items-center gap-1">
                      <div
                        className={`w-4 rounded-t-sm ${active ? "bg-primary" : "bg-line"}`}
                        style={{ height: active ? `${20 + (i % 3) * 8}px` : "6px" }}
                      />
                      <span className="text-[10px] font-bold text-ink-muted">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
