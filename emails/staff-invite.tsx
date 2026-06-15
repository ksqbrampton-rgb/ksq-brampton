import { BaseEmail, EmailHeading, EmailBody, EmailButton } from "./base";

interface Props {
  name: string;
  role: string;
  inviteUrl: string;
}

export default function StaffInviteEmail({ name, role, inviteUrl }: Props) {
  return (
    <BaseEmail preview="You've been invited to the Knowledge Square staff portal">
      <EmailHeading>You're Invited</EmailHeading>
      <EmailBody>Hi {name},</EmailBody>
      <EmailBody>
        You've been invited to join the Knowledge Square staff portal as <strong>{role}</strong>.
        Click the button below to set your password and activate your account. This link expires in{" "}
        <strong>7 days</strong>.
      </EmailBody>

      <EmailButton href={inviteUrl}>Set Your Password</EmailButton>

      <EmailBody style={{ fontSize: "12px", color: "rgba(74,101,88,0.7)" }}>
        If you weren't expecting this invitation, you can safely ignore this email — no account will be
        activated until the password is set.
      </EmailBody>
    </BaseEmail>
  );
}
