import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How to Enroll for Your NIN",
  description:
    "Step-by-step guide to enrolling for your Nigerian National Identification Number (NIN) at Knowledge Square Brampton.",
};

const STEPS = [
  {
    number: 1,
    title: "Gather Your Required Documents",
    description:
      "Before anything else, ensure you have your valid (or expired) Nigerian passport and any applicable secondary ID. Check the full documents list below.",
    details: [
      "Valid or expired Nigerian international passport",
      "Secondary ID if passport is expired (national ID, driver's licence)",
      "Evidence of payment (receipt)",
      "Completed pre-enrollment form with 2D barcode (see Step 2)",
      "Parent's passport if enrolling a minor",
    ],
  },
  {
    number: 2,
    title: "Complete the NIMC Pre-Enrollment Form",
    description:
      "Download the NIMC pre-enrollment form and fill it in accurately. The form generates a 2D barcode on completion — this barcode must be visible on your printed copy.",
    details: [
      "Download the form from the Downloads section",
      "Fill in all fields accurately — errors may delay your NIN",
      "Print the completed form — the 2D barcode is required",
      "Digital or phone copies of the form are not accepted at the appointment",
      "Need help? Form assistance is available at the center for a nominal fee",
    ],
  },
  {
    number: 3,
    title: "Make Your Payment",
    description:
      "Pay the applicable NIMC diaspora enrollment fee before your appointment. Keep your payment receipt — it is a required document.",
    details: [
      `New enrollment: $${SITE.fees.newEnrollment} CAD`,
      `BVN + NIN completion: $${SITE.fees.bvnCompletion} CAD`,
      "Payment receipt is a required document — do not discard it",
      "Cash and e-transfer are accepted",
    ],
  },
  {
    number: 4,
    title: "Book Your Appointment Online",
    description:
      "Use our in-app booking system to choose your preferred date and time. No account is required — just your name, email, and phone number.",
    details: [
      "Visit the Book page on this site",
      "Pick an available date on the calendar",
      "Select a time slot",
      "Enter your name, email, and phone",
      "You will receive a confirmation email immediately",
    ],
    cta: { label: "Book an Appointment", href: "/book" },
  },
  {
    number: 5,
    title: "Attend Your Appointment",
    description:
      "Arrive at 69 Eastern Avenue, Unit 1, Brampton at your scheduled time with all required documents. Walk-ins are not accepted.",
    details: [
      "Arrive 5 minutes before your slot",
      "Bring all required documents (originals)",
      "Check-in at reception",
      "Biometric capture: fingerprints and photograph — approximately 10 minutes",
      "Data transmitted to NIMC for processing",
    ],
  },
  {
    number: 6,
    title: "Receive Your NIN",
    description:
      "Your NIN is processed and issued by NIMC after your biometric capture. You will be notified by email with collection instructions.",
    details: [
      "NIMC processes NIN after biometric submission",
      "You will be notified by email when your NIN slip is ready",
      "Collection details provided in the notification email",
    ],
  },
];

export default function HowToEnrollPage() {
  return (
    <div className="pt-16">
      {/* Header */}
      <div
        className="py-20 px-4"
        style={{ background: "var(--dark)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-tag" style={{ borderColor: "rgba(201,151,58,0.5)", color: "var(--gold2)" }}>
            How to Enroll
          </span>
          <h1
            className="font-heading font-bold text-white mt-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontFamily: "var(--font-cormorant)" }}
          >
            Your Step-by-Step Enrollment Guide
          </h1>
          <p className="font-body text-white/65 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Follow these six steps to successfully enroll for your NIN at Knowledge Square Brampton.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex gap-6 sm:gap-8">
              {/* Step number + connector */}
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-lg flex-shrink-0"
                  style={{
                    background: "var(--green)",
                    color: "var(--gold)",
                    fontFamily: "var(--font-cormorant)",
                  }}
                >
                  {step.number}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 mt-3" style={{ background: "rgba(26,74,46,0.15)", minHeight: "40px" }} />
                )}
              </div>

              {/* Content */}
              <div className="pb-8 flex-1">
                <h2
                  className="font-heading font-semibold mb-2"
                  style={{ fontSize: "1.4rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}
                >
                  {step.title}
                </h2>
                <p className="text-sm font-body leading-relaxed mb-4" style={{ color: "var(--mid)" }}>
                  {step.description}
                </p>
                <ul className="space-y-2">
                  {step.details.map((d, di) => (
                    <li key={di} className="flex items-start gap-2 text-sm font-body" style={{ color: "var(--mid)" }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--gold)" }} />
                      {d}
                    </li>
                  ))}
                </ul>
                {step.cta && (
                  <Link href={step.cta.href} className="btn-primary mt-5 inline-flex">
                    {step.cta.label}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
