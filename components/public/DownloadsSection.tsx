const DOWNLOADS = [
  {
    title: "Enrollment Form",
    description: "Complete this pre-enrollment form before your appointment and bring the printed copy with you. Digital copies are not accepted.",
    type: "PDF",
    href: "/downloads/KSQ_enrolment_form_v2A.pdf",
    external: false,
  },
  {
    title: "Official NIMC Fee Schedule",
    description: "The official NIMC-published fee schedule for diaspora enrollment services.",
    type: "PDF",
    href: "https://nimc.gov.ng",
    external: true,
  },
  {
    title: "NIMC Official Website",
    description: "Visit the National Identity Management Commission website for official information and resources.",
    type: "Website",
    href: "https://nimc.gov.ng",
    external: true,
  },
];

function DownloadArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

function ExternalArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}

export default function DownloadsSection() {
  return (
    <section
      id="downloads"
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
            Resources
          </span>
          <h2
            className="font-heading font-bold mt-4 mb-4 text-white"
            style={{
              fontSize: "clamp(1.9rem, 4vw, 3rem)",
              fontFamily: "var(--font-cormorant)",
            }}
          >
            Downloads & Resources
          </h2>
          <div className="gold-divider mx-auto" />
        </div>

        {/* 4-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal max-w-5xl mx-auto">
          {DOWNLOADS.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target={item.external ? "_blank" : "_self"}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="group flex flex-col rounded-xl p-6 transition-all duration-200 hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                textDecoration: "none",
              }}
            >
              {/* Type badge */}
              <span
                className="text-xs font-body font-medium tracking-wide uppercase mb-4"
                style={{ color: "var(--gold)" }}
              >
                {item.type}
              </span>

              <h3
                className="font-heading font-semibold text-white mb-2 flex-1"
                style={{ fontSize: "1.1rem", fontFamily: "var(--font-cormorant)" }}
              >
                {item.title}
              </h3>

              <p className="text-xs font-body text-white/55 leading-relaxed mb-5">
                {item.description}
              </p>

              {/* Arrow */}
              <div
                className="flex items-center gap-2 text-sm font-body font-medium transition-colors duration-200"
                style={{ color: "var(--gold)" }}
              >
                <span>{item.external ? "Visit →" : "Download"}</span>
                <span className="transition-transform duration-200 group-hover:translate-y-0.5">
                  {item.external ? <ExternalArrow /> : <DownloadArrow />}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
