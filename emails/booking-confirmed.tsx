import { BaseEmail, EmailHeading, EmailBody, EmailInfoBox, EmailInfoRow, EmailButton, EmailRefBadge, EmailChecklist } from "./base";
import { SITE } from "@/lib/constants";

interface Props {
  guestName: string;
  applicationRef: string;
  appointmentDate: string;
  appointmentTime: string;
  googleCalendarUrl: string;
}

const DOCUMENTS = [
  "Valid or expired Nigerian passport",
  "Evidence of payment (receipt)",
  "Completed pre-enrollment form with 2D barcode (printed)",
  "Parent's passport (if enrolling a minor)",
];

export default function BookingConfirmedEmail({
  guestName,
  applicationRef,
  appointmentDate,
  appointmentTime,
  googleCalendarUrl,
}: Props) {
  return (
    <BaseEmail preview={`Your NIN appointment is confirmed — ${appointmentDate}`}>
      <EmailHeading>Appointment Confirmed</EmailHeading>
      <EmailBody>Dear {guestName},</EmailBody>
      <EmailBody>
        Your NIN enrollment appointment at Knowledge Square Brampton has been confirmed. Please arrive on time with all required documents.
      </EmailBody>

      <EmailRefBadge ref={applicationRef} />

      <EmailInfoBox>
        <EmailInfoRow label="Date" value={appointmentDate} />
        <EmailInfoRow label="Time" value={appointmentTime} />
        <EmailInfoRow label="Location" value={`${SITE.address.line1}, ${SITE.address.city}, Ontario`} />
        <EmailInfoRow label="Duration" value="30 minutes" />
      </EmailInfoBox>

      <EmailBody style={{ fontWeight: "600", color: "#0f2318" }}>
        What to bring:
      </EmailBody>
      <EmailChecklist items={DOCUMENTS} />

      <EmailButton href={googleCalendarUrl}>Add to Google Calendar</EmailButton>

      <EmailBody style={{ fontSize: "12px", color: "rgba(74,101,88,0.7)" }}>
        Walk-ins are not accepted. If you need to reschedule, please contact us at {SITE.email} as soon as possible.
      </EmailBody>
    </BaseEmail>
  );
}
