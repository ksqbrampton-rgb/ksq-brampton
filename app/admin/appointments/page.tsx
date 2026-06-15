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

interface StaffOption { id: string; name: string; role: string; }

const EMPTY_FORM = { date: "", slotStart: "", firstName: "", lastName: "", email: "", phone: "", notes: "", officerId: "", sendEmail: true };

export default function AppointmentsPage() {
  const [view, setView]     = useState<View>("Today");
  const [items, setItems]   = useState<ApptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<Record<string, AppStatus>>({});

  // Manual booking
  const [showNew, setShowNew]       = useState(false);
  const [staff, setStaff]           = useState<StaffOption[]>([]);
  const [form, setForm]             = useState({ ...EMPTY_FORM });
  const [slots, setSlots]           = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg]       = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/data/staff")
      .then(r => r.json())
      .then(d => setStaff(d.staff ?? []))
      .catch(() => {});
  }, []);

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

  function refreshList() {
    fetch(`/api/admin/data/appointments?view=${view}`)
      .then(r => r.json())
      .then(data => {
        const appts: ApptItem[] = data.appointments ?? [];
        setItems(appts);
        const map: Record<string, AppStatus> = {};
        appts.forEach(a => { map[a.id] = a.application.status; });
        setStatuses(map);
      })
      .catch(() => {});
  }

  async function loadSlots(date: string) {
    if (!date) { setSlots([]); return; }
    setSlotsLoading(true);
    setForm(f => ({ ...f, slotStart: "" }));
    try {
      const r = await fetch(`/api/slots?date=${date}`);
      const d = await r.json();
      setSlots(d.slots ?? []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }

  function openNew() {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Toronto" }); // YYYY-MM-DD
    setForm({ ...EMPTY_FORM, date: today });
    setSlots([]);
    setFormMsg(null);
    setShowNew(true);
    loadSlots(today);
  }

  async function postBooking(force: boolean): Promise<{ ok: boolean; duplicate?: boolean; error?: string }> {
    const res = await fetch("/api/admin/data/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        notes: form.notes.trim() || undefined,
        slotStart: form.slotStart,
        officerId: form.officerId || null,
        sendEmail: form.sendEmail,
        force,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true };
    if (res.status === 409 && data.code === "DUPLICATE") return { ok: false, duplicate: true };
    if (data.errors) return { ok: false, error: "Please check the guest details." };
    return { ok: false, error: data.error ?? "Couldn't create the booking." };
  }

  async function submitBooking() {
    setFormMsg(null);
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setFormMsg("First name, last name, and email are required.");
      return;
    }
    if (!form.slotStart) {
      setFormMsg("Please choose a time slot.");
      return;
    }
    setSubmitting(true);
    try {
      let result = await postBooking(false);
      if (result.duplicate) {
        if (confirm("This guest already has an active application. Book anyway?")) {
          result = await postBooking(true);
        } else {
          setFormMsg("Cancelled — this guest already has an active application.");
          return;
        }
      }
      if (result.ok) {
        setShowNew(false);
        refreshList();
      } else if (result.error) {
        setFormMsg(result.error);
      }
    } catch {
      setFormMsg("Couldn't create the booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="font-heading font-bold" style={{ fontSize: "1.5rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>Appointments</h1>
        <button onClick={openNew} className="px-4 py-2 rounded-lg text-sm font-body font-medium" style={{ background: "var(--gold)", color: "var(--dark)" }}>+ New Booking</button>
      </div>
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

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ background: "rgba(15,35,24,0.45)" }}>
          <div className="w-full max-w-lg rounded-xl my-8" style={{ background: "white", boxShadow: "0 10px 40px rgba(15,35,24,0.25)" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(26,74,46,0.08)" }}>
              <h2 className="font-heading font-semibold" style={{ fontSize: "1.15rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>New Booking</h2>
              <button onClick={() => setShowNew(false)} className="text-base font-body" style={{ color: "var(--mid)" }} aria-label="Close">✕</button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1" style={{ color: "var(--mid)" }}>Date</label>
                <input type="date" value={form.date} onChange={e => { const v = e.target.value; setForm(f => ({ ...f, date: v })); loadSlots(v); }}
                  className="w-full px-3 py-2 rounded-lg text-sm font-body outline-none" style={{ border: "1px solid rgba(26,74,46,0.12)", background: "var(--cream)", color: "var(--dark)" }} />
              </div>

              <div>
                <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1" style={{ color: "var(--mid)" }}>Time Slot</label>
                {slotsLoading ? (
                  <p className="text-sm font-body py-2" style={{ color: "var(--mid)" }}>Loading slots…</p>
                ) : slots.length === 0 ? (
                  <p className="text-sm font-body py-2" style={{ color: "var(--mid)" }}>No available slots for this date.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {slots.map(s => {
                      const sel = form.slotStart === s;
                      return (
                        <button key={s} onClick={() => setForm(f => ({ ...f, slotStart: s }))}
                          className="px-3 py-1.5 rounded-lg text-xs font-body font-medium"
                          style={{ background: sel ? "var(--green)" : "var(--cream)", color: sel ? "white" : "var(--dark)", border: sel ? "none" : "1px solid rgba(26,74,46,0.12)" }}>
                          {formatSlotTime(s)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1" style={{ color: "var(--mid)" }}>First Name</label>
                  <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm font-body outline-none" style={{ border: "1px solid rgba(26,74,46,0.12)", background: "var(--cream)", color: "var(--dark)" }} />
                </div>
                <div>
                  <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1" style={{ color: "var(--mid)" }}>Last Name</label>
                  <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm font-body outline-none" style={{ border: "1px solid rgba(26,74,46,0.12)", background: "var(--cream)", color: "var(--dark)" }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1" style={{ color: "var(--mid)" }}>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm font-body outline-none" style={{ border: "1px solid rgba(26,74,46,0.12)", background: "var(--cream)", color: "var(--dark)" }} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1" style={{ color: "var(--mid)" }}>Phone <span className="normal-case" style={{ opacity: 0.6 }}>(optional)</span></label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm font-body outline-none" style={{ border: "1px solid rgba(26,74,46,0.12)", background: "var(--cream)", color: "var(--dark)" }} />
                </div>
                <div>
                  <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1" style={{ color: "var(--mid)" }}>Officer <span className="normal-case" style={{ opacity: 0.6 }}>(optional)</span></label>
                  <select value={form.officerId} onChange={e => setForm(f => ({ ...f, officerId: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm font-body outline-none" style={{ border: "1px solid rgba(26,74,46,0.12)", background: "var(--cream)", color: "var(--dark)" }}>
                    <option value="">— Unassigned —</option>
                    {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1" style={{ color: "var(--mid)" }}>Notes <span className="normal-case" style={{ opacity: 0.6 }}>(optional)</span></label>
                <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm font-body outline-none" style={{ border: "1px solid rgba(26,74,46,0.12)", background: "var(--cream)", color: "var(--dark)" }} />
              </div>

              <label className="flex items-center gap-2 text-sm font-body" style={{ color: "var(--dark)" }}>
                <input type="checkbox" checked={form.sendEmail} onChange={e => setForm(f => ({ ...f, sendEmail: e.target.checked }))} />
                Send confirmation email to the guest
              </label>

              {formMsg && <p className="text-sm font-body" style={{ color: "#dc2626" }}>{formMsg}</p>}
            </div>

            <div className="flex justify-end gap-2 px-6 py-4" style={{ borderTop: "1px solid rgba(26,74,46,0.08)" }}>
              <button onClick={() => setShowNew(false)} disabled={submitting} className="px-4 py-2 rounded-lg text-sm font-body font-medium" style={{ background: "var(--cream)", color: "var(--mid)" }}>Cancel</button>
              <button onClick={submitBooking} disabled={submitting} className="px-4 py-2 rounded-lg text-sm font-body font-medium disabled:opacity-50" style={{ background: "var(--green)", color: "white" }}>{submitting ? "Booking…" : "Create Booking"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
