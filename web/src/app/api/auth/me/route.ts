import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/server/env";
import { parseAuthFromCookie } from "@/lib/server/cookies";

export async function GET(request: Request) {
  try {
    const token = parseAuthFromCookie(request.headers.get("cookie"));
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const res = await fetch(`${getBackendUrl()}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ error: data?.error || "Erreur" }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}



