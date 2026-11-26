"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GameIcon } from "../../components/game-icon";
import { StatBar } from "../../components/stats";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import type { User } from "../../lib/users";
import type { PaymentTransaction } from "../../lib/transactions";
import { verifyAndSettlePayment } from "../../lib/payment";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function PengaturanView({
  user,
  transactions = [],
}: {
  user: User;
  transactions?: PaymentTransaction[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "payment">("general");
  const [name, setName] = useState(user.name);
  const [dailyGoal, setDailyGoal] = useState(30);
  const [soundEffects, setSoundEffects] = useState(true);
  const [speakingExercises, setSpeakingExercises] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCheckPayment = async (orderId: string) => {
    try {
      setVerifyingId(orderId);
      const res = await verifyAndSettlePayment(orderId);
      if (res.ok) {
        alert(res.message);
        router.refresh();
      } else {
        alert(res.error);
      }
    } catch (err) {
      alert((err as Error).message || "Gagal memeriksa status pembayaran.");
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      <div className="mb-6">
        <StatBar user={user} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-low border-2 border-line flex items-center justify-center text-primary">
            <span className="icon text-3xl">settings</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-on-surface">Pengaturan Akun</h1>
            <p className="text-sm font-bold text-ink-muted">Kelola profil, audio, dan riwayat pembayaran.</p>
          </div>
        </div>
      </div>

      {/* Sub Menu Navigasi Tab */}
      <div className="mb-6 flex gap-2 border-b-2 border-line pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`relative flex items-center gap-2 rounded-2xl px-5 py-3 font-extrabold text-sm transition-all cursor-pointer ${
            activeTab === "general"
              ? "bg-primary text-white shadow-xs"
              : "text-ink-muted hover:bg-surface-low hover:text-ink"
          }`}
        >
          <span className="icon text-xl">tune</span> Pengaturan Umum
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payment")}
          className={`relative flex items-center gap-2 rounded-2xl px-5 py-3 font-extrabold text-sm transition-all cursor-pointer ${
            activeTab === "payment"
              ? "bg-primary text-white shadow-xs"
              : "text-ink-muted hover:bg-surface-low hover:text-ink"
          }`}
        >
          <span className="icon text-xl">receipt_long</span> Riwayat Pembayaran
          {transactions.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
              activeTab === "payment" ? "bg-white text-primary" : "bg-primary-soft text-primary-dark"
            }`}>
              {transactions.length}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "general" ? (
          <motion.form
            key="general-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSave}
            className="flex flex-col gap-6"
          >
            {/* 1. Profil Pengguna */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-2 border-b-2 border-line">
                <span className="icon text-primary text-xl">person</span>
                <CardTitle className="text-lg">Profil Pengguna</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">Nama Lengkap</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Alamat Email (Akun)</Label>
                  <Input
                    type="email"
                    value={user.email}
                    disabled
                    className="opacity-70 cursor-not-allowed bg-surface-high"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 2. Preferensi Target Belajar */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-2 border-b-2 border-line">
                <span className="icon text-streak-edge text-xl">bolt</span>
                <CardTitle className="text-lg">Target XP Harian</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Santai", xp: 15 },
                    { label: "Biasa", xp: 30 },
                    { label: "Serius", xp: 50 },
                    { label: "Gila Belajar", xp: 100 },
                  ].map((tier) => (
                    <button
                      key={tier.xp}
                      type="button"
                      onClick={() => setDailyGoal(tier.xp)}
                      className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                        dailyGoal === tier.xp
                          ? "border-primary bg-primary-soft/40 shadow-xs"
                          : "border-line bg-surface-low hover:bg-surface-high/50"
                      }`}
                    >
                      <span className="block text-xs font-black text-ink-muted uppercase">{tier.label}</span>
                      <span className="text-lg font-black text-on-surface">{tier.xp} XP</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 3. Audio & Aksesibilitas */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-2 border-b-2 border-line">
                <span className="icon text-primary text-xl">volume_up</span>
                <CardTitle className="text-lg">Efek Suara &amp; Latihan Suara</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-3">
                <ToggleRow
                  icon="music_note"
                  title="Efek Suara Interaktif"
                  desc="Bunyi nada saat jawaban benar atau keliru"
                  checked={soundEffects}
                  onChange={setSoundEffects}
                />
                <ToggleRow
                  icon="mic"
                  title="Latihan Pengucapan (Speaking)"
                  desc="Gunakan fitur mikrofon untuk melatih pelafalan kata bahasa Inggris"
                  checked={speakingExercises}
                  onChange={setSpeakingExercises}
                />
                <ToggleRow
                  icon="notifications"
                  title="Notifikasi Pengingat Belajar"
                  desc="Kirim pengingat agar rangkaian streak tidak terputus"
                  checked={notifications}
                  onChange={setNotifications}
                />
              </CardContent>
            </Card>

            {/* Submit Bar */}
            <div className="flex items-center justify-between pt-2">
              {saved ? (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-black text-primary-dark flex items-center gap-1.5"
                >
                  <span className="icon text-base">check_circle</span> Pengaturan berhasil disimpan!
                </motion.span>
              ) : (
                <span className="text-xs font-bold text-ink-muted">Pastikan data yang kamu masukkan sudah benar.</span>
              )}

              <Button type="submit" variant="primary" size="lg" className="px-8">
                Simpan Perubahan
              </Button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="payment-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b-2 border-line">
                <div className="flex items-center gap-2">
                  <span className="icon text-primary text-2xl">receipt_long</span>
                  <div>
                    <CardTitle className="text-xl">Riwayat Transaksi Top Up</CardTitle>
                    <p className="text-xs font-bold text-ink-muted">Semua transaksi pembelian permata via Midtrans tercatat di sini.</p>
                  </div>
                </div>
                <Link href="/quests">
                  <Button variant="super" size="sm">
                    <GameIcon name="gem" size={18} /> Top Up Permata
                  </Button>
                </Link>
              </CardHeader>

              <CardContent className="pt-4">
                {transactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
                    <GameIcon name="mascotThink" size={100} alt="Belum ada transaksi" />
                    <h3 className="text-lg font-black text-ink">Belum ada riwayat transaksi</h3>
                    <p className="text-sm font-medium text-ink-muted max-w-sm">
                      Kamu belum pernah melakukan pembelian paket permata. Kunjungi Toko untuk melihat pilihan paket hemat.
                    </p>
                    <Link href="/quests">
                      <Button variant="primary" size="md" className="mt-2">
                        Buka Toko Sekarang
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col divide-y-2 divide-line">
                    {transactions.map((tx) => {
                      const isSuccess = tx.transactionStatus === "settlement" || tx.transactionStatus === "capture";
                      const isPending = tx.transactionStatus === "pending";

                      return (
                        <div key={tx.orderId} className="py-4 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center shrink-0 ${
                              isSuccess
                                ? "bg-primary-soft/40 border-primary text-primary-dark"
                                : isPending
                                ? "bg-streak-soft/40 border-streak text-streak-edge"
                                : "bg-ruby-soft/40 border-ruby text-ruby-edge"
                            }`}>
                              <span className="icon text-2xl">
                                {isSuccess ? "check_circle" : isPending ? "pending" : "cancel"}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-black text-base text-ink">{tx.packageName}</h4>
                                <span className="font-extrabold text-xs text-gem-edge flex items-center gap-0.5">
                                  +{tx.gems} <GameIcon name="gem" size={14} />
                                </span>
                              </div>
                              <p className="text-xs font-bold text-ink-muted">
                                Order ID: <code className="bg-surface-low px-1.5 py-0.5 rounded font-mono text-[11px]">{tx.orderId}</code> •{" "}
                                {new Date(tx.createdAt || Date.now()).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="block font-black text-base text-ink">
                                Rp {tx.grossAmount.toLocaleString("id-ID")}
                              </span>
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                                isSuccess
                                  ? "bg-primary text-white"
                                  : isPending
                                  ? "bg-streak text-white"
                                  : "bg-ruby text-white"
                              }`}>
                                {isSuccess ? "Berhasil" : isPending ? "Menunggu" : tx.transactionStatus}
                              </span>
                            </div>

                            {isPending && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={verifyingId === tx.orderId}
                                onClick={() => handleCheckPayment(tx.orderId)}
                                className="!h-9 !px-3 text-xs"
                              >
                                {verifyingId === tx.orderId ? "Cek…" : "Cek Status"}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToggleRow({
  icon,
  title,
  desc,
  checked,
  onChange,
}: {
  icon: string;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3.5 bg-surface-low rounded-2xl border border-line">
      <div className="flex items-center gap-3">
        <span className="icon text-primary text-2xl">{icon}</span>
        <div>
          <h4 className="font-black text-sm text-on-surface">{title}</h4>
          <p className="text-xs font-bold text-ink-muted">{desc}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-7 rounded-full transition-colors relative p-1 shrink-0 ${
          checked ? "bg-primary" : "bg-line"
        }`}
      >
        <motion.div
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-5 h-5 rounded-full bg-white shadow-xs"
        />
      </button>
    </div>
  );
}
