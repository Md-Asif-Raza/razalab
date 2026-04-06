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

    </>
  );
}
