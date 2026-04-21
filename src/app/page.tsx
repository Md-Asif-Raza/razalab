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

/* ═══════════════════════════════════════════════════════════════
   GLOW BAND — Horizontal light-leak between sections.
   z-index:3 renders ABOVE sections (z-index:2), zero layout height.
   ═══════════════════════════════════════════════════════════════ */
function GlowBand({
  intensity = 0.35,
  color1 = '90, 104, 130',   // steel blue (--c1)
  color2 = '100, 80, 180',   // purple accent
  height = 280,
  blur = 80,
  top = -140,
}: {
  intensity?: number;
  color1?: string;
  color2?: string;
  height?: number;
  blur?: number;
  top?: number;
}) {
  return (
    <div aria-hidden="true" style={{
      position: 'relative',
      zIndex: 3,
      height: 0,
      overflow: 'visible',
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute',
        left: '50%',
        top: `${top}px`,
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '1600px',
        height: `${height}px`,
        background: `radial-gradient(ellipse 80% 50% at center,
          rgba(${color1}, ${intensity}) 0%,
          rgba(${color2}, ${intensity * 0.45}) 35%,
          rgba(${color1}, ${intensity * 0.15}) 60%,
          transparent 85%)`,
        filter: `blur(${blur}px)`,
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION TRANSITION — Soft gradient fade between sections.
   ═══════════════════════════════════════════════════════════════ */
function SectionTransition({ color = '90, 104, 130' }: { color?: string }) {
  return (
    <div aria-hidden="true" style={{
      position: 'relative',
      zIndex: 3,
      height: '120px',
      marginTop: '-60px',
      marginBottom: '-60px',
      pointerEvents: 'none',
      background: `linear-gradient(to bottom,
        transparent 0%,
        rgba(${color}, 0.06) 40%,
        rgba(${color}, 0.08) 50%,
        rgba(${color}, 0.06) 60%,
        transparent 100%)`,
    }} />
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      {/* ── SEAMLESS HERO-BRANDS MERGER ── */}
      <div style={{
        position: 'relative',
        overflow: 'hidden'
      }}>
        <SectionHero />
        <SectionBrands />
      </div>
      <SectionTransition />
      <SectionVideo />
      <GlowBand intensity={0.35} color2="70, 90, 180" />
      <SectionCampaigns />
      <GlowBand intensity={0.45} height={350} blur={100} top={-175} />
      <SectionCalculator />
      <SectionTransition color="100, 80, 180" />
      <SectionWhyChoose />
      <GlowBand intensity={0.25} />
      <SectionFAQ />
      <SectionCTA />
      <Footer />
    </>
  );
}
