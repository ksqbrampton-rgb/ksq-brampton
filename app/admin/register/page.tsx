"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [error, setError]         = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/admin/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Registration failed.");
      return;
    }

    router.replace("/admin/login?registered=1");
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",
  } as React.CSSProperties;

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--dark)" }}>
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <Link href="/">
            <h1 className="font-heading font-bold text-white text-3xl" style={{ fontFamily: "var(--font-cormorant)" }}>
              Knowledge Square
            </h1>
            <p className="text-xs tracking-widest uppercase mt-1 font-body" style={{ color: "var(--gold)" }}>
              Staff Portal Setup
            </p>
          </Link>
        </div>

        <div className="rounded-xl p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 className="font-heading font-semibold text-white mb-1 text-center" style={{ fontSize: "1.5rem", fontFamily: "var(--font-cormorant)" }}>
            Create Admin Account
          </h2>
          <p className="text-xs font-body text-center mb-7" style={{ color: "rgba(255,255,255,0.40)" }}>
            First-time setup — creates your Super Admin account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                  First Name *
                </label>
                <input
                  type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                  required placeholder="Ada"
                  className="w-full px-3 py-3 rounded-md text-sm font-body outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Last Name
                </label>
                <input
                  type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                  placeholder="Okonkwo"
                  className="w-full px-3 py-3 rounded-md text-sm font-body outline-none"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                Email Address *
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="admin@ksqbrampton.ca"
                className="w-full px-3 py-3 rounded-md text-sm font-body outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                Password *
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required placeholder="Min. 8 characters"
                className="w-full px-3 py-3 rounded-md text-sm font-body outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                Confirm Password *
              </label>
              <input
                type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                required placeholder="Re-enter password"
                className="w-full px-3 py-3 rounded-md text-sm font-body outline-none"
                style={{ ...inputStyle, borderColor: confirm && confirm !== password ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.12)" }}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg text-xs font-body text-center" style={{ background: "rgba(239,68,68,0.10)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-md text-sm font-body font-semibold mt-2 transition-all flex items-center justify-center gap-2"
              style={{ background: loading ? "rgba(201,151,58,0.6)" : "var(--gold)", color: "var(--dark)", cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--dark)", borderTopColor: "transparent" }} />
                  Creating account…
                </>
              ) : "Create Admin Account"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <Link href="/admin/login" className="text-xs font-body" style={{ color: "rgba(255,255,255,0.35)" }}>
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
