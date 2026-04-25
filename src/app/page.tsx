import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AppMockup from "@/components/AppMockup";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#09090b]">
      <Navbar />
      <Hero />
      <Features />
      <AppMockup />
      <HowItWorks />
      <Footer />
    </div>
  );
}
