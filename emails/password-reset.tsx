import { BaseEmail, EmailHeading, EmailBody, EmailButton } from "./base";

interface Props {
  name: string;
  resetUrl: string;
}

export default function PasswordResetEmail({ name, resetUrl }: Props) {
  return (
    <BaseEmail preview="Reset your Knowledge Square staff portal password">
      <EmailHeading>Reset Your Password</EmailHeading>
      <EmailBody>Hi {name},</EmailBody>
      <EmailBody>
        We received a request to reset the password for your Knowledge Square staff portal account. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
      </EmailBody>

      <EmailButton href={resetUrl}>Reset Password</EmailButton>

      <EmailBody style={{ fontSize: "12px", color: "rgba(74,101,88,0.7)" }}>
        If you did not request a password reset, you can safely ignore this email. Your password will not be changed.
      </EmailBody>
    </BaseEmail>
  );
}
