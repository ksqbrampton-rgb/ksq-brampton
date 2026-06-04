const STEPS = [
  {
    number: 1,
    title: "Gather Your Documents",
    description:
      "Collect your valid Nigerian passport, evidence of payment, and any additional documents based on your enrollment type.",
  },
  {
    number: 2,
    title: "Complete Pre-Enrollment Form",
    description:
      "Download and fill the NIMC pre-enrollment form. A 2D barcode is generated upon completion — bring the printed form with the barcode.",
  },
  {
    number: 3,
    title: "Make Payment",
    description:
      "Pay the applicable NIMC diaspora enrollment fee. Keep your payment receipt — it is a required document at your appointment.",
  },
  {
    number: 4,
    title: "Book Your Appointment",
    description:
      "Use our in-app booking system on this site to choose your date and time slot. No account required — just your name, email, and phone.",
  },
  {
    number: 5,
    title: "Attend & Complete Biometrics",
    description:
      "Arrive at 69 Eastern Avenue, Unit 1, Brampton with all required documents. Biometric capture (fingerprints + photo) takes approximately 10 minutes.",
  },
  {
    number: 6,
    title: "Receive Your NIN",
    description:
      "Your NIN is processed and issued by NIMC. You will be notified when your NIN slip is ready for collection.",
  },
];

export default function EnrollSection() {
  return (
    <section id="enroll" className="py-24" style={{ background: "var(--light)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <span className="section-tag">How to Enroll</span>
          <h2
            className="font-heading font-bold mt-4 mb-4"
            style={{
              fontSize: "clamp(1.9rem, 4vw, 3rem)",
              color: "var(--dark)",
              fontFamily: "var(--font-cormorant)",
            }}
          >
            Six Steps to Your NIN
          </h2>
          <div className="gold-divider mx-auto mb-4" />
          <p className="font-body text-sm max-w-lg mx-auto" style={{ color: "var(--mid)" }}>
            The process is straightforward. Follow these steps and your NIN
            enrollment will be complete in a single visit.
          </p>
        </div>

        {/* 6-card grid */}
        <div
          className="grid gap-6 reveal"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="ksq-card group"
              style={{ background: "var(--cream)" }}
            >
              {/* Number badge */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-heading font-bold text-lg transition-colors duration-200"
                  style={{
                    background: "var(--green)",
                    color: "var(--gold)",
                    fontFamily: "var(--font-cormorant)",
                  }}
                >
                  {step.number}
                </div>
              </div>
              <h3
                className="font-heading font-semibold mb-2"
                style={{
                  fontSize: "1.2rem",
                  color: "var(--dark)",
                  fontFamily: "var(--font-cormorant)",
                }}
              >
                {step.title}
              </h3>
              <p className="text-sm font-body leading-relaxed" style={{ color: "var(--mid)" }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
