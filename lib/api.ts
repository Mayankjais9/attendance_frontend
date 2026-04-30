export const API =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://65.2.3.19:8081";

export type LoginResponse = {
  access_token: string;
  token_type: string;
  role?: string;
  roles?: string[];
  role_ids?: number[];
  roles_full?: { role_id: number; role_name: string }[];
};

export function getAuthHeaders(init?: HeadersInit): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || ""
      : "";

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init || {}),
  };
}

export async function api<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: getAuthHeaders(init.headers),
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
    console.error("[api] request failed", path, res.status, message);
    throw new Error(`${res.status} - ${message}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const body = await res.text();
    console.error("[api] non-json response", path, contentType, body);
    throw new Error("API returned a non-JSON response");
  }

  return res.json();
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const body = new URLSearchParams();
  body.append("username", email.trim().toLowerCase());
  body.append("password", password);

  const url = `${API}/auth/login`;
  console.log("[login] request", url);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      cache: "no-store",
    });
  } catch {
    throw new Error("Network error while connecting to login service");
  }

  console.log("[login] response", res.status);

  if (!res.ok) {
    let message = "Login failed";
    try {
      const j = await res.json();
      message = j?.detail ?? message;
    } catch {
      message = (await res.text()) || message;
    }
    if (res.status === 422) {
      message = "Login request format is invalid";
    }
    throw new Error(message);
  }

  return res.json();
}

export type MeResponse = {
  user_id: number;
  full_name?: string;
  email?: string;
  dept_id?: number | null;
  status?: string;
  roles?: string[];
};

export async function downloadBase64File(
  filename: string,
  base64: string,
  mimeType: string
) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  const blob = new Blob([bytes], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
