import { BaseEmail, EmailHeading, EmailBody, EmailInfoBox, EmailInfoRow, EmailButton } from "./base";
import { SITE } from "@/lib/constants";

interface Props {
  guestName: string;
  appointmentDate: string;
  appointmentTime: string;
  rebookUrl: string;
}

export default function BookingCancelledEmail({ guestName, appointmentDate, appointmentTime, rebookUrl }: Props) {
  return (
    <BaseEmail preview="Your NIN appointment has been cancelled">
      <EmailHeading>Appointment Cancelled</EmailHeading>
      <EmailBody>Dear {guestName},</EmailBody>
      <EmailBody>
        Your NIN enrollment appointment at Knowledge Square Brampton has been cancelled.
      </EmailBody>

      <EmailInfoBox>
        <EmailInfoRow label="Cancelled Appointment" value={`${appointmentDate} at ${appointmentTime}`} />
        <EmailInfoRow label="Location" value={`${SITE.address.line1}, ${SITE.address.city}`} />
      </EmailInfoBox>

      <EmailBody>
        You are welcome to rebook at any available time using the link below.
      </EmailBody>

      <EmailButton href={rebookUrl}>Book a New Appointment</EmailButton>

      <EmailBody style={{ fontSize: "12px", color: "rgba(74,101,88,0.7)" }}>
        If you have questions, contact us at {SITE.email}.
      </EmailBody>
    </BaseEmail>
  );
}
