import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/server/env";
import { AUTH_COOKIE_NAME, buildAuthCookie } from "@/lib/server/cookies";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 422 });
    }

    const backendRes = await fetch(`${getBackendUrl()}/api/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await backendRes.json().catch(() => ({} as any));

    if (!backendRes.ok) {
      const status = backendRes.status === 401 ? 401 : backendRes.status === 400 ? 400 : 500;
      return NextResponse.json(
        { error: data?.error || data?.message || "Identifiants invalides" },
        { status }
      );
    }

    const token = (data as any)?.token as string | undefined;
    if (!token) {
      return NextResponse.json({ error: "Réponse invalide du serveur" }, { status: 502 });
    }

    const res = NextResponse.json({ success: true });
    // 1h par défaut (aligné avec app.security.jwt.expiration=3600000)
    res.headers.append("set-cookie", buildAuthCookie(token, 3600));
    return res;
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}



