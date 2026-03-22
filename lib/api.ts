// ✅ ALWAYS use proxy
export const API = "/api";

export type LoginResponse = {
  access_token: string;
  token_type: string;
  roles?: string[];
  role_ids?: number[];
  roles_full?: { role_id: number; role_name: string }[];
};

// 🔥 Generic API handler
export async function api<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || ""
      : "";

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
    let message = "Something went wrong";
    try {
      const err = await res.json();
      message = err?.detail || message;
    } catch {
      message = await res.text();
    }
    throw new Error(`${res.status} - ${message}`);
  }

  return res.json();
}

// 🔥 Login function (uses proxy)
export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const body = new URLSearchParams();
  body.set("username", email.trim().toLowerCase());
  body.set("password", password);

  const res = await fetch("/api/auth/login", { // ✅ FIXED
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
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

  return res.json();
}