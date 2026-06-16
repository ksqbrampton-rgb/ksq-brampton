"use client";

import { useState } from "react";
import { SITE } from "@/lib/constants";

const SERVICES = [
  {
    title: "New NIN Registration",
    description:
      "For Nigerians and persons of Nigerian descent residing in Canada. Provide the required identification documents and complete biometric enrolment at our approved centre.",
    requirements: [
      "Valid or expired Nigerian international passport",
      "Secondary current government-issued ID if your passport is expired (e.g., driver's licence)",
      "Bank Verification Number (BVN)",
      "Completed pre-enrollment form, printed",
      "NPC document for first-time applicants (Birth Attestation / Registration)",
      "Parent's passport and NIN if enrolling a minor under 16",
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
  },
  {
    title: "Suspended NIN Reactivation",
    description:
      "For individuals whose NIN has been suspended due to incomplete enrolment, data inconsistencies, or validation issues. Biometric recapture and verification may be required.",
    requirements: [
      "Your existing or suspended NIN",
      "Valid or expired Nigerian international passport",
      "Bank Verification Number (BVN)",
      "Be available for biometric recapture and verification",
      "Any documents from your original enrolment, if available",
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 4v6h-6" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    ),
  },
  {
    title: "BVN-Generated NIN Validation",
    description:
      "NINs auto-generated through Bank Verification Number (BVN) harmonization are not fully valid until you complete physical enrolment and biometric capture. Visit our centre to validate and activate yours.",
    requirements: [
      "Your BVN (with the NIN reserved against it)",
      "Valid or expired Nigerian international passport",
      "Completed pre-enrollment form, printed",
      "Be available for biometric capture to validate and activate the NIN",
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    title: "Migration",
    description:
      "For applicants migrating their existing records, including child-to-adult record migration. The appropriate NPC document is required before enrolment.",
    requirements: [
      "Existing child or record NIN being migrated",
      "Appropriate NPC document (Birth Attestation / Registration / Foreign Birth Registration)",
      "Valid or expired Nigerian international passport",
      "Parent's passport and NIN for under-16s",
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    title: "NPC Attestation",
    description: `First-time applicants need a National Population Commission (NPC) document — Birth Attestation, Birth Registration, or Foreign Birth Registration. Apply yourself at the NPC website, or have us assist on-site for $${SITE.fees.attestationAssist} CAD.`,
    requirements: [
      "Choose your NPC document: Birth Attestation, Birth Registration, or Foreign Birth Registration",
      "Apply at the NPC website before your appointment, or request on-site assistance",
      `On-site attestation assistance: $${SITE.fees.attestationAssist} CAD`,
      "Bring the completed NPC document to your enrolment appointment",
    ],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" />
      </svg>
    ),
  },
];

const SECONDARY_DOCS = [
  "Old Nigerian National ID Card",
  "Nigerian Voter's Card",
  "Nigerian Birth Certificate",
  "Nigerian Government Staff ID Card",
  "Nigerian NHIS ID Card",
  "Attestation Letter from a Prominent Community Ruler",
  "Attestation Letter from a Religious / Traditional Leader",
  "Declaration of Age",
];

function ServiceCard({
  service,
  flipped,
  onToggle,
}: {
  service: (typeof SERVICES)[number];
  flipped: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ perspective: "1200px" }} className="h-[380px]">
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${service.title} — tap to ${flipped ? "hide" : "view"} requirements`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className="relative w-full h-full cursor-pointer outline-none"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-xl p-7 flex flex-col"
          style={{
            background: "white",
            border: "1px solid rgba(26,74,46,0.08)",
            boxShadow: "0 8px 32px rgba(26,74,46,0.06)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
            style={{ background: "rgba(26,74,46,0.08)", color: "var(--green)" }}
          >
            {service.icon}
          </div>
          <h3
            className="font-heading font-semibold mb-3"
            style={{
              fontSize: "1.25rem",
              color: "var(--dark)",
              fontFamily: "var(--font-cormorant)",
            }}
          >
            {service.title}
          </h3>
          <p className="text-sm font-body leading-relaxed" style={{ color: "var(--mid)" }}>
            {service.description}
          </p>
          <div className="flex-1" />
          <div
            className="flex items-center gap-2 text-xs font-body font-medium mt-4"
            style={{ color: "var(--gold)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Tap for requirements
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-xl p-7 flex flex-col overflow-hidden"
          style={{
            background: "var(--green)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span
            className="text-xs font-body font-medium tracking-widest uppercase mb-2 block"
            style={{ color: "var(--gold)" }}
          >
            Requirements
          </span>
          <h3
            className="font-heading font-semibold text-white mb-3"
            style={{ fontSize: "1.1rem", fontFamily: "var(--font-cormorant)" }}
          >
            {service.title}
          </h3>
          <ul className="space-y-2 overflow-y-auto pr-1 flex-1">
            {service.requirements.map((req) => (
              <li key={req} className="flex items-start gap-2 text-xs font-body text-white/80 leading-relaxed">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "var(--gold)", flexShrink: 0, marginTop: "3px" }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {req}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 text-xs font-body font-medium mt-4" style={{ color: "var(--gold)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Tap to go back
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setFlipped((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <section id="services" className="py-24" style={{ background: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <span className="section-tag">Services</span>
          <h2
            className="font-heading font-bold mt-4 mb-4"
            style={{
              fontSize: "clamp(1.9rem, 4vw, 3rem)",
              color: "var(--dark)",
              fontFamily: "var(--font-cormorant)",
            }}
          >
            NIN Services for Nigerians in Canada
          </h2>
          <div className="gold-divider mx-auto mb-4" />
          <p className="font-body text-sm max-w-2xl mx-auto" style={{ color: "var(--mid)" }}>
            Whether you are enrolling for the first time, reactivating a suspended record, or
            validating a BVN-generated NIN, our Brampton centre handles the full range of NIMC
            diaspora services. Tap any card to see what to bring.
          </p>
        </div>

        {/* Service flip cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.title}
              service={service}
              flipped={!!flipped[i]}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        {/* Secondary documents panel */}
        <div
          className="mt-10 rounded-xl p-8 reveal relative overflow-hidden"
          style={{ background: "var(--green)", color: "white" }}
        >
          {/* Flag strip top */}
          <div className="absolute top-0 left-0 right-0 h-1 flex">
            <div className="flex-1" style={{ background: "#008751" }} />
            <div className="flex-1 bg-white" />
            <div className="flex-1" style={{ background: "#008751" }} />
          </div>

          <div className="pt-3">
            <span
              className="text-xs font-body font-medium tracking-widest uppercase mb-3 block"
              style={{ color: "var(--gold)" }}
            >
              Identity Verification
            </span>
            <h3
              className="font-heading font-semibold text-white mb-3"
              style={{ fontSize: "1.5rem", fontFamily: "var(--font-cormorant)" }}
            >
              Supporting Documents
            </h3>
            <p className="text-sm font-body text-white/75 leading-relaxed mb-6 max-w-3xl">
              At the centre we verify your identity with your Nigerian International Passport and
              your Bank Verification Number (BVN), plus your NPC Attestation Letter if you have one.
              The following secondary documents can also support your enrollment — original copies
              only:
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {SECONDARY_DOCS.map((doc) => (
                <li key={doc} className="flex items-start gap-3 text-sm font-body text-white/80">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "var(--gold)", flexShrink: 0, marginTop: "3px" }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
