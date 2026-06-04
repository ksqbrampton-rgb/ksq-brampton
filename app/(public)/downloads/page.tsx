import type { Metadata } from "next";
import DownloadsSection from "@/components/public/DownloadsSection";

export const metadata: Metadata = {
  title: "Downloads & Resources",
  description:
    "Download the NIMC pre-enrollment form, diaspora fact sheet, and official fee schedule for NIN enrollment at Knowledge Square Brampton.",
};

export default function DownloadsPage() {
  return (
    <div className="pt-16">
      <div className="py-16 px-4 text-center" style={{ background: "var(--dark)" }}>
        <h1
          className="font-heading font-bold text-white"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontFamily: "var(--font-cormorant)" }}
        >
          Downloads & Resources
        </h1>
        <p className="font-body text-white/60 mt-3 text-sm">
          Forms, fact sheets, and official links for your NIN enrollment
        </p>
      </div>
      <DownloadsSection />
    </div>
  );
}
