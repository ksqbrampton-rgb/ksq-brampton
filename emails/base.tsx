import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from "@react-email/components";
import { SITE } from "@/lib/constants";

interface BaseEmailProps {
  preview: string;
  children: React.ReactNode;
}

export function BaseEmail({ preview, children }: BaseEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: "#f5f7f5", fontFamily: "'Outfit', Arial, sans-serif", margin: 0, padding: "32px 0" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(26,74,46,0.10)" }}>
          {/* Header */}
          <Section style={{ backgroundColor: "#0f2318", padding: "28px 32px" }}>
            <Text style={{ color: "#c9973a", fontSize: "10px", fontWeight: "600", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 4px 0" }}>
              NIMC ACCREDITED DIASPORA PARTNER
            </Text>
            <Text style={{ color: "#ffffff", fontSize: "22px", fontWeight: "700", margin: "0", fontFamily: "Georgia, serif" }}>
              Knowledge Square
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", margin: "2px 0 0 0", letterSpacing: "1px", textTransform: "uppercase" }}>
              NIN Enrollment · Brampton, Ontario
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ padding: "32px 32px 24px" }}>
            {children}
          </Section>

          {/* Footer */}
          <Hr style={{ borderColor: "rgba(26,74,46,0.08)", margin: "0 32px" }} />
          <Section style={{ padding: "20px 32px 28px", backgroundColor: "#faf7f2" }}>
            <Text style={{ color: "#4a6558", fontSize: "11px", margin: "0 0 4px 0" }}>
              {SITE.address.line1} · {SITE.address.city}, {SITE.address.province}, Canada
            </Text>
            <Text style={{ color: "#4a6558", fontSize: "11px", margin: "0" }}>
              <Link href={`mailto:${SITE.email}`} style={{ color: "#1a4a2e" }}>{SITE.email}</Link>
              {" · "}
              <Link href={`https://${SITE.domain}`} style={{ color: "#1a4a2e" }}>{SITE.domain}</Link>
            </Text>
            <Text style={{ color: "rgba(74,101,88,0.5)", fontSize: "10px", margin: "10px 0 0 0" }}>
              This email was sent because you have an appointment at Knowledge Square NIN Enrollment Center.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Reusable sub-components
export function EmailHeading({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ color: "#0f2318", fontSize: "22px", fontWeight: "700", margin: "0 0 8px 0", fontFamily: "Georgia, serif" }}>
      {children}
    </Text>
  );
}

export function EmailBody({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <Text style={{ color: "#4a6558", fontSize: "14px", lineHeight: "1.7", margin: "0 0 16px 0", ...style }}>
      {children}
    </Text>
  );
}

export function EmailInfoBox({ children }: { children: React.ReactNode }) {
  return (
    <Section style={{ backgroundColor: "#f0f4f1", borderRadius: "8px", padding: "16px 20px", margin: "16px 0", borderLeft: "4px solid #1a4a2e" }}>
      {children}
    </Section>
  );
}

export function EmailInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Text style={{ margin: "4px 0", fontSize: "13px", color: "#0f2318" }}>
      <span style={{ color: "#4a6558", fontWeight: "normal" }}>{label}: </span>
      <strong>{value}</strong>
    </Text>
  );
}

export function EmailButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Section style={{ margin: "20px 0" }}>
      <Link
        href={href}
        style={{
          backgroundColor: "#c9973a",
          color: "#0f2318",
          padding: "12px 28px",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: "600",
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        {children}
      </Link>
    </Section>
  );
}

export function EmailRefBadge({ ref: refNumber }: { ref: string }) {
  return (
    <Section style={{ backgroundColor: "#1a4a2e", borderRadius: "8px", padding: "12px 20px", margin: "16px 0", textAlign: "center" }}>
      <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 2px 0" }}>
        Booking Reference
      </Text>
      <Text style={{ color: "#e8b85a", fontSize: "18px", fontWeight: "700", margin: "0", fontFamily: "Georgia, serif", letterSpacing: "1px" }}>
        {refNumber}
      </Text>
    </Section>
  );
}

export function EmailChecklist({ items }: { items: string[] }) {
  return (
    <Section style={{ margin: "12px 0" }}>
      {items.map((item, i) => (
        <Text key={i} style={{ color: "#4a6558", fontSize: "13px", margin: "4px 0", paddingLeft: "8px" }}>
          ✓ {item}
        </Text>
      ))}
    </Section>
  );
}
