import type { Metadata } from "next";
import BookingWidget from "@/components/public/BookingWidget";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Book your NIN enrollment appointment at Knowledge Square Brampton. No account required — choose a date, select a time, and confirm your details on this page.",
};

export default function BookPage() {
  return (
    <div className="pt-16 min-h-screen" style={{ background: "var(--cream)" }}>
      {/* Header */}
      <div className="py-16 px-4 text-center" style={{ background: "var(--dark)" }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-5 w-7 rounded-sm overflow-hidden flex-shrink-0">
              <div className="w-1/3" style={{ background: "#008751" }} />
              <div className="w-1/3 bg-white" />
              <div className="w-1/3" style={{ background: "#008751" }} />
            </div>
            <span
              className="text-xs font-body font-medium tracking-widest uppercase"
              style={{ color: "var(--gold)" }}
            >
              NIMC Accredited Diaspora Partner
            </span>
          </div>
          <h1
            className="font-heading font-bold text-white mb-3"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontFamily: "var(--font-cormorant)",
            }}
          >
            Book an Appointment
          </h1>
          <p className="font-body text-white/60 text-sm max-w-md mx-auto">
            No account required. Choose a date, select a time slot, and confirm
            your details — all on this page.
          </p>
        </div>
      </div>

      {/* How it works strip */}
      <div style={{ background: "var(--green)" }}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
            {[
              { n: "1", label: "Choose a date" },
              { n: "2", label: "Select a time" },
              { n: "3", label: "Enter your details" },
              { n: "4", label: "You're booked" },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-body font-semibold flex-shrink-0"
                  style={{ background: "rgba(201,151,58,0.25)", color: "var(--gold)" }}
                >
                  {s.n}
                </span>
                <span className="text-xs font-body text-white/70">{s.label}</span>
                {i < 3 && (
                  <span className="text-white/20 hidden sm:block">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking widget */}
      <div className="px-4 py-12">
        <BookingWidget />
        <p className="text-center text-xs font-body mt-6" style={{ color: "var(--mid)" }}>
          Appointments are 30 minutes · Walk-ins are not accepted
        </p>
      </div>
    </div>
  );
}
