import { Suspense } from "react";

export const instant = false;

import { requireUser } from "../../lib/users";
import { getUserTransactions } from "../../lib/transactions";
import { PengaturanView } from "./setting-view";

export default async function PengaturanPage() {
  const user = await requireUser();
  const transactions = await getUserTransactions(user.id);

  return (
    <Suspense fallback={<p className="p-10 text-center text-ink-muted">Memuat pengaturan…</p>}>
      <PengaturanView user={user} transactions={transactions} />
    </Suspense>
  );
}
