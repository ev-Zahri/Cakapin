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
      return JSON.parse(inline);
    } catch (e) {
      console.error("Gagal parse FIREBASE_SERVICE_ACCOUNT_JSON:", e);
    }
  }

  // Cek apakah file lokal ada (misal di development lokal)
  const relativePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? "serviceAccountKey.json";
  const filePath = path.join(process.cwd(), relativePath);

  if (existsSync(filePath)) {
    try {
      return JSON.parse(readFileSync(filePath, "utf8"));
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
      // Fallback jika env belum diset saat build static analyzer Vercel
      initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "cakapin-app" });
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
