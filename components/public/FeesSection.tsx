import { SITE } from "@/lib/constants";

export default function FeesSection() {
  return (
    <section id="fees" className="py-24" style={{ background: "var(--light)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <span className="section-tag">Fees</span>
          <h2
            className="font-heading font-bold mt-4 mb-4"
            style={{
              fontSize: "clamp(1.9rem, 4vw, 3rem)",
              color: "var(--dark)",
              fontFamily: "var(--font-cormorant)",
            }}
          >
            Service Fees
          </h2>
          <div className="gold-divider mx-auto mb-4" />
          <p className="font-body text-sm max-w-md mx-auto" style={{ color: "var(--mid)" }}>
            All fees are in Canadian dollars (CAD) and vary by the type of service you need.
          </p>
        </div>

        {/* Rate table */}
        <div
          className="reveal rounded-xl overflow-hidden"
          style={{
            background: "var(--cream)",
            border: "1px solid rgba(26,74,46,0.08)",
            boxShadow: "0 8px 32px rgba(26,74,46,0.08)",
          }}
        >
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--green)" }}>
                <th
                  className="text-left font-body font-medium uppercase tracking-wide text-xs px-6 py-4"
                  style={{ color: "var(--gold)" }}
                >
                  Service
                </th>
                <th
                  className="text-right font-body font-medium uppercase tracking-wide text-xs px-6 py-4"
                  style={{ color: "var(--gold)" }}
                >
                  Fee (CAD)
                </th>
              </tr>
            </thead>
            <tbody>
              {SITE.fees.rates.map((rate, i) => (
                <tr
                  key={rate.service}
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid rgba(26,74,46,0.07)",
                  }}
                >
                  <td
                    className="font-body text-sm px-6 py-4"
                    style={{ color: "var(--dark)" }}
                  >
                    {rate.service}
                  </td>
                  <td
                    className="font-heading font-bold text-right px-6 py-4"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "1.35rem",
                      color: "var(--green)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ${rate.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* NPC attestation assist note */}
        <div
          className="mt-6 p-5 rounded-lg reveal"
          style={{
            borderLeft: "4px solid var(--gold)",
            background: "rgba(201,151,58,0.08)",
          }}
        >
          <p className="text-sm font-body" style={{ color: "var(--mid)" }}>
            <span className="font-semibold" style={{ color: "var(--dark)" }}>
              NPC Attestation:
            </span>{" "}
            You can apply for your attestation yourself at the{" "}
            <a
              href="https://nationalpopulation.gov.ng/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: "var(--green)" }}
            >
              NPC website ↗
            </a>{" "}
            before your appointment, or have us assist you on-site for $
            {SITE.fees.attestationAssist} CAD.
          </p>
        </div>

        {/* Note */}
        <p className="text-xs font-body text-center mt-8" style={{ color: "var(--mid)" }}>
          Fees cover enrolment processing and biometric capture at our Brampton centre. Please
          mention any add-on service (such as attestation assistance) when booking.
        </p>
      </div>
    </section>
  );
}
