"use client";

import { useState } from "react";
import AuditLogTable from "@/components/admin/AuditLogTable";
import { SITE } from "@/lib/constants";

const TABS = ["General", "Fees", "Booking", "Audit Log"] as const;
type Tab = typeof TABS[number];

interface Settings {
  senderName: string;
  newEnrollmentFee: number;
  bvnCompletionFee: number;
  formAssistanceFee: number;
  slotDuration: number;
  maxDailyAppointments: number;
  hoursWeekdays: string;
  hoursSaturday: string;
}

const INITIAL: Settings = {
  senderName: "Knowledge Square NIN Enrollment Center",
  newEnrollmentFee: SITE.fees.newEnrollment,
  bvnCompletionFee: SITE.fees.bvnCompletion,
  formAssistanceFee: 10,
  slotDuration: 30,
  maxDailyAppointments: 20,
  hoursWeekdays: "Monday – Friday: 9:00 AM – 5:00 PM",
  hoursSaturday: "Saturday: 10:00 AM – 3:00 PM",
};

function SettingRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-4" style={{ borderBottom: "1px solid rgba(26,74,46,0.06)" }}>
      <div className="sm:w-56 flex-shrink-0">
        <p className="text-sm font-body font-medium" style={{ color: "var(--dark)" }}>{label}</p>
        {hint && <p className="text-xs font-body mt-0.5" style={{ color: "var(--mid)" }}>{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("General");
  const [settings, setSettings] = useState<Settings>(INITIAL);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings(s => ({ ...s, [key]: value }));
    setSaved(false);
  }

  function save() {
    // TODO Phase 6 DB: persist to SystemSetting table via admin.updateSetting tRPC
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const inputStyle = {
    border: "1px solid rgba(26,74,46,0.15)",
    background: "var(--cream)",
    color: "var(--dark)",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "14px",
    fontFamily: "Outfit, sans-serif",
    outline: "none",
    width: "100%",
  } as React.CSSProperties;

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold" style={{ fontSize: "1.5rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>
          Settings
        </h1>
        {tab !== "Audit Log" && (
          <button
            onClick={save}
            className="px-5 py-2 rounded-lg text-sm font-body font-semibold flex items-center gap-2 transition-all"
            style={{
              background: saved ? "rgba(26,74,46,0.10)" : "var(--green)",
              color: saved ? "var(--green)" : "white",
            }}
          >
            {saved && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            {saved ? "Saved" : "Save Changes"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b" style={{ borderColor: "rgba(26,74,46,0.10)" }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2.5 text-sm font-body font-medium transition-colors"
            style={{
              color: tab === t ? "var(--green)" : "var(--mid)",
              borderBottom: tab === t ? "2px solid var(--green)" : "2px solid transparent",
              marginBottom: "-1px",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-xl p-6" style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}>

        {/* General */}
        {tab === "General" && (
          <div>
            <SettingRow label="Email Sender Name" hint="Appears in email From field">
              <input style={inputStyle} value={settings.senderName} onChange={e => set("senderName", e.target.value)} />
            </SettingRow>
            <SettingRow label="Weekday Hours Display" hint="Shown on public Location page">
              <input style={inputStyle} value={settings.hoursWeekdays} onChange={e => set("hoursWeekdays", e.target.value)} />
            </SettingRow>
            <SettingRow label="Saturday Hours Display">
              <input style={inputStyle} value={settings.hoursSaturday} onChange={e => set("hoursSaturday", e.target.value)} />
            </SettingRow>
            <SettingRow label="Domain" hint="Read-only">
              <input style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} value={SITE.domain} readOnly />
            </SettingRow>
          </div>
        )}

        {/* Fees */}
        {tab === "Fees" && (
          <div>
            <p className="text-xs font-body mb-5" style={{ color: "var(--mid)" }}>
              Fees are in Canadian dollars (CAD). Changes affect public site display and revenue calculations.
            </p>
            <SettingRow label="New Enrollment" hint="First-time NIN applicants">
              <div className="flex items-center gap-2">
                <span className="text-sm font-body" style={{ color: "var(--mid)" }}>$</span>
                <input
                  type="number" min={0} style={{ ...inputStyle, maxWidth: "120px" }}
                  value={settings.newEnrollmentFee}
                  onChange={e => set("newEnrollmentFee", Number(e.target.value))}
                />
                <span className="text-sm font-body" style={{ color: "var(--mid)" }}>CAD</span>
              </div>
            </SettingRow>
            <SettingRow label="BVN + NIN Completion" hint="For BVN holders completing NIN">
              <div className="flex items-center gap-2">
                <span className="text-sm font-body" style={{ color: "var(--mid)" }}>$</span>
                <input
                  type="number" min={0} style={{ ...inputStyle, maxWidth: "120px" }}
                  value={settings.bvnCompletionFee}
                  onChange={e => set("bvnCompletionFee", Number(e.target.value))}
                />
                <span className="text-sm font-body" style={{ color: "var(--mid)" }}>CAD</span>
              </div>
            </SettingRow>
            <SettingRow label="Form Assistance" hint="Staff-assisted form completion">
              <div className="flex items-center gap-2">
                <span className="text-sm font-body" style={{ color: "var(--mid)" }}>$</span>
                <input
                  type="number" min={0} style={{ ...inputStyle, maxWidth: "120px" }}
                  value={settings.formAssistanceFee}
                  onChange={e => set("formAssistanceFee", Number(e.target.value))}
                />
                <span className="text-sm font-body" style={{ color: "var(--mid)" }}>CAD</span>
              </div>
            </SettingRow>
          </div>
        )}

        {/* Booking */}
        {tab === "Booking" && (
          <div>
            <p className="text-xs font-body mb-5" style={{ color: "var(--mid)" }}>
              These settings affect slot generation. Changes take effect for new bookings only.
            </p>
            <SettingRow label="Slot Duration" hint="Minutes per appointment">
              <div className="flex items-center gap-2">
                <input
                  type="number" min={15} max={120} step={15} style={{ ...inputStyle, maxWidth: "100px" }}
                  value={settings.slotDuration}
                  onChange={e => set("slotDuration", Number(e.target.value))}
                />
                <span className="text-sm font-body" style={{ color: "var(--mid)" }}>minutes</span>
              </div>
            </SettingRow>
            <SettingRow label="Max Daily Appointments" hint="Hard cap per day across all slots">
              <input
                type="number" min={1} max={100} style={{ ...inputStyle, maxWidth: "100px" }}
                value={settings.maxDailyAppointments}
                onChange={e => set("maxDailyAppointments", Number(e.target.value))}
              />
            </SettingRow>
            <SettingRow label="Manage Schedule" hint="Toggle days and set hours">
              <a
                href="/admin/availability"
                className="text-sm font-body font-medium"
                style={{ color: "var(--green)" }}
              >
                Go to Availability settings →
              </a>
            </SettingRow>
          </div>
        )}

        {/* Audit Log */}
        {tab === "Audit Log" && (
          <div className="-mx-6 -mb-6 p-6 pt-0">
            <AuditLogTable />
          </div>
        )}
      </div>
    </div>
  );
}
