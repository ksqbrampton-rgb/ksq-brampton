"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import StatusBadge from "@/components/admin/StatusBadge";
import DocumentsPanel from "@/components/admin/DocumentsPanel";
import { STATUS_LABELS, type AppStatus, type PaymentStatus } from "@/lib/types";
import { formatSlotTime } from "@/lib/slots";
import { SITE } from "@/lib/constants";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function formatDate(iso: string) {
  const d = new Date(iso);
  return `${["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

const STATUS_STEPS: AppStatus[] = ["APPOINTMENT_SCHEDULED","ARRIVED","BIOMETRICS_CAPTURED","NIN_PROCESSING","NIN_ISSUED"];

interface AppDetail {
  id: string; applicationRef: string; status: AppStatus; paymentStatus: PaymentStatus;
  paymentMethod?: string|null; paymentReference?: string|null; notes?: string|null;
  guest: { id: string; firstName: string; lastName: string; email: string; phone?: string|null; noShowCount: number };
  appointment?: { id: string; slotStart: string; arrivedAt?: string|null } | null;
  documents?: { id: string; fileName: string; type: string; status: string; mimeType: string; fileSize: number }[];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-6" style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}>
      <h3 className="font-heading font-semibold mb-5" style={{ fontSize: "1rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)", borderBottom: "1px solid rgba(26,74,46,0.07)", paddingBottom: "12px" }}>{title}</h3>
      {children}
    </div>
  );
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 py-2" style={{ borderBottom: "1px solid rgba(26,74,46,0.05)" }}>
      <span className="text-xs font-body font-medium uppercase tracking-wide w-36 flex-shrink-0" style={{ color: "var(--mid)" }}>{label}</span>
      <span className="text-sm font-body" style={{ color: "var(--dark)" }}>{value}</span>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [app, setApp]                 = useState<AppDetail | null>(null);
  const [loading, setLoading]         = useState(true);
  const [status, setStatus]           = useState<AppStatus>("APPOINTMENT_SCHEDULED");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("PENDING");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paymentRef, setPaymentRef]   = useState("");
  const [ninNumber, setNinNumber]     = useState("");
  const [noteInput, setNoteInput]     = useState("");
  const [saving, setSaving]           = useState(false);

  useEffect(() => {
    fetch(`/api/admin/data/applications/${id}`)
      .then(r => r.json())
      .then(data => {
        const a: AppDetail = data.application;
        setApp(a);
        setStatus(a.status);
        setPaymentStatus(a.paymentStatus);
        setPaymentMethod(a.paymentMethod ?? "CASH");
        setPaymentRef(a.paymentReference ?? "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function patchApp(body: Record<string, unknown>) {
    setSaving(true);
    const res = await fetch(`/api/admin/data/applications/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.application) setApp(data.application);
    setSaving(false);
  }

  async function updateStatus(newStatus: AppStatus) {
    setStatus(newStatus);
    await patchApp({ status: newStatus });
  }

  if (loading) return <div className="p-10 text-center text-sm font-body" style={{ color: "var(--mid)" }}>Loading application…</div>;
  if (!app)    return <div className="p-10 text-center text-sm font-body" style={{ color: "var(--mid)" }}>Application not found. <Link href="/admin/applications" style={{ color: "var(--green)" }}>← Back</Link></div>;

  const stepIndex = STATUS_STEPS.indexOf(status);

  return (
    <div className="max-w-4xl space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/admin/applications" className="text-xs font-body flex items-center gap-1 mb-2" style={{ color: "var(--mid)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>Applications
          </Link>
          <h1 className="font-heading font-bold" style={{ fontSize: "1.4rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>{app.guest.firstName} {app.guest.lastName}</h1>
          <p className="text-xs font-mono mt-0.5" style={{ color: "var(--mid)" }}>{app.applicationRef}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Status progress */}
      <div className="rounded-xl p-5" style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}>
        <div className="flex items-center relative">
          <div className="absolute top-3.5 left-3.5 right-3.5 h-0.5" style={{ background: "rgba(26,74,46,0.10)", zIndex: 0 }} />
          {STATUS_STEPS.map((s, i) => {
            const done = i < stepIndex; const active = i === stepIndex;
            return (
              <div key={s} className="flex-1 flex flex-col items-center gap-1.5 relative z-10">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{ background: done ? "var(--green)" : active ? "var(--gold)" : "white", color: done ? "white" : active ? "var(--dark)" : "var(--mid)", border: done || active ? "none" : "1.5px solid rgba(26,74,46,0.15)" }}>
                  {done ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : i + 1}
                </div>
                <span className="text-xs font-body text-center hidden sm:block leading-tight" style={{ color: active ? "var(--dark)" : "var(--mid)", fontSize: "0.65rem", maxWidth: "60px" }}>{STATUS_LABELS[s]}</span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2 mt-5 pt-4" style={{ borderTop: "1px solid rgba(26,74,46,0.07)" }}>
          {status === "APPOINTMENT_SCHEDULED" && <button onClick={() => updateStatus("ARRIVED")} className="px-3 py-1.5 rounded-lg text-xs font-body font-medium" style={{ background: "rgba(16,185,129,0.10)", color: "#059669" }}>✓ Check In</button>}
          {status === "ARRIVED" && <button onClick={() => updateStatus("BIOMETRICS_CAPTURED")} className="px-3 py-1.5 rounded-lg text-xs font-body font-medium" style={{ background: "rgba(26,74,46,0.10)", color: "var(--green)" }}>✓ Biometrics Captured</button>}
          {status === "BIOMETRICS_CAPTURED" && <button onClick={() => updateStatus("NIN_PROCESSING")} className="px-3 py-1.5 rounded-lg text-xs font-body font-medium" style={{ background: "rgba(245,158,11,0.10)", color: "#d97706" }}>→ Send to Processing</button>}
          {(status === "APPOINTMENT_SCHEDULED" || status === "ARRIVED") && <button onClick={() => updateStatus("NO_SHOW")} className="px-3 py-1.5 rounded-lg text-xs font-body font-medium" style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}>Mark No-Show</button>}
          {status === "APPOINTMENT_SCHEDULED" && <button onClick={() => updateStatus("CANCELLED")} className="px-3 py-1.5 rounded-lg text-xs font-body font-medium" style={{ background: "rgba(107,114,128,0.08)", color: "#6b7280" }}>Cancel</button>}
          {saving && <span className="text-xs font-body" style={{ color: "var(--mid)" }}>Saving…</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Section title="Guest Information">
          <Row label="Name" value={`${app.guest.firstName} ${app.guest.lastName}`} />
          <Row label="Email" value={<a href={`mailto:${app.guest.email}`} style={{ color: "var(--green)" }}>{app.guest.email}</a>} />
          <Row label="Phone" value={app.guest.phone ?? "—"} />
          <Row label="No-Show Count" value={app.guest.noShowCount} />
        </Section>
        <Section title="Appointment">
          {app.appointment ? (
            <>
              <Row label="Date" value={formatDate(app.appointment.slotStart)} />
              <Row label="Time" value={formatSlotTime(app.appointment.slotStart)} />
              <Row label="Location" value={`${SITE.address.line1}, ${SITE.address.city}`} />
              <Row label="Arrived At" value={app.appointment.arrivedAt ? formatSlotTime(app.appointment.arrivedAt) : "—"} />
            </>
          ) : <p className="text-sm font-body" style={{ color: "var(--mid)" }}>No appointment scheduled.</p>}
        </Section>

        {/* Payment */}
        <Section title="Payment Verification">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-body font-medium inline-block"
              style={{ background: paymentStatus === "VERIFIED" ? "rgba(26,74,46,0.10)" : "rgba(245,158,11,0.10)", color: paymentStatus === "VERIFIED" ? "var(--green)" : "#d97706" }}>
              {paymentStatus === "VERIFIED" ? "✓ Verified" : "⏳ Pending"}
            </span>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1" style={{ color: "var(--mid)" }}>Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm font-body outline-none" style={{ border: "1px solid rgba(26,74,46,0.12)", background: "var(--cream)", color: "var(--dark)" }}>
                  <option value="CASH">Cash</option><option value="E_TRANSFER">E-Transfer</option><option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1" style={{ color: "var(--mid)" }}>Reference</label>
                <input type="text" value={paymentRef} onChange={e => setPaymentRef(e.target.value)} placeholder="e.g. ET-20260601-112"
                  className="w-full px-3 py-2 rounded-lg text-sm font-body outline-none" style={{ border: "1px solid rgba(26,74,46,0.12)", background: "var(--cream)", color: "var(--dark)" }} />
              </div>
              <button onClick={() => { setPaymentStatus("VERIFIED"); patchApp({ paymentStatus: "VERIFIED", paymentMethod, paymentReference: paymentRef }); }}
                className="w-full py-2 rounded-lg text-sm font-body font-medium" style={{ background: "var(--green)", color: "white" }}>
                Mark Payment Verified
              </button>
            </div>
          </div>
        </Section>

        {/* NIN */}
        <Section title="NIN Issuance">
          {status === "NIN_ISSUED" ? (
            <div className="p-4 rounded-lg text-center" style={{ background: "rgba(26,74,46,0.06)" }}>
              <p className="text-sm font-body font-medium" style={{ color: "var(--green)" }}>✓ NIN has been issued.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-body" style={{ color: "var(--mid)" }}>Enter the 11-digit NIN once issued by NIMC. Stored encrypted.</p>
              <input type="text" value={ninNumber} onChange={e => setNinNumber(e.target.value.replace(/\D/g,"").slice(0,11))} placeholder="11-digit NIN" maxLength={11}
                className="w-full px-3 py-2 rounded-lg text-sm font-body font-mono outline-none" style={{ border: "1px solid rgba(26,74,46,0.12)", background: "var(--cream)", color: "var(--dark)" }} />
              <button onClick={() => { if (ninNumber.length === 11) { setStatus("NIN_ISSUED"); patchApp({ status: "NIN_ISSUED", ninNumber }); } }}
                disabled={ninNumber.length !== 11}
                className="w-full py-2 rounded-lg text-sm font-body font-medium disabled:opacity-40"
                style={{ background: "var(--gold)", color: "var(--dark)" }}>Mark NIN Issued</button>
            </div>
          )}
        </Section>
      </div>

      <Section title="Documents">
        <DocumentsPanel applicationId={app.id} uploadedById="dev-super-admin" initialDocuments={app.documents ?? []} />
      </Section>

      <Section title="Internal Notes">
        <div className="space-y-3">
          {app.notes && <div className="p-3 rounded-lg text-sm font-body whitespace-pre-line" style={{ background: "var(--light)", color: "var(--dark)" }}>{app.notes}</div>}
          <div className="flex gap-2">
            <input type="text" value={noteInput} onChange={e => setNoteInput(e.target.value)} placeholder="Add an internal note…"
              className="flex-1 px-3 py-2 rounded-lg text-sm font-body outline-none" style={{ border: "1px solid rgba(26,74,46,0.12)", background: "var(--cream)", color: "var(--dark)" }} />
            <button onClick={() => { if (noteInput.trim()) { const updated = app.notes ? `${app.notes}\n${noteInput.trim()}` : noteInput.trim(); patchApp({ notes: updated }); setApp(a => a ? { ...a, notes: updated } : a); setNoteInput(""); } }}
              className="px-4 py-2 rounded-lg text-sm font-body font-medium" style={{ background: "var(--green)", color: "white" }}>Add</button>
          </div>
        </div>
      </Section>
    </div>
  );
}
