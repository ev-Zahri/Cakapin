import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export type GoogleConfig = {
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
};

export function getGoogleOAuthConfig(): GoogleConfig {
  const relativePath = process.env.OAUTH_CLIENT_SECRET ?? "client_secret.json"
  const secretPath = join(process.cwd(), relativePath);
  if (existsSync(secretPath)) {
    try {
      const data = JSON.parse(readFileSync(secretPath, "utf-8"));
      const web = data.web || data.installed;
      if (web?.client_id && web?.client_secret) {
        return {
          clientId: web.client_id,
          clientSecret: web.client_secret,
          redirectUris: web.redirect_uris || [],
        };
      }
    } catch (e) {
      console.warn("Gagal membaca client_secret.json:", e);
    }
  }

  // Fallback ke environment variables jika di deploy ke Vercel/Cloud
  return {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUris: [
      process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/google/callback",
    ],
  };
}

export function getGoogleOAuthUrl(host: string, isHttps = false): string {
  const config = getGoogleOAuthConfig();
  const protocol = isHttps ? "https" : "http";
  
  // Deteksi redirect uri yang sesuai dengan domain request
  let redirectUri = `${protocol}://${host}/auth/google/callback`;
  
  // Cek apakah host cocok dengan daftar di Google Console
  const matched = config.redirectUris.find((uri) => uri.includes(host));
  if (matched) {
    redirectUri = matched;
  } else if (config.redirectUris.length > 0) {
    redirectUri = config.redirectUris[0];
  }

  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: redirectUri,
    client_id: config.clientId,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    state: redirectUri, // bawa redirectUri di state agar callback tahu redirectUri asalnya
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

export async function getGoogleTokens(code: string, redirectUri: string) {
  const config = getGoogleOAuthConfig();
  const values = {
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  };

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(values).toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gagal menukar kode Google: ${errText}`);
  }

  return (await res.json()) as { access_token: string; id_token: string };
}

export type GoogleUserResult = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  picture?: string;
};

export async function getGoogleUser(accessToken: string): Promise<GoogleUserResult> {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil data profil Google pengguna.");
  }

  return (await res.json()) as GoogleUserResult;
}
