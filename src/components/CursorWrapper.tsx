'use client';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function CursorWrapper() {
  const pathname = usePathname();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleCount = useRef(0);

  useEffect(() => {
    // Disable listener attachment for admin and login
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Spawn ripple occasionally for a 'trail' feel
      if (Math.random() > 0.85) {
        const newRipple = { id: rippleCount.current++, x: e.clientX, y: e.clientY };
        setRipples(prev => [...prev.slice(-15), newRipple]);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const newRipple = { id: rippleCount.current++, x: e.clientX, y: e.clientY };
      setRipples(prev => [...prev.slice(-15), newRipple]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [pathname]);

  // Disable JSX rendering strictly for admin and login sectors
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {/* MAIN CURSOR */}
      <motion.div
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.5 }}
        style={{
          width: 8, height: 8,
          background: '#fff',
          borderRadius: '50%',
          position: 'absolute',
          top: -4, left: -4,
          boxShadow: '0 0 15px rgba(255,255,255,0.8)',
          pointerEvents: 'none'
        }}
      />

      {/* WATER WAVE RIPPLES */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ x: ripple.x, y: ripple.y, scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onAnimationComplete={() => setRipples(prev => prev.filter(r => r.id !== ripple.id))}
            style={{
              width: 20, height: 20,
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '50%',
              position: 'absolute',
              top: -10, left: -10,
              pointerEvents: 'none'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
