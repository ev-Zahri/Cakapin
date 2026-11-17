import type { User } from "../lib/users";
import { GameIcon } from "./game-icon";

/** Kapsul status: rangkaian, permata, nyawa. */
export function StatBar({ user }: { user: User }) {
  const pill = "flex items-center gap-1.5 rounded-full border-2 border-line px-3 py-1 font-extrabold";
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <span className={`${pill} text-streak-edge`}>
        <GameIcon name="flame" size={24} alt="Rangkaian" /> {user.streak} Hari
      </span>
      <span className={`${pill} text-gem-edge`}>
        <GameIcon name="gem" size={24} alt="Permata" /> {user.gems.toLocaleString("id-ID")}
      </span>
      <span className={`${pill} text-ruby-edge`}>
        <GameIcon name="heart" size={24} alt="Nyawa" /> {user.hearts}
      </span>
    </div>
  );
}

export const unitBg = {
  primary: "bg-primary shadow-[0_8px_0_var(--color-primary-edge)]",
  gem: "bg-gem shadow-[0_8px_0_var(--color-gem-edge)]",
  streak: "bg-streak shadow-[0_8px_0_var(--color-streak-edge)]",
  ruby: "bg-ruby shadow-[0_8px_0_var(--color-ruby-edge)]",
} as const;
