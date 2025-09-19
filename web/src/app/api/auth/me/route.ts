import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/server/env";
import { parseAuthFromCookie, parseRefreshFromCookie, parseRememberFromCookie, buildAuthCookie, buildRefreshCookie } from "@/lib/server/cookies";

export async function GET(request: Request) {
  try {
    const token = parseAuthFromCookie(request.headers.get("cookie"));
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    let res = await fetch(`${getBackendUrl()}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    // Si token expiré, tenter refresh automatique
    if (res.status === 401) {
      // Essayer d'abord le refresh token, puis le remember token
      let refreshToken = parseRefreshFromCookie(request.headers.get("cookie"));
      if (!refreshToken) {
        refreshToken = parseRememberFromCookie(request.headers.get("cookie"));
      }
      
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${getBackendUrl()}/api/auth/refresh`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${refreshToken}` },
          });
          
          if (refreshRes.ok) {
            const { token: newToken, refreshToken: newRefreshToken } = await refreshRes.json();
            
            // Retry avec nouveau token
            res = await fetch(`${getBackendUrl()}/api/users/me`, {
              headers: { Authorization: `Bearer ${newToken}` },
              cache: "no-store",
            });
            
            if (res.ok) {
              const data = await res.json();
              const response = NextResponse.json(data);
              
              // Mettre à jour les cookies
              response.headers.append("set-cookie", buildAuthCookie(newToken, 3600));
              response.headers.append("set-cookie", buildRefreshCookie(newRefreshToken, 7776000));
              
              return response;
            }
          }
        } catch (refreshError) {
          // Refresh échoué, continuer avec l'erreur originale
        }
      }
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ error: data?.error || "Erreur" }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}



