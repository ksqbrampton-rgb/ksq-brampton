import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Knowledge Square NIN Enrollment Center — how we collect, use, and protect your personal information.",
};

const LAST_UPDATED = "June 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2
        className="font-heading font-semibold mb-3"
        style={{ fontSize: "1.3rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}
      >
        {title}
      </h2>
      <div className="space-y-3 text-sm font-body leading-relaxed" style={{ color: "var(--mid)" }}>
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="pt-16 min-h-screen" style={{ background: "var(--cream)" }}>
      {/* Header */}
      <div className="py-16 px-4 text-center" style={{ background: "var(--dark)" }}>
        <h1
          className="font-heading font-bold text-white"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontFamily: "var(--font-cormorant)" }}
        >
          Privacy Policy
        </h1>
        <p className="font-body text-white/50 mt-3 text-sm">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-sm font-body leading-relaxed mb-10" style={{ color: "var(--mid)" }}>
          Knowledge Square NIN Enrollment Center (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your personal
          information. This Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you use our website at{" "}
          <a href={`https://${SITE.domain}`} style={{ color: "var(--green)" }}>{SITE.domain}</a>{" "}
          or attend an appointment at our Brampton enrollment center.
          This policy complies with Canada&apos;s Personal Information Protection and Electronic
          Documents Act (PIPEDA) and Nigeria&apos;s Data Protection Regulation (NDPR).
        </p>

        <Section title="1. Information We Collect">
          <p>We collect the following personal information when you book an appointment:</p>
          <ul className="list-none space-y-1 pl-4">
            {["First and last name", "Email address", "Phone number", "Appointment preferences and notes"].map(i => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--gold)" }} />
                {i}
              </li>
            ))}
          </ul>
          <p>
            At your appointment, our enrollment officers collect biometric data (fingerprints and photograph)
            and identity document information on behalf of Nigeria&apos;s National Identity Management Commission
            (NIMC). This biometric data is transmitted directly to NIMC and is not stored by Knowledge Square.
          </p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use your personal information solely to:</p>
          <ul className="list-none space-y-1 pl-4">
            {[
              "Confirm and manage your enrollment appointment",
              "Send appointment reminders and notifications",
              "Respond to contact form inquiries",
              "Process and track NIN enrollment applications",
              "Comply with legal obligations",
            ].map(i => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--gold)" }} />
                {i}
              </li>
            ))}
          </ul>
          <p>
            We do not sell, rent, or share your personal information with third parties for marketing purposes.
          </p>
        </Section>

        <Section title="3. Data Storage and Security">
          <p>
            Your data is stored in a secure PostgreSQL database hosted by Supabase (Canada region). All
            connections are encrypted using TLS 1.3. Sensitive fields including email addresses and phone
            numbers are encrypted at rest using AES-256-GCM encryption.
          </p>
          <p>
            Appointment confirmation and reminder emails are sent via Resend, a compliant email delivery service.
            No passwords are created or stored for guests — we operate a guest-service model.
          </p>
        </Section>

        <Section title="4. Data Retention">
          <p>
            Appointment and application records are retained for 7 years following the date of enrollment,
            in accordance with regulatory requirements. After this period, personal identifiers are anonymised
            and the application record is retained for statistical purposes only.
          </p>
          <p>
            Contact form inquiries are retained for 12 months and then permanently deleted.
          </p>
        </Section>

        <Section title="5. Your Rights">
          <p>Under PIPEDA, you have the right to:</p>
          <ul className="list-none space-y-1 pl-4">
            {[
              "Access the personal information we hold about you",
              "Request correction of inaccurate information",
              "Request deletion of your personal information (subject to legal retention requirements)",
              "Withdraw consent for non-essential communications",
              "File a complaint with the Office of the Privacy Commissioner of Canada",
            ].map(i => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--gold)" }} />
                {i}
              </li>
            ))}
          </ul>
          <p>
            To exercise any of these rights, please contact us in writing at{" "}
            <a href={`mailto:${SITE.email}`} style={{ color: "var(--green)" }}>{SITE.email}</a>.
            We will respond within 30 days.
          </p>
        </Section>

        <Section title="6. Cookies">
          <p>
            Our website uses only essential session cookies required for the staff portal login. No
            advertising, tracking, or analytics cookies are used. No third-party cookies are set on the
            public-facing pages of this website.
          </p>
        </Section>

        <Section title="7. Third-Party Services">
          <p>We use the following third-party services to operate this platform:</p>
          <ul className="list-none space-y-1 pl-4">
            {[
              "Supabase (database and file storage) — Canada region",
              "Resend (email delivery) — emails sent from info@ksqbrampton.ca",
              "Vercel (website hosting) — Canada/US edge network",
              "Google Maps (location embed on the public site) — no personal data shared",
            ].map(i => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--gold)" }} />
                {i}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="8. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date at the top of
            this page reflects the most recent revision. Continued use of our services after changes are
            posted constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="9. Contact Us">
          <p>For privacy-related inquiries, please contact:</p>
          <div
            className="p-4 rounded-lg mt-3"
            style={{ background: "var(--light)", border: "1px solid rgba(26,74,46,0.08)" }}
          >
            <p className="font-medium" style={{ color: "var(--dark)" }}>Knowledge Square NIN Enrollment Center</p>
            <p>{SITE.address.line1}</p>
            <p>{SITE.address.city}, {SITE.address.province}, Canada</p>
            <p>
              <a href={`mailto:${SITE.email}`} style={{ color: "var(--green)" }}>{SITE.email}</a>
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}
