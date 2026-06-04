"use client";

import { useState } from "react";

interface DayConfig {
  day: string;
  label: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

const INITIAL_SCHEDULE: DayConfig[] = [
  { day: "MONDAY",    label: "Monday",    isOpen: true,  openTime: "09:00", closeTime: "17:00" },
  { day: "TUESDAY",   label: "Tuesday",   isOpen: true,  openTime: "09:00", closeTime: "17:00" },
  { day: "WEDNESDAY", label: "Wednesday", isOpen: true,  openTime: "09:00", closeTime: "17:00" },
  { day: "THURSDAY",  label: "Thursday",  isOpen: true,  openTime: "09:00", closeTime: "17:00" },
  { day: "FRIDAY",    label: "Friday",    isOpen: true,  openTime: "09:00", closeTime: "17:00" },
  { day: "SATURDAY",  label: "Saturday",  isOpen: true,  openTime: "10:00", closeTime: "15:00" },
  { day: "SUNDAY",    label: "Sunday",    isOpen: false, openTime: "10:00", closeTime: "15:00" },
];

interface DateException {
  id: string;
  date: string;
  isClosed: boolean;
  reason: string;
  openTime?: string;
  closeTime?: string;
}

const INITIAL_EXCEPTIONS: DateException[] = [
  { id: "exc-1", date: "2026-07-01", isClosed: true, reason: "Canada Day" },
  { id: "exc-2", date: "2026-08-03", isClosed: true, reason: "Civic Holiday" },
];

function formatExceptionDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-CA", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
}

