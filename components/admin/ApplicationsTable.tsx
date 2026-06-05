"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import StatusBadge from "./StatusBadge";
import type { AppRecord, AppStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { formatSlotTime } from "@/lib/slots";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function formatSlotDate(iso: string) {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

const STATUS_OPTIONS: { value: AppStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Statuses" },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value: value as AppStatus, label })),
];

export default function ApplicationsTable() {
  const [applications, setApplications] = useState<AppRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState<AppStatus | "ALL">("ALL");
  const [page, setPage]       = useState(1);
  const PER_PAGE = 8;

  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    fetch(`/api/admin/data/applications?${params}`)
      .then(r => r.json())
      .then(data => setApplications(data.applications ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return applications;
    return applications.filter(app =>
      app.guest.firstName.toLowerCase().includes(q) ||
      app.guest.lastName.toLowerCase().includes(q) ||
      app.guest.email.toLowerCase().includes(q) ||
      app.applicationRef.toLowerCase().includes(q)
    );
  }, [applications, search]);

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--mid)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search by name, email or reference…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm font-body outline-none"
            style={{ background: "white", border: "1px solid rgba(26,74,46,0.12)", color: "var(--dark)" }} />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value as AppStatus | "ALL"); setPage(1); }}
          className="px-3 py-2.5 rounded-lg text-sm font-body outline-none"
          style={{ background: "white", border: "1px solid rgba(26,74,46,0.12)", color: "var(--dark)", minWidth: "160px" }}>
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}>
        {loading ? (
          <p className="px-4 py-10 text-center text-sm font-body" style={{ color: "var(--mid)" }}>Loading applications…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(26,74,46,0.07)", background: "rgba(26,74,46,0.02)" }}>
                  {["Reference", "Guest", "Appointment", "Status", "Payment", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-body font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--mid)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-sm font-body" style={{ color: "var(--mid)" }}>No applications found.</td></tr>
                ) : paged.map((app, i) => (
                  <tr key={app.id} style={{ borderBottom: i < paged.length - 1 ? "1px solid rgba(26,74,46,0.05)" : "none" }}>
                    <td className="px-4 py-3"><span className="font-mono text-xs" style={{ color: "var(--mid)" }}>{app.applicationRef}</span></td>
                    <td className="px-4 py-3">
                      <p className="font-body font-medium whitespace-nowrap" style={{ color: "var(--dark)" }}>{app.guest.firstName} {app.guest.lastName}</p>
                      <p className="text-xs font-body truncate max-w-[160px]" style={{ color: "var(--mid)" }}>{app.guest.email}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {app.appointment ? (
                        <>
                          <p className="font-body text-xs font-medium" style={{ color: "var(--dark)" }}>{formatSlotDate(app.appointment.slotStart)}</p>
                          <p className="text-xs font-body" style={{ color: "var(--mid)" }}>{formatSlotTime(app.appointment.slotStart)}</p>
                        </>
                      ) : <span className="text-xs font-body" style={{ color: "var(--mid)" }}>—</span>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={app.status} size="sm" /></td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-body font-medium" style={{ color: app.paymentStatus === "VERIFIED" ? "var(--green)" : "#d97706" }}>
                        {app.paymentStatus === "VERIFIED" ? "✓ Verified" : "⏳ Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/applications/${app.id}`} className="px-3 py-1.5 rounded text-xs font-body font-medium" style={{ background: "rgba(26,74,46,0.07)", color: "var(--green)" }}>View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid rgba(26,74,46,0.06)" }}>
            <p className="text-xs font-body" style={{ color: "var(--mid)" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
            <div className="flex items-center gap-1">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className="w-7 h-7 rounded text-xs font-body font-medium"
                  style={{ background: p === page ? "var(--green)" : "transparent", color: p === page ? "white" : "var(--mid)" }}>{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
