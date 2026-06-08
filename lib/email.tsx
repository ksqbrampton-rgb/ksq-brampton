import { Resend } from "resend";
import { render } from "@react-email/components";
import { SITE } from "./constants";
import { buildGoogleCalendarUrl, buildAppointmentCalendarParams } from "./booking";
import { db } from "./db";

// Initialise lazily so env vars are always available at call time
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

function getFrom() {
  return process.env.EMAIL_FROM ?? `info@${SITE.domain}`;
}

const MANAGER_EMAIL = process.env.EMAIL_FROM ?? `info@${SITE.domain}`;

interface EmailMeta { eventType: string; guestId?: string; applicationId?: string; }

async function send(to: string, subject: string, template: React.ReactElement, meta: EmailMeta) {
  const html = await render(template);
  const resend = getResend();
  const { data, error } = await resend.emails.send({ from: getFrom(), to, subject, html });
  if (error) {
    console.error("[email] Send error:", JSON.stringify(error));
    throw new Error(`Email send failed: ${error.message}`);
  }
  console.log("[email] Sent successfully:", data?.id, "→", to);

  try {
    await db.emailLog.create({
      data: {
        guestId: meta.guestId ?? null,
        applicationId: meta.applicationId ?? null,
        eventType: meta.eventType,
        subject,
        resendId: data?.id ?? null,
        sentAt: new Date(),
      },
    });
  } catch (logErr) {
    console.error("[email] EmailLog write failed:", logErr);
  }
}

// ─── Booking Confirmed ─────────────────────────────────────

export async function sendBookingConfirmed(params: {
  to: string;
  guestName: string;
  applicationRef: string;
  appointmentDate: string;
  appointmentTime: string;
  slotIso: string;
  guestId?: string;
  applicationId?: string;
}) {
  const { default: Template } = await import("@/emails/booking-confirmed");
  const calParams = buildAppointmentCalendarParams(params.slotIso, params.applicationRef);
  const googleCalendarUrl = buildGoogleCalendarUrl(calParams);
  await send(
    params.to,
    `Your NIN Appointment is Confirmed — ${params.appointmentDate}`,
    <Template
      guestName={params.guestName}
      applicationRef={params.applicationRef}
      appointmentDate={params.appointmentDate}
      appointmentTime={params.appointmentTime}
      googleCalendarUrl={googleCalendarUrl}
    />,
    { eventType: "BOOKING_CONFIRMED", guestId: params.guestId, applicationId: params.applicationId }
  );
}

// ─── Booking Cancelled ─────────────────────────────────────

export async function sendBookingCancelled(params: {
  to: string;
  guestName: string;
  appointmentDate: string;
  appointmentTime: string;
}) {
  const { default: Template } = await import("@/emails/booking-cancelled");
  const rebookUrl = `https://${SITE.domain}/book`;
  await send(
    params.to,
    "Your NIN Appointment Was Cancelled",
    <Template
      guestName={params.guestName}
      appointmentDate={params.appointmentDate}
      appointmentTime={params.appointmentTime}
      rebookUrl={rebookUrl}
    />,
    { eventType: "BOOKING_CANCELLED" }
  );
}

// ─── Booking Rescheduled ───────────────────────────────────

export async function sendBookingRescheduled(params: {
  to: string;
  guestName: string;
  applicationRef: string;
  newDate: string;
  newTime: string;
  oldDate: string;
  oldTime: string;
}) {
  const { default: Template } = await import("@/emails/booking-rescheduled");
  await send(
    params.to,
    "Your NIN Appointment Has Been Rescheduled",
    <Template
      guestName={params.guestName}
      applicationRef={params.applicationRef}
      newDate={params.newDate}
      newTime={params.newTime}
      oldDate={params.oldDate}
      oldTime={params.oldTime}
    />,
    { eventType: "BOOKING_RESCHEDULED" }
  );
}

// ─── Reminder 48h ─────────────────────────────────────────

export async function sendReminder48h(params: {
  to: string;
  guestName: string;
  applicationRef: string;
  appointmentDate: string;
  appointmentTime: string;
}) {
  const { default: Template } = await import("@/emails/reminder-48h");
  await send(
    params.to,
    `Reminder: NIN Appointment in 2 Days — ${params.appointmentDate}`,
    <Template
      guestName={params.guestName}
      applicationRef={params.applicationRef}
      appointmentDate={params.appointmentDate}
      appointmentTime={params.appointmentTime}
    />,
    { eventType: "REMINDER_48H" }
  );
}

// ─── Reminder 2h ──────────────────────────────────────────

export async function sendReminder2h(params: {
  to: string;
  guestName: string;
  applicationRef: string;
  appointmentDate: string;
  appointmentTime: string;
}) {
  const { default: Template } = await import("@/emails/reminder-2h");
  await send(
    params.to,
    `Your NIN Appointment is in 2 Hours — ${SITE.address.line1}, ${SITE.address.city}`,
    <Template
      guestName={params.guestName}
      applicationRef={params.applicationRef}
      appointmentDate={params.appointmentDate}
      appointmentTime={params.appointmentTime}
    />,
    { eventType: "REMINDER_2H" }
  );
}

// ─── No Show ──────────────────────────────────────────────

export async function sendNoShow(params: {
  to: string;
  guestName: string;
  appointmentDate: string;
  appointmentTime: string;
}) {
  const { default: Template } = await import("@/emails/no-show");
  const rebookUrl = `https://${SITE.domain}/book`;
  await send(
    params.to,
    "You Missed Your NIN Appointment — Rebook Here",
    <Template
      guestName={params.guestName}
      appointmentDate={params.appointmentDate}
      appointmentTime={params.appointmentTime}
      rebookUrl={rebookUrl}
    />,
    { eventType: "NO_SHOW" }
  );
}

// ─── Biometrics Captured ──────────────────────────────────

export async function sendBiometricsCaptured(params: {
  to: string;
  guestName: string;
  applicationRef: string;
}) {
  const { default: Template } = await import("@/emails/biometrics-captured");
  await send(
    params.to,
    "Biometrics Captured — Your NIN is Being Processed",
    <Template guestName={params.guestName} applicationRef={params.applicationRef} />,
    { eventType: "BIOMETRICS_CAPTURED" }
  );
}

// ─── NIN Issued ───────────────────────────────────────────

export async function sendNinIssued(params: {
  to: string;
  guestName: string;
  applicationRef: string;
}) {
  const { default: Template } = await import("@/emails/nin-issued");
  await send(
    params.to,
    "Your NIN is Ready — Collection Instructions",
    <Template guestName={params.guestName} applicationRef={params.applicationRef} />,
    { eventType: "NIN_ISSUED" }
  );
}

// ─── Contact Form ─────────────────────────────────────────

export async function sendContactFormEmails(params: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const { default: GuestTemplate } = await import("@/emails/contact-form-guest");
  const { default: ManagerTemplate } = await import("@/emails/contact-form-manager");
  const submittedAt = new Date().toLocaleString("en-CA", { timeZone: "America/Toronto" });

  await Promise.all([
    send(params.email, "We Received Your Message — Knowledge Square", <GuestTemplate name={params.name} message={params.message} />, { eventType: "CONTACT_FORM_GUEST" }),
    send(MANAGER_EMAIL, `New Contact Form: ${params.name}`, <ManagerTemplate {...params} submittedAt={submittedAt} />, { eventType: "CONTACT_FORM_MANAGER" }),
  ]);
}
