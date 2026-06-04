import { BaseEmail, EmailHeading, EmailBody, EmailInfoBox, EmailInfoRow } from "./base";

interface Props {
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: string;
}

export default function ContactFormManagerEmail({ name, email, phone, message, submittedAt }: Props) {
  return (
    <BaseEmail preview={`New contact form submission from ${name}`}>
      <EmailHeading>New Contact Form Submission</EmailHeading>
      <EmailBody>A new message has been submitted via the contact form on ksqbrampton.ca.</EmailBody>

      <EmailInfoBox>
        <EmailInfoRow label="Name" value={name} />
        <EmailInfoRow label="Email" value={email} />
        {phone && <EmailInfoRow label="Phone" value={phone} />}
        <EmailInfoRow label="Submitted" value={submittedAt} />
      </EmailInfoBox>

      <EmailBody style={{ fontWeight: "600", color: "#0f2318" }}>Message:</EmailBody>
      <EmailBody style={{ fontSize: "13px", fontStyle: "italic", borderLeft: "3px solid #c9973a", paddingLeft: "12px" }}>
        &ldquo;{message}&rdquo;
      </EmailBody>

      <EmailBody style={{ fontSize: "12px", color: "rgba(74,101,88,0.7)" }}>
        Reply directly to this email or contact the guest at {email}.
      </EmailBody>
    </BaseEmail>
  );
}
