'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getBrands } from '@/lib/actions';

const FALLBACK_BRANDS = [
  { name: 'Cantina', is_bold: false },
  { name: 'LOOKSMAX AI', is_bold: true },
  { name: 'RIZZ', is_bold: false },
  { name: 'Loveable', is_bold: false },
  { name: 'Stella Clipping Campaign', is_bold: false },
  { name: 'Atlas Ai', is_bold: false },
  { name: 'Dropship.io', is_bold: false },
  { name: 'Find GPT', is_bold: false },
  { name: 'Joe Rogan + ReplitClip', is_bold: false },
  { name: 'Sameer clipping', is_bold: false },
  { name: 'canffen ai', is_bold: false },
  { name: 'Rebet', is_bold: false },
  { name: 'taller app', is_bold: false },
];

/* ── HYPER-PREMIUM BACKGROUND ANIMATIONS ── */
const NetworkPattern = () => (
  <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]">
    <svg width="100%" height="100%" className="w-full h-full">
      <pattern id="network-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.4)" />
        <line x1="2" y1="2" x2="100" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#network-grid)" />
    </svg>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.1, 0.3, 0.1] }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)]"
    />
  </div>
);


import { useScroll, useTransform } from 'framer-motion';

const FloatingParticles = () => {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  // Parallax layers
  const y1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -300]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -450]);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {[...Array(24)].map((_, i) => {
        const speed = [y1, y2, y3][i % 3];
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${(i * 17.5) % 100}%`,
              top: `${(i * 13.3) % 100}%`,
              y: speed
            }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </div>
  );
};

export default function SectionBrands() {
  const [brands, setBrands] = useState(FALLBACK_BRANDS);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  useEffect(() => {
    setMounted(true);
    getBrands().then(data => {
      if (data && data.length > 0) setBrands(data);
    }).catch(() => { });
  }, []);

  return (
    <section
      id="brands"
      ref={sectionRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 0 100px',
        background: 'transparent',
      }}
    >
      {/* RESTORED ANIMATIONS — only on client to avoid hydration mismatch */}
      <NetworkPattern />
      {mounted && <FloatingParticles />}

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>

        {/* Heading — Sub-header style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            margin: 0,
            textShadow: '0 0 40px rgba(255, 255, 255, 0.1)'
          }}>
            Trusted by{' '}
            <span style={{
              color: '#fff',
              fontStyle: 'italic',
              fontWeight: 800,
              textShadow: '0 0 25px rgba(255, 255, 255, 0.4)',
            }}>
              leading
            </span>
            {' '}brands worldwide
          </h2>
        </motion.div>

        {/* Marquee with Masking Edge Fades */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
            maskImage: 'linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)',
            padding: '32px 0',
          }}>
            <div
              className="brands-track-forward"
              style={{
                display: 'flex',
                gap: '140px',
                width: 'max-content',
                alignItems: 'center',
              }}
            >
              {[...brands, ...brands, ...brands].map((b, i) => (
                <motion.div
                  key={i}
                  className="brand-item"
                  whileHover={{ scale: 1.1, opacity: 1, color: '#fff' }}
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                    fontWeight: 700,
                    fontStyle: b.is_bold ? 'italic' : 'normal',
                    color: 'rgba(255, 255, 255, 0.4)',
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em',
                    cursor: 'default',
                    userSelect: 'none',
                    transition: 'color 0.4s ease, scale 0.4s ease',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {b.name}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
