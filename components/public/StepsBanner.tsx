const STEPS = [
  {
    number: "01",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: "Download & Fill Form",
    description:
      "Download the pre-enrollment form, complete it accurately, and print it to bring to your appointment.",
  },
  {
    number: "02",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: "Book Your Appointment",
    description:
      "Use our in-app booking system — no account needed, no external redirect. Pick a date and time that works for you.",
  },
  {
    number: "03",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    title: "Attend & Get Your NIN",
    description:
      "Come in with your documents. Biometric capture takes about 30 minutes. Your NIN is processed and issued by NIMC.",
  },
];

export default function StepsBanner() {
  return (
    <section
      className="py-0"
      style={{ background: "var(--green)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={[
                "relative px-6 sm:px-8 py-10 sm:py-12",
                i < STEPS.length - 1
                  ? "border-b border-white/10 lg:border-b-0 lg:border-r lg:border-white/10"
                  : "",
              ].join(" ")}
            >
              {/* Faded background number */}
              <span
                className="absolute top-4 right-6 font-heading font-bold pointer-events-none select-none"
                style={{
                  fontSize: "5rem",
                  color: "rgba(255,255,255,0.05)",
                  fontFamily: "var(--font-cormorant)",
                  lineHeight: 1,
                }}
              >
                {step.number}
              </span>

              {/* Icon circle */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-5 flex-shrink-0"
                style={{
                  background: "rgba(201,151,58,0.15)",
                  border: "1px solid rgba(201,151,58,0.4)",
                  color: "var(--gold)",
                }}
              >
                {step.icon}
              </div>

              {/* Step number tag */}
              <span
                className="text-xs font-body font-medium tracking-widest uppercase mb-2 block"
                style={{ color: "var(--gold)" }}
              >
                Step {step.number}
              </span>

              <h3
                className="font-heading font-semibold text-white mb-3"
                style={{ fontSize: "1.3rem", fontFamily: "var(--font-cormorant)" }}
              >
                {step.title}
              </h3>
              <p className="text-sm text-white/60 font-body leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
