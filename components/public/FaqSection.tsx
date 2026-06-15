"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What is the NIN and why do I need one?",
    a: "The National Identification Number (NIN) is a unique 11-digit number assigned by Nigeria's NIMC to every Nigerian citizen. It is now mandatory for passport renewal, BVN linkage, voter registration, SIM registration, and many other government services.",
  },
  {
    q: "How long does the enrollment appointment take?",
    a: "The biometric capture process takes approximately 30 minutes. Allow additional time for check-in and document verification.",
  },
  {
    q: "Can I enroll with an expired passport?",
    a: "Yes. An expired Nigerian passport is accepted for enrollment. However, you may also be required to bring a secondary form of identification such as a national ID card or driver's licence.",
  },
  {
    q: "I already have a BVN — do I still need to enroll for a NIN?",
    a: "If your BVN was never linked to a NIN through biometric capture, you still need to complete NIN enrollment. We handle this through our BVN-Generated NIN re-enrolment service.",
  },
  {
    q: "Who issues the NIN — Knowledge Square or NIMC?",
    a: "The NIN is issued solely by NIMC (National Identity Management Commission). Knowledge Square is an authorised diaspora enrollment center — we capture and transmit your biometric data to NIMC who issues the NIN.",
  },
  {
    q: "What are the fees for enrollment?",
    a: "Fees depend on your enrollment type and range from $60 to $160 CAD. See the Fees section for the full rate card.",
  },
  {
    q: "When and how do I collect my NIN slip?",
    a: "Your NIN slip is processed by NIMC after your biometric capture. You will be notified by email when it is ready.",
  },
  {
    q: "What if I made an error on my pre-enrollment form?",
    a: "Please contact us at info@ksqbrampton.ca before your appointment if you notice an error. Corrections may be possible but cannot always be guaranteed at the time of appointment.",
  },
  {
    q: "Can children be enrolled for a NIN?",
    a: "Yes. NIN enrollment is available for all ages. Infants from 7 months old are eligible. Children must be accompanied by a parent or guardian, and for under-16s the parent or guardian's passport and NIN are required.",
  },
  {
    q: "Is an appointment required, or can I walk in?",
    a: "You can either book online or walk in. Priority is given to those who booked online, so we recommend booking your slot in advance — it takes just a few minutes and no account is needed.",
  },
];

function FaqItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className="rounded-lg overflow-hidden transition-all duration-200"
      style={{
        border: "1px solid rgba(26,74,46,0.10)",
        background: isOpen ? "white" : "var(--cream)",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left group"
        aria-expanded={isOpen}
      >
        <span
          className="text-sm font-body font-medium pr-4 leading-snug"
          style={{ color: "var(--dark)" }}
        >
          {q}
        </span>
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: isOpen ? "var(--green)" : "rgba(26,74,46,0.08)",
            color: isOpen ? "white" : "var(--green)",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? "200px" : "0" }}
      >
        <p className="px-5 pb-5 text-sm font-body leading-relaxed" style={{ color: "var(--mid)" }}>
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const half = Math.ceil(FAQS.length / 2);
  const left = FAQS.slice(0, half);
  const right = FAQS.slice(half);

  return (
    <section id="faq" className="py-24" style={{ background: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <span className="section-tag">FAQs</span>
          <h2
            className="font-heading font-bold mt-4 mb-4"
            style={{
              fontSize: "clamp(1.9rem, 4vw, 3rem)",
              color: "var(--dark)",
              fontFamily: "var(--font-cormorant)",
            }}
          >
            Frequently Asked Questions
          </h2>
          <div className="gold-divider mx-auto" />
        </div>

        {/* 2-col accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 reveal">
          <div className="space-y-3">
            {left.map((faq, i) => (
              <FaqItem
                key={i}
                q={faq.q}
                a={faq.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
          <div className="space-y-3">
            {right.map((faq, i) => {
              const idx = i + half;
              return (
                <FaqItem
                  key={idx}
                  q={faq.q}
                  a={faq.a}
                  isOpen={openIndex === idx}
                  onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
