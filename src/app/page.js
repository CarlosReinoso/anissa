import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import GraphicsSection from "@/components/GraphicsSection";
import TattoosSection from "@/components/TattoosSection";
import ContactCTA from "@/components/ContactCTA";

export default function Home() {
  return (
    <div className="bg-white text-black">
      <Hero />
      <AboutSection />
      <GraphicsSection />
      <TattoosSection />
      <ContactCTA />
    </div>
  );
}
