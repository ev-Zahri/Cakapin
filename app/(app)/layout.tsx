import Link from "next/link";
import { Suspense } from "react";
import { logout } from "../actions";
import { GameIcon } from "../components/game-icon";
import { getSessionUid } from "../lib/session";
import { getUser } from "../lib/users";

export const instant = false;

type Props = { children: React.ReactNode };

/** Layout aplikasi: Navigasi kiri proporsional (w-64) + Kontainer tengah tertata rapi (max-w-6xl). */
export default async function AppLayout({ children }: Props) {
  const uid = await getSessionUid();
  const user = uid ? await getUser(uid) : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 lg:gap-8 px-4 sm:px-6">
      {/* Sidebar Navigasi Kiri Desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line py-6 pr-4 md:flex">
        {/* Brand Logo */}
        <Link href="/learn" className="mb-6 flex items-center gap-2.5 text-2xl font-black text-primary tracking-tight">
          <GameIcon name="mascot" size={38} alt="Cakapin" />
          <span>cakapin</span>
        </Link>

        {/* Menu Navigasi Utama */}
        <nav className="flex flex-col gap-1.5">
          <NavLink href="/learn" icon="home" label="Belajar" />
          <NavLink href="/practice" icon="fitness_center" label="Pusat Latihan" badge="Baru" />
          <NavLink href="/quests" icon="storefront" label="Toko & Misi" />
          <NavLink href="/leaderboard" icon="leaderboard" label="Papan Peringkat" />
          <NavLink href="/settings" icon="settings" label="Pengaturan" />
        </nav>

        {/* Bagian Bawah Sidebar: Mini Profil Pembelajar & Tombol Keluar */}
        <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-line">
          {user && (
            <div className="flex items-center gap-3 rounded-2xl bg-surface-low p-3 border border-slate-200/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white font-black text-sm uppercase">
                {user.name ? user.name.slice(0, 2) : "CK"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-black text-ink">{user.name || "Siswa Cakapin"}</p>
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-ink-muted">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Level Dasar A1</span>
                </div>
              </div>
            </div>
          )}

          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-xs font-black uppercase tracking-wider text-slate-500 hover:bg-rose-50 hover:text-rose-600 cursor-pointer transition-colors"
            >
              <span className="icon text-xl">logout</span> Keluar Akun
            </button>
          </form>
        </div>
      </aside>

      {/* Konten Halaman Utama */}
      <main className="flex min-w-0 flex-1 flex-col pb-24 md:pb-8">
        <Suspense fallback={<p className="p-10 text-center font-bold text-ink-muted">Memuat halaman…</p>}>
          {children}
        </Suspense>
      </main>

      {/* Navigasi bawah untuk layar mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-line bg-white/95 backdrop-blur-md py-2 md:hidden shadow-lg">
        {[
          ["/learn", "home", "Belajar"],
          ["/practice", "fitness_center", "Latihan"],
          ["/quests", "storefront", "Toko"],
          ["/leaderboard", "leaderboard", "Peringkat"],
          ["/settings", "settings", "Akun"],
        ].map(([href, icon, label]) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 p-2 text-ink-muted hover:text-primary transition-colors"
          >
            <span className="icon text-2xl">{icon}</span>
            <span className="text-[10px] font-black uppercase">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

function NavLink({
  href,
  icon,
  label,
  badge,
}: {
  href: string;
  icon: string;
  label: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl px-4 py-3 font-extrabold text-sm text-ink-muted hover:bg-surface-low hover:text-ink transition-colors group"
    >
      <div className="flex items-center gap-3">
        <span className="icon text-2xl text-slate-400 group-hover:text-primary transition-colors">{icon}</span>
        <span>{label}</span>
      </div>
      {badge && (
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-700">
          {badge}
        </span>
      )}
    </Link>
  );
}
