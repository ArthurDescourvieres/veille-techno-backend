import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/server/env";
import { AUTH_COOKIE_NAME, buildAuthCookie, buildRefreshCookie, buildRememberCookie } from "@/lib/server/cookies";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password, rememberMe } = body as { email?: string; password?: string; rememberMe?: boolean };

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 422 });
    }

    const backendRes = await fetch(`${getBackendUrl()}/api/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    const data = await backendRes.json().catch(() => ({} as any));

    if (!backendRes.ok) {
      const status = backendRes.status === 401 ? 401 : backendRes.status === 400 ? 400 : 500;
      return NextResponse.json(
        { error: data?.error || data?.message || "Identifiants invalides" },
        { status }
      );
    }

    const { token, refreshToken, rememberToken } = data as { 
      token?: string; 
      refreshToken?: string; 
      rememberToken?: string; 
    };
    
    if (!token || !refreshToken) {
      return NextResponse.json({ error: "Réponse invalide du serveur" }, { status: 502 });
    }

    const res = NextResponse.json({ success: true });
    
    // Token principal (1h)
    res.headers.append("set-cookie", buildAuthCookie(token, 3600));
    
    // Refresh token (90 jours)
    res.headers.append("set-cookie", buildRefreshCookie(refreshToken, 7776000));
    
    // Remember token (1 an) - si présent
    if (rememberToken) {
      res.headers.append("set-cookie", buildRememberCookie(rememberToken, 31536000));
    }
    
    return res;
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}



