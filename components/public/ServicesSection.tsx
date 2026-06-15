const SERVICES = [
  {
    title: "New NIN Registration",
    description:
      "For Nigerians and persons of Nigerian descent residing in Canada. Provide the required identification documents and complete biometric enrolment at our approved centre.",
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
      "For individuals whose NIN has been suspended due to incomplete enrolment, data inconsistencies, or validation issues. Biometric recapture and verification may be required before reactivation.",
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
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    title: "Migration & NPC Attestation",
    description:
      "First-time applicants must obtain the appropriate National Population Commission (NPC) document — Birth Attestation, Birth Registration, or Foreign Birth Registration — before enrolment. This also supports child-to-adult record migration.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 15l2 2 4-4" />
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

export default function ServicesSection() {
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
            diaspora services.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="ksq-card group"
              style={{ background: "white", padding: "2rem" }}
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
            </div>
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
