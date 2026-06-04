"use client";

import { SITE } from "@/lib/constants";

export default function ContactPage() {
  return (
    <div className="pt-16">
      {/* Header */}
      <div className="py-16 px-4 text-center" style={{ background: "var(--dark)" }}>
        <h1
          className="font-heading font-bold text-white"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontFamily: "var(--font-cormorant)" }}
        >
          Contact Us
        </h1>
        <p className="font-body text-white/60 mt-3 text-sm">
          We&apos;re here to help with your NIN enrollment questions
        </p>
      </div>

      {/* Content */}
      <section className="py-20 px-4" style={{ background: "var(--cream)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Contact info */}
          <div className="space-y-8">
            <div>
              <span className="section-tag">Get in Touch</span>
              <h2
                className="font-heading font-bold mt-4 mb-4"
                style={{ fontSize: "1.8rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}
              >
                We&apos;d Love to Hear From You
              </h2>
              <div className="gold-divider mb-6" />
              <p className="text-sm font-body leading-relaxed" style={{ color: "var(--mid)" }}>
                Have a question about NIN enrollment, your appointment, or our
                services? Use the form or reach us directly by email.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(26,74,46,0.08)", color: "var(--green)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-body font-semibold uppercase tracking-wide" style={{ color: "var(--green)" }}>Email</p>
                  <a href={`mailto:${SITE.email}`} className="text-sm font-body" style={{ color: "var(--mid)" }}>
                    {SITE.email}
                  </a>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(26,74,46,0.08)", color: "var(--green)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-body font-semibold uppercase tracking-wide" style={{ color: "var(--green)" }}>Address</p>
                  <p className="text-sm font-body" style={{ color: "var(--mid)" }}>
                    {SITE.address.line1}<br />{SITE.address.city}, {SITE.address.province}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(26,74,46,0.08)", color: "var(--green)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-body font-semibold uppercase tracking-wide" style={{ color: "var(--green)" }}>Hours</p>
                  <p className="text-sm font-body" style={{ color: "var(--mid)" }}>
                    Mon–Fri: 9:00 AM – 5:00 PM<br />Sat: 10:00 AM – 3:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form (static — handler wired in Phase 4) */}
          <div
            className="rounded-xl p-8"
            style={{ background: "white", border: "1px solid rgba(26,74,46,0.08)", boxShadow: "0 4px 24px rgba(26,74,46,0.08)" }}
          >
            <h3
              className="font-heading font-semibold mb-6"
              style={{ fontSize: "1.4rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}
            >
              Send a Message
            </h3>

            {/* Note: form action wired in Phase 4 */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-body font-medium mb-1.5 uppercase tracking-wide" style={{ color: "var(--mid)" }}>
                    First Name
                  </label>
                  <input
                    id="contact-first"
                    type="text"
                    className="w-full px-3 py-2.5 rounded-md text-sm font-body outline-none transition-colors"
                    style={{ border: "1px solid rgba(26,74,46,0.15)", background: "var(--cream)" }}
                    placeholder="Ada"
                  />
                </div>
                <div>
                  <label className="block text-xs font-body font-medium mb-1.5 uppercase tracking-wide" style={{ color: "var(--mid)" }}>
                    Last Name
                  </label>
                  <input
                    id="contact-last"
                    type="text"
                    className="w-full px-3 py-2.5 rounded-md text-sm font-body outline-none transition-colors"
                    style={{ border: "1px solid rgba(26,74,46,0.15)", background: "var(--cream)" }}
                    placeholder="Okafor"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-body font-medium mb-1.5 uppercase tracking-wide" style={{ color: "var(--mid)" }}>
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="w-full px-3 py-2.5 rounded-md text-sm font-body outline-none"
                  style={{ border: "1px solid rgba(26,74,46,0.15)", background: "var(--cream)" }}
                  placeholder="ada@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-body font-medium mb-1.5 uppercase tracking-wide" style={{ color: "var(--mid)" }}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  className="w-full px-3 py-2.5 rounded-md text-sm font-body outline-none resize-none"
                  style={{ border: "1px solid rgba(26,74,46,0.15)", background: "var(--cream)" }}
                  placeholder="Your question or message..."
                />
              </div>

              <div
                className="p-3 rounded-md text-xs font-body"
                style={{ background: "rgba(26,74,46,0.05)", color: "var(--mid)", border: "1px solid rgba(26,74,46,0.10)" }}
              >
                Your message will be sent to our team and you will receive a confirmation email.
              </div>

              <button
                id="contact-submit"
                className="w-full py-3 rounded-md text-sm font-body font-medium transition-all"
                style={{ background: "var(--gold)", color: "var(--dark)", cursor: "pointer" }}
                onClick={async () => {
                  const btn = document.getElementById("contact-submit") as HTMLButtonElement;
                  const firstName = (document.getElementById("contact-first") as HTMLInputElement)?.value;
                  const lastName = (document.getElementById("contact-last") as HTMLInputElement)?.value;
                  const email = (document.getElementById("contact-email") as HTMLInputElement)?.value;
                  const message = (document.getElementById("contact-message") as HTMLTextAreaElement)?.value;
                  if (!firstName || !email || !message) { alert("Please fill in all required fields."); return; }
                  btn.disabled = true;
                  btn.textContent = "Sending…";
                  const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: `${firstName} ${lastName}`.trim(), email, message }),
                  });
                  if (res.ok) {
                    btn.textContent = "✓ Message Sent";
                    btn.style.background = "rgba(26,74,46,0.10)";
                    btn.style.color = "var(--green)";
                  } else {
                    btn.disabled = false;
                    btn.textContent = "Send Message";
                    alert("Failed to send. Please email us directly.");
                  }
                }}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
