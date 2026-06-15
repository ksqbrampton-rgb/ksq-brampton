import type { Metadata } from "next";
import Link from "next/link";

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
      "Before anything else, ensure you have your valid (or expired) Nigerian passport, your Bank Verification Number (BVN), and any applicable secondary ID. Check the full documents list below.",
    details: [
      "Valid or expired Nigerian international passport",
      "Secondary, current government-issued ID if your passport is expired (e.g., driver's licence)",
      "Bank Verification Number (BVN)",
      "Completed pre-enrollment form, printed (see Step 2)",
      "Parent's passport and NIN if enrolling a minor under 16",
    ],
  },
  {
    number: 2,
    title: "Complete the Pre-Enrollment Form",
    description:
      "Download the pre-enrollment form and fill it in accurately, then print it and bring the printed copy to your appointment.",
    details: [
      "Download the form from the Downloads section",
      "Fill in all fields accurately — errors may delay your NIN",
      "Print the completed form and bring it with you",
      "Digital or phone copies of the form are not accepted at the appointment",
    ],
  },
  {
    number: 3,
    title: "Book Your Appointment Online",
    description:
      "Use our in-app booking system to choose your preferred date and time. No account is required — just your name, email, and phone number. Booking online gives you priority over walk-ins.",
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
    number: 4,
    title: "Attend Your Appointment",
    description:
      "Arrive at 69 Eastern Avenue, Unit 1, Brampton at your scheduled time with all required documents. You can also walk in, though online bookings are given priority.",
    details: [
      "Arrive 5 minutes before your slot",
      "Bring all required documents (originals)",
      "Check-in at reception",
      "Biometric capture: fingerprints and photograph — approximately 30 minutes",
      "Data transmitted to NIMC for processing",
    ],
  },
  {
    number: 5,
    title: "Receive Your NIN",
    description:
      "Your NIN is processed and issued by NIMC after your biometric capture. You will be notified by email when your NIN slip is ready.",
    details: [
      "NIMC processes NIN after biometric submission",
      "You will be notified by email when your NIN slip is ready",
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
            Follow these five steps to successfully enroll for your NIN at Knowledge Square Brampton.
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
