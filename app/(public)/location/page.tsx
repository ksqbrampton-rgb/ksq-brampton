import type { Metadata } from "next";
import LocationSection from "@/components/public/LocationSection";

export const metadata: Metadata = {
  title: "Location & Hours",
  description:
    "Find Knowledge Square NIN Enrollment Center at 69 Eastern Avenue, Unit 1, Brampton, Ontario. Office hours, transit, and parking information.",
};

export default function LocationPage() {
  return (
    <div className="pt-16">
      <div className="py-16 px-4 text-center" style={{ background: "var(--dark)" }}>
        <h1
          className="font-heading font-bold text-white"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontFamily: "var(--font-cormorant)" }}
        >
          Location & Hours
        </h1>
        <p className="font-body text-white/60 mt-3 text-sm">
          69 Eastern Avenue, Unit 1 · Brampton, Ontario
        </p>
      </div>
      <LocationSection />
    </div>
  );
}
