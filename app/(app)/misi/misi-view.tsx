"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { buyCostume, buyItem, claimMonthly, claimQuest, equipCostume } from "../../actions";
import { ActionButton } from "../../components/action-button";
import { GameIcon, type IconName } from "../../components/game-icon";
import { SHOP } from "../../lib/shop";

export type MisiProps = {
  gems: number;
  hearts: number;
  streakFreezes: number;
  xpBoostUntil: number;
  owned: string[];
  equipped: string | null;
  costumes: { id: string; name: string; desc: string; cost: number; icon: IconName }[];
  quests: { id: string; icon: IconName; title: string; desc: string; value: number; target: number; gems: number; claimed: boolean }[];
  badges: { icon: IconName; title: string; unlocked: boolean }[];
  monthly: { days: number; target: number; claimed: boolean; daysLeft: number; monthName: string };
  league: { name: string; nextName: string | null; xpToNext: number; rank: number };
};

const card = "flex flex-col justify-between rounded-3xl border-2 border-b-4 border-line bg-white p-5 transition-shadow hover:shadow-md";
const gemTag = "flex items-center justify-center gap-1 font-black text-gem-edge";

export function MisiView(p: MisiProps) {
  const [tab, setTab] = useState<"shop" | "quests">("shop");

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Misi &amp; Toko Permata</h1>
          <p className="text-ink-muted">Selesaikan misi, kumpulkan permata, dan belanja perlengkapan belajar.</p>
        </div>
        <motion.div
          key={p.gems}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2 rounded-full border-2 border-gem bg-gem-soft px-4 py-2 text-lg font-black text-gem-edge"
        >
          <GameIcon name="gem" size={28} alt="Permata" /> {p.gems.toLocaleString("id-ID")}
        </motion.div>
      </div>

      {/* Tab */}
      <div className="mb-6 inline-flex rounded-full bg-surface-high p-1">
        {([["shop", "Toko", "storefront"], ["quests", "Misi & Pencapaian", "flag"]] as const).map(([id, label, icon]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 font-extrabold transition-colors ${tab === id ? "text-ink" : "text-ink-muted hover:text-ink"}`}
          >
            {tab === id && (
              <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            )}
            <span className="icon relative text-xl">{icon}</span>
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {tab === "shop" ? (
              <motion.div key="shop" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }} className="flex flex-col gap-10">
                <ShopSection {...p} />
              </motion.div>
            ) : (
              <motion.div key="quests" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }} className="flex flex-col gap-6">
                <QuestSection {...p} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:col-span-4 lg:h-fit">
          <Monthly {...p.monthly} />
          <League {...p.league} />
        </aside>
      </div>
    </>
  );
}

/* ---------------- Toko ---------------- */
function ShopSection(p: MisiProps) {
  const boostActive = useBoostLeft(p.xpBoostUntil);

  return (
    <>
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-black"><GameIcon name="bolt" size={32} /> Perlengkapan Belajar</h2>
        <Grid>
          <ShopCard
            icon="flame" tag={`${p.streakFreezes}/${SHOP.freeze.max} Aktif`} title="Bekukan Streak"
            desc="Menjaga streak belajarmu tetap aman jika kamu lupa berlatih selama 1 hari penuh."
            cost={SHOP.freeze.cost} action={buyItem.bind(null, "freeze")}
            disabled={p.streakFreezes >= SHOP.freeze.max || p.gems < SHOP.freeze.cost}
            label={p.streakFreezes >= SHOP.freeze.max ? `Maks ${SHOP.freeze.max}/${SHOP.freeze.max} Tersimpan` : "Beli"}
          />
          <ShopCard
            icon="bolt" tag={boostActive ? `Aktif ${boostActive}` : "HOT"} title="Pengganda XP 2x"
            desc={`Dapatkan 2x lipat XP dari setiap pelajaran selama ${SHOP.xp2x.minutes} menit.`}
            cost={SHOP.xp2x.cost} action={buyItem.bind(null, "xp2x")}
            disabled={p.gems < SHOP.xp2x.cost} label={boostActive ? "Perpanjang" : "Aktifkan Sekarang"}
          />
          <ShopCard
            icon="heart" tag="+5 Nyawa" title="Isi Ulang Hati"
            desc="Pulihkan seluruh nyawa secara instan agar bisa lanjut belajar tanpa jeda."
            cost={SHOP.hearts.cost} action={buyItem.bind(null, "hearts")}
            disabled={p.hearts >= 5 || p.gems < SHOP.hearts.cost} label={p.hearts >= 5 ? "Nyawa Penuh (5/5)" : `Isi Penuh (${p.hearts}/5)`}
          />
        </Grid>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-2xl font-black"><span className="icon text-3xl text-streak-edge">checkroom</span> Kostum &amp; Aksesoris Maskot</h2>
          <span className="text-sm text-ink-muted">Beri gaya unik pada maskot kamu!</span>
        </div>
        <Grid>
          {p.costumes.map((c) => {
            const owned = p.owned.includes(c.id);
            const active = p.equipped === c.id;
            return (
              <motion.div key={c.id} layout className={`${card} ${active ? "!border-primary" : ""}`}>
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className={`relative flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl ${active ? "bg-primary-soft/50" : "bg-surface-low"}`}>
                    {active && (
                      <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-black text-white">
                        <span className="icon text-sm">check</span> Digunakan
                      </span>
                    )}
                    <motion.div whileHover={{ scale: 1.1, rotate: -4 }}>
                      <GameIcon name={c.icon} size={128} alt={c.name} />
                    </motion.div>
                  </div>
                  <h3 className="mt-1 text-lg font-black">{c.name}</h3>
                  <p className="text-sm text-ink-muted">{c.desc}</p>
                </div>
                <div className="mt-5 flex flex-col gap-3 border-t-2 border-surface-low pt-4">
                  {owned ? (
                    <>
                      <span className="text-center font-extrabold text-ink-muted">Sudah Dimiliki</span>
                      <ActionButton
                        action={equipCostume.bind(null, active ? null : c.id)}
                        className={`btn w-full !py-2.5 text-sm ${active ? "btn-ghost" : "btn-gem"}`}
                      >
                        {active ? "Lepas" : "Pakai"}
                      </ActionButton>
                    </>
                  ) : (
                    <>
                      <span className={gemTag}><GameIcon name="gem" size={22} /> {c.cost} Permata</span>
                      <ActionButton action={buyCostume.bind(null, c.id)} disabled={p.gems < c.cost} className="btn btn-primary w-full !py-2.5 text-sm">
                        Beli Kostum
                      </ActionButton>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </Grid>
      </section>
    </>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-5 md:grid-cols-3"
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
    >
      {Array.isArray(children)
        ? children.map((c, i) => <Pop key={i}>{c}</Pop>)
        : <Pop>{children}</Pop>}
    </motion.div>
  );
}

function Pop({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="flex">
      <div className="flex-1">{children}</div>
    </motion.div>
  );
}

function ShopCard(p: {
  icon: IconName; tag: string; title: string; desc: string; cost: number;
  label: string; disabled: boolean; action: () => Promise<{ error?: string }>;
}) {
  return (
    <div className={`${card} h-full`}>
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-low">
          <motion.div whileHover={{ scale: 1.15, rotate: 6 }}><GameIcon name={p.icon} size={52} alt="" /></motion.div>
          <span className="absolute -bottom-2 -right-3 whitespace-nowrap rounded-full bg-streak px-2 py-0.5 text-[10px] font-black text-white">{p.tag}</span>
        </div>
        <h3 className="mt-1 text-lg font-black">{p.title}</h3>
        <p className="text-sm text-ink-muted">{p.desc}</p>
      </div>
      <div className="mt-5 flex flex-col gap-3 border-t-2 border-surface-low pt-4">
        <span className={gemTag}><GameIcon name="gem" size={22} /> {p.cost} Permata</span>
        <ActionButton action={p.action} disabled={p.disabled} className="btn btn-primary w-full !py-2.5 text-sm">{p.label}</ActionButton>
      </div>
    </div>
  );
}

/* ---------------- Misi ---------------- */
function QuestSection(p: MisiProps) {
  const reset = useCountdownToMidnight();
  return (
    <>
      <div className="flex flex-col gap-5 rounded-3xl border-2 border-b-4 border-line bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-black">Misi Harian Kamu</h3>
            <p className="text-sm text-ink-muted">Selesaikan misi sebelum jam 00:00 untuk mendapatkan permata!</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-streak/25 px-3 py-1 font-black text-streak-edge">
            <span className="icon text-lg">timer</span> {reset}
          </span>
        </div>

        {p.quests.map((q, i) => {
          const done = q.value >= q.target;
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface-low p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white"><GameIcon name={q.icon} size={32} /></div>
                <div>
                  <h4 className={`font-black ${q.claimed ? "text-ink-muted line-through" : ""}`}>{q.title}</h4>
                  <p className="text-sm text-ink-muted">{q.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-28 overflow-hidden rounded-full bg-line">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (q.value / q.target) * 100)}%` }}
                    transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.2 }}
                  />
                </div>
                {q.claimed ? (
                  <span className="text-sm font-black text-primary-dark">Diklaim ✓</span>
                ) : done ? (
                  <ActionButton action={claimQuest.bind(null, q.id)} className="btn btn-primary !py-2 text-sm">
                    Klaim +{q.gems}
                  </ActionButton>
                ) : (
                  <span className="flex items-center gap-1 text-sm font-black text-gem-edge">+{q.gems} <GameIcon name="gem" size={18} /></span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-3xl border-2 border-b-4 border-line bg-white p-6">
        <h3 className="mb-4 text-xl font-black">Lencana Pencapaian</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {p.badges.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 18 }}
              whileHover={b.unlocked ? { scale: 1.06, rotate: -2 } : undefined}
              className={`flex flex-col items-center gap-2 rounded-2xl bg-surface-low p-4 text-center ${b.unlocked ? "" : "opacity-50 grayscale"}`}
            >
              <GameIcon name={b.icon} size={84} alt={b.title} />
              <span className="text-sm font-extrabold">{b.title}</span>
              {!b.unlocked && <span className="icon text-lg text-ink-muted">lock</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------------- Panel kanan ---------------- */
function Monthly(m: MisiProps["monthly"]) {
  const ready = m.days >= m.target && !m.claimed;
  const pct = Math.min(100, (m.days / m.target) * 100);
  return (
    <div className="flex flex-col gap-5 rounded-3xl border-2 border-b-4 border-line bg-white p-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-streak/25 px-3 py-1 text-xs font-black uppercase tracking-wider text-streak-edge">Tantangan Bulanan</span>
        <span className="text-xs font-bold text-ink-muted">Sisa {m.daysLeft} Hari</span>
      </div>
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="relative flex h-36 w-36 items-center justify-center">
          <motion.div className="absolute inset-0 rounded-full bg-streak/20 blur-xl" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.4, repeat: Infinity }} />
          <motion.div
            animate={ready ? { rotate: [0, -6, 6, -6, 6, 0], scale: [1, 1.08, 1] } : { y: [0, -5, 0] }}
            transition={{ duration: ready ? 1.2 : 3, repeat: Infinity, ease: "easeInOut" }}
            className={m.days < m.target && !m.claimed ? "grayscale-[40%]" : ""}
          >
            <GameIcon name="chest" size={112} alt="Peti harta karun" />
          </motion.div>
        </div>
        <h3 className="text-xl font-black">Tantangan Super {m.monthName}</h3>
        <p className="text-sm text-ink-muted">
          Tuntaskan {m.target} target harian untuk membuka peti berisi 500 Permata!
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between font-extrabold">
          <span>Progres Tantangan</span>
          <span className="text-lg font-black text-primary-dark">{m.days} / {m.target}</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-line p-0.5">
          <motion.div
            className="relative h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 70, damping: 16 }}
          >
            <span className="absolute inset-x-1 top-0.5 h-1 rounded-full bg-white/40" />
          </motion.div>
        </div>
        <p className="mt-1 text-center text-sm text-ink-muted">
          {m.claimed ? "Hadiah bulan ini sudah diklaim 🎉" : ready ? "Tantangan selesai! Klaim hadiahmu." : `Tinggal ${m.target - m.days} target harian lagi!`}
        </p>
      </div>
      {ready && (
        <ActionButton action={claimMonthly} className="btn btn-primary w-full">Klaim 500 Permata</ActionButton>
      )}
    </div>
  );
}

