"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { FormState } from "../actions";
import { GameIcon } from "./game-icon";
import { LegalModal } from "./legal-modal";

type Props = {
  mode: "login" | "signup";
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
};

const LANGUAGES = [
  { code: "en", flag: "🇬🇧", label: "Inggris", ready: true },
  { code: "ja", flag: "🇯🇵", label: "Jepang", ready: false },
  { code: "ko", flag: "🇰🇷", label: "Korea", ready: false },
  { code: "es", flag: "🇪🇸", label: "Spanyol", ready: false },
];

export function AuthForm({ mode, action }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const signup = mode === "signup";
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [lang, setLang] = useState("en");
  const [legalModal, setLegalModal] = useState<"terms" | "privacy" | null>(null);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthMeta = [
    { label: "Belum diisi", tone: "text-ink-muted", bar: "bg-line" },
    { label: "Lemah", tone: "text-ruby-edge", bar: "bg-ruby" },
    { label: "Sedang", tone: "text-streak-edge", bar: "bg-streak" },
    { label: "Kuat 💪", tone: "text-primary-dark", bar: "bg-primary" },
  ][strength];

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-8">
      {/* Maskot + sapaan */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col items-center text-center"
      >
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          <GameIcon name={signup ? "mascotWave" : "mascot"} size={signup ? 120 : 110} alt="Maskot Cakapin" priority />
        </motion.div>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-ink">
          {signup ? "Mulai Petualangan Belajarmu!" : "Selamat Datang Kembali!"}
        </h1>
        <p className="mt-1 max-w-md text-sm text-ink-muted">
          {signup
            ? "Buat akun gratis dan bergabung bersama pembelajar lain di seluruh Indonesia!"
            : "Masuk untuk melanjutkan petualangan belajarmu dan jaga streak-mu tetap membara!"}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className={`w-full overflow-hidden rounded-3xl bg-white shadow-xl shadow-surface-highest/60 ${signup ? "max-w-xl" : "max-w-md"}`}
      >
        <div className="p-6 sm:p-8">
          {/* Google (belum tersedia: backend memakai Firebase Admin saja) */}
          <button
            type="button"
            disabled
            title="Segera hadir"
            className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-2xl bg-surface-low p-4 font-extrabold opacity-60 shadow-[0_4px_0_#dbd9d9]"
          >
            <GoogleLogo />
            <span>{signup ? "Daftar" : "Masuk"} Cepat dengan Google</span>
            <span className="rounded-full bg-streak px-2 py-0.5 text-[10px] font-black uppercase text-white">Segera</span>
          </button>

          <div className="flex items-center gap-3 py-5">
            <div className="h-0.5 flex-1 rounded-full bg-surface-high" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">
              {signup ? "atau buat akun dengan email" : "atau masuk dengan email"}
            </span>
            <div className="h-0.5 flex-1 rounded-full bg-surface-high" />
          </div>

          <form action={formAction} className="flex flex-col gap-4">
            {signup && (
              <Field label="Nama Lengkap" icon="person">
                <input className="field !pl-12" name="name" placeholder="Contoh: Rian Anggara" autoComplete="name" required minLength={2} />
              </Field>
            )}

            <Field label={signup ? "Alamat Email Aktif" : "Email"} icon="mail">
              <input className="field !pl-12" name="email" type="email" placeholder="nama@gmail.com" autoComplete="email" required />
            </Field>

            <Field label={signup ? "Kata Sandi Baru" : "Kata Sandi"} icon="lock">
              <input
                className="field !pl-12 !pr-12"
                name="password"
                type={show ? "text" : "password"}
                placeholder={signup ? "Minimal 8 karakter kombinasi" : "Masukkan kata sandi"}
                autoComplete={signup ? "new-password" : "current-password"}
                required
                minLength={signup ? 8 : 1}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                aria-label={show ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                onClick={() => setShow(!show)}
                className="absolute right-3 flex items-center p-1 text-ink-muted hover:text-ink"
              >
                <span className="icon text-[22px]">{show ? "visibility_off" : "visibility"}</span>
              </button>
            </Field>

            {signup && (
              <div className="px-1">
                <div className="mb-1.5 flex items-center justify-between text-xs font-extrabold">
                  <span className="text-ink-muted">Kekuatan Kata Sandi:</span>
                  <span className={strengthMeta.tone}>{strengthMeta.label}</span>
                </div>
                <div className="grid h-2 grid-cols-3 gap-2">
                  {[1, 2, 3].map((n) => (
                    <motion.div
                      key={n}
                      className={`h-full rounded-full ${strength >= n ? strengthMeta.bar : "bg-line"}`}
                      animate={{ scaleY: strength >= n ? 1.25 : 1 }}
                    />
                  ))}
                </div>
              </div>
            )}

            {signup ? (
              <>
                <div>
                  <p className="mb-2 text-sm font-extrabold">Bahasa yang ingin dipelajari pertama kali:</p>
                  <input type="hidden" name="language" value={lang} />
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {LANGUAGES.map((l) => {
                      const active = lang === l.code;
                      return (
                        <motion.button
                          key={l.code}
                          type="button"
                          disabled={!l.ready}
                          whileTap={l.ready ? { scale: 0.95 } : undefined}
                          onClick={() => setLang(l.code)}
                          className={`relative flex flex-col items-center rounded-2xl p-3 font-extrabold transition ${
                            active ? "bg-gem-soft text-gem-edge shadow-[0_3px_0_var(--color-gem)]" : "bg-surface-low shadow-[0_3px_0_#dbd9d9]"
                          } ${l.ready ? "" : "cursor-not-allowed opacity-50"}`}
                        >
                          <span className="mb-1 text-2xl">{l.flag}</span>
                          <span className="text-sm">{l.label}</span>
                          {!l.ready && <span className="text-[10px] uppercase text-ink-muted">Segera</span>}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-1 text-sm text-ink-muted">
                  <input type="checkbox" name="terms" defaultChecked required className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-primary" />
                  <span>
                    Saya menyetujui{" "}
                    <button
                      type="button"
                      onClick={() => setLegalModal("terms")}
                      className="font-bold text-primary-dark underline hover:text-primary transition-colors cursor-pointer"
                    >
                      Ketentuan Layanan
                    </button>{" "}
                    dan{" "}
                    <button
                      type="button"
                      onClick={() => setLegalModal("privacy")}
                      className="font-bold text-primary-dark underline hover:text-primary transition-colors cursor-pointer"
                    >
                      Kebijakan Privasi
                    </button>{" "}
                    Cakapin.
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer select-none items-center gap-2 text-sm">
                  <input type="checkbox" name="remember" defaultChecked className="h-4 w-4 cursor-pointer accent-primary" />
                  Ingat Saya
                </label>
                <span className="cursor-not-allowed text-sm font-extrabold text-ink-muted" title="Segera hadir">
                  Lupa Kata Sandi?
                </span>
              </div>
            )}

            <AnimatePresence>
              {state?.error && (
                <motion.p
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden rounded-xl bg-ruby-soft px-4 py-2 text-sm font-bold text-ruby-edge"
                >
                  {state.error}
                </motion.p>
              )}
            </AnimatePresence>

            <button className="btn btn-primary mt-1 w-full !py-4" disabled={pending}>
              {pending ? "Memproses…" : signup ? "Daftar Sekarang" : "Masuk Sekarang"}
              <span className="icon text-2xl">{signup ? "arrow_forward" : "bolt"}</span>
            </button>
          </form>
        </div>

        <div className="bg-surface-low p-5 text-center text-sm text-ink-muted">
          {signup ? "Sudah punya akun? " : "Belum punya akun Cakapin? "}
          <Link href={signup ? "/masuk" : "/daftar"} className="ml-1 font-black uppercase tracking-wide text-primary-dark hover:underline">
            {signup ? "Masuk ke akun" : "Daftar sekarang"}
          </Link>
        </div>
      </motion.div>

      {/* Lencana kepercayaan */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full bg-surface-high/60 px-5 py-3 text-xs font-extrabold"
      >
        <span className="flex items-center gap-1.5"><span className="icon text-base text-primary">verified</span> {signup ? "100% Gratis" : "Aman & Gratis"}</span>
        <span className="text-line-strong">•</span>
        <span className="flex items-center gap-1.5"><span className="icon text-base text-streak-edge">award_star</span> 100% Interaktif</span>
        {signup && (
          <>
            <span className="text-line-strong">•</span>
            <span className="flex items-center gap-1.5"><span className="icon text-base text-gem">lock_open</span> Akses Semua Bab</span>
          </>
        )}
      </motion.div>

      {/* Popup Modal Legal */}
      <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
    </main>
  );
}

function Field({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-extrabold">{label}</span>
      <span className="relative flex items-center">
        <span className="icon pointer-events-none absolute left-4 text-[20px] text-ink-muted">{icon}</span>
        {children}
      </span>
    </label>
  );
}

function GoogleLogo() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}
