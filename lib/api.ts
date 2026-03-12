export const API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8081";

export type LoginResponse = {
  access_token: string;
  token_type: string;
  roles?: string[];
  role_ids?: number[];
  roles_full?: { role_id: number; role_name: string }[];
};

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const body = new URLSearchParams();
  body.set("username", email.trim().toLowerCase());
  body.set("password", password);

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    let message = "Login failed";
    try {
      const j = await res.json();
      message = j?.detail ?? message;
    } catch {
      message = (await res.text()) || message;
    }
    throw new Error(message);
  }
  return (await res.json()) as LoginResponse;
}
