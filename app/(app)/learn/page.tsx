import { Suspense } from "react";

export const instant = false;

import { nextLesson, units } from "../../lib/curriculum";
import { getRank, requireUser } from "../../lib/users";
import { BelajarView } from "./learn-view";

export default async function BelajarPage() {
  const user = await requireUser();
  const current = nextLesson(user.completed);
  const rank = await getRank(user.xp);

  return (
    <Suspense fallback={<p className="p-10 text-center text-ink-muted">Memuat peta belajar…</p>}>
      <BelajarView user={user} currentLesson={current} rank={rank} units={units} />
    </Suspense>
  );
}
