import { BaseEmail, EmailHeading, EmailBody, EmailInfoBox, EmailInfoRow, EmailRefBadge, EmailChecklist } from "./base";
import { SITE } from "@/lib/constants";

interface Props {
  guestName: string;
  applicationRef: string;
  appointmentDate: string;
  appointmentTime: string;
}

const DOCUMENTS = [
  "Valid or expired Nigerian passport",
  "Evidence of payment (receipt)",
  "Completed pre-enrollment form with 2D barcode (printed)",
  "Parent's passport (if enrolling a minor)",
];

export default function Reminder48hEmail({ guestName, applicationRef, appointmentDate, appointmentTime }: Props) {
  return (
    <BaseEmail preview={`Reminder: NIN appointment in 2 days — ${appointmentDate}`}>
      <EmailHeading>Appointment in 2 Days</EmailHeading>
      <EmailBody>Dear {guestName},</EmailBody>
      <EmailBody>
        This is a reminder that your NIN enrollment appointment at Knowledge Square Brampton is in <strong>2 days</strong>. Please ensure you have all required documents ready.
      </EmailBody>

      <EmailRefBadge ref={applicationRef} />

      <EmailInfoBox>
        <EmailInfoRow label="Date" value={appointmentDate} />
        <EmailInfoRow label="Time" value={appointmentTime} />
        <EmailInfoRow label="Location" value={`${SITE.address.line1}, ${SITE.address.city}, Ontario`} />
      </EmailInfoBox>

      <EmailBody style={{ fontWeight: "600", color: "#0f2318" }}>Documents checklist:</EmailBody>
      <EmailChecklist items={DOCUMENTS} />

      <EmailBody style={{ fontSize: "12px", color: "rgba(74,101,88,0.7)" }}>
        Need to reschedule? Contact us at {SITE.email} at least 24 hours before your appointment.
      </EmailBody>
    </BaseEmail>
  );
}