export default function AvailabilityPage() {
  const [schedule, setSchedule] = useState<DayConfig[]>(INITIAL_SCHEDULE);
  const [exceptions, setExceptions] = useState<DateException[]>(INITIAL_EXCEPTIONS);
  const [saved, setSaved] = useState(false);

  // New exception form
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const [newClosed, setNewClosed] = useState(true);

  function toggleDay(index: number) {
    setSchedule(s => s.map((d, i) => i === index ? { ...d, isOpen: !d.isOpen } : d));
    setSaved(false);
  }

  function updateDayTime(index: number, field: "openTime" | "closeTime", value: string) {
    setSchedule(s => s.map((d, i) => i === index ? { ...d, [field]: value } : d));
    setSaved(false);
  }

  function addException() {
    if (!newDate || !newReason) return;
    setExceptions(e => [
      ...e,
      { id: `exc-${Date.now()}`, date: newDate, isClosed: newClosed, reason: newReason },
    ]);
    setNewDate("");
    setNewReason("");
    setNewClosed(true);
  }

  function removeException(id: string) {
    setExceptions(e => e.filter(ex => ex.id !== id));
  }

  function save() {
    // TODO Phase 3 DB: persist to AvailabilityTemplate + DateException tables
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
    return (
      <div className="rounded-xl p-6" style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}>
        <div className="mb-5 pb-4" style={{ borderBottom: "1px solid rgba(26,74,46,0.07)" }}>
          <h3 className="font-heading font-semibold" style={{ fontSize: "1.05rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>
            {title}
          </h3>
          {subtitle && <p className="text-xs font-body mt-0.5" style={{ color: "var(--mid)" }}>{subtitle}</p>}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold" style={{ fontSize: "1.5rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>
          Availability
        </h1>
        <button
          onClick={save}
          className="px-5 py-2 rounded-lg text-sm font-body font-semibold transition-all flex items-center gap-2"
          style={{ background: saved ? "rgba(26,74,46,0.10)" : "var(--green)", color: saved ? "var(--green)" : "white" }}
        >
          {saved ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Saved
            </>
          ) : "Save Changes"}
        </button>
      </div>

      {/* Weekly schedule */}
      <Section title="Weekly Schedule" subtitle="Set which days and hours appointments are available">
        <div className="space-y-2">
          {schedule.map((day, i) => (
            <div key={day.day} className="flex items-center gap-4 py-3 rounded-lg px-3 transition-colors" style={{ background: day.isOpen ? "rgba(26,74,46,0.03)" : "transparent" }}>
              {/* Toggle */}
              <button
                onClick={() => toggleDay(i)}
                className="relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0"
                style={{
                  background: day.isOpen ? "var(--green)" : "rgba(107,114,128,0.25)",
                  width: "40px",
                  height: "22px",
                }}
                aria-checked={day.isOpen}
                role="switch"
              >
                <span
                  className="absolute top-0.5 rounded-full bg-white transition-all duration-200"
                  style={{
                    width: "18px",
                    height: "18px",
                    left: day.isOpen ? "20px" : "2px",
                  }}
                />
              </button>

              {/* Day label */}
              <span className="text-sm font-body font-medium w-28 flex-shrink-0" style={{ color: day.isOpen ? "var(--dark)" : "var(--mid)" }}>
                {day.label}
              </span>

              {/* Time inputs */}
              {day.isOpen ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="time"
                    value={day.openTime}
                    onChange={e => updateDayTime(i, "openTime", e.target.value)}
                    className="px-2 py-1 rounded text-sm font-body outline-none"
                    style={{ border: "1px solid rgba(26,74,46,0.15)", background: "white", color: "var(--dark)" }}
                  />
                  <span className="text-xs font-body" style={{ color: "var(--mid)" }}>to</span>
                  <input
                    type="time"
                    value={day.closeTime}
                    onChange={e => updateDayTime(i, "closeTime", e.target.value)}
                    className="px-2 py-1 rounded text-sm font-body outline-none"
                    style={{ border: "1px solid rgba(26,74,46,0.15)", background: "white", color: "var(--dark)" }}
                  />
                </div>
              ) : (
                <span className="text-xs font-body" style={{ color: "var(--mid)" }}>Closed</span>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Date exceptions */}
      <Section title="Date Exceptions" subtitle="Override the weekly schedule for specific dates (holidays, closures)">
        {/* Existing exceptions */}
        {exceptions.length > 0 && (
          <div className="space-y-2 mb-5">
            {exceptions.map(ex => (
              <div key={ex.id} className="flex items-center justify-between gap-3 p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)" }}>
                <div>
                  <p className="text-sm font-body font-medium" style={{ color: "var(--dark)" }}>
                    {formatExceptionDate(ex.date)}
                  </p>
                  <p className="text-xs font-body" style={{ color: "var(--mid)" }}>
                    {ex.isClosed ? "Closed" : `Special hours: ${ex.openTime} – ${ex.closeTime}`} · {ex.reason}
                  </p>
                </div>
                <button
                  onClick={() => removeException(ex.id)}
                  className="p-1.5 rounded transition-colors"
                  style={{ color: "#dc2626" }}
                  aria-label="Remove exception"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add new exception */}
        <div className="p-4 rounded-lg space-y-3" style={{ background: "var(--light)", border: "1px solid rgba(26,74,46,0.08)" }}>
          <p className="text-xs font-body font-semibold uppercase tracking-wide" style={{ color: "var(--green)" }}>Add Exception</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1" style={{ color: "var(--mid)" }}>Date</label>
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm font-body outline-none"
                style={{ border: "1px solid rgba(26,74,46,0.12)", background: "white", color: "var(--dark)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1" style={{ color: "var(--mid)" }}>Reason</label>
              <input
                type="text"
                value={newReason}
                onChange={e => setNewReason(e.target.value)}
                placeholder="e.g. Canada Day"
                className="w-full px-3 py-2 rounded-lg text-sm font-body outline-none"
                style={{ border: "1px solid rgba(26,74,46,0.12)", background: "white", color: "var(--dark)" }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newClosed}
                onChange={e => setNewClosed(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-body" style={{ color: "var(--dark)" }}>Full closure</span>
            </label>
          </div>
          <button
            onClick={addException}
            disabled={!newDate || !newReason}
            className="px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors disabled:opacity-40"
            style={{ background: "var(--green)", color: "white" }}
          >
            Add Exception
          </button>
        </div>
      </Section>
    </div>
  );
}
