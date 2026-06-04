import { BaseEmail, EmailHeading, EmailBody, EmailInfoBox, EmailInfoRow, EmailRefBadge } from "./base";
import { SITE } from "@/lib/constants";

interface Props {
  guestName: string;
  applicationRef: string;
  appointmentDate: string;
  appointmentTime: string;
}

export default function Reminder2hEmail({ guestName, applicationRef, appointmentDate, appointmentTime }: Props) {
  return (
    <BaseEmail preview={`Your NIN appointment is in 2 hours — ${appointmentTime}`}>
      <EmailHeading>Your Appointment is in 2 Hours</EmailHeading>
      <EmailBody>Dear {guestName},</EmailBody>
      <EmailBody>
        Your NIN enrollment appointment at Knowledge Square Brampton is starting in <strong>2 hours</strong>. Please make your way to us now.
      </EmailBody>

      <EmailRefBadge ref={applicationRef} />

      <EmailInfoBox>
        <EmailInfoRow label="Today" value={appointmentDate} />
        <EmailInfoRow label="Time" value={appointmentTime} />
        <EmailInfoRow label="Address" value={`${SITE.address.line1}, ${SITE.address.city}, Ontario`} />
      </EmailInfoBox>

      <EmailBody>
        Remember to bring your Nigerian passport, payment receipt, and printed pre-enrollment form with 2D barcode.
      </EmailBody>

      <EmailBody style={{ fontSize: "12px", color: "rgba(74,101,88,0.7)" }}>
        Running late? Please call ahead or email {SITE.email}.
      </EmailBody>
    </BaseEmail>
  );
}
