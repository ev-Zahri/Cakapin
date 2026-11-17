import Link from "next/link";

export const instant = false;

import { logout } from "../actions";
import { GameIcon } from "../components/game-icon";

type Props = { children: React.ReactNode };

/** Layout aplikasi: rel navigasi kiri + konten. Halaman anak membaca sesi di dalam <Suspense>. */
export default function AppLayout({ children }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-1 gap-8 px-4 lg:px-8">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-2 border-r-2 border-line py-6 pr-6 md:flex">
        <Link href="/belajar" className="mb-6 flex items-center gap-2 text-3xl font-black text-primary">
          <GameIcon name="mascot" size={44} alt="" /> cakapin
        </Link>
        <NavLink href="/belajar" icon="home" label="Belajar" />
        <NavLink href="/latihan" icon="fitness_center" label="Latihan" />
        <NavLink href="/misi" icon="flag" label="Misi & Toko" />
        <NavLink href="/peringkat" icon="leaderboard" label="Peringkat" />
        <form action={logout} className="mt-auto">
          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-extrabold uppercase tracking-wide text-ink-muted hover:bg-surface-low">
            <span className="icon text-2xl">logout</span> Keluar
          </button>
        </form>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-24 md:pb-8">
        <Suspense fallback={<p className="p-10 text-center text-ink-muted">Memuat…</p>}>{children}</Suspense>
      </div>

      {/* Navigasi bawah untuk layar kecil */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t-2 border-line bg-white py-2 md:hidden">
        {[
          ["/belajar", "home"],
          ["/latihan", "fitness_center"],
          ["/misi", "flag"],
          ["/peringkat", "leaderboard"],
        ].map(([href, icon]) => (
          <Link key={href} href={href} className="p-2 text-ink-muted">
            <span className="icon text-3xl">{icon}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border-2 border-transparent px-4 py-3 font-extrabold uppercase tracking-wide text-ink-muted hover:bg-surface-low"
    >
      <span className="icon text-2xl">{icon}</span> {label}
    </Link>
  );
}

import { Suspense } from "react";
