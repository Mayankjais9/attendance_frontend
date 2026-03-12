"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, API } from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const data = await loginUser(email, password);
      const token = data.access_token;
      localStorage.setItem("token", token);

      // Get roles from login response or /auth/me
      let rawRoles: string[] = [];
      if (Array.isArray(data.roles) && data.roles.length > 0) {
        rawRoles = data.roles;
      } else {
        const meRes = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (meRes.ok) {
          const me = await meRes.json();
          if (Array.isArray(me.roles)) rawRoles = me.roles;
        }
      }

      // Persist roles
      const rolesLower = rawRoles.map((r) => (r || "").trim().toLowerCase());
      localStorage.setItem("roles", JSON.stringify(rolesLower));
      document.cookie = `roles=${encodeURIComponent(rolesLower.join(","))}; Path=/`;
      document.cookie = `token=${encodeURIComponent(token)}; Path=/`;

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-3 rounded border p-4 shadow"
    >
      <h2 className="text-xl font-semibold text-center">Login</h2>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <input
        type="email"
        className="w-full rounded border p-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        className="w-full rounded border p-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded bg-blue-600 p-2 text-white disabled:bg-gray-400"
      >
        {busy ? "Logging in…" : "Login"}
      </button>
    </form>
  );
}
