// Inisialisasi Midtrans Snap SDK untuk pembuatan transaksi pembayaran permata.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const midtransClient = require("midtrans-client");

export type GemPackage = {
  id: "gems_100" | "gems_500" | "gems_1200";
  name: string;
  gems: number;
  price: number;
  tag?: string;
};

export const GEM_PACKAGES: Record<string, GemPackage> = {
  gems_100: {
    id: "gems_100",
    name: "Kantong Permata (100)",
    gems: 100,
    price: 15000,
  },
  gems_500: {
    id: "gems_500",
    name: "Peti Permata (500)",
    gems: 500,
    price: 65000,
    tag: "Paling Populer",
  },
  gems_1200: {
    id: "gems_1200",
    name: "Gudang Permata (1.200)",
    gems: 1200,
    price: 140000,
    tag: "Nilai Terbaik",
  },
};

export function getSnapClient() {
  const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

  if (!serverKey) {
    throw new Error("MIDTRANS_SERVER_KEY belum dikonfigurasi di file environment (.env).");
  }

  return new midtransClient.Snap({
    isProduction,
    serverKey,
    clientKey: clientKey || "",
  });
}
