import { BaseEmail, EmailHeading, EmailBody, EmailRefBadge } from "./base";
import { SITE } from "@/lib/constants";

interface Props {
  guestName: string;
  applicationRef: string;
}

export default function BiometricsCapturedEmail({ guestName, applicationRef }: Props) {
  return (
    <BaseEmail preview="Your biometrics have been captured — NIN processing has begun">
      <EmailHeading>Biometrics Captured</EmailHeading>
      <EmailBody>Dear {guestName},</EmailBody>
      <EmailBody>
        Your biometric data has been successfully captured at Knowledge Square Brampton. Your information has been submitted to NIMC (National Identity Management Commission) for NIN processing.
      </EmailBody>

      <EmailRefBadge ref={applicationRef} />

      <EmailBody>
        Processing times vary. You will receive another email from us once your NIN has been issued and is ready for collection.
      </EmailBody>

      <EmailBody style={{ fontSize: "12px", color: "rgba(74,101,88,0.7)" }}>
        Questions about your NIN status? Contact us at {SITE.email} and quote your booking reference.
      </EmailBody>
    </BaseEmail>
  );
}
