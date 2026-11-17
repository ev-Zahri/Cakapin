import Link from "next/link";

export const instant = false;

import { allLessons } from "../../lib/curriculum";
import { requireUser } from "../../lib/users";
import { StatBar } from "../../components/stats";
import { FadeIn, Float } from "../../components/motion";
import { GameIcon } from "../../components/game-icon";

export default async function LatihanPage() {
  const user = await requireUser();
  const done = allLessons.filter((l) => user.completed.includes(l.id));

  return (
    <div className="mx-auto w-full max-w-2xl py-6">
      <div className="mb-6"><StatBar user={user} /></div>
      <h1 className="mb-1 flex items-center gap-2 text-3xl font-black"><GameIcon name="bolt" size={40} /> Pusat Latihan</h1>
      <p className="mb-6 text-ink-muted">Ulangi pelajaran yang sudah kamu selesaikan agar makin hafal.</p>

      {user.hearts === 0 && (
        <div className="card mb-4 !border-ruby bg-ruby-soft text-ruby-edge">
          Nyawa habis. Isi ulang di <Link href="/misi" className="underline">Toko</Link>.
        </div>
      )}

      {done.length === 0 ? (
        <div className="card text-center">
          <Float className="flex justify-center"><GameIcon name="mascotSleep" size={160} alt="Maskot tidur" /></Float>
          <p className="font-bold">Belum ada pelajaran yang selesai.</p>
          <Link href="/belajar" className="btn btn-primary mt-4">Mulai belajar</Link>
        </div>
      ) : (
        <FadeIn><ul className="flex flex-col gap-3">
          {done.map((l) => (
            <li key={l.id} className="card flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-ink-muted">Unit {l.unit} · Level {l.level}</p>
                <p className="font-extrabold">{l.title}</p>
              </div>
              <Link href={`/pelajaran/${l.id}`} className="btn btn-gem !py-2 text-sm">Latih</Link>
            </li>
          ))}
        </ul></FadeIn>
      )}
    </div>
  );
}
