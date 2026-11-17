import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Firebase Admin (server-only). Kredensial dibaca dari:
 *  1. FIREBASE_SERVICE_ACCOUNT_JSON  → isi JSON (untuk production / Vercel)
 *  2. FIREBASE_SERVICE_ACCOUNT_PATH  → path file (default: ./serviceAccountKey.json)
 */
function loadServiceAccount(): ServiceAccount {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (inline) return JSON.parse(inline);

  const file = path.resolve(
    process.cwd(),
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? "serviceAccountKey.json",
  );
  return JSON.parse(readFileSync(file, "utf8"));
}

const app = getApps()[0] ?? initializeApp({ credential: cert(loadServiceAccount()) });

export const db = getFirestore(app);
