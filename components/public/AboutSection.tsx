const WHY_ITEMS = [
  "Required for Nigerian passport renewal and new applications",
  "Mandatory for Bank Verification Number (BVN) linkage",
  "Required for voter registration with INEC",
  "Permanent identifier — valid for life, used for all government services",
  "Applicable to all ages, including children and minors",
  "Biometric capture takes approximately 10 minutes",
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24" style={{ background: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: What is NIN card */}
          <div className="space-y-6 reveal">
            <div
              className="rounded-xl p-8 relative overflow-hidden"
              style={{ background: "var(--green)", color: "white" }}
            >
              {/* Flag strip top */}
              <div className="absolute top-0 left-0 right-0 h-1 flex">
                <div className="flex-1" style={{ background: "#008751" }} />
                <div className="flex-1 bg-white" />
                <div className="flex-1" style={{ background: "#008751" }} />
              </div>

              <div className="pt-4">
                <span
                  className="text-xs font-body font-medium tracking-widest uppercase mb-4 block"
                  style={{ color: "var(--gold)" }}
                >
                  National Identity
                </span>
                <h3
                  className="font-heading font-bold text-white mb-4"
                  style={{ fontSize: "1.8rem", fontFamily: "var(--font-cormorant)" }}
                >
                  What is the NIN?
                </h3>
                <p className="text-white/75 font-body text-sm leading-relaxed mb-4">
                  The National Identification Number (NIN) is a unique
                  11-digit number issued by Nigeria&apos;s National Identity
                  Management Commission (NIMC). It is assigned to every Nigerian
                  citizen and legal resident after enrolment of their
                  demographic data and biometric information.
                </p>
                <p className="text-white/75 font-body text-sm leading-relaxed">
                  As a member of the Nigerian diaspora in Canada, you can enroll
                  at authorised NIMC diaspora centers like Knowledge Square
                  Brampton without traveling to Nigeria.
                </p>
              </div>
            </div>

            {/* NIMC badge */}
            <div
              className="inline-flex items-center gap-3 px-4 py-3 rounded-lg"
              style={{
                background: "rgba(201,151,58,0.08)",
                border: "1px solid rgba(201,151,58,0.25)",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--gold)", color: "var(--dark)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-body font-semibold" style={{ color: "var(--green)" }}>
                  NIMC Authorised Enrollment
                </p>
                <p className="text-xs font-body" style={{ color: "var(--mid)" }}>
                  Accredited diaspora partner — Brampton, Ontario
                </p>
              </div>
            </div>
          </div>

          {/* Right: Why you need a NIN */}
          <div className="space-y-6 reveal">
            <div>
              <span className="section-tag">About NIN</span>
              <h2
                className="font-heading font-bold mt-4 mb-4"
                style={{
                  fontSize: "clamp(1.9rem, 4vw, 3rem)",
                  color: "var(--dark)",
                  fontFamily: "var(--font-cormorant)",
                }}
              >
                Why Every Nigerian Abroad Needs a NIN
              </h2>
              <div className="gold-divider mb-6" />
              <p className="font-body text-sm leading-relaxed" style={{ color: "var(--mid)" }}>
                The NIN is increasingly mandatory across all Nigerian government
                services and transactions. Without it, you may be unable to
                access critical services — even from Canada.
              </p>
            </div>

            <ul className="space-y-4">
              {WHY_ITEMS.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(26,74,46,0.10)" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--green)" }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="text-sm font-body leading-relaxed" style={{ color: "var(--mid)" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
