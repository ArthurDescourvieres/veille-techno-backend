export const AUTH_COOKIE_NAME = "kanban_auth";

export function buildAuthCookie(token: string, maxAgeSeconds: number): string {
  const parts = [
    `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}`,
    `Path=/`,
    `HttpOnly`,
    `Secure`,
    `SameSite=Strict`,
    `Max-Age=${maxAgeSeconds}`,
  ];
  return parts.join("; ");
}

export function parseAuthFromCookie(cookieHeader?: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  const cookies = cookieHeader.split(/;\s*/);
  for (const c of cookies) {
    const [k, v] = c.split("=");
    if (k === AUTH_COOKIE_NAME) {
      return decodeURIComponent(v || "");
    }
  }
  return undefined;
}



