import { Suspense } from "react";

export const instant = false;

import { getLeaderboard, getRank, requireUser } from "../../lib/users";
import { leagueFor } from "../../lib/shop";
import { PeringkatView } from "./peringkat-view";

export default async function PeringkatPage() {
  const user = await requireUser();
  const [board, rank] = await Promise.all([getLeaderboard(30), getRank(user.xp)]);
  const { current } = leagueFor(user.xp);

  return (
    <Suspense fallback={<p className="p-10 text-center text-ink-muted">Memuat papan peringkat…</p>}>
      <PeringkatView
        user={user}
        board={board}
        rank={rank}
        leagueName={current.name}
      />
    </Suspense>
  );
}
