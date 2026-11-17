import { Suspense } from "react";

export const instant = false;

import { allLessons } from "../../lib/curriculum";
import { requireUser } from "../../lib/users";
import { LatihanView } from "./latihan-view";

export default async function LatihanPage() {
  const user = await requireUser();
  const done = allLessons.filter((l) => user.completed.includes(l.id));

  return (
    <Suspense fallback={<p className="p-10 text-center text-ink-muted">Memuat pusat latihan…</p>}>
      <LatihanView
        user={user}
        doneLessons={done}
        firstLessonId={allLessons[0]?.id ?? "u1-l1"}
      />
    </Suspense>
  );
}
