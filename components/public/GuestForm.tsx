"use client";

import { useState } from "react";
import { validateBookingForm, type BookingFormData } from "@/lib/booking";
import { formatSlotTime } from "@/lib/slots";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function formatDateDisplay(date: Date): string {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return `${days[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

interface Props {
  selectedDate: Date;
  selectedSlot: string;
  onSubmit: (data: BookingFormData) => Promise<void>;
  submitting: boolean;
  submitError: string | null;
}

interface FieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}

function Field({ label, id, type = "text", value, onChange, error, placeholder, required, hint }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-body font-medium uppercase tracking-wide mb-1.5"
        style={{ color: "var(--mid)" }}
      >
        {label}{required && <span style={{ color: "var(--gold)" }}> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={id}
        className="w-full px-3 py-2.5 rounded-md text-sm font-body outline-none transition-all"
        style={{
          border: error ? "1.5px solid #dc2626" : "1.5px solid rgba(26,74,46,0.15)",
          background: "var(--cream)",
          color: "var(--dark)",
        }}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs font-body mt-1" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs font-body mt-1" style={{ color: "var(--mid)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

export default function GuestForm({ selectedDate, selectedSlot, onSubmit, submitting, submitError }: Props) {
  const [form, setForm] = useState<BookingFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [touched, setTouched] = useState<Partial<Record<keyof BookingFormData, boolean>>>({});
  const [triedSubmit, setTriedSubmit] = useState(false);

  const errors = validateBookingForm(form);
  const visibleErrors = triedSubmit
    ? errors
    : Object.fromEntries(Object.entries(errors).filter(([k]) => touched[k as keyof BookingFormData]));

  function set(field: keyof BookingFormData) {
    return (value: string) => {
      setForm(f => ({ ...f, [field]: value }));
      setTouched(t => ({ ...t, [field]: true }));
    };
  }

  async function handleSubmit() {
    setTriedSubmit(true);
    if (Object.keys(errors).length > 0) return;
    await onSubmit(form);
  }

  return (
    <div className="w-full space-y-5">
      {/* Booking summary */}
      <div
        className="p-4 rounded-lg"
        style={{ background: "rgba(26,74,46,0.05)", border: "1px solid rgba(26,74,46,0.10)" }}
      >
        <p className="text-xs font-body font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--green)" }}>
          Your appointment
        </p>
        <div className="flex flex-col gap-1 text-sm font-body" style={{ color: "var(--dark)" }}>
          <span>📅 {formatDateDisplay(selectedDate)}</span>
          <span>🕐 {formatSlotTime(selectedSlot)}</span>
          <span>📍 {SITE.address.line1}, {SITE.address.city}</span>
        </div>
      </div>

      {/* Name row — stacked on xs, side-by-side on sm+ */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-4">
        <Field
          label="First Name" id="firstName" required
          value={form.firstName} onChange={set("firstName")}
          error={visibleErrors.firstName} placeholder="Ada"
        />
        <Field
          label="Last Name" id="lastName" required
          value={form.lastName} onChange={set("lastName")}
          error={visibleErrors.lastName} placeholder="Okafor"
        />
      </div>

      <Field
        label="Email Address" id="email" type="email" required
        value={form.email} onChange={set("email")}
        error={visibleErrors.email} placeholder="ada@example.com"
        hint="Your confirmation will be sent here"
      />

      <Field
        label="Phone Number" id="phone" type="tel" required
        value={form.phone} onChange={set("phone")}
        error={visibleErrors.phone} placeholder="+1 (416) 555-0100"
      />

      <div>
        <label
          htmlFor="notes"
          className="block text-xs font-body font-medium uppercase tracking-wide mb-1.5"
          style={{ color: "var(--mid)" }}
        >
          Notes <span className="normal-case font-normal">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          value={form.notes}
          onChange={e => set("notes")(e.target.value)}
          placeholder="e.g. I need form assistance, or I am enrolling a minor"
          className="w-full px-3 py-2.5 rounded-md text-sm font-body outline-none resize-none transition-all"
          style={{
            border: "1.5px solid rgba(26,74,46,0.15)",
            background: "var(--cream)",
            color: "var(--dark)",
          }}
        />
      </div>

      {submitError && (
        <div
          className="p-3 rounded-lg text-sm font-body"
          style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626" }}
        >
          {submitError}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-3.5 rounded-md font-body font-medium text-sm transition-all flex items-center justify-center gap-2"
        style={{
          background: submitting ? "rgba(201,151,58,0.6)" : "var(--gold)",
          color: "var(--dark)",
          cursor: submitting ? "not-allowed" : "pointer",
        }}
      >
        {submitting ? (
          <>
            <span
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "var(--dark)", borderTopColor: "transparent" }}
            />
            Confirming…
          </>
        ) : (
          "Confirm Booking"
        )}
      </button>

      <p className="text-xs font-body text-center leading-relaxed" style={{ color: "var(--mid)" }}>
        No account created. Your information is used only for this appointment.
      </p>
    </div>
  );
}
