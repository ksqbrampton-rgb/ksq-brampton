const DOCUMENTS = [
  {
    title: "Nigerian Passport",
    description:
      "Valid or expired Nigerian international passport. If expired, bring a secondary ID (national ID, driver's licence).",
    required: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
        <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="14" r="2"/>
      </svg>
    ),
  },
  {
    title: "Evidence of Payment",
    description:
      "Receipt confirming payment of the NIMC diaspora enrollment fee. Online bank transfer or cash receipt accepted.",
    required: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
  },
  {
    title: "Pre-Enrollment Form (2D Barcode)",
    description:
      "Completed NIMC pre-enrollment form with the 2D barcode visible. Must be printed — digital copies not accepted.",
    required: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
        <path d="M21 14h-3v3h3v3h-3v1M14 14h3v1M14 18h1v3M21 21v-1"/>
      </svg>
    ),
  },
  {
    title: "Parent's Passport",
    description:
      "Required only for minors (under 18). Parent or guardian must accompany the child to the appointment.",
    required: false,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

export default function DocumentsSection() {
  return (
    <section
      id="documents"
      className="py-24"
      style={{ background: "var(--green)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <span
            className="section-tag"
            style={{ borderColor: "rgba(201,151,58,0.5)", color: "var(--gold2)" }}
          >
            Required Documents
          </span>
          <h2
            className="font-heading font-bold mt-4 mb-4 text-white"
            style={{
              fontSize: "clamp(1.9rem, 4vw, 3rem)",
              fontFamily: "var(--font-cormorant)",
            }}
          >
            What to Bring to Your Appointment
          </h2>
          <div className="gold-divider mx-auto mb-4" />
          <p className="font-body text-sm max-w-lg mx-auto text-white/60">
            Ensure you have all required documents before your appointment. Walk-ins are not accepted.
          </p>
        </div>

        {/* 4-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
          {DOCUMENTS.map((doc) => (
            <div
              key={doc.title}
              className="rounded-xl p-6 transition-all duration-200 hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background: "rgba(201,151,58,0.15)",
                  color: "var(--gold)",
                }}
              >
                {doc.icon}
              </div>

              {/* Required / Optional badge */}
              <span
                className="text-xs font-body font-medium tracking-wide uppercase mb-2 block"
                style={{ color: doc.required ? "var(--gold)" : "rgba(255,255,255,0.4)" }}
              >
                {doc.required ? "Required" : "If applicable"}
              </span>

              <h3
                className="font-heading font-semibold text-white mb-2"
                style={{ fontSize: "1.1rem", fontFamily: "var(--font-cormorant)" }}
              >
                {doc.title}
              </h3>
              <p className="text-xs font-body text-white/55 leading-relaxed">
                {doc.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div
          className="mt-10 p-5 rounded-lg reveal"
          style={{
            borderLeft: "4px solid var(--gold)",
            background: "rgba(201,151,58,0.08)",
          }}
        >
          <p className="text-sm font-body text-white/75">
            <span className="font-semibold text-white">Need help with your form?</span>{" "}
            Form completion assistance is available at the center for a nominal fee. Please
            mention this when booking your appointment.
          </p>
        </div>
      </div>
    </section>
  );
}
