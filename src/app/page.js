import WelcomeSection from "@/components/WelcomeSection";
import Hero from "../components/Hero";
import WhyChooseSection from "@/components/WhyChooseSection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <div className="bg-white text-black">
      <Hero />
      <WelcomeSection />
      <ServicesSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
}
