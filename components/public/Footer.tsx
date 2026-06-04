import Link from "next/link";
import { SITE, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="pt-16 pb-8"
      style={{ background: "var(--dark)", color: "rgba(255,255,255,0.75)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/10">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div>
              <h3
                className="font-heading font-bold text-white text-2xl"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Knowledge Square
              </h3>
              <p className="text-xs tracking-widest uppercase mt-0.5" style={{ color: "var(--gold)" }}>
                NIN Enrollment Center · Brampton
              </p>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              NIMC-accredited diaspora enrollment center serving the Nigerian
              community in Brampton, Ontario.
            </p>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium"
              style={{
                background: "rgba(201,151,58,0.12)",
                border: "1px solid rgba(201,151,58,0.3)",
                color: "var(--gold2)",
              }}
            >
              <span>✓</span> NIMC Authorised Enrollment
            </div>
            <p className="text-sm text-white/50">
              {SITE.address.line1}
              <br />
              {SITE.address.city}, {SITE.address.province}
              <br className="sm:hidden" />
              <span className="hidden sm:inline">, </span>
              {SITE.address.country}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-body font-semibold text-sm tracking-wide uppercase">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/book"
                className="text-sm transition-colors duration-200 font-medium"
                style={{ color: "var(--gold)" }}
              >
                Book an Appointment →
              </Link>
            </nav>
          </div>

          {/* Column 3: Legal & Resources */}
          <div className="space-y-4">
            <h4 className="text-white font-body font-semibold text-sm tracking-wide uppercase">
              Legal & Resources
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/privacy"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/downloads"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                Enrollment Form (PDF)
              </Link>
              <Link
                href="/downloads"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                NIMC Fee Schedule
              </Link>
              <a
                href="https://nimc.gov.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                NIMC Official Website ↗
              </a>
              <Link
                href="/contact"
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                Contact Us
              </Link>
            </nav>
            <div className="pt-2">
              <p className="text-sm text-white/60">
                <a
                  href={`mailto:${SITE.email}`}
                  className="hover:text-white transition-colors"
                  style={{ color: "var(--gold)" }}
                >
                  {SITE.email}
                </a>
              </p>
              <p className="text-sm text-white/50 mt-1">{SITE.domain}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>
            © {year} {SITE.name} NIN Enrollment Center. All rights reserved.
          </p>
          <p>
            Authorised NIMC Diaspora Partner · Brampton, Ontario, Canada
          </p>
        </div>
      </div>
    </footer>
  );
}
