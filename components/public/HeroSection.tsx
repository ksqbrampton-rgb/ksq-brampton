import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "var(--dark)" }}
    >
      {/* Radial gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 10% 50%, rgba(26,74,46,0.55) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 90% 20%, rgba(201,151,58,0.12) 0%, transparent 60%)",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Nigerian flag strip — right edge */}
      <div className="absolute right-0 top-0 bottom-0 flex flex-col w-2">
        <div className="flex-1" style={{ background: "#008751" }} />
        <div className="flex-1" style={{ background: "#ffffff" }} />
        <div className="flex-1" style={{ background: "#008751" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            {/* Nigerian flag mini */}
            <div className="flex h-5 w-7 rounded-sm overflow-hidden flex-shrink-0">
              <div className="w-1/3" style={{ background: "#008751" }} />
              <div className="w-1/3 bg-white" />
              <div className="w-1/3" style={{ background: "#008751" }} />
            </div>
            <span
              className="text-xs font-body font-medium tracking-widest uppercase"
              style={{ color: "var(--gold)" }}
            >
              NIMC Accredited Diaspora Partner · Brampton, Canada
            </span>
          </div>

          {/* H1 */}
          <h1
            className="font-heading font-bold text-white leading-tight mb-6"
            style={{
              fontSize: "clamp(2.6rem, 6vw, 5rem)",
              fontFamily: "var(--font-cormorant)",
            }}
          >
            Nigerian NIN Enrollment{" "}
            <br className="hidden sm:block" />
            in{" "}
            <span style={{ color: "var(--gold)" }}>Brampton</span>
          </h1>

          {/* Subheading */}
          <p
            className="font-body text-white/70 leading-relaxed mb-10 max-w-xl"
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.15rem)" }}
          >
            Knowledge Square is Brampton&apos;s NIMC-authorised center for
            Nigerian National Identification Number (NIN) diaspora enrollment.
            Book your appointment online — no account required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
            <a
              href="#services"
              className="btn-outline text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4"
              style={{ justifyContent: "center", textAlign: "center", fontWeight: 600 }}
            >
              Our Services
            </a>
            <Link href="/book" className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 justify-center xs:justify-start">
              Book an Appointment
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="flex flex-col sm:flex-row gap-6 sm:gap-10 mt-14 pt-10"
            style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
          >
            {[
              { value: "~30 min", label: "Biometric capture time" },
              { value: "1 Location", label: "Brampton, Ontario" },
              { value: "NIMC ✓", label: "Authorised enrollment" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="font-heading font-bold text-white"
                  style={{ fontSize: "1.4rem", fontFamily: "var(--font-cormorant)" }}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-white/50 font-body mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
