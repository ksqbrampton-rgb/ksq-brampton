"use client";

import { buildGoogleCalendarUrl, buildIcsDataUri, buildAppointmentCalendarParams } from "@/lib/booking";
import { formatSlotTime } from "@/lib/slots";
import { SITE } from "@/lib/constants";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function formatDateDisplay(date: Date): string {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return `${days[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

interface Props {
  applicationRef: string;
  slotStart: string;
  guestName: string;
}

const DOCUMENTS_CHECKLIST = [
  "Valid or expired Nigerian passport",
  "Bank Verification Number (BVN)",
  "Completed pre-enrollment form (printed)",
  "Parent's passport (if enrolling a minor)",
];

export default function BookingConfirmation({ applicationRef, slotStart, guestName }: Props) {
  const slotDate = new Date(slotStart);
  const calParams = buildAppointmentCalendarParams(slotStart, applicationRef);
  const googleUrl = buildGoogleCalendarUrl(calParams);
  const icsUri = buildIcsDataUri(calParams);

  return (
    <div className="w-full space-y-6">
      {/* Success header */}
      <div className="text-center space-y-3">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
          style={{ background: "rgba(26,74,46,0.10)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--green)" }}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div>
          <h3
            className="font-heading font-bold"
            style={{ fontSize: "1.5rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}
          >
            Appointment Confirmed!
          </h3>
          <p className="text-sm font-body mt-1" style={{ color: "var(--mid)" }}>
            A confirmation email has been sent to your inbox.
          </p>
        </div>
      </div>

      {/* Reference number */}
      <div
        className="p-4 rounded-xl text-center"
        style={{ background: "var(--green)", color: "white" }}
      >
        <p className="text-xs font-body font-medium uppercase tracking-widest mb-1 opacity-70">
          Booking Reference
        </p>
        <p
          className="font-heading font-bold tracking-wide"
          style={{ fontSize: "1.4rem", fontFamily: "var(--font-cormorant)", color: "var(--gold2)" }}
        >
          {applicationRef}
        </p>
        <p className="text-xs font-body mt-1 opacity-60">Save this number for your records</p>
      </div>

      {/* Appointment details */}
      <div
        className="p-4 rounded-lg space-y-3"
        style={{ background: "var(--light)", border: "1px solid rgba(26,74,46,0.08)" }}
      >
        <p className="text-xs font-body font-semibold uppercase tracking-wide" style={{ color: "var(--green)" }}>
          Appointment Details
        </p>
        {[
          { icon: "👤", label: "Name", value: guestName },
          { icon: "📅", label: "Date", value: formatDateDisplay(slotDate) },
          { icon: "🕐", label: "Time", value: formatSlotTime(slotStart) },
          { icon: "📍", label: "Location", value: `${SITE.address.line1}, ${SITE.address.city}, ${SITE.address.province}` },
        ].map(item => (
          <div key={item.label} className="flex gap-3 text-sm font-body">
            <span>{item.icon}</span>
            <div>
              <span className="font-medium" style={{ color: "var(--dark)" }}>{item.label}: </span>
              <span style={{ color: "var(--mid)" }}>{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add to calendar */}
      <div className="grid grid-cols-2 gap-3">
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-body font-medium transition-all hover:opacity-80"
          style={{ background: "var(--green)", color: "white" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Google Calendar
        </a>
        <a
          href={icsUri}
          download={`KSQ-NIN-${applicationRef}.ics`}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-body font-medium transition-all hover:opacity-80"
          style={{ background: "rgba(26,74,46,0.08)", color: "var(--green)", border: "1px solid rgba(26,74,46,0.15)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Apple / Outlook
        </a>
      </div>

      {/* Documents reminder */}
      <div
        className="p-4 rounded-lg"
        style={{ borderLeft: "4px solid var(--gold)", background: "rgba(201,151,58,0.06)" }}
      >
        <p className="text-xs font-body font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--dark)" }}>
          What to bring
        </p>
        <ul className="space-y-1.5">
          {DOCUMENTS_CHECKLIST.map(doc => (
            <li key={doc} className="flex items-start gap-2 text-xs font-body" style={{ color: "var(--mid)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--green)", flexShrink: 0, marginTop: "2px" }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {doc}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs font-body text-center leading-relaxed" style={{ color: "var(--mid)" }}>
        Questions? Email{" "}
        <a href={`mailto:${SITE.email}`} className="underline" style={{ color: "var(--green)" }}>
          {SITE.email}
        </a>
      </p>
    </div>
  );
}
