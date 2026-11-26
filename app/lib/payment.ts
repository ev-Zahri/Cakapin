"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { getSnapClient } from "./midtrans";
import { db } from "./firebase";
import { readSessionUid } from "./session";
import { users } from "./users";

export type VerifyPaymentResult =
  | { ok: true; gemsAdded: number; message: string }
  | { ok: false; error: string; pending?: boolean };

/**
 * Memeriksa status transaksi langsung ke server Midtrans (Core API Status)
 * dan mengkreditkan permata secara instan tanpa harus menunggu webhook Midtrans
 * (sangat penting untuk pengujian di localhost di mana webhook tidak bisa ditembus oleh Midtrans).
 */
export async function verifyAndSettlePayment(orderId: string): Promise<VerifyPaymentResult> {
  const uid = await readSessionUid();
  if (!uid) return { ok: false, error: "Sesi telah berakhir, silakan masuk lagi." };

  try {
    const snapClient = getSnapClient();
    // Midtrans Snap client memiliki transaksi status API
    // snapClient.transaction.status(orderId)
    const statusResponse = await snapClient.transaction.notification({
      // atau langsung snapClient.transaction.status(orderId)
      order_id: orderId,
    }).catch(async () => {
      // Fallback fetch langsung ke Midtrans status API
      const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
      const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
      const baseUrl = isProduction
        ? "https://api.midtrans.com/v2"
        : "https://api.sandbox.midtrans.com/v2";

      const res = await fetch(`${baseUrl}/${orderId}/status`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(serverKey + ":").toString("base64")}`,
        },
        cache: "no-store",
      });
      return await res.json();
    });

    const {
      transaction_status,
      fraud_status,
      gross_amount,
      custom_field1: targetUid,
      custom_field2: gemsAmountStr,
    } = statusResponse;

    const isSuccess =
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept");

    if (!isSuccess) {
      if (transaction_status === "pending") {
        return { ok: false, pending: true, error: "Pembayaran masih menunggu konfirmasi." };
      }
      return { ok: false, error: `Status pembayaran saat ini: ${transaction_status || "belum selesai"}` };
    }

    // Pastikan transaksi ini milik user yang sedang aktif
    const userToCredit = targetUid || uid;

    // Catat ke Firestore koleksi transactions secara idempotent
    const txRef = db.collection("transactions").doc(orderId);
    const txSnap = await txRef.get();

    if (txSnap.exists && txSnap.data()?.status === "settlement") {
      return { ok: true, gemsAdded: 0, message: "Transaksi ini sudah pernah diproses sebelumnya." };
    }

    const gemsToAdd = Number(gemsAmountStr) || 0;

    await txRef.set(
      {
        orderId,
        grossAmount: gross_amount,
        transactionStatus: "settlement",
        fraudStatus: fraud_status || null,
        uid: userToCredit,
        gems: gemsToAdd,
        paymentType: statusResponse.payment_type || "simulator",
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: txSnap.exists ? txSnap.data()?.createdAt : FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    if (gemsToAdd > 0) {
      await users().doc(userToCredit).update({
        gems: FieldValue.increment(gemsToAdd),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    revalidatePath("/", "layout");
    return { ok: true, gemsAdded: gemsToAdd, message: `Berhasil menambahkan ${gemsToAdd} permata!` };
  } catch (err) {
    console.error("Gagal memverifikasi transaksi Midtrans:", err);
    return { ok: false, error: (err as Error).message || "Gagal memverifikasi status pembayaran." };
  }
}
