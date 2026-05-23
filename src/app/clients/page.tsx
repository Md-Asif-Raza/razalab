'use client';
import Navbar from "@/components/Navbar";
import SectionCampaigns from "@/components/SectionCampaigns";
import Footer from "@/components/Footer";

/* ═══════════════════════════════════════════════════════════════
   GLOW BAND — Horizontal light-leak between sections.
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

export default function ClientsPage() {
  return (
    <>
      <Navbar />
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '120px', // Extra spacing to ensure sticky navbar doesn't cover content
        minHeight: '80vh'
      }}>
        {/* Subtle top ambient glow for the dedicated page */}
        <GlowBand intensity={0.4} color2="70, 90, 180" height={400} top={-50} />
        
        <SectionCampaigns />
      </div>
      <Footer />
    </>
  );
}
