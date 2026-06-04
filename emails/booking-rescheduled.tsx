import { BaseEmail, EmailHeading, EmailBody, EmailInfoBox, EmailInfoRow, EmailRefBadge } from "./base";
import { SITE } from "@/lib/constants";

interface Props {
  guestName: string;
  applicationRef: string;
  newDate: string;
  newTime: string;
  oldDate: string;
  oldTime: string;
}

export default function BookingRescheduledEmail({ guestName, applicationRef, newDate, newTime, oldDate, oldTime }: Props) {
  return (
    <BaseEmail preview={`Your NIN appointment has been rescheduled to ${newDate}`}>
      <EmailHeading>Appointment Rescheduled</EmailHeading>
      <EmailBody>Dear {guestName},</EmailBody>
      <EmailBody>
        Your NIN enrollment appointment has been rescheduled. Please note the new date and time below.
      </EmailBody>

      <EmailRefBadge ref={applicationRef} />

      <EmailInfoBox>
        <EmailInfoRow label="New Date" value={newDate} />
        <EmailInfoRow label="New Time" value={newTime} />
        <EmailInfoRow label="Previous Date" value={`${oldDate} at ${oldTime}`} />
        <EmailInfoRow label="Location" value={`${SITE.address.line1}, ${SITE.address.city}, Ontario`} />
      </EmailInfoBox>

      <EmailBody style={{ fontSize: "12px", color: "rgba(74,101,88,0.7)" }}>
        If this rescheduled time does not work for you, please contact us at {SITE.email}.
      </EmailBody>
    </BaseEmail>
  );
}
