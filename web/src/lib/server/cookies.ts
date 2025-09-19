export const AUTH_COOKIE_NAME = "kanban_auth";
export const REFRESH_COOKIE_NAME = "kanban_refresh";
export const REMEMBER_COOKIE_NAME = "kanban_remember";

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

export function buildRefreshCookie(refreshToken: string, maxAgeSeconds: number): string {
  const parts = [
    `${REFRESH_COOKIE_NAME}=${encodeURIComponent(refreshToken)}`,
    `Path=/`,
    `HttpOnly`,
    `Secure`,
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

export function buildRememberCookie(rememberToken: string, maxAgeSeconds: number): string {
  const parts = [
    `${REMEMBER_COOKIE_NAME}=${encodeURIComponent(rememberToken)}`,
    `Path=/`,
    `HttpOnly`,
    `Secure`,
    `Max-Age=${maxAgeSeconds}`,
  ];
  return parts.join("; ");
}

export function parseRefreshFromCookie(cookieHeader?: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  const cookies = cookieHeader.split(/;\s*/);
  for (const c of cookies) {
    const [k, v] = c.split("=");
    if (k === REFRESH_COOKIE_NAME) {
      return decodeURIComponent(v || "");
    }
  }
  return undefined;
}

export function parseRememberFromCookie(cookieHeader?: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  const cookies = cookieHeader.split(/;\s*/);
  for (const c of cookies) {
    const [k, v] = c.split("=");
    if (k === REMEMBER_COOKIE_NAME) {
      return decodeURIComponent(v || "");
    }
  }
  return undefined;
}



