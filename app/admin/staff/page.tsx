"use client";

import { useState } from "react";
import InviteStaffModal from "@/components/admin/InviteStaffModal";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  MANAGER:     "Manager",
  OFFICER:     "Officer",
};

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  SUPER_ADMIN: { bg: "rgba(201,151,58,0.12)", color: "var(--gold)" },
  MANAGER:     { bg: "rgba(26,74,46,0.10)",   color: "var(--green)" },
  OFFICER:     { bg: "rgba(59,130,246,0.10)",  color: "#2563eb" },
};

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

const INITIAL_STAFF: StaffMember[] = [
  { id: "s-001", name: "Admin User",         email: "admin@ksqbrampton.ca",   role: "SUPER_ADMIN", isActive: true, lastLogin: new Date().toISOString(),                            createdAt: "2026-01-15" },
  { id: "s-002", name: "Enrollment Officer", email: "officer@ksqbrampton.ca", role: "OFFICER",     isActive: true, lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), createdAt: "2026-02-01" },
];

function timeAgo(iso?: string): string {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [showInvite, setShowInvite] = useState(false);

  function toggleActive(id: string) {
    setStaff(s => s.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m));
  }

  function handleInvited(invited: { name: string; email: string; role: string }) {
    setStaff(s => [...s, {
      id: `s-${Date.now()}`,
      name: invited.name,
      email: invited.email,
      role: invited.role,
      isActive: true,
      createdAt: new Date().toISOString().slice(0, 10),
    }]);
    setShowInvite(false);
  }

  return (
    <div className="max-w-4xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold" style={{ fontSize: "1.5rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>
            Staff
          </h1>
          <p className="text-sm font-body mt-0.5" style={{ color: "var(--mid)" }}>
            {staff.filter(s => s.isActive).length} active · {staff.length} total
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors"
          style={{ background: "var(--green)", color: "white" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Invite Staff
        </button>
      </div>

      {/* Staff table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(26,74,46,0.07)", background: "rgba(26,74,46,0.02)" }}>
                {["Staff Member", "Role", "Status", "Last Login", "Joined", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-body font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--mid)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.map((member, i) => {
                const roleStyle = ROLE_COLORS[member.role] ?? ROLE_COLORS.OFFICER;
                return (
                  <tr
                    key={member.id}
                    style={{ borderBottom: i < staff.length - 1 ? "1px solid rgba(26,74,46,0.05)" : "none", opacity: member.isActive ? 1 : 0.55 }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-body font-bold"
                          style={{ background: "rgba(26,74,46,0.10)", color: "var(--green)" }}
                        >
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-body font-medium" style={{ color: "var(--dark)" }}>{member.name}</p>
                          <p className="text-xs font-body" style={{ color: "var(--mid)" }}>{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-body font-medium px-2.5 py-1 rounded-full"
                        style={{ background: roleStyle.bg, color: roleStyle.color }}
                      >
                        {ROLE_LABELS[member.role]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-body font-medium"
                        style={{ color: member.isActive ? "var(--green)" : "var(--mid)" }}
                      >
                        {member.isActive ? "● Active" : "○ Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-body" style={{ color: "var(--mid)" }}>
                        {timeAgo(member.lastLogin)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-body" style={{ color: "var(--mid)" }}>{member.createdAt}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleActive(member.id)}
                        className="px-3 py-1.5 rounded text-xs font-body font-medium transition-colors"
                        style={{
                          background: member.isActive ? "rgba(239,68,68,0.08)" : "rgba(26,74,46,0.08)",
                          color: member.isActive ? "#dc2626" : "var(--green)",
                        }}
                      >
                        {member.isActive ? "Deactivate" : "Reactivate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showInvite && (
        <InviteStaffModal
          onClose={() => setShowInvite(false)}
          onInvited={handleInvited}
        />
      )}
    </div>
  );
}
