import { connection } from "next/server";
import { db } from "./firebase";

export type PaymentTransaction = {
  id: string;
  orderId: string;
  grossAmount: number;
  packageName?: string;
  gems: number;
  uid: string;
  transactionStatus: "settlement" | "pending" | "cancel" | "expire" | string;
  paymentType?: string;
  createdAt?: number;
};

/**
 * Mengambil daftar riwayat transaksi Midtrans milik pengguna dari koleksi 'transactions'
 */
export async function getUserTransactions(uid: string): Promise<PaymentTransaction[]> {
  await connection();
  try {
    const snap = await db
      .collection("transactions")
      .where("uid", "==", uid)
      .limit(30)
      .get();

    const list = snap.docs.map((doc) => {
      const d = doc.data();
      let createdTime = Date.now();
      if (d.createdAt && typeof d.createdAt.toMillis === "function") {
        createdTime = d.createdAt.toMillis();
      } else if (typeof d.createdAt === "number") {
        createdTime = d.createdAt;
      }

      return {
        id: doc.id,
        orderId: d.orderId || doc.id,
        grossAmount: Number(d.grossAmount) || 0,
        packageName: d.packageName || `${d.gems || 0} Permata`,
        gems: Number(d.gems) || 0,
        uid: d.uid || uid,
        transactionStatus: d.transactionStatus || "pending",
        paymentType: d.paymentType || "Midtrans",
        createdAt: createdTime,
      };
    });

    // Urutkan dari yang paling baru
    return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (err) {
    console.error("Gagal mengambil riwayat transaksi:", err);
    return [];
  }
}
