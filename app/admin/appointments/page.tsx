"use client";

import Link from "next/link";
import { useState } from "react";
import StatusBadge from "@/components/admin/StatusBadge";
import { MOCK_APPLICATIONS, type AppStatus } from "@/lib/mock-data";
import { formatSlotTime } from "@/lib/slots";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

const VIEWS = ["Today", "Upcoming", "Past"] as const;
type View = typeof VIEWS[number];

export default function AppointmentsPage() {
  const [view, setView] = useState<View>("Today");
  const [statuses, setStatuses] = useState<Record<string, AppStatus>>(
    Object.fromEntries(MOCK_APPLICATIONS.map(a => [a.id, a.status]))
  );

  const now = new Date();

  const filtered = MOCK_APPLICATIONS.filter(app => {
    if (!app.appointment) return false;
    const slot = new Date(app.appointment.slotStart);
    const isToday = slot.toDateString() === now.toDateString();
    const isFuture = slot > now && !isToday;
    const isPast = slot < now && !isToday;
    if (view === "Today") return isToday;
    if (view === "Upcoming") return isFuture;
    return isPast;
  }).sort((a, b) =>
    new Date(a.appointment!.slotStart).getTime() - new Date(b.appointment!.slotStart).getTime()
  );

  function updateStatus(id: string, status: AppStatus) {
    setStatuses(prev => ({ ...prev, [id]: status }));
  }

  return (
    <div className="max-w-5xl space-y-5">
      <h1 className="font-heading font-bold" style={{ fontSize: "1.5rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>
        Appointments
      </h1>

      {/* View toggle */}
      <div className="flex gap-1 p-1 rounded-lg w-fit" style={{ background: "white", border: "1px solid rgba(26,74,46,0.10)" }}>
        {VIEWS.map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="px-4 py-1.5 rounded-md text-sm font-body font-medium transition-all"
            style={{
              background: view === v ? "var(--green)" : "transparent",
              color: view === v ? "white" : "var(--mid)",
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}
      >
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-body" style={{ color: "var(--mid)" }}>
              No {view.toLowerCase()} appointments.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(26,74,46,0.07)", background: "rgba(26,74,46,0.02)" }}>
                  {["Date & Time", "Guest", "Reference", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-body font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--mid)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, i) => {
                  const status = statuses[app.id];
                  return (
                    <tr
                      key={app.id}
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(26,74,46,0.05)" : "none" }}
                      className="transition-colors hover:bg-ksq-light/20"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-body font-semibold text-sm" style={{ color: "var(--dark)" }}>
                          {formatSlotTime(app.appointment!.slotStart)}
                        </p>
                        <p className="text-xs font-body" style={{ color: "var(--mid)" }}>
                          {formatDate(app.appointment!.slotStart)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-body font-medium whitespace-nowrap" style={{ color: "var(--dark)" }}>
                          {app.guest.firstName} {app.guest.lastName}
                        </p>
                        <p className="text-xs font-body" style={{ color: "var(--mid)" }}>{app.guest.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs" style={{ color: "var(--mid)" }}>{app.applicationRef}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={status} size="sm" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {status === "APPOINTMENT_SCHEDULED" && (
                            <button
                              onClick={() => updateStatus(app.id, "ARRIVED")}
                              className="px-2.5 py-1 rounded text-xs font-body font-medium"
                              style={{ background: "rgba(16,185,129,0.10)", color: "#059669" }}
                            >
                              Check In
                            </button>
                          )}
                          {status === "ARRIVED" && (
                            <button
                              onClick={() => updateStatus(app.id, "BIOMETRICS_CAPTURED")}
                              className="px-2.5 py-1 rounded text-xs font-body font-medium"
                              style={{ background: "rgba(26,74,46,0.10)", color: "var(--green)" }}
                            >
                              Biometrics ✓
                            </button>
                          )}
                          {(status === "APPOINTMENT_SCHEDULED" || status === "ARRIVED") && (
                            <button
                              onClick={() => updateStatus(app.id, "NO_SHOW")}
                              className="px-2.5 py-1 rounded text-xs font-body font-medium"
                              style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}
                            >
                              No Show
                            </button>
                          )}
                          <Link
                            href={`/admin/applications/${app.id}`}
                            className="px-2.5 py-1 rounded text-xs font-body font-medium"
                            style={{ background: "rgba(26,74,46,0.06)", color: "var(--mid)" }}
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
