import { NextRequest, NextResponse } from "next/server";
import { getGoogleTokens, getGoogleUser } from "@/app/lib/google-auth";
import { createSession } from "@/app/lib/session";
import { newUserDoc, userIdFromEmail, users, withDefaults, type UserDoc } from "@/app/lib/users";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state"); // memuat redirect_uri yang dipakai saat request

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
  const proto = request.headers.get("x-forwarded-proto") || (request.url.startsWith("https") ? "https" : "http");
  const fallbackRedirectUri = `${proto}://${host}/auth/google/callback`;
  const redirectUri = state || fallbackRedirectUri;

  if (error || !code) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(new URL("/auth/login?error=google_cancelled", request.url));
  }

  try {
    const { access_token } = await getGoogleTokens(code, redirectUri);
    const googleUser = await getGoogleUser(access_token);

    if (!googleUser.email) {
      return NextResponse.redirect(new URL("/auth/login?error=no_email", request.url));
    }

    const email = googleUser.email.trim().toLowerCase();
    const uid = userIdFromEmail(email);
    const userRef = users().doc(uid);
    const snap = await userRef.get();

    if (!snap.exists) {
      // Akun baru dibuat via Google login
      const name = googleUser.name || email.split("@")[0];
      const newDoc = newUserDoc(name, email, "GOOGLE_AUTH_OAUTH2", "en");
      await userRef.set(newDoc);
    } else {
      // Pastikan field-field baru terlengkapi jika akun sudah ada
      const existing = snap.data() as UserDoc;
      await userRef.update(withDefaults(existing));
    }

    await createSession(uid, true);

    return NextResponse.redirect(new URL("/learn", request.url));
  } catch (err) {
    console.error("Error processing Google OAuth callback:", err);
    return NextResponse.redirect(new URL("/auth/login?error=google_failed", request.url));
  }
}
