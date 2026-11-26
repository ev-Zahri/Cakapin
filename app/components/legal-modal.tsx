"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type ModalType = "terms" | "privacy" | null;

interface LegalModalProps {
  type: ModalType;
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  const isTerms = type === "terms";
  const title = isTerms ? "Ketentuan Layanan" : "Kebijakan Privasi";

  return (
    <Dialog open={!!type} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] flex flex-col overflow-hidden p-0 gap-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b-2 border-line bg-surface-low space-y-0">
          <div className="flex items-center gap-2">
            <span className="icon text-primary text-2xl">
              {isTerms ? "gavel" : "shield"}
            </span>
            <DialogTitle className="text-xl font-black text-ink">{title}</DialogTitle>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-surface-high hover:bg-surface-highest flex items-center justify-center text-ink-muted hover:text-ink cursor-pointer transition-colors"
          >
            <span className="icon text-xl">close</span>
          </button>
        </DialogHeader>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto text-sm text-ink-muted space-y-4 leading-relaxed font-bold">
          {isTerms ? (
            <>
              <p>
                Selamat datang di <strong className="text-ink">Cakapin</strong>. Dengan mendaftar dan menggunakan platform belajar interaktif kami, Anda menyetujui ketentuan dan pedoman berikut:
              </p>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-ink">1. Akses &amp; Penggunaan Akun</h3>
                <p>
                  Anda bertanggung jawab menjaga kerahasiaan kata sandi akun Anda. Akun ini ditujukan untuk perkembangan belajar individual dan tidak boleh dialihkan.
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-ink">2. Konten Pembelajaran &amp; Gamifikasi</h3>
                <p>
                  XP, permata (gems), nyawa, dan rangkaian belajar (streaks) merupakan elemen gamifikasi edukatif di dalam sistem Cakapin dan tidak memiliki nilai tunai moneter.
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-ink">3. Perilaku Pengguna</h3>
                <p>
                  Dilarang memanipulasi skor peringkat (leaderboard) atau menggunakan bot otomatis untuk menyelesaikan sesi latihan.
                </p>
              </div>
            </>
          ) : (
            <>
              <p>
                Privasi dan keamanan data Anda adalah prioritas kami di <strong className="text-ink">Cakapin</strong>.
              </p>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-ink">1. Data yang Dikumpulkan</h3>
                <p>
                  Kami hanya mengumpulkan nama, alamat email, preferensi bahasa belajar, dan progres latihan harian (XP, riwayat kuis, streak).
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-ink">2. Penggunaan Data</h3>
                <p>
                  Informasi Anda digunakan semata-mata untuk mempersonalisasi materi latihan, menyinkronkan progres di berbagai perangkat, dan menampilkan posisi liga.
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-ink">3. Keamanan Informasi</h3>
                <p>
                  Kata sandi Anda dienkripsi secara aman dengan algoritma kriptografi modern (scrypt). Kami tidak pernah menjual data pribadi Anda kepada pihak ketiga.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-line bg-surface-low flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="btn btn-primary px-6 !py-2.5 text-sm"
          >
            Saya Mengerti
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
