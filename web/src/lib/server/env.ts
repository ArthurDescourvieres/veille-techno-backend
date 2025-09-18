export function getBackendUrl(): string {
  const url = process.env.BACKEND_URL || "http://localhost:8080";
  return url.replace(/\/$/, "");
}



