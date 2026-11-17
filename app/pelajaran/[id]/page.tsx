import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLesson, isUnlocked, pickQuestions } from "../../lib/curriculum";
import { requireUser } from "../../lib/users";
import { GameIcon } from "../../components/game-icon";
import { LessonPlayer } from "./player";

export default function PelajaranPage({ params }: PageProps<"/pelajaran/[id]">) {
  return (
    <Suspense fallback={<p className="p-10 text-center text-ink-muted">Memuat pelajaran…</p>}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: PageProps<"/pelajaran/[id]">["params"] }) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson || lesson.questions.length === 0) notFound();

  const user = await requireUser();
  if (!isUnlocked(id, user.completed)) {
    return <Notice title="Pelajaran masih terkunci" text="Selesaikan pelajaran sebelumnya dulu ya." />;
  }
  if (user.hearts === 0) {
    return <Notice title="Nyawa habis" text="Isi ulang nyawa di Toko Permata untuk lanjut belajar." cta={{ href: "/misi", label: "Ke Toko" }} />;
  }

  // Soal diacak setiap kali dibuka (setelah data request dibaca) → pengulangan selalu berbeda.
  return <LessonPlayer lesson={{ ...lesson, questions: pickQuestions(lesson) }} hearts={user.hearts} />;
}

function Notice({ title, text, cta }: { title: string; text: string; cta?: { href: string; label: string } }) {
  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <GameIcon name="mascotSad" size={160} alt="Maskot sedih" />
      <h1 className="text-2xl font-black">{title}</h1>
      <p className="text-ink-muted">{text}</p>
      {cta && <Link href={cta.href} className="btn btn-gem">{cta.label}</Link>}
      <Link href="/belajar" className="btn btn-ghost">Kembali</Link>
    </main>
  );
}
