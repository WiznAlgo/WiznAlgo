import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import Ticker from "@/components/landing/Ticker";
import FeaturesSection from "@/components/landing/FeaturesSection";
import AITechSection from "@/components/landing/AITechSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Ticker />
      <HeroSection />
      <FeaturesSection />
      <AITechSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </>
  );
}
