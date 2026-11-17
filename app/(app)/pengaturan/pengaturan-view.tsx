"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { GameIcon } from "../../components/game-icon";
import { StatBar } from "../../components/stats";
import type { User } from "../../lib/users";
import Link from "next/link";

export function PengaturanView({ user }: { user: User }) {
  const [name, setName] = useState(user.name);
  const [dailyGoal, setDailyGoal] = useState(30);
  const [soundEffects, setSoundEffects] = useState(true);
  const [speakingExercises, setSpeakingExercises] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      <div className="mb-6">
        <StatBar user={user} />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-surface-low border-2 border-line flex items-center justify-center text-primary">
          <span className="icon text-3xl">settings</span>
        </div>
        <div>
          <h1 className="text-3xl font-black text-on-surface">Pengaturan Akun</h1>
          <p className="text-sm font-bold text-ink-muted">Kelola preferensi akun, audio latihan, dan target harianmu.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* 1. Profil Pengguna */}
        <div className="bg-white rounded-3xl border-2 border-line p-6 sm:p-8 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-line">
            <span className="icon text-primary text-xl">person</span>
            <h2 className="text-lg font-black text-on-surface">Profil Pengguna</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-ink-muted mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-low border-2 border-line rounded-2xl px-4 py-3 font-bold text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-ink-muted mb-1.5">
                Alamat Email (Akun)
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-surface-high border-2 border-line rounded-2xl px-4 py-3 font-bold text-sm text-ink-muted cursor-not-allowed opacity-80"
              />
            </div>
          </div>
        </div>

        {/* 2. Preferensi Target Belajar */}
        <div className="bg-white rounded-3xl border-2 border-line p-6 sm:p-8 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-line">
            <span className="icon text-streak-edge text-xl">bolt</span>
            <h2 className="text-lg font-black text-on-surface">Target XP Harian</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Santai", xp: 15 },
              { label: "Biasa", xp: 30 },
              { label: "Serius", xp: 50 },
              { label: "Giat", xp: 80 },
            ].map((t) => (
              <button
                key={t.xp}
                type="button"
                onClick={() => setDailyGoal(t.xp)}
                className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                  dailyGoal === t.xp
                    ? "bg-primary-soft border-primary-edge text-primary-dark shadow-xs"
                    : "bg-surface-low border-line text-ink-muted hover:border-line-strong"
                }`}
              >
                <span className="font-black text-base">{t.label}</span>
                <span className="text-xs font-bold mt-1">{t.xp} XP / Hari</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Pengaturan Audio & Latihan */}
        <div className="bg-white rounded-3xl border-2 border-line p-6 sm:p-8 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-line">
            <span className="icon text-gem-edge text-xl">volume_up</span>
            <h2 className="text-lg font-black text-on-surface">Audio &amp; Latihan Suara</h2>
          </div>

          <div className="flex flex-col gap-4">
            <ToggleRow
              icon="volume_up"
              title="Efek Suara Interaktif"
              desc="Putar suara kata saat jawaban benar atau saat menekan tombol pengucapan"
              checked={soundEffects}
              onChange={setSoundEffects}
            />
            <ToggleRow
              icon="mic"
              title="Latihan Berbicara (Speaking)"
              desc="Aktifkan modul yang melibatkan mikrofon dan pengecekan pengucapan kata"
              checked={speakingExercises}
              onChange={setSpeakingExercises}
            />
            <ToggleRow
              icon="notifications"
              title="Pengingat Latihan Harian"
              desc="Kirim pengingat agar rangkaian streak belajar harianmu tidak terputus"
              checked={notifications}
              onChange={setNotifications}
            />
          </div>
        </div>

        {/* 4. Maskot Saat Ini */}
        <div className="bg-white rounded-3xl border-2 border-line p-6 sm:p-8 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-soft border-2 border-primary/20 flex items-center justify-center p-1 shadow-xs">
              <GameIcon name="mascot" size={52} alt="Maskot" />
            </div>
            <div>
              <h3 className="font-black text-base text-on-surface">Kostum Maskot Terpasang</h3>
              <p className="text-xs font-bold text-ink-muted">
                {user.equipped ? `Kostum Aktif: ${user.equipped}` : "Gaya Standar (Belum menggunakan kostum)"}
              </p>
            </div>
          </div>
          <Link href="/misi" className="btn btn-gem !py-2.5 text-xs">
            Ubah di Toko
          </Link>
        </div>

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

          <button type="submit" className="btn btn-primary px-8 !py-3.5 text-sm">
            Simpan Perubahan
          </button>
        </div>
      </form>
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
