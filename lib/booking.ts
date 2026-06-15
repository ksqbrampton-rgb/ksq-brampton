import { SITE } from "./constants";

/**
 * Generate a booking reference number.
 * Format: KSQ-BPT-YYYYMMDD-XXXX
 */
export function generateBookingRef(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
  return `KSQ-BPT-${datePart}-${randomPart}`;
}

/**
 * Build a Google Calendar "Add Event" URL (no API needed — just query params).
 */
export function buildGoogleCalendarUrl(params: {
  title: string;
  startIso: string;
  durationMinutes: number;
  location: string;
  description: string;
}): string {
  const start = new Date(params.startIso);
  const end = new Date(start.getTime() + params.durationMinutes * 60 * 1000);

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const qs = new URLSearchParams({
    action: "TEMPLATE",
    text: params.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    location: params.location,
    details: params.description,
  });

  return `https://calendar.google.com/calendar/render?${qs.toString()}`;
}

/**
 * Build an .ics file data URI for Apple Calendar / Outlook.
 */
export function buildIcsDataUri(params: {
  title: string;
  startIso: string;
  durationMinutes: number;
  location: string;
  description: string;
  uid: string;
}): string {
  const start = new Date(params.startIso);
  const end = new Date(start.getTime() + params.durationMinutes * 60 * 1000);

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z/, "Z");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Knowledge Square//NIN Booking//EN",
    "BEGIN:VEVENT",
    `UID:${params.uid}@ksqbrampton.ca`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${params.title}`,
    `LOCATION:${params.location}`,
    `DESCRIPTION:${params.description.replace(/\n/g, "\\n")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

/**
 * Build calendar event params for a KSQ appointment.
 */
export function buildAppointmentCalendarParams(slotIso: string, ref: string) {
  return {
    title: "NIN Enrollment Appointment — Knowledge Square",
    startIso: slotIso,
    durationMinutes: 30,
    location: `${SITE.address.line1}, ${SITE.address.city}, ${SITE.address.province}, Canada`,
    description: [
      `Booking Reference: ${ref}`,
      "",
      "Please bring:",
      "• Valid or expired Nigerian passport",
      "• Bank Verification Number (BVN)",
      "• Completed pre-enrollment form (printed)",
      "",
      `Questions? Email ${SITE.email}`,
    ].join("\n"),
    uid: ref,
  };
}

/**
 * Zod-compatible input validation types (shared between client + server).
 * Phase 3: import zod and use .parse() on the API route.
 */
export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

export interface BookingPayload extends BookingFormData {
  slotStart: string; // ISO string
}

export interface BookingResult {
  success: true;
  applicationRef: string;
  slotStart: string;
  guestName: string;
}

export function validateBookingForm(data: Partial<BookingFormData>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.firstName?.trim()) errors.firstName = "First name is required";
  if (!data.lastName?.trim()) errors.lastName = "Last name is required";

  if (!data.email?.trim()) {
    errors.email = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.phone?.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[\d\s\+\-\(\)]{7,20}$/.test(data.phone.trim())) {
    errors.phone = "Please enter a valid phone number";
  }

  return errors;
}
