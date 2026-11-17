import Image from "next/image";

/** Peta nama → file di public/Icons. */
const FILES = {
  gem: "Set_ikon_gamifikasi_diamond_gem.png",
  flame: "Set_ikon_gamifikasi_flame.png",
  heart: "Set_ikon_gamifikasi_red_heart.png",
  bolt: "Set_ikon_gamifikasi_lightning_bolt.png",
  chest: "Set_ikon_gamifikasi_golden_chest.png",
  crown: "Set_ikon_gamifikasi_golden_crown.png",
  mascot: "Mascot.png",
  mascotWave: "Lembar_ekspresi_maskot_happy_waving.png",
  mascotCelebrate: "Lembar_ekspresi_maskot_celebrating_wingsup_confetti.png",
  mascotSad: "Lembar_ekspresi_maskot_sad_single_tear.png",
  mascotThink: "Lembar_ekspresi_maskot_thinking.png",
  mascotSleep: "Lembar_ekspresi_maskot_sleeping.png",
  mascotSpeak: "Lembar_ekspresi_maskot_speech_bubble.png",
  badgeFirst: "Lencana_pencapaian_first_lesson.png",
  badgePerfect: "Lencana_pencapaian_perfect_score.png",
  badgeStreak: "Lencana_pencapaian_7_day_streak.png",
  badgeWords: "Lencana_pencapaian_100_words_learned.png",
  badgeLeague: "Lencana_pencapaian_league_promotion.png",
  badgeSpeaking: "Lencana_pencapaian_speaking_master.png",
  hat: "Item_toko_(kostum_maskot)_graduation_hat.png",
  headband: "Item_toko_(kostum_maskot)_headband.png",
  magic: "Item_toko_(kostum_maskot)_topi_sulap.png",
} as const;

export type IconName = keyof typeof FILES;

export function GameIcon({
  name,
  size = 24,
  className,
  alt = "",
  priority,
}: {
  name: IconName;
  size?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/Icons/${encodeURIComponent(FILES[name])}`}
      alt={alt}
      width={size}
      height={size}
      style={{ width: "auto", height: "auto" }}
      className={`inline-block select-none object-contain ${className ?? ""}`}
      priority={priority}
      draggable={false}
    />
  );
}
