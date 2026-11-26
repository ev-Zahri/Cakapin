import { NextRequest, NextResponse } from "next/server";
import { getGoogleOAuthUrl } from "@/app/lib/google-auth";

export async function GET(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
  const proto = request.headers.get("x-forwarded-proto") || (request.url.startsWith("https") ? "https" : "http");
  const isHttps = proto === "https";

  const url = getGoogleOAuthUrl(host, isHttps);
  return NextResponse.redirect(url);
}
