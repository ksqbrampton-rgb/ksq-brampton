import type { Metadata } from "next";
import FaqSection from "@/components/public/FaqSection";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about NIN enrollment at Knowledge Square Brampton — eligibility, documents, fees, and more.",
};

export default function FaqsPage() {
  return (
    <div className="pt-16">
      <div className="py-16 px-4 text-center" style={{ background: "var(--dark)" }}>
        <h1
          className="font-heading font-bold text-white"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontFamily: "var(--font-cormorant)" }}
        >
          Frequently Asked Questions
        </h1>
        <p className="font-body text-white/60 mt-3 text-sm max-w-md mx-auto">
          Can&apos;t find what you&apos;re looking for? Email us at{" "}
          <a href="mailto:info@ksqbrampton.ca" className="underline" style={{ color: "var(--gold)" }}>
            info@ksqbrampton.ca
          </a>
        </p>
      </div>
      <FaqSection />
    </div>
  );
}
