import HeroSection from "@/components/public/HeroSection";
import StepsBanner from "@/components/public/StepsBanner";
import AboutSection from "@/components/public/AboutSection";
import EnrollSection from "@/components/public/EnrollSection";
import ServicesSection from "@/components/public/ServicesSection";
import DocumentsSection from "@/components/public/DocumentsSection";
import LocationSection from "@/components/public/LocationSection";
import FeesSection from "@/components/public/FeesSection";
import FaqSection from "@/components/public/FaqSection";
import DownloadsSection from "@/components/public/DownloadsSection";
import RevealWrapper from "@/components/public/RevealWrapper";

export default function HomePage() {
  return (
    <RevealWrapper>
      <HeroSection />
      <StepsBanner />
      <AboutSection />
      <EnrollSection />
      <ServicesSection />
      <DocumentsSection />
      <LocationSection />
      <FeesSection />
      <FaqSection />
      <DownloadsSection />
    </RevealWrapper>
  );
}
