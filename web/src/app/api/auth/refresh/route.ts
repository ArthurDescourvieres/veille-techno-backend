import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/server/env";
import { parseRefreshFromCookie, parseRememberFromCookie, buildAuthCookie, buildRefreshCookie } from "@/lib/server/cookies";

export async function POST(request: Request) {
  try {
    // Essayer d'abord le refresh token, puis le remember token
    let token = parseRefreshFromCookie(request.headers.get("cookie"));
    if (!token) {
      token = parseRememberFromCookie(request.headers.get("cookie"));
    }
    
    if (!token) {
      return NextResponse.json({ error: "Token de refresh manquant" }, { status: 401 });
    }

    const backendRes = await fetch(`${getBackendUrl()}/api/auth/refresh`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
    });

    const data = await backendRes.json();
    if (!backendRes.ok) {
      return NextResponse.json({ error: "Refresh échoué" }, { status: 401 });
    }

    const { token, refreshToken: newRefreshToken } = data;

    const res = NextResponse.json({ success: true });
    res.headers.append("set-cookie", buildAuthCookie(newToken, 3600));
    res.headers.append("set-cookie", buildRefreshCookie(newRefreshToken, 7776000)); // 90 jours
    
    return res;
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
