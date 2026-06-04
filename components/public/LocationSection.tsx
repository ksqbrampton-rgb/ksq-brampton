import { SITE } from "@/lib/constants";

export default function LocationSection() {
  return (
    <section id="location" className="py-24" style={{ background: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Details */}
          <div className="space-y-8 reveal">
            <div>
              <span className="section-tag">Location</span>
              <h2
                className="font-heading font-bold mt-4 mb-4"
                style={{
                  fontSize: "clamp(1.9rem, 4vw, 3rem)",
                  color: "var(--dark)",
                  fontFamily: "var(--font-cormorant)",
                }}
              >
                Visit Us in Brampton
              </h2>
              <div className="gold-divider mb-6" />
            </div>

            {/* Address */}
            <div className="flex gap-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(26,74,46,0.08)", color: "var(--green)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-body font-semibold mb-1" style={{ color: "var(--dark)" }}>Address</p>
                <p className="text-sm font-body" style={{ color: "var(--mid)" }}>
                  {SITE.address.line1}
                  <br />
                  {SITE.address.city}, {SITE.address.province}, {SITE.address.country}
                  <br />
                  {SITE.address.postal}
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(26,74,46,0.08)", color: "var(--green)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-body font-semibold mb-2" style={{ color: "var(--dark)" }}>Office Hours</p>
                <div className="space-y-1">
                  {[
                    { day: "Monday – Friday", hours: "9:00 AM – 5:00 PM" },
                    { day: "Saturday", hours: "10:00 AM – 3:00 PM" },
                    { day: "Sunday", hours: "Closed", closed: true },
                  ].map((h) => (
                    <div key={h.day} className="flex gap-3 text-sm font-body">
                      <span className="w-36" style={{ color: "var(--mid)" }}>{h.day}</span>
                      <span
                        className="font-medium"
                        style={{ color: h.closed ? "rgba(74,101,88,0.5)" : "var(--green)" }}
                      >
                        {h.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="flex gap-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(26,74,46,0.08)", color: "var(--green)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-body font-semibold mb-1" style={{ color: "var(--dark)" }}>Email</p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-sm font-body transition-colors hover:opacity-80"
                  style={{ color: "var(--green)" }}
                >
                  {SITE.email}
                </a>
              </div>
            </div>

            {/* Transit + Parking */}
            <div
              className="p-5 rounded-lg"
              style={{
                background: "var(--light)",
                border: "1px solid rgba(26,74,46,0.08)",
              }}
            >
              <p className="text-sm font-body font-semibold mb-2" style={{ color: "var(--dark)" }}>
                Transit & Parking
              </p>
              <p className="text-sm font-body leading-relaxed" style={{ color: "var(--mid)" }}>
                Free street parking available on Eastern Avenue. Accessible via
                Brampton Transit — check{" "}
                <a
                  href="https://www.brampton.ca/EN/residents/transit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: "var(--green)" }}
                >
                  Brampton Transit
                </a>{" "}
                for routes and schedules.
              </p>
            </div>
          </div>

          {/* Right: Map */}
          <div className="reveal rounded-xl overflow-hidden shadow-lg" style={{ height: "480px" }}>
            <iframe
              title="Knowledge Square Brampton location map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2888.0!2d-79.7700!3d43.6830!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b14c7a7c23b01%3A0x0!2s69+Eastern+Ave%2C+Brampton%2C+ON!5e0!3m2!1sen!2sca!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
