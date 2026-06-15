"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
  onInvited: (info: { name: string; emailSent: boolean }) => void;
}

const ROLES = [
  { value: "OFFICER",     label: "Enrollment Officer" },
  { value: "MANAGER",     label: "Manager" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

export default function InviteStaffModal({ onClose, onInvited }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [role, setRole]           = useState("OFFICER");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  async function handleSubmit() {
    if (!firstName.trim() || !email.trim()) {
      setError("First name and email are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/data/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Could not send the invite. Please try again.");
        setLoading(false);
        return;
      }

      onInvited({ name: data.staff?.name ?? `${firstName} ${lastName}`.trim(), emailSent: !!data.emailSent });
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md p-6 space-y-5"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold" style={{ fontSize: "1.2rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>
            Invite Staff Member
          </h2>
          <button onClick={onClose} style={{ color: "var(--mid)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1" style={{ color: "var(--mid)" }}>First Name *</label>
              <input
                type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                placeholder="Ada"
                className="w-full px-3 py-2 rounded-lg text-sm font-body outline-none"
                style={{ border: "1px solid rgba(26,74,46,0.15)", background: "var(--cream)", color: "var(--dark)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1" style={{ color: "var(--mid)" }}>Last Name</label>
              <input
                type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                placeholder="Okonkwo"
                className="w-full px-3 py-2 rounded-lg text-sm font-body outline-none"
                style={{ border: "1px solid rgba(26,74,46,0.15)", background: "var(--cream)", color: "var(--dark)" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1" style={{ color: "var(--mid)" }}>Email Address *</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="ada@ksqbrampton.ca"
              className="w-full px-3 py-2 rounded-lg text-sm font-body outline-none"
              style={{ border: "1px solid rgba(26,74,46,0.15)", background: "var(--cream)", color: "var(--dark)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1" style={{ color: "var(--mid)" }}>Role</label>
            <select
              value={role} onChange={e => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm font-body outline-none"
              style={{ border: "1px solid rgba(26,74,46,0.15)", background: "var(--cream)", color: "var(--dark)" }}
            >
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          {error && <p className="text-xs font-body" style={{ color: "#dc2626" }}>{error}</p>}

          <div
            className="p-3 rounded-lg text-xs font-body"
            style={{ background: "rgba(26,74,46,0.05)", color: "var(--mid)", border: "1px solid rgba(26,74,46,0.08)" }}
          >
            An invite email will be sent to the staff member with instructions to set their password.
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-body font-medium"
            style={{ background: "rgba(26,74,46,0.06)", color: "var(--mid)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg text-sm font-body font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "var(--green)", color: "white" }}
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "white", borderTopColor: "transparent" }} />
            ) : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}
