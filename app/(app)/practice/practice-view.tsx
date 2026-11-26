"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GameIcon } from "../../components/game-icon";
import { StatBar } from "../../components/stats";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import type { User } from "../../lib/users";
import type { Lesson } from "../../lib/curriculum";

export interface WordItem {
  id: string;
  word: string;
  ipa: string;
  meaning: string;
  example: string;
  category: "Percakapan" | "Tata Bahasa" | "Kosakata Kerja" | "Umum";
  level: "weak" | "learning" | "mastered";
  mastery: number; // 0 - 100
}

const RICH_VOCABULARY: WordItem[] = [
  {
    id: "v1",
    word: "Good morning",
    ipa: "/ɡʊd ˈmɔː.nɪŋ/",
    meaning: "Selamat pagi (sapaan formal/santai)",
    example: "Good morning! Did you sleep well last night?",
    category: "Percakapan",
    level: "mastered",
    mastery: 100,
  },
  {
    id: "v2",
    word: "Where are you from?",
    ipa: "/weər ɑːr juː frɒm/",
    meaning: "Kamu berasal dari mana? (menanyakan asal)",
    example: "I am from Indonesia, where are you from?",
    category: "Percakapan",
    level: "weak",
    mastery: 45,
  },
  {
    id: "v3",
    word: "Subject pronouns",
    ipa: "/ˈsʌb.dʒɪkt ˈprəʊ.naʊn/",
    meaning: "Kata ganti subjek pelaku (I, You, They, We, He, She, It)",
    example: "She is a doctor and they are university students.",
    category: "Tata Bahasa",
    level: "mastered",
    mastery: 90,
  },
  {
    id: "v4",
    word: "Awkward",
    ipa: "/ˈɔː.kwəd/",
    meaning: "Canggung, kikuk, atau serba salah",
    example: "There was an awkward silence when he walked in.",
    category: "Umum",
    level: "weak",
    mastery: 30,
  },
  {
    id: "v5",
    word: "Thorough",
    ipa: "/ˈθʌr.ə/",
    meaning: "Menyeluruh, teliti, dan cermat",
    example: "She gave the contract a thorough review before signing.",
    category: "Kosakata Kerja",
    level: "weak",
    mastery: 40,
  },
  {
    id: "v6",
    word: "Accomplish",
    ipa: "/əˈkʌm.plɪʃ/",
    meaning: "Mencapai, menuntaskan, atau berhasil menyelesaikan",
    example: "We accomplished all our daily study goals today.",
    category: "Kosakata Kerja",
    level: "mastered",
    mastery: 85,
  },
  {
    id: "v7",
    word: "How do you do",
    ipa: "/haʊ duː juː duː/",
    meaning: "Salam perkenalan sangat formal (dijawab dengan kalimat yang sama)",
    example: "Pleased to meet you, Mr. Smith. How do you do?",
    category: "Percakapan",
    level: "learning",
    mastery: 60,
  },
  {
    id: "v8",
    word: "Preposition of time",
    ipa: "/ˌprep.əˈzɪʃ.ən əv taɪm/",
    meaning: "Kata depan waktu (in untuk bulan/tahun, on untuk hari, at untuk jam)",
    example: "Our meeting starts at 9 AM on Monday.",
    category: "Tata Bahasa",
    level: "learning",
    mastery: 55,
  },
];

export interface LatihanProps {
  user: User;
  doneLessons: Lesson[];
  firstLessonId: string;
}

