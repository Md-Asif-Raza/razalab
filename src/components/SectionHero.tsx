'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import CountUp from '@/components/CountUp';
import { getHeroContent } from '@/lib/actions';

export default function SectionHero() {
  const [data, setData] = useState({
    title: 'The Raza Labs',
    title_accent: 'for organic marketing',
    subtitle: 'We\'ll build you a mass content distribution system that scales your brand to new heights with an army of clippers. We have generated over 527 M+views for our clients with our systems. From creators to brands, we make your content explode across all platforms.',
    cta_text: 'Get In Touch',
    cta_link: '#cta-end',
    stats_text: '527,00,000+',
  });

  useEffect(() => {
    getHeroContent().then(res => {
      if (res) {
        setData(prev => ({
          title: res.title || prev.title,
          title_accent: res.title_accent || prev.title_accent,
          subtitle: res.subtitle || prev.subtitle,
          cta_text: res.cta_text || prev.cta_text,
          cta_link: res.cta_link || prev.cta_link,
          stats_text: res.stats_text || prev.stats_text,
        }));
      }
    }).catch(() => { });
  }, []);

  return (
    <section id="hero" className="section-glow-bottom glow-transition" style={{ position: 'relative' }}>
      {/* ═══ AMBIENT GLOW — large elliptical behind headline ═══ */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '20%',
        left: '30%',
        width: '80%', // FIX: percentage instead of fixed 800px to prevent mobile overflow
        maxWidth: '800px', // FIX: cap at 800px on desktop
        height: '250px',
        background: 'radial-gradient(ellipse at center, rgba(90, 104, 130, 0.25) 0%, rgba(100, 80, 180, 0.12) 40%, transparent 70%)',
        filter: 'blur(120px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div className="standard-container" style={{ position: 'relative', zIndex: 1, maxWidth: '1180px', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}> {/* FIX: add overflow-hidden to prevent bleed */}
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h1 className="reveal-up hero-anim-1" style={{
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '40px',
            color: '#fff',
            maxWidth: '1200px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0',
            padding: 0,
            margin: 0
          }}>
            <span style={{ display: 'block' }}>{data.title}</span>
            <span style={{ color: 'rgba(90, 104, 130, 0.6)', display: 'block' }}>{data.title_accent}</span>
          </h1>

          <p className="reveal-up stagger-1 hero-anim-2" style={{
            fontSize: 'clamp(0.875rem, 2vw, 1.25rem)', // FIX: responsive subtitle sizing
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.6)',
            maxWidth: '800px',
            marginBottom: '48px',
            textAlign: 'left',
            padding: 0,
            margin: '0 0 48px 0',
            wordWrap: 'break-word', // FIX: enable word wrapping
            overflowWrap: 'break-word' // FIX: break long words
          }}>
            {data.subtitle}
          </p>

          <div className="reveal-up stagger-2 hero-anim-3" style={{ marginBottom: '64px', textAlign: 'left', width: '100%' }}> {/* FIX: add width 100% for mobile */}
            <Link href={data.cta_link} className="btn-primary" style={{ padding: 'clamp(12px, 2vw, 18px) clamp(24px, 4vw, 48px)', fontSize: 'clamp(0.875rem, 2vw, 1rem)', borderRadius: '12px', display: 'inline-block', width: 'auto', minWidth: '150px' }}> {/* FIX: responsive sizing */}
              {data.cta_text}
            </Link>
          </div>

          <div className="reveal-up stagger-3 hero-anim-4" style={{
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px'
          }}>
            <span style={{ fontWeight: 700, color: '#fff' }}>
              <CountUp endString={data.stats_text} />
            </span>
            views tracked for your favorite
          </div>
        </div>
      </div>
    </section>
  );
}
