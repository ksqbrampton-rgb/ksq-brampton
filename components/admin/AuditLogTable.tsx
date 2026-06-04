"use client";

import { useState, useMemo } from "react";
import { downloadCsv } from "@/lib/export";

interface AuditEntry {
  id: string;
  timestamp: string;
  staff: string;
  action: string;
  entityType: string;
  entityId?: string;
  description: string;
}

const MOCK_AUDIT: AuditEntry[] = [
  { id: "a-001", timestamp: new Date(Date.now() - 10 * 60000).toISOString(),    staff: "Enrollment Officer", action: "BIOMETRICS_CAPTURED", entityType: "Application", entityId: "KSQ-BPT-20260604-0004", description: "Biometrics captured for Olumide Balogun" },
  { id: "a-002", timestamp: new Date(Date.now() - 35 * 60000).toISOString(),    staff: "Enrollment Officer", action: "CHECKIN",             entityType: "Application", entityId: "KSQ-BPT-20260604-0003", description: "Guest checked in: Ngozi Adeyemi" },
  { id: "a-003", timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),   staff: "Admin User",         action: "SETTING_CHANGED",    entityType: "SystemSetting", description: "Fee updated: newEnrollment = $50 CAD" },
  { id: "a-004", timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),   staff: "Admin User",         action: "STAFF_LOGIN",        entityType: "StaffUser",   description: "Admin User signed in" },
  { id: "a-005", timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),  staff: "Enrollment Officer", action: "NIN_ISSUED",         entityType: "Application", entityId: "KSQ-BPT-20260603-0003", description: "NIN issued for Ifeoma Nwosu" },
  { id: "a-006", timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),  staff: "Enrollment Officer", action: "NO_SHOW_MARKED",     entityType: "Application", entityId: "KSQ-BPT-20260602-0001", description: "No-show marked for Emeka Obi" },
  { id: "a-007", timestamp: new Date(Date.now() - 72 * 3600000).toISOString(),  staff: "Admin User",         action: "AVAILABILITY_UPDATED", entityType: "AvailabilityTemplate", description: "Saturday hours updated: 10:00–15:00" },
  { id: "a-008", timestamp: new Date(Date.now() - 96 * 3600000).toISOString(),  staff: "Admin User",         action: "EXPORT_GENERATED",  entityType: "Report",      description: "Applications CSV exported" },
];

const ACTION_COLORS: Record<string, string> = {
  CHECKIN:             "#059669",
  BIOMETRICS_CAPTURED: "var(--green)",
  NIN_ISSUED:          "var(--green)",
  NO_SHOW_MARKED:      "#dc2626",
  APPOINTMENT_CANCELLED: "#dc2626",
  STAFF_LOGIN:         "#3b82f6",
  SETTING_CHANGED:     "#d97706",
  AVAILABILITY_UPDATED: "#d97706",
  EXPORT_GENERATED:    "#6b7280",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AuditLogTable() {
  const [staffFilter, setStaffFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const staffOptions = ["ALL", ...Array.from(new Set(MOCK_AUDIT.map(a => a.staff)))];
  const actionOptions = ["ALL", ...Array.from(new Set(MOCK_AUDIT.map(a => a.action)))];

  const filtered = useMemo(() => {
    return MOCK_AUDIT.filter(entry => {
      const matchStaff  = staffFilter  === "ALL" || entry.staff  === staffFilter;
      const matchAction = actionFilter === "ALL" || entry.action === actionFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || entry.description.toLowerCase().includes(q) || (entry.entityId ?? "").toLowerCase().includes(q);
      return matchStaff && matchAction && matchSearch;
    });
  }, [staffFilter, actionFilter, search]);

  function exportLog() {
    downloadCsv(
      filtered,
      [
        { header: "Timestamp",   accessor: e => new Date(e.timestamp).toLocaleString("en-CA") },
        { header: "Staff",       accessor: e => e.staff },
        { header: "Action",      accessor: e => e.action },
        { header: "Entity Type", accessor: e => e.entityType },
        { header: "Reference",   accessor: e => e.entityId ?? "" },
        { header: "Description", accessor: e => e.description },
      ],
      `ksq-audit-log-${new Date().toISOString().slice(0, 10)}.csv`
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--mid)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search description or reference…"
            className="w-full pl-8 pr-3 py-2 rounded-lg text-sm font-body outline-none"
            style={{ border: "1px solid rgba(26,74,46,0.12)", background: "white", color: "var(--dark)" }}
          />
        </div>
        <select value={staffFilter} onChange={e => setStaffFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm font-body outline-none"
          style={{ border: "1px solid rgba(26,74,46,0.12)", background: "white", color: "var(--dark)" }}>
          {staffOptions.map(o => <option key={o} value={o}>{o === "ALL" ? "All Staff" : o}</option>)}
        </select>
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm font-body outline-none"
          style={{ border: "1px solid rgba(26,74,46,0.12)", background: "white", color: "var(--dark)" }}>
          {actionOptions.map(o => <option key={o} value={o}>{o === "ALL" ? "All Actions" : o.replace(/_/g, " ")}</option>)}
        </select>
        <button
          onClick={exportLog}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body font-medium"
          style={{ background: "rgba(26,74,46,0.07)", color: "var(--green)" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(26,74,46,0.07)", background: "rgba(26,74,46,0.02)" }}>
                {["When", "Staff", "Action", "Description"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-body font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--mid)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-sm font-body" style={{ color: "var(--mid)" }}>No entries match your filters.</td></tr>
              ) : filtered.map((entry, i) => (
                <tr key={entry.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(26,74,46,0.05)" : "none" }}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs font-body" style={{ color: "var(--mid)" }}>{timeAgo(entry.timestamp)}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm font-body font-medium" style={{ color: "var(--dark)" }}>{entry.staff}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className="text-xs font-body font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: `${ACTION_COLORS[entry.action] ?? "#6b7280"}18`,
                        color: ACTION_COLORS[entry.action] ?? "#6b7280",
                      }}
                    >
                      {entry.action.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-body" style={{ color: "var(--dark)" }}>{entry.description}</p>
                    {entry.entityId && (
                      <p className="text-xs font-mono mt-0.5" style={{ color: "var(--mid)" }}>{entry.entityId}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
