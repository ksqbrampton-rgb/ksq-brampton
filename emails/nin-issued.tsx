import { BaseEmail, EmailHeading, EmailBody, EmailInfoBox, EmailInfoRow, EmailRefBadge } from "./base";
import { SITE } from "@/lib/constants";

interface Props {
  guestName: string;
  applicationRef: string;
  maskedNin: string;
  issuedDate: string;
}

export default function NinIssuedEmail({ guestName, applicationRef, maskedNin, issuedDate }: Props) {
  return (
    <BaseEmail preview="Your NIN has been issued — collection instructions inside">
      <EmailHeading>Your NIN is Ready</EmailHeading>
      <EmailBody>Dear {guestName},</EmailBody>
      <EmailBody>
        Congratulations! Your Nigerian National Identification Number (NIN) has been issued by NIMC. Please contact us to arrange collection of your NIN slip.
      </EmailBody>

      <EmailRefBadge ref={applicationRef} />

      <EmailInfoBox>
        <EmailInfoRow label="NIN (masked)" value={maskedNin} />
        <EmailInfoRow label="Date Issued" value={issuedDate} />
        <EmailInfoRow label="Collection Address" value={`${SITE.address.line1}, ${SITE.address.city}, Ontario`} />
        <EmailInfoRow label="Hours (Mon–Fri)" value="9:00 AM – 5:00 PM" />
        <EmailInfoRow label="Hours (Saturday)" value="10:00 AM – 3:00 PM" />
        <EmailInfoRow label="Contact" value={SITE.email} />
      </EmailInfoBox>

      <EmailBody>
        For your security, only part of your NIN is shown here. Your full NIN slip will be handed to you when you collect it in person — please bring a valid ID and quote your booking reference.
      </EmailBody>

      <EmailBody style={{ fontSize: "12px", color: "rgba(74,101,88,0.7)" }}>
        If you require your NIN slip to be shipped, please contact us at {SITE.email}.
      </EmailBody>
    </BaseEmail>
  );
}
