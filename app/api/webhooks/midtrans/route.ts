import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "@/app/lib/firebase";
import { users } from "@/app/lib/users";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      custom_field1: uid,
      custom_field2: gemsAmountStr,
    } = body;

    // 1. Verifikasi Signature Hash dari Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const rawInput = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const calculatedSignature = crypto.createHash("sha512").update(rawInput).digest("hex");

    if (calculatedSignature !== signature_key) {
      console.warn("Midtrans webhook: Signature key tidak cocok!");
      return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
    }

    // 2. Evaluasi status transaksi
    // Transaksi sukses: 'settlement' (atau 'capture' jika status fraud 'accept')
    const isSuccess =
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept");

    // Catat riwayat transaksi ke koleksi 'transactions' untuk audit
    const txRef = db.collection("transactions").doc(order_id);
    const txSnap = await txRef.get();

    // Jika transaksi ini sudah pernah diproses sukses sebelumnya, abaikan (idempotent)
    if (txSnap.exists && txSnap.data()?.status === "settlement") {
      return NextResponse.json({ status: "Already processed" });
    }

    await txRef.set(
      {
        orderId: order_id,
        grossAmount: gross_amount,
        transactionStatus: transaction_status,
        fraudStatus: fraud_status || null,
        uid: uid || null,
        gems: gemsAmountStr ? Number(gemsAmountStr) : 0,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // 3. Tambahkan saldo permata ke pengguna jika pembayaran sukses
    if (isSuccess && uid && gemsAmountStr) {
      const gemsToAdd = Number(gemsAmountStr);
      if (gemsToAdd > 0) {
        await users().doc(uid).update({
          gems: FieldValue.increment(gemsToAdd),
          updatedAt: FieldValue.serverTimestamp(),
        });
        console.log(`Berhasil menambahkan ${gemsToAdd} permata ke pengguna ${uid} (Order: ${order_id})`);
      }
    }

    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("Gagal memproses webhook Midtrans:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
