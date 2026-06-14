"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import StatusBadge from "@/components/admin/StatusBadge";
import type { AppStatus } from "@/lib/types";
import { formatSlotTime } from "@/lib/slots";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function formatDate(iso: string) { const d = new Date(iso); return `${MONTHS[d.getMonth()]} ${d.getDate()}`; }
function hasStarted(iso: string) { return new Date(iso).getTime() <= Date.now(); }

const VIEWS = ["Today", "Upcoming", "Past"] as const;
type View = typeof VIEWS[number];

type Action = "checkin" | "biometrics" | "noshow" | "reopen";

interface ApptItem {
  id: string;
  slotStart: string;
  status: string;
  application: {
    id: string;
    applicationRef: string;
    status: AppStatus;
    guest: { firstName: string; lastName: string; phone?: string | null };
  };
}

export default function AppointmentsPage() {
  const [view, setView]     = useState<View>("Today");
  const [items, setItems]   = useState<ApptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<Record<string, AppStatus>>({});

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/data/appointments?view=${view}`)
      .then(r => r.json())
      .then(data => {
        const appts: ApptItem[] = data.appointments ?? [];
        setItems(appts);
        const map: Record<string, AppStatus> = {};
        appts.forEach(a => { map[a.id] = a.application.status; });
        setStatuses(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [view]);

  async function updateStatus(apptId: string, action: Action) {
    const statusMap: Record<Action, AppStatus> = {
      checkin: "ARRIVED",
      biometrics: "BIOMETRICS_CAPTURED",
      noshow: "NO_SHOW",
      reopen: "APPOINTMENT_SCHEDULED",
    };
    const prev = statuses[apptId];
    setStatuses(p => ({ ...p, [apptId]: statusMap[action] }));

    const res = await fetch(`/api/admin/data/appointments/${apptId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatuses(p => ({ ...p, [apptId]: prev })); // revert optimistic update
      alert(data.error ?? "That action couldn't be completed.");
    }
  }

  return (
    <div className="max-w-5xl space-y-5">
      <h1 className="font-heading font-bold" style={{ fontSize: "1.5rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>Appointments</h1>
      <div className="flex gap-1 p-1 rounded-lg w-fit" style={{ background: "white", border: "1px solid rgba(26,74,46,0.10)" }}>
        {VIEWS.map(v => (
          <button key={v} onClick={() => setView(v)} className="px-4 py-1.5 rounded-md text-sm font-body font-medium transition-all"
            style={{ background: view === v ? "var(--green)" : "transparent", color: view === v ? "white" : "var(--mid)" }}>{v}</button>
        ))}
      </div>
      <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}>
        {loading ? (
          <p className="px-4 py-16 text-center text-sm font-body" style={{ color: "var(--mid)" }}>Loading…</p>
        ) : items.length === 0 ? (
          <p className="px-4 py-16 text-center text-sm font-body" style={{ color: "var(--mid)" }}>No {view.toLowerCase()} appointments.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(26,74,46,0.07)", background: "rgba(26,74,46,0.02)" }}>
                  {["Date & Time", "Guest", "Reference", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-body font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--mid)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  const status = statuses[item.id] ?? item.application.status;
                  const started = hasStarted(item.slotStart);
                  return (
                    <tr key={item.id} style={{ borderBottom: i < items.length - 1 ? "1px solid rgba(26,74,46,0.05)" : "none" }}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-body font-semibold text-sm" style={{ color: "var(--dark)" }}>{formatSlotTime(item.slotStart)}</p>
                        <p className="text-xs font-body" style={{ color: "var(--mid)" }}>{formatDate(item.slotStart)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-body font-medium whitespace-nowrap" style={{ color: "var(--dark)" }}>{item.application.guest.firstName} {item.application.guest.lastName}</p>
                        <p className="text-xs font-body" style={{ color: "var(--mid)" }}>{item.application.guest.phone ?? ""}</p>
                      </td>
                      <td className="px-4 py-3"><span className="font-mono text-xs" style={{ color: "var(--mid)" }}>{item.application.applicationRef}</span></td>
                      <td className="px-4 py-3"><StatusBadge status={status} size="sm" /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {status === "APPOINTMENT_SCHEDULED" && <button onClick={() => updateStatus(item.id, "checkin")} className="px-2.5 py-1 rounded text-xs font-body font-medium" style={{ background: "rgba(16,185,129,0.10)", color: "#059669" }}>Check In</button>}
                          {status === "ARRIVED" && <button onClick={() => updateStatus(item.id, "biometrics")} className="px-2.5 py-1 rounded text-xs font-body font-medium" style={{ background: "rgba(26,74,46,0.10)", color: "var(--green)" }}>Biometrics ✓</button>}
                          {(status === "APPOINTMENT_SCHEDULED" || status === "ARRIVED") && started && <button onClick={() => updateStatus(item.id, "noshow")} className="px-2.5 py-1 rounded text-xs font-body font-medium" style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}>No Show</button>}
                          {status === "NO_SHOW" && <button onClick={() => updateStatus(item.id, "reopen")} className="px-2.5 py-1 rounded text-xs font-body font-medium" style={{ background: "rgba(201,151,58,0.12)", color: "var(--gold)" }}>Undo No-Show</button>}
                          <Link href={`/admin/applications/${item.application.id}`} className="px-2.5 py-1 rounded text-xs font-body font-medium" style={{ background: "rgba(26,74,46,0.06)", color: "var(--mid)" }}>View</Link>
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
