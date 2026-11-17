// Kurikulum — sumber: docs/learning-path.md (Babak 1: Fondasi A1)

export type Question =
  | { type: "choice"; prompt: string; options: string[]; answer: string; hint?: string }
  | { type: "arrange"; prompt: string; words: string[]; answer: string[]; hint?: string };

export type Lesson = {
  id: string; // contoh: "u1-l2"
  unit: number;
  level: number;
  title: string;
  questions: Question[]; // kosong = materi belum tersedia
};

export type Unit = {
  number: number;
  title: string;
  color: "primary" | "gem" | "streak" | "ruby";
  lessons: Lesson[];
};

type RawUnit = { title: string; color: Unit["color"]; levels: string[] };

const RAW: RawUnit[] = [
  { title: "Salam & Perkenalan", color: "primary", levels: ["Salam formal/informal", "Nama & asal", "Subject pronouns", "To be (am/is/are)", "Listening: percakapan perkenalan", "Speaking: memperkenalkan diri"] },
  { title: "Angka & Waktu", color: "gem", levels: ["Angka 1–100", "Jam (What time is it?)", "Hari, bulan, tahun", "Preposisi waktu (in, on, at)", "Listening: jadwal harian", "Speaking: menyebutkan waktu"] },
  { title: "Warna & Bentuk", color: "streak", levels: ["Warna dasar & lanjutan", "Bentuk (circle, square, triangle)", "Adjectives (big, small, long, short)", "Demonstrative (this/that/these/those)", "Listening: deskripsi benda", "Speaking: mendeskripsikan benda"] },
  { title: "Keluarga & Teman", color: "ruby", levels: ["Anggota keluarga", "Possessive adjectives", "Possessive 's", "Have/has", "Listening: silsilah keluarga", "Speaking: mendeskripsikan keluarga"] },
  { title: "Makanan & Minuman", color: "primary", levels: ["Kosakata makanan & minuman", "Countable vs uncountable", "Article (a/an/the)", "Some/any", "Listening: memesan makanan", "Speaking: suka/tidak suka"] },
  { title: "Tubuh & Kesehatan Dasar", color: "gem", levels: ["Bagian tubuh", "Have/has + body parts", "Sakit sederhana", "Imperative", "Listening: instruksi dokter", "Speaking: kondisi tubuh"] },
  { title: "Rumah & Perabotan", color: "streak", levels: ["Ruangan", "Perabotan", "Preposisi tempat", "There is/There are", "Listening: deskripsi rumah", "Speaking: mendeskripsikan rumah"] },
  { title: "Pakaian & Warna Lanjutan", color: "ruby", levels: ["Jenis pakaian", "Warna & pola", "Adjective order", "This/that/these/those + clothes", "Listening: belanja pakaian", "Speaking: mendeskripsikan pakaian"] },
];

// Soal yang sudah ditulis (Unit 1, Level 1–4). Level lain menyusul.
const QUESTIONS: Record<string, Question[]> = {
  "u1-l1": [
    { type: "choice", prompt: "Apa arti “Good morning”?", options: ["Selamat pagi", "Selamat malam", "Sampai jumpa", "Terima kasih"], answer: "Selamat pagi" },
    { type: "choice", prompt: "Mana sapaan yang paling santai (informal)?", options: ["Good evening", "Hi", "Good afternoon", "How do you do"], answer: "Hi" },
    { type: "arrange", prompt: "Susun: “Selamat malam”", words: ["night", "Good", "morning"], answer: ["Good", "night"] },
    { type: "choice", prompt: "Kamu pamit tidur. Kamu bilang…", options: ["Good morning", "Good night", "Hello", "Good afternoon"], answer: "Good night" },
  ],
  "u1-l2": [
    { type: "arrange", prompt: "Susun: “Nama saya Rina”", words: ["name", "My", "is", "Rina", "am"], answer: ["My", "name", "is", "Rina"] },
    { type: "choice", prompt: "Lengkapi: “I ___ from Indonesia.”", options: ["am", "is", "are", "be"], answer: "am" },
    { type: "arrange", prompt: "Susun: “Saya berasal dari Bali”", words: ["from", "I", "Bali", "am", "is"], answer: ["I", "am", "from", "Bali"] },
    { type: "choice", prompt: "Apa arti “Where are you from?”", options: ["Kamu dari mana?", "Siapa namamu?", "Apa kabar?", "Kamu mau ke mana?"], answer: "Kamu dari mana?" },
  ],
  "u1-l3": [
    { type: "choice", prompt: "Pronoun untuk “dia (perempuan)”", options: ["He", "She", "It", "They"], answer: "She" },
    { type: "choice", prompt: "Pronoun untuk “kami/kita”", options: ["We", "You", "They", "I"], answer: "We" },
    { type: "choice", prompt: "Pronoun untuk benda: “The book” → ___", options: ["He", "She", "It", "We"], answer: "It" },
    { type: "choice", prompt: "Pronoun untuk “mereka”", options: ["They", "We", "He", "You"], answer: "They" },
  ],
  "u1-l4": [
    { type: "choice", prompt: "She ___ a teacher.", options: ["am", "is", "are", "be"], answer: "is" },
    { type: "choice", prompt: "They ___ students.", options: ["is", "am", "are", "be"], answer: "are" },
    { type: "arrange", prompt: "Susun (negatif): “Saya bukan dokter”", words: ["I", "am", "not", "a", "doctor", "is"], answer: ["I", "am", "not", "a", "doctor"] },
    { type: "arrange", prompt: "Susun (tanya): “Apakah kamu siswa?”", words: ["Are", "you", "a", "student", "is"], answer: ["Are", "you", "a", "student"] },
  ],
};

