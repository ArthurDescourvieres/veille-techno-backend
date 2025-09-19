import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/server/env";
import { parseAuthFromCookie, AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME, REMEMBER_COOKIE_NAME } from "@/lib/server/cookies";

export async function POST(request: Request) {
  try {
    const token = parseAuthFromCookie(request.headers.get("cookie"));
    
    // Si on a un token, notifier le backend
    if (token) {
      try {
        const backendRes = await fetch(`${getBackendUrl()}/api/auth/logout`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
        });
        
        if (!backendRes.ok) {
          console.warn("Backend logout failed, but continuing with cookie cleanup");
        }
      } catch (error) {
        // Même si le backend échoue, on continue avec la suppression des cookies
        console.error("Erreur lors de la déconnexion backend:", error);
      }
    }

    // Supprimer tous les cookies d'authentification
    const res = NextResponse.json({ success: true, message: "Déconnexion réussie" });
    
    // Supprimer le cookie auth
    res.headers.append("set-cookie", `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; Secure; Max-Age=0; SameSite=Strict`);
    
    // Supprimer le cookie refresh
    res.headers.append("set-cookie", `${REFRESH_COOKIE_NAME}=; Path=/; HttpOnly; Secure; Max-Age=0; SameSite=Strict`);
    
    // Supprimer le cookie remember
    res.headers.append("set-cookie", `${REMEMBER_COOKIE_NAME}=; Path=/; HttpOnly; Secure; Max-Age=0; SameSite=Strict`);
    
    return res;
  } catch (err) {
    console.error("Erreur dans logout route:", err);
    
    // Même en cas d'erreur, on supprime les cookies
    const res = NextResponse.json({ success: true, message: "Déconnexion réussie" });
    
    res.headers.append("set-cookie", `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; Secure; Max-Age=0; SameSite=Strict`);
    res.headers.append("set-cookie", `${REFRESH_COOKIE_NAME}=; Path=/; HttpOnly; Secure; Max-Age=0; SameSite=Strict`);
    res.headers.append("set-cookie", `${REMEMBER_COOKIE_NAME}=; Path=/; HttpOnly; Secure; Max-Age=0; SameSite=Strict`);
    
    return res;
  }
}
