"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import StatusBadge from "./StatusBadge";
import type { AppStatus } from "@/lib/types";
import { formatSlotTime } from "@/lib/slots";

interface QueueItem {
  id: string;
  slotStart: string;
  status: string;
  application: {
    id: string;
    applicationRef: string;
    status: AppStatus;
    paymentStatus: string;
    guest: { firstName: string; lastName: string };
  };
}

export default function TodayQueue() {
  const [items, setItems]     = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<Record<string, AppStatus>>({});

  useEffect(() => {
    fetch("/api/admin/data/stats")
      .then(r => r.json())
      .then(data => {
        const queue: QueueItem[] = data.todayQueue ?? [];
        setItems(queue);
        const map: Record<string, AppStatus> = {};
        queue.forEach((q: QueueItem) => { map[q.id] = q.application.status as AppStatus; });
        setStatuses(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(apptId: string, action: "checkin" | "biometrics" | "noshow") {
    const statusMap: Record<string, AppStatus> = {
      checkin:    "ARRIVED",
      biometrics: "BIOMETRICS_CAPTURED",
      noshow:     "NO_SHOW",
    };
    // Optimistic update
    setStatuses(prev => ({ ...prev, [apptId]: statusMap[action] }));
    await fetch(`/api/admin/data/appointments/${apptId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
  }

  if (loading) return (
    <div className="p-8 text-center rounded-xl" style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)" }}>
      <p className="text-sm font-body" style={{ color: "var(--mid)" }}>Loading today&apos;s queue…</p>
    </div>
  );

  if (items.length === 0) return (
    <div className="p-8 text-center rounded-xl" style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)" }}>
      <p className="text-sm font-body" style={{ color: "var(--mid)" }}>No appointments scheduled for today.</p>
    </div>
  );

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(26,74,46,0.07)", background: "rgba(26,74,46,0.02)" }}>
              {["Time", "Guest", "Status", "Payment", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-body font-semibold uppercase tracking-wide" style={{ color: "var(--mid)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const status = statuses[item.id] ?? item.application.status as AppStatus;
              return (
                <tr key={item.id} style={{ borderBottom: i < items.length - 1 ? "1px solid rgba(26,74,46,0.05)" : "none" }}>
                  <td className="px-4 py-3">
                    <span className="font-body font-semibold text-sm" style={{ color: "var(--dark)" }}>{formatSlotTime(item.slotStart)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-body font-medium" style={{ color: "var(--dark)" }}>{item.application.guest.firstName} {item.application.guest.lastName}</p>
                    <p className="text-xs font-body" style={{ color: "var(--mid)" }}>{item.application.applicationRef}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={status} size="sm" /></td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-body font-medium" style={{ color: item.application.paymentStatus === "VERIFIED" ? "var(--green)" : "#d97706" }}>
                      {item.application.paymentStatus === "VERIFIED" ? "✓ Verified" : "⏳ Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {status === "APPOINTMENT_SCHEDULED" && (
                        <button onClick={() => updateStatus(item.id, "checkin")} className="px-2.5 py-1 rounded text-xs font-body font-medium" style={{ background: "rgba(16,185,129,0.10)", color: "#059669" }}>Check In</button>
                      )}
                      {status === "ARRIVED" && (
                        <button onClick={() => updateStatus(item.id, "biometrics")} className="px-2.5 py-1 rounded text-xs font-body font-medium" style={{ background: "rgba(26,74,46,0.10)", color: "var(--green)" }}>Biometrics ✓</button>
                      )}
                      {(status === "APPOINTMENT_SCHEDULED" || status === "ARRIVED") && (
                        <button onClick={() => updateStatus(item.id, "noshow")} className="px-2.5 py-1 rounded text-xs font-body font-medium" style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}>No Show</button>
                      )}
                      <Link href={`/admin/applications/${item.application.id}`} className="px-2.5 py-1 rounded text-xs font-body font-medium" style={{ background: "rgba(26,74,46,0.06)", color: "var(--mid)" }}>View</Link>
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
