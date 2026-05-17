/**
 * Auth utilities for making authenticated API calls to the backend.
 * Uses Clerk's session token as a Bearer token.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

/**
 * Fetch wrapper that automatically attaches the Clerk session token.
 * Usage: fetchWithAuth("/api/admins", { method: "POST", body: JSON.stringify({...}) })
 */
export async function fetchWithAuth(
  path: string,
  options: RequestInit = {},
  getToken: () => Promise<string | null>
): Promise<Response> {
  const token = await getToken();
  return fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
}

/** Public fetch — no auth token */
export async function fetchPublic(path: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

export { BACKEND_URL };
