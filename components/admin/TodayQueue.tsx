"use client";

import Link from "next/link";
import { useState } from "react";
import StatusBadge from "./StatusBadge";
import { MOCK_APPLICATIONS, type AppStatus } from "@/lib/mock-data";
import { formatSlotTime } from "@/lib/slots";

export default function TodayQueue() {
  const today = new Date();

  const [statuses, setStatuses] = useState<Record<string, AppStatus>>(
    Object.fromEntries(MOCK_APPLICATIONS.map(a => [a.id, a.status]))
  );

  const todayApps = MOCK_APPLICATIONS.filter(app => {
    if (!app.appointment) return false;
    const slot = new Date(app.appointment.slotStart);
    return slot.toDateString() === today.toDateString();
  }).sort((a, b) =>
    new Date(a.appointment!.slotStart).getTime() - new Date(b.appointment!.slotStart).getTime()
  );

  function updateStatus(id: string, status: AppStatus) {
    setStatuses(prev => ({ ...prev, [id]: status }));
  }

  if (todayApps.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl" style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)" }}>
        <p className="font-body text-sm" style={{ color: "var(--mid)" }}>No appointments scheduled for today.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(26,74,46,0.07)", background: "rgba(26,74,46,0.02)" }}>
              {["Time", "Guest", "Status", "Payment", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-body font-semibold uppercase tracking-wide" style={{ color: "var(--mid)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {todayApps.map((app, i) => {
              const status = statuses[app.id];
              const slotTime = formatSlotTime(app.appointment!.slotStart);
              return (
                <tr
                  key={app.id}
                  style={{ borderBottom: i < todayApps.length - 1 ? "1px solid rgba(26,74,46,0.05)" : "none" }}
                  className="transition-colors hover:bg-ksq-light/30"
                >
                  <td className="px-4 py-3">
                    <span className="font-body font-semibold text-sm" style={{ color: "var(--dark)" }}>{slotTime}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-body font-medium" style={{ color: "var(--dark)" }}>
                      {app.guest.firstName} {app.guest.lastName}
                    </p>
                    <p className="text-xs font-body" style={{ color: "var(--mid)" }}>{app.applicationRef}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={status} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-body font-medium"
                      style={{ color: app.paymentStatus === "VERIFIED" ? "var(--green)" : "#d97706" }}
                    >
                      {app.paymentStatus === "VERIFIED" ? "✓ Verified" : "⏳ Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {status === "APPOINTMENT_SCHEDULED" && (
                        <button
                          onClick={() => updateStatus(app.id, "ARRIVED")}
                          className="px-2.5 py-1 rounded text-xs font-body font-medium transition-colors"
                          style={{ background: "rgba(16,185,129,0.10)", color: "#059669" }}
                        >
                          Check In
                        </button>
                      )}
                      {status === "ARRIVED" && (
                        <button
                          onClick={() => updateStatus(app.id, "BIOMETRICS_CAPTURED")}
                          className="px-2.5 py-1 rounded text-xs font-body font-medium transition-colors"
                          style={{ background: "rgba(26,74,46,0.10)", color: "var(--green)" }}
                        >
                          Biometrics ✓
                        </button>
                      )}
                      {(status === "APPOINTMENT_SCHEDULED" || status === "ARRIVED") && (
                        <button
                          onClick={() => updateStatus(app.id, "NO_SHOW")}
                          className="px-2.5 py-1 rounded text-xs font-body font-medium transition-colors"
                          style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}
                        >
                          No Show
                        </button>
                      )}
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="px-2.5 py-1 rounded text-xs font-body font-medium transition-colors"
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
    </div>
  );
}