export function LatihanView({ user, doneLessons, firstLessonId }: LatihanProps) {
  const [filter, setFilter] = useState<"all" | "weak" | "mastered">("all");
  const [search, setSearch] = useState("");
  const [activeVoiceId, setActiveVoiceId] = useState<string | null>(null);

  const filteredWords = RICH_VOCABULARY.filter((w) => {
    const matchesFilter = filter === "all" ? true : w.level === filter;
    const matchesSearch =
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.meaning.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const speak = (text: string, id: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.9;
      setActiveVoiceId(id);
      u.onend = () => setActiveVoiceId(null);
      window.speechSynthesis.speak(u);
    }
  };

  const targetLessonId = doneLessons[0]?.id ?? firstLessonId;

  return (
    <div className="w-full py-6">
      <div className="mb-6">
        <StatBar user={user} />
      </div>

      {/* Hero Banner: English Skill Lab */}
      <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-r from-slate-900 to-slate-800 p-6 sm:p-8 text-white shadow-md mb-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-300 mb-3">
              <span className="icon text-sm">auto_awesome</span> English Skill Lab
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Pusat Latihan Mandiri &amp; Bicara
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-300 leading-relaxed">
              Tingkatkan kelancaran berbicara, perbaiki kesalahan tata bahasa yang sering dilakukan, dan kuasai kosakata aktif setiap hari.
            </p>
          </div>

          <div className="flex shrink-0 flex-col sm:flex-row gap-3">
            <Link href={`/lesson/${targetLessonId}`}>
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <span className="icon text-xl">play_arrow</span> Latihan Kilat (+15 XP)
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Kolom Kiri: 4 Mode Latihan Utama + Vocabulary Vault (8 Kolom) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Section: 4 Mode Latihan Spesialis */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-ink">4 Pilar Latihan Bahasa</h2>
                <p className="text-xs font-bold text-ink-muted">Pilih mode latihan sesuai keterampilan yang ingin kamu asah hari ini</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Pronunciation Lab */}
              <Card className="p-5 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <span className="icon text-2xl">mic</span>
                    </div>
                    <span className="rounded-full bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 text-[10px] font-black uppercase text-indigo-700">
                      Pelafalan &amp; IPA
                    </span>
                  </div>
                  <h3 className="text-base font-black text-ink">Latihan Pelafalan (Speaking)</h3>
                  <p className="mt-1 text-xs font-medium text-ink-muted leading-relaxed">
                    Latih aksen dan kelancaran intonasi kata sulit dengan panduan fonetik resmi IPA dan speech synthesis.
                  </p>
                </div>
                <Link href={`/lesson/${targetLessonId}`} className="mt-4 block">
                  <Button variant="outline" size="sm" className="w-full">
                    Latih Suara (+20 XP)
                  </Button>
                </Link>
              </Card>

              {/* 2. Grammar Clinic */}
              <Card className="p-5 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                      <span className="icon text-2xl">menu_book</span>
                    </div>
                    <span className="rounded-full bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 text-[10px] font-black uppercase text-amber-700">
                      Klinik Grammar
                    </span>
                  </div>
                  <h3 className="text-base font-black text-ink">Bedah Tata Bahasa</h3>
                  <p className="mt-1 text-xs font-medium text-ink-muted leading-relaxed">
                    Pelajari pola tenses, preposition (in/on/at), dan perbaiki kekeliruan struktur kalimat umum.
                  </p>
                </div>
                <Link href={`/lesson/${targetLessonId}`} className="mt-4 block">
                  <Button variant="outline" size="sm" className="w-full">
                    Mulai Klinik (+15 XP)
                  </Button>
                </Link>
              </Card>

              {/* 3. Daily Dialogue Bites */}
              <Card className="p-5 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <span className="icon text-2xl">forum</span>
                    </div>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-700">
                      Simulasi Percakapan
                    </span>
                  </div>
                  <h3 className="text-base font-black text-ink">Dialog Dunia Nyata</h3>
                  <p className="mt-1 text-xs font-medium text-ink-muted leading-relaxed">
                    Simulasi 3 kalimat percakapan situasional saat di kantor, memesan kopi di kafe, atau menyapa rekan baru.
                  </p>
                </div>
                <Link href={`/lesson/${targetLessonId}`} className="mt-4 block">
                  <Button variant="outline" size="sm" className="w-full">
                    Buka Dialog (+15 XP)
                  </Button>
                </Link>
              </Card>

              {/* 4. Speed Sprint */}
              <Card className="p-5 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                      <span className="icon text-2xl">timer</span>
                    </div>
                    <span className="rounded-full bg-rose-50 border border-rose-200/60 px-2.5 py-0.5 text-[10px] font-black uppercase text-rose-700">
                      Refleks 60 Detik
                    </span>
                  </div>
                  <h3 className="text-base font-black text-ink">Tantangan Kilat Refleks</h3>
                  <p className="mt-1 text-xs font-medium text-ink-muted leading-relaxed">
                    Pacu kecepatan otak menerjemahkan kata dan memilih sinonim dalam 60 detik tanpa jeda.
                  </p>
                </div>
                <Link href={`/lesson/${targetLessonId}`} className="mt-4 block">
                  <Button variant="outline" size="sm" className="w-full">
                    Mulai Sprint (+25 XP)
                  </Button>
                </Link>
              </Card>
            </div>
          </section>

          {/* Section: Vocabulary Vault (Kaya Konteks Kalimat) */}
          <section>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-ink">Gudang Kosakata Aktif (Vault)</h2>
                <p className="text-xs font-bold text-ink-muted">Koleksi kata yang dipelajari lengkap dengan simbol IPA &amp; contoh kalimat</p>
              </div>

              {/* Filter Tabs & Search */}
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-xl bg-surface-low p-1 border border-line text-xs font-black">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      filter === "all" ? "bg-white text-ink shadow-xs" : "text-ink-muted"
                    }`}
                  >
                    Semua ({RICH_VOCABULARY.length})
                  </button>
                  <button
                    onClick={() => setFilter("weak")}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      filter === "weak" ? "bg-white text-rose-600 shadow-xs" : "text-ink-muted"
                    }`}
                  >
                    Perlu Latihan (3)
                  </button>
                  <button
                    onClick={() => setFilter("mastered")}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      filter === "mastered" ? "bg-white text-emerald-600 shadow-xs" : "text-ink-muted"
                    }`}
                  >
                    Dikuasai (4)
                  </button>
                </div>
              </div>
            </div>

            {/* List Kartu Kosakata Kaya Konteks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredWords.map((item) => (
                <Card key={item.id} className="p-4 flex flex-col justify-between hover:border-slate-300 transition-all">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-ink">{item.word}</h4>
                          <button
                            type="button"
                            onClick={() => speak(item.word, item.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-low text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                            title="Dengarkan pengucapan"
                          >
                            <span className="icon text-base">
                              {activeVoiceId === item.id ? "graphic_eq" : "volume_up"}
                            </span>
                          </button>
                        </div>
                        <span className="font-mono text-xs font-semibold text-slate-500">{item.ipa}</span>
                      </div>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                          item.level === "mastered"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.level === "weak"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {item.level === "mastered" ? "Dikuasai" : item.level === "weak" ? "Perlu Dilatih" : "Sedang Dipelajari"}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-ink-muted mb-2.5">{item.meaning}</p>

                    <div className="rounded-xl bg-surface-low p-2.5 border border-slate-200/60">
                      <p className="text-xs font-medium text-slate-700 italic">
                        &ldquo;{item.example}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-line flex items-center justify-between text-[11px] font-bold text-ink-muted">
                    <span>Kategori: {item.category}</span>
                    <span className="font-mono font-black text-emerald-600">{item.mastery}% Hafal</span>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Kolom Kanan: Sticky Insights, AI Tutor Tip, & Statistik (4 Kolom) */}
        <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-6 lg:h-fit">
          {/* AI Language Insight Box */}
          <Card className="p-5 border-emerald-500/30 bg-emerald-50/20">
            <div className="flex items-center gap-2 text-emerald-800 mb-3">
              <span className="icon text-2xl text-emerald-600">tips_and_updates</span>
              <h3 className="text-sm font-black uppercase tracking-wider">Cakapin Grammar Insight</h3>
            </div>
            <p className="text-xs font-bold text-slate-700 leading-relaxed">
              Banyak yang keliru antara <strong className="text-emerald-950">&ldquo;Hear&rdquo;</strong> dan{" "}
              <strong className="text-emerald-950">&ldquo;Listen&rdquo;</strong>.
            </p>
            <div className="mt-2.5 rounded-2xl bg-white p-3 border border-emerald-200/60 text-xs text-slate-600 space-y-1.5 font-medium">
              <p>
                • <strong>Hear:</strong> Menangkap suara tanpa sengaja (refleks telinga).
              </p>
              <p>
                • <strong>Listen:</strong> Memperhatikan suara secara sadar dan aktif.
              </p>
            </div>
          </Card>

          {/* Statistik Belajar Pekan Ini */}
          <Card className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-line mb-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-ink">Performa Pekan Ini</h3>
              <span className="icon text-slate-400 text-xl">analytics</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-low">
                <div className="flex items-center gap-2.5">
                  <span className="icon text-primary text-xl">schedule</span>
                  <div>
                    <span className="block text-xs font-black text-ink">45 Menit</span>
                    <span className="text-[10px] font-bold text-ink-muted">Waktu Berlatih</span>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-600">+12% vs lalu</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-low">
                <div className="flex items-center gap-2.5">
                  <span className="icon text-indigo-500 text-xl">verified</span>
                  <div>
                    <span className="block text-xs font-black text-ink">92%</span>
                    <span className="text-[10px] font-bold text-ink-muted">Akurasi Jawaban</span>
                  </div>
                </div>
                <span className="text-xs font-black text-indigo-600">Sangat Baik</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-low">
                <div className="flex items-center gap-2.5">
                  <span className="icon text-amber-500 text-xl">menu_book</span>
                  <div>
                    <span className="block text-xs font-black text-ink">{RICH_VOCABULARY.length} Kosakata</span>
                    <span className="text-[10px] font-bold text-ink-muted">Tersimpan di Vault</span>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-600">+5 Kata Baru</span>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