function League({ name, nextName, xpToNext, rank }: MisiProps["league"]) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border-2 border-b-4 border-line bg-gradient-to-br from-gem-soft to-white p-6">
      <div className="flex items-center gap-3">
        <GameIcon name="badgeLeague" size={52} alt="" />
        <div>
          <h4 className="text-lg font-black">{name}</h4>
          <span className="text-sm text-ink-muted">Posisi #{rank} di klasemen</span>
        </div>
      </div>
      <p className="text-sm text-ink-muted">
        {nextName ? `Kumpulkan ${xpToNext} XP lagi untuk naik ke ${nextName}!` : "Kamu sudah di liga tertinggi. Pertahankan!"}
      </p>
      <Link href="/peringkat" className="flex items-center gap-1 self-start text-sm font-black text-gem-edge hover:underline">
        Lihat Papan Peringkat <span className="icon text-base">arrow_forward</span>
      </Link>
    </div>
  );
}

/* ---------------- hooks waktu (client-only, hindari mismatch hydration) ---------------- */
function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

const pad = (n: number) => String(n).padStart(2, "0");

function useCountdownToMidnight(): string {
  const now = useNow();
  if (now === null) return "--:--:--";
  // tengah malam WIB (UTC+7)
  const wib = now + 7 * 3_600_000;
  const left = 86_400_000 - (wib % 86_400_000);
  const s = Math.floor(left / 1000);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

/** Sisa waktu XP 2x, atau "" bila tidak aktif. */
function useBoostLeft(until: number): string {
  const now = useNow();
  if (now === null || until <= now) return "";
  const s = Math.floor((until - now) / 1000);
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}
