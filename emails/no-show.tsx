import { BaseEmail, EmailHeading, EmailBody, EmailInfoBox, EmailInfoRow, EmailButton } from "./base";
import { SITE } from "@/lib/constants";

interface Props {
  guestName: string;
  appointmentDate: string;
  appointmentTime: string;
  rebookUrl: string;
}

export default function NoShowEmail({ guestName, appointmentDate, appointmentTime, rebookUrl }: Props) {
  return (
    <BaseEmail preview="You missed your NIN appointment — rebook here">
      <EmailHeading>Missed Appointment</EmailHeading>
      <EmailBody>Dear {guestName},</EmailBody>
      <EmailBody>
        We noticed you were unable to attend your NIN enrollment appointment at Knowledge Square Brampton. We understand that things come up.
      </EmailBody>

      <EmailInfoBox>
        <EmailInfoRow label="Missed Appointment" value={`${appointmentDate} at ${appointmentTime}`} />
        <EmailInfoRow label="Location" value={`${SITE.address.line1}, ${SITE.address.city}`} />
      </EmailInfoBox>

      <EmailBody>
        You can rebook at any available time using the link below. Please note that repeated no-shows may result in booking restrictions.
      </EmailBody>

      <EmailButton href={rebookUrl}>Book a New Appointment</EmailButton>

      <EmailBody style={{ fontSize: "12px", color: "rgba(74,101,88,0.7)" }}>
        If you had an emergency or need to discuss your booking, contact us at {SITE.email}.
      </EmailBody>
    </BaseEmail>
  );
}
