import { createHmac, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

/**
 * Generator salt deterministik/aman tanpa randomBytes saat runtime render
 */
function generateSalt(): Buffer {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Buffer.from(bytes);
}

/* ---------- Password (scrypt) ---------- */
export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt();
  const hash = await scrypt(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);
  return timingSafeEqual(expected, actual);
}

/* ---------- Session cookie (HMAC signed) ---------- */
const COOKIE = "cakapin_session";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 hari

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET (min. 32 karakter) belum diset di .env");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export async function createSession(uid: string, remember = true): Promise<void> {
  // remember=false → cookie sesi (hilang saat browser ditutup), kedaluwarsa maks 1 hari.
  const ttl = remember ? MAX_AGE : 60 * 60 * 24;
  const payload = Buffer.from(JSON.stringify({ uid, exp: Date.now() + ttl * 1000 })).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(remember ? { maxAge: MAX_AGE } : {}),
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

function parseSession(raw: string | undefined): string | null {
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;
  const good = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (good.length !== given.length || !timingSafeEqual(good, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof data.uid === "string" && data.exp > Date.now() ? data.uid : null;
  } catch {
    return null;
  }
}

/**
 * Dipakai saat RENDER halaman. `use cache: private` membuat hasil sesi bisa di-prefetch &
 * disimpan di browser (tidak di server), sehingga navigasi terasa instan dan insight
 * "uncached data during a navigation" hilang. Lihat docs: authentication-with-cache-components.
 */
export async function getSessionUid(): Promise<string | null> {
  "use cache: private";
  return parseSession((await cookies()).get(COOKIE)?.value);
}

/** Dipakai di Server Action (selalu saat request, tanpa cache). */
export async function readSessionUid(): Promise<string | null> {
  return parseSession((await cookies()).get(COOKIE)?.value);
}