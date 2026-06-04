import { BaseEmail, EmailHeading, EmailBody } from "./base";
import { SITE } from "@/lib/constants";

interface Props {
  name: string;
  message: string;
}

export default function ContactFormGuestEmail({ name, message }: Props) {
  return (
    <BaseEmail preview="We received your message — Knowledge Square">
      <EmailHeading>We Received Your Message</EmailHeading>
      <EmailBody>Dear {name},</EmailBody>
      <EmailBody>
        Thank you for contacting Knowledge Square NIN Enrollment Center. We have received your message and will respond within 1–2 business days.
      </EmailBody>
      <EmailBody style={{ fontSize: "12px", color: "rgba(74,101,88,0.7)", fontStyle: "italic", borderLeft: "3px solid #c9973a", paddingLeft: "12px" }}>
        &ldquo;{message}&rdquo;
      </EmailBody>
      <EmailBody>
        For urgent matters, you can reach us directly at{" "}
        <a href={`mailto:${SITE.email}`} style={{ color: "#1a4a2e" }}>{SITE.email}</a>.
      </EmailBody>
    </BaseEmail>
  );
}
