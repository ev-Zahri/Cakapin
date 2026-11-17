import { Suspense } from "react";

export const instant = false;

import { requireUser } from "../../lib/users";
import { PengaturanView } from "./pengaturan-view";

export default async function PengaturanPage() {
  const user = await requireUser();

  return (
    <Suspense fallback={<p className="p-10 text-center text-ink-muted">Memuat pengaturan…</p>}>
      <PengaturanView user={user} />
    </Suspense>
  );
}
