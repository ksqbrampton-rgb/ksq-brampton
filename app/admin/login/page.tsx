"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.replace(callbackUrl);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-body font-medium uppercase tracking-wide mb-1.5"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="admin@ksqbrampton.ca"
          className="w-full px-3 py-3 rounded-md text-sm font-body outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.12)",
            color: "white",
          }}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-body font-medium uppercase tracking-wide mb-1.5"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full px-3 py-3 rounded-md text-sm font-body outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.12)",
            color: "white",
          }}
        />
      </div>

      {error && (
        <div
          className="p-3 rounded-lg text-xs font-body text-center"
          style={{ background: "rgba(239,68,68,0.10)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-md text-sm font-body font-semibold mt-2 transition-all flex items-center justify-center gap-2"
        style={{
          background: loading ? "rgba(201,151,58,0.6)" : "var(--gold)",
          color: "var(--dark)",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? (
          <>
            <span
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "var(--dark)", borderTopColor: "transparent" }}
            />
            Signing in…
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--dark)" }}
    >
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <Link href="/">
            <h1
              className="font-heading font-bold text-white text-3xl"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Knowledge Square
            </h1>
            <p className="text-xs tracking-widest uppercase mt-1 font-body" style={{ color: "var(--gold)" }}>
              Staff Portal
            </p>
          </Link>
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h2
            className="font-heading font-semibold text-white mb-1 text-center"
            style={{ fontSize: "1.5rem", fontFamily: "var(--font-cormorant)" }}
          >
            Sign In
          </h2>
          <p className="text-xs font-body text-center mb-7" style={{ color: "rgba(255,255,255,0.40)" }}>
            Authorized staff only
          </p>

          {/* Suspense required for useSearchParams in production */}
          <Suspense fallback={<div className="h-48" />}>
            <LoginForm />
          </Suspense>

          {/* Dev hint */}
          <div
            className="mt-6 p-3 rounded-lg text-xs font-body"
            style={{ background: "rgba(201,151,58,0.08)", border: "1px solid rgba(201,151,58,0.15)", color: "rgba(255,255,255,0.45)" }}
          >
            <p className="font-medium mb-1" style={{ color: "var(--gold)" }}>Dev credentials</p>
            <p>Email: <span className="font-mono text-white/60">admin@ksqbrampton.ca</span></p>
            <p>Password: <span className="font-mono text-white/60">Admin1234!</span></p>
          </div>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-xs font-body" style={{ color: "rgba(255,255,255,0.35)" }}>
            ← Back to public site
          </Link>
        </p>
      </div>
    </div>
  );
}
