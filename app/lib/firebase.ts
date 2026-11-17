import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Firebase Admin (server-only). Kredensial dibaca dari:
 *  1. FIREBASE_SERVICE_ACCOUNT_JSON  → isi JSON string (Wajib di Vercel/Production)
 *  2. FIREBASE_SERVICE_ACCOUNT_PATH  → path file lokal (default: ./serviceAccountKey.json)
 */
function loadServiceAccount(): ServiceAccount | null {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (inline) {
    try {
      // Tangani jika diinput sebagai base64 string
      const jsonStr = inline.trim().startsWith("{")
        ? inline.trim()
        : Buffer.from(inline.trim(), "base64").toString("utf8");

      const parsed = JSON.parse(jsonStr);

      // Normalisasi private_key jika newline ter-escape menjadi '\\n'
      if (parsed.private_key && typeof parsed.private_key === "string") {
        parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
      }
      return parsed;
    } catch (e) {
      console.error("Gagal parse FIREBASE_SERVICE_ACCOUNT_JSON:", e);
    }
  }

  // Cek apakah file lokal ada (misal di development lokal)
  const relativePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? "serviceAccountKey.json";
  const filePath = path.join(process.cwd(), relativePath);

  if (existsSync(filePath)) {
    try {
      const parsed = JSON.parse(readFileSync(filePath, "utf8"));
      if (parsed.private_key && typeof parsed.private_key === "string") {
        parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
      }
      return parsed;
    } catch (e) {
      console.error("Gagal membaca serviceAccountKey file:", e);
    }
  }

  return null;
}

function getDb(): Firestore {
  if (getApps().length === 0) {
    const cred = loadServiceAccount();
    if (cred) {
      initializeApp({ credential: cert(cred) });
    } else {
      throw new Error(
        "Kredensial Firebase tidak ditemukan! Pastikan environment variable FIREBASE_SERVICE_ACCOUNT_JSON sudah diatur di Vercel Settings -> Environment Variables, atau file serviceAccountKey.json ada di root proyek.",
      );
    }
  }
  return getFirestore();
}

export const db = new Proxy({} as Firestore, {
  get(_target, prop) {
    const instance = getDb();
    const value = (instance as unknown as Record<string, unknown>)[prop as string];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
