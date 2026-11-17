import { Suspense } from "react";

export const instant = false;

import { DAILY_XP_GOAL } from "../../lib/curriculum";
import { COSTUMES, LEAGUES, MONTHLY_TARGET, daysLeftInMonth, leagueFor } from "../../lib/shop";
import { getRank, requireUser, thisMonth, today } from "../../lib/users";
import { StatBar } from "../../components/stats";
import { MisiView, type MisiProps } from "./misi-view";

export default async function MisiPage() {
  const user = await requireUser();
  const rank = await getRank(user.xp);
  const { current, next } = leagueFor(user.xp);
  const month = thisMonth();
  const d = user.daily;

  const props: MisiProps = {
    gems: user.gems,
    hearts: user.hearts,
    streakFreezes: user.streakFreezes,
    xpBoostUntil: user.xpBoostUntil,
    owned: user.owned,
    equipped: user.equipped,
    costumes: COSTUMES.map((c) => ({ ...c })),
    quests: [
      { id: "xp", icon: "bolt", title: `Dapatkan ${DAILY_XP_GOAL} XP`, desc: `Progres: ${Math.min(d.xp, DAILY_XP_GOAL)} dari ${DAILY_XP_GOAL} XP`, value: d.xp, target: DAILY_XP_GOAL, gems: 10, claimed: d.claimed.includes("xp") },
      { id: "lessons", icon: "mascotThink", title: "Selesaikan 2 pelajaran", desc: `Progres: ${Math.min(d.lessons, 2)} dari 2 pelajaran tuntas`, value: d.lessons, target: 2, gems: 10, claimed: d.claimed.includes("lessons") },
      { id: "perfect", icon: "badgePerfect", title: "1 pelajaran tanpa salah", desc: "Selesaikan satu sesi tanpa kehilangan nyawa", value: d.perfect, target: 1, gems: 15, claimed: d.claimed.includes("perfect") },
    ],
    badges: [
      { icon: "badgeFirst", title: "Pelajaran Pertama", unlocked: user.completed.length >= 1 },
      { icon: "badgePerfect", title: "Skor Sempurna", unlocked: user.perfectTotal >= 1 },
      { icon: "badgeStreak", title: "Streak 7 Hari", unlocked: user.streak >= 7 },
      { icon: "badgeWords", title: "100 Kata Dipelajari", unlocked: user.xp >= 500 },
      { icon: "badgeLeague", title: "Naik Liga", unlocked: user.xp >= LEAGUES[1].min },
      { icon: "badgeSpeaking", title: "Master Speaking", unlocked: false },
    ],
    monthly: {
      days: user.goalDays.filter((x) => x.startsWith(month)).length,
      target: MONTHLY_TARGET,
      claimed: user.monthlyClaimed === month,
      daysLeft: daysLeftInMonth(today()),
      monthName: new Intl.DateTimeFormat("id-ID", { month: "long", timeZone: "Asia/Jakarta" }).format(new Date()),
    },
    league: {
      name: current.name,
      nextName: next?.name ?? null,
      xpToNext: next ? next.min - user.xp : 0,
      rank,
    },
  };

  return (
    <div className="mx-auto w-full max-w-6xl py-6">
      <div className="mb-6"><StatBar user={user} /></div>
      <Suspense>
        <MisiView {...props} />
      </Suspense>
    </div>
  );
}
