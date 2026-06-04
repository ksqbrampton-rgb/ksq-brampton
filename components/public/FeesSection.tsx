import Link from "next/link";
import { SITE } from "@/lib/constants";

const FEE_CARDS = [
  {
    title: "New Enrollment",
    amount: `$${SITE.fees.newEnrollment}`,
    currency: SITE.fees.currency,
    description:
      "For first-time NIN applicants. Includes biometric capture, data entry, and NIN issuance.",
    features: ["First-time enrollment", "Biometric capture", "NIN slip issuance"],
    featured: false,
  },
  {
    title: "BVN + NIN Completion",
    amount: `$${SITE.fees.bvnCompletion}`,
    currency: SITE.fees.currency,
    description:
      "For applicants who have a BVN and need to complete their NIN enrollment with biometric data.",
    features: ["BVN holders", "NIN completion", "Biometric update"],
    featured: true,
  },
  {
    title: "Form Assistance",
    amount: "Nominal",
    currency: "",
    description:
      "Staff-assisted completion of your NIMC pre-enrollment form if you need help filling it out correctly.",
    features: ["Form completion", "Barcode generation", "Staff-guided"],
    featured: false,
  },
];

export default function FeesSection() {
  return (
    <section id="fees" className="py-24" style={{ background: "var(--light)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <span className="section-tag">Fees</span>
          <h2
            className="font-heading font-bold mt-4 mb-4"
            style={{
              fontSize: "clamp(1.9rem, 4vw, 3rem)",
              color: "var(--dark)",
              fontFamily: "var(--font-cormorant)",
            }}
          >
            Enrollment Fees
          </h2>
          <div className="gold-divider mx-auto mb-4" />
          <p className="font-body text-sm max-w-md mx-auto" style={{ color: "var(--mid)" }}>
            Fees are set in accordance with the NIMC official diaspora fee schedule.
          </p>
        </div>

        {/* Fee cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
          {FEE_CARDS.map((card) => (
            <div
              key={card.title}
              className={`rounded-xl p-8 transition-all duration-200 ${card.featured ? "" : "ksq-card"}`}
              style={
                card.featured
                  ? {
                      background: "var(--green)",
                      boxShadow: "0 8px 32px rgba(26,74,46,0.25)",
                    }
                  : {}
              }
            >
              <p
                className="text-sm font-body font-medium tracking-wide uppercase mb-2"
                style={{ color: card.featured ? "var(--gold)" : "var(--mid)" }}
              >
                {card.title}
              </p>

              <div className="flex items-end gap-1 mb-4">
                <span
                  className="font-heading font-bold"
                  style={{
                    fontSize: "2.5rem",
                    fontFamily: "var(--font-cormorant)",
                    color: card.featured ? "white" : "var(--dark)",
                    lineHeight: 1,
                  }}
                >
                  {card.amount}
                </span>
                {card.currency && (
                  <span
                    className="text-sm font-body mb-1"
                    style={{ color: card.featured ? "rgba(255,255,255,0.6)" : "var(--mid)" }}
                  >
                    {card.currency}
                  </span>
                )}
              </div>

              <p
                className="text-sm font-body leading-relaxed mb-6"
                style={{ color: card.featured ? "rgba(255,255,255,0.7)" : "var(--mid)" }}
              >
                {card.description}
              </p>

              <ul className="space-y-2">
                {card.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-body">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: card.featured ? "var(--gold)" : "var(--green)", flexShrink: 0 }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span style={{ color: card.featured ? "rgba(255,255,255,0.75)" : "var(--mid)" }}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-xs font-body text-center mt-8" style={{ color: "var(--mid)" }}>
          All fees are in Canadian dollars (CAD). For the official NIMC fee schedule,{" "}
          <a
            href="https://nimc.gov.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-opacity"
            style={{ color: "var(--green)" }}
          >
            visit the NIMC website ↗
          </a>
        </p>
      </div>
    </section>
  );
}
