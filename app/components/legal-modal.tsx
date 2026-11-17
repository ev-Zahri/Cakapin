"use client";

import { AnimatePresence, motion } from "motion/react";

type ModalType = "terms" | "privacy" | null;

interface LegalModalProps {
  type: ModalType;
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  if (!type) return null;

  const isTerms = type === "terms";
  const title = isTerms ? "Ketentuan Layanan" : "Kebijakan Privasi";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        {/* Backdrop dismiss */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col rounded-3xl bg-white border-2 border-line shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b-2 border-line bg-surface-container-low/50">
            <div className="flex items-center gap-2">
              <span className="icon text-primary text-2xl">
                {isTerms ? "gavel" : "shield"}
              </span>
              <h2 className="text-xl font-black text-on-surface">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant transition-colors"
            >
              <span className="icon text-xl">close</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto font-body-sm text-on-surface-variant space-y-4 leading-relaxed">
            {isTerms ? (
              <>
                <p>
                  Selamat datang di <strong>Cakapin</strong>. Dengan mendaftar dan menggunakan platform belajar interaktif kami, Anda menyetujui ketentuan dan pedoman berikut:
                </p>
                <div className="space-y-2">
                  <h3 className="font-headline-sm text-sm text-on-surface">1. Akses &amp; Penggunaan Akun</h3>
                  <p>
                    Anda bertanggung jawab menjaga kerahasiaan kata sandi akun Anda. Akun ini ditujukan untuk perkembangan belajar individual dan tidak boleh dialihkan.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline-sm text-sm text-on-surface">2. Konten Pembelajaran &amp; Gamifikasi</h3>
                  <p>
                    XP, permata (gems), nyawa, dan rangkaian belajar (streaks) merupakan elemen gamifikasi edukatif di dalam sistem Cakapin dan tidak memiliki nilai tunai moneter.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline-sm text-sm text-on-surface">3. Kode Etik Komunitas</h3>
                  <p>
                    Pengguna dilarang menggunakan bot, otomasi tidak sah, atau perilaku kecurangan yang mengganggu keadilan papan peringkat liga sesama pengguna.
                  </p>
                </div>
              </>
            ) : (
              <>
                <p>
                  Privasi dan keamanan data Anda adalah komitmen utama di <strong>Cakapin</strong>. Berikut adalah ringkasan bagaimana data Anda dikelola:
                </p>
                <div className="space-y-2">
                  <h3 className="font-headline-sm text-sm text-on-surface">1. Data yang Dikumpulkan</h3>
                  <p>
                    Kami hanya mengumpulkan informasi dasar pendaftaran (nama, alamat email terdaftar, preferensi bahasa belajar) dan statistik pembelajaran Anda (skor latihan, XP, pencapaian).
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline-sm text-sm text-on-surface">2. Penggunaan Data</h3>
                  <p>
                    Data Anda digunakan semata-mata untuk menyimpan progres belajar, menghitung peringkat liga mingguan, serta mempersonalisasi soal dan rekomendasi latihan.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-headline-sm text-sm text-on-surface">3. Keamanan Informasi</h3>
                  <p>
                    Kata sandi disimpan menggunakan standar enkripsi modern (scrypt/hashing aman). Data Anda tidak pernah diperjualbelikan kepada pihak ketiga manapun.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t-2 border-line bg-surface-container-low/50 flex justify-end">
            <button
              onClick={onClose}
              className="btn btn-primary !py-2.5 px-6 text-sm"
            >
              Saya Mengerti
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