// Soal tambahan agar pengulangan pelajaran selalu berbeda (bank soal lebih besar dari 1 sesi).
const EXTRA: Record<string, Question[]> = {
  "u1-l1": [
    { type: "choice", prompt: "Apa arti “Good afternoon”?", options: ["Selamat siang/sore", "Selamat pagi", "Selamat tidur", "Sampai nanti"], answer: "Selamat siang/sore" },
    { type: "arrange", prompt: "Susun: “Selamat pagi”", words: ["morning", "Good", "night", "evening"], answer: ["Good", "morning"] },
    { type: "choice", prompt: "Sapaan formal saat malam hari…", options: ["Good evening", "Hi", "Hey", "Yo"], answer: "Good evening" },
    { type: "choice", prompt: "Apa arti “Hello”?", options: ["Halo", "Maaf", "Tolong", "Selamat tinggal"], answer: "Halo" },
  ],
  "u1-l2": [
    { type: "choice", prompt: "Apa arti “My name is Budi”?", options: ["Nama saya Budi", "Saya dari Budi", "Budi temanku", "Kamu Budi"], answer: "Nama saya Budi" },
    { type: "arrange", prompt: "Susun: “Saya dari Jakarta”", words: ["Jakarta", "I", "from", "am", "name"], answer: ["I", "am", "from", "Jakarta"] },
    { type: "choice", prompt: "Pertanyaan untuk menanyakan nama:", options: ["What is your name?", "Where are you from?", "How old are you?", "Who is he?"], answer: "What is your name?" },
    { type: "choice", prompt: "Lengkapi: “My ___ is Sarah.”", options: ["name", "from", "am", "is"], answer: "name" },
  ],
  "u1-l3": [
    { type: "choice", prompt: "Pronoun untuk “dia (laki-laki)”", options: ["He", "She", "It", "We"], answer: "He" },
    { type: "choice", prompt: "Pronoun untuk “aku/saya”", options: ["I", "You", "They", "It"], answer: "I" },
    { type: "choice", prompt: "Pronoun untuk “kamu”", options: ["You", "We", "He", "They"], answer: "You" },
    { type: "choice", prompt: "“Rina and Budi” → ___", options: ["They", "He", "She", "It"], answer: "They" },
  ],
  "u1-l4": [
    { type: "choice", prompt: "I ___ happy.", options: ["am", "is", "are", "be"], answer: "am" },
    { type: "choice", prompt: "He ___ not a doctor.", options: ["is", "am", "are", "be"], answer: "is" },
    { type: "arrange", prompt: "Susun: “Kami adalah teman”", words: ["We", "are", "friends", "is", "am"], answer: ["We", "are", "friends"] },
    { type: "arrange", prompt: "Susun (tanya): “Apakah dia guru?”", words: ["Is", "she", "a", "teacher", "are"], answer: ["Is", "she", "a", "teacher"] },
  ],
};

export const units: Unit[] = RAW.map((u, ui) => ({
  number: ui + 1,
  title: u.title,
  color: u.color,
  lessons: u.levels.map((title, li) => {
    const id = `u${ui + 1}-l${li + 1}`;
    return { id, unit: ui + 1, level: li + 1, title, questions: [...(QUESTIONS[id] ?? []), ...(EXTRA[id] ?? [])] };
  }),
}));

export const allLessons: Lesson[] = units.flatMap((u) => u.lessons);

export function getLesson(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id);
}

/** Jumlah soal dalam satu sesi (dibatasi oleh ukuran bank soal). */
export const SESSION_SIZE = 5;
export const sessionSize = (lesson: Lesson) => Math.min(SESSION_SIZE, lesson.questions.length);

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Ambil soal acak dari bank soal, acak urutan soal, pilihan, dan kata.
 * Panggil hanya saat request (setelah membaca sesi), agar hasilnya berbeda setiap kali.
 */
export function pickQuestions(lesson: Lesson): Question[] {
  return shuffle(lesson.questions)
    .slice(0, sessionSize(lesson))
    .map((q) => (q.type === "choice" ? { ...q, options: shuffle(q.options) } : { ...q, words: shuffle(q.words) }));
}


/** Lesson terbuka jika lesson sebelumnya sudah selesai (lesson pertama selalu terbuka). */
export function isUnlocked(lessonId: string, completed: string[]): boolean {
  const idx = allLessons.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return idx === 0;
  return completed.includes(allLessons[idx - 1].id);
}

/** Lesson berikutnya yang harus dikerjakan. */
export function nextLesson(completed: string[]): Lesson | undefined {
  return allLessons.find((l) => !completed.includes(l.id));
}

export const XP_PER_QUESTION = 10;
export const GEMS_PER_LESSON = 5;
export const MAX_HEARTS = 5;
export const DAILY_XP_GOAL = 30;
