const DOCUMENTS = [
  {
    title: "Nigerian Passport",
    description:
      "Valid or expired Nigerian international passport. If expired, bring a secondary, current government-issued ID with details matching the passport (e.g., driver's licence).",
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
    title: "Bank Verification Number (BVN)",
    description:
      "Bring your BVN. A NIN may already be reserved against it; it becomes valid only after enrolment and biometric capture at the centre.",
    required: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2"/>
        <circle cx="9" cy="10" r="2"/>
        <path d="M6.5 16c0-1.4 1.1-2.4 2.5-2.4s2.5 1 2.5 2.4"/>
        <line x1="14.5" y1="9" x2="18" y2="9"/>
        <line x1="14.5" y1="13" x2="18" y2="13"/>
      </svg>
    ),
  },
  {
    title: "Pre-Enrollment Form",
    description:
      "Completed pre-enrollment form, printed. Digital copies are not accepted.",
    required: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    title: "Parent's Passport",
    description:
      "Required for minors. A parent or guardian must accompany the child; for under-16s, the parent or guardian's NIN is also required.",
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
            What to Bring For Your Appointment
          </h2>
          <div className="gold-divider mx-auto mb-4" />
          <p className="font-body text-sm max-w-lg mx-auto text-white/60">
            Ensure you have all required documents before your appointment.
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

      </div>
    </section>
  );
}
