'use client';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CursorWrapper() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-fidelity trail
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
      setIsVisible(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [pathname, isVisible, mouseX, mouseY]);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login') || !isVisible) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {/* TRAILING HALO */}
      <motion.div
        style={{
          x: trailX, y: trailY,
          width: 40, height: 40,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          position: 'absolute',
          top: -20, left: -20,
          pointerEvents: 'none',
          boxShadow: '0 0 20px rgba(255,255,255,0.05)',
        }}
      />

      {/* MAIN DOT */}
      <motion.div
        style={{
          x: mouseX, y: mouseY,
          width: 8, height: 8,
          background: '#fff',
          borderRadius: '50%',
          position: 'absolute',
          top: -4, left: -4,
          boxShadow: '0 0 15px rgba(255,255,255,0.8)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
