"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [error, setError]         = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8)  { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    const res = await fetch("/api/admin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error ?? "Reset failed."); return; }

    setSuccess(true);
    setTimeout(() => router.replace("/admin/login"), 2500);
  }

  const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "white" } as React.CSSProperties;

  if (!token) {
    return (
      <p className="text-center text-sm font-body" style={{ color: "#fca5a5" }}>
        Invalid reset link. <Link href="/admin/forgot-password" style={{ color: "var(--gold)" }}>Request a new one →</Link>
      </p>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(26,74,46,0.20)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--gold)" }}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p className="text-white font-body font-medium">Password updated!</p>
        <p className="text-xs font-body" style={{ color: "rgba(255,255,255,0.45)" }}>Redirecting to sign in…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>New Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min. 8 characters"
          className="w-full px-3 py-3 rounded-md text-sm font-body outline-none" style={inputStyle} />
      </div>
      <div>
        <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>Confirm New Password</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Re-enter password"
          className="w-full px-3 py-3 rounded-md text-sm font-body outline-none"
          style={{ ...inputStyle, borderColor: confirm && confirm !== password ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.12)" }} />
      </div>
      {error && (
        <div className="p-3 rounded-lg text-xs font-body text-center" style={{ background: "rgba(239,68,68,0.10)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}>
          {error}
        </div>
      )}
      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-md text-sm font-body font-semibold flex items-center justify-center gap-2"
        style={{ background: loading ? "rgba(201,151,58,0.6)" : "var(--gold)", color: "var(--dark)", cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? <><span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--dark)", borderTopColor: "transparent" }} />Updating…</> : "Set New Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--dark)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/">
            <h1 className="font-heading font-bold text-white text-3xl" style={{ fontFamily: "var(--font-cormorant)" }}>Knowledge Square</h1>
            <p className="text-xs tracking-widest uppercase mt-1 font-body" style={{ color: "var(--gold)" }}>Staff Portal</p>
          </Link>
        </div>
        <div className="rounded-xl p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 className="font-heading font-semibold text-white mb-1 text-center" style={{ fontSize: "1.5rem", fontFamily: "var(--font-cormorant)" }}>
            Set New Password
          </h2>
          <p className="text-xs font-body text-center mb-7" style={{ color: "rgba(255,255,255,0.40)" }}>Choose a strong password for your account</p>
          <Suspense fallback={<div className="h-32" />}>
            <ResetForm />
          </Suspense>
        </div>
        <p className="text-center mt-6">
          <Link href="/admin/login" className="text-xs font-body" style={{ color: "rgba(255,255,255,0.35)" }}>← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
