"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--dark)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/">
            <h1 className="font-heading font-bold text-white text-3xl" style={{ fontFamily: "var(--font-cormorant)" }}>
              Knowledge Square
            </h1>
            <p className="text-xs tracking-widest uppercase mt-1 font-body" style={{ color: "var(--gold)" }}>
              Staff Portal
            </p>
          </Link>
        </div>

        <div className="rounded-xl p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(201,151,58,0.15)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--gold)" }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h2 className="font-heading font-semibold text-white" style={{ fontSize: "1.4rem", fontFamily: "var(--font-cormorant)" }}>
                Check Your Email
              </h2>
              <p className="text-sm font-body" style={{ color: "rgba(255,255,255,0.50)" }}>
                If an account exists for <span style={{ color: "var(--gold)" }}>{email}</span>, a password reset link has been sent. Check your inbox — the link expires in 1 hour.
              </p>
              <Link href="/admin/login" className="block text-sm font-body mt-4" style={{ color: "var(--gold)" }}>
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h2 className="font-heading font-semibold text-white mb-1 text-center" style={{ fontSize: "1.5rem", fontFamily: "var(--font-cormorant)" }}>
                Reset Password
              </h2>
              <p className="text-xs font-body text-center mb-7" style={{ color: "rgba(255,255,255,0.40)" }}>
                Enter your email and we&apos;ll send a reset link
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                    Email Address
                  </label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    required placeholder="admin@ksqbrampton.ca"
                    className="w-full px-3 py-3 rounded-md text-sm font-body outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "white" }}
                  />
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 rounded-md text-sm font-body font-semibold flex items-center justify-center gap-2"
                  style={{ background: loading ? "rgba(201,151,58,0.6)" : "var(--gold)", color: "var(--dark)", cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? (
                    <><span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--dark)", borderTopColor: "transparent" }} />Sending…</>
                  ) : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>

        {!sent && (
          <p className="text-center mt-6">
            <Link href="/admin/login" className="text-xs font-body" style={{ color: "rgba(255,255,255,0.35)" }}>
              ← Back to sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
