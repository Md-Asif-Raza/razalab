import Navbar from "@/components/Navbar";
import SectionHero from "@/components/SectionHero";
import SectionBrands from "@/components/SectionBrands";
import SectionVideo from "@/components/SectionVideo";
import SectionCampaigns from "@/components/SectionCampaigns";
import SectionCalculator from "@/components/SectionCalculator";
import SectionWhyChoose from "@/components/SectionWhyChoose";
import SectionFAQ from "@/components/SectionFAQ";
import SectionCTA from "@/components/SectionCTA";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <SectionHero />       {/* 1: Home */}
      <SectionBrands />
      <SectionVideo />      {/* 2: Explainer Video */}
      <SectionCampaigns />  {/* 3: Clients */}
      <SectionCalculator /> {/* 4: Calculator */}
      <SectionWhyChoose />   {/* 5: Testimonials (Preserved) */}
      <SectionFAQ />         {/* 6: FAQs */}
      <SectionCTA />         {/* 7: End */}
      <Footer />

      {/* Hidden admin access — tiny dot, bottom-left corner */}
      <Link href="/admin" aria-label="Admin" style={{
        position: 'fixed',
        bottom: 8,
        left: 8,
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: 'rgba(90,104,130,0.15)',
        border: 'none',
        cursor: 'none',
        zIndex: 500,
        textDecoration: 'none',
        opacity: 0.3,
      }} />
    </>
  );
}
