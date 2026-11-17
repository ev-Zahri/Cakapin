import Link from "next/link";
import { Float, Item, Stagger } from "./components/motion";
import { GameIcon } from "./components/game-icon";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center">
      <Stagger className="flex flex-col items-center gap-6">
        <Item>
          <Float>
            <GameIcon name="mascotWave" size={220} alt="Maskot Cakapin" priority />
          </Float>
        </Item>
        <Item><h1 className="text-6xl font-black text-primary">cakapin</h1></Item>
        <Item>
          <p className="max-w-md text-xl font-bold text-ink">
            Belajar bahasa Inggris dengan seru — sedikit demi sedikit, setiap hari.
          </p>
        </Item>
        <Item className="flex w-full max-w-xs flex-col gap-3">
          <Link href="/daftar" className="btn btn-primary">Mulai sekarang</Link>
          <Link href="/masuk" className="btn btn-ghost">Saya sudah punya akun</Link>
        </Item>
      </Stagger>
    </main>
  );
}
