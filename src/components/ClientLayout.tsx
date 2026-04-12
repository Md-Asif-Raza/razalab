'use client';
import { usePathname } from 'next/navigation';
import BgCanvas from "@/components/BgCanvas";
import BgAuth from "@/components/BgAuth";
import BgAdmin from "@/components/BgAdmin";
import CursorWrapper from "@/components/CursorWrapper";
import ScrollObserver from "@/components/ScrollObserver";
import SmoothScroll from "@/components/SmoothScroll";
import { useAnimations } from "@/hooks/useAnimations";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname?.startsWith('/login') || pathname?.startsWith('/reset-password');
  const isAdmin = pathname?.startsWith('/admin');
  const isLanding = !isAuth && !isAdmin;

  // Pure animation layer — auto-detects elements, zero color changes
  useAnimations();

  return (
    <>
      <div className="bottom-blur-vignette" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: '140px',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
        pointerEvents: 'none', zIndex: 50
      }}></div>

      {isLanding && (
        <>
          <SmoothScroll />
          <ScrollObserver />
          <CursorWrapper />
          <BgCanvas />
          <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -2 }}>
            {/* LEFT SLATE RAY */}
            <div style={{
              position: 'absolute',
              top: '-30%',
              left: '-15%',
              width: '55vw',
              height: '160vh',
              background: 'linear-gradient(90deg, transparent, rgba(90, 104, 130, 0.3) 35%, rgba(200, 210, 230, 0.1) 50%, rgba(90, 104, 130, 0.3) 65%, transparent)',
              filter: 'blur(80px)',
              mixBlendMode: 'screen',
              animation: 'rayLeft 10s ease-in-out infinite alternate'
            }} />
            {/* RIGHT WHITE RAY */}
            <div style={{
              position: 'absolute',
              top: '-20%',
              right: '-20%',
              width: '50vw',
              height: '150vh',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06) 30%, rgba(255, 255, 255, 0.12) 50%, rgba(255, 255, 255, 0.06) 70%, transparent)',
              filter: 'blur(90px)',
              mixBlendMode: 'screen',
              animation: 'rayRight 12s ease-in-out infinite alternate'
            }} />
            {/* SECONDARY RIGHT WHITE RAY (thinner) */}
            <div style={{
              position: 'absolute',
              top: '10%',
              right: '-10%',
              width: '30vw',
              height: '120vh',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.04) 40%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.04) 60%, transparent)',
              filter: 'blur(60px)',
              mixBlendMode: 'screen',
              animation: 'rayRight2 16s ease-in-out infinite alternate'
            }} />
          </div>
        </>
      )}

      {isAdmin && <BgAdmin />}
      {isAuth && <BgAuth />}

      <div className="site-content" id="site-content">
        {children}
      </div>
    </>
  );
}
