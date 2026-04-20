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
    <section id="hero" className="glow-transition" style={{ 
      position: 'relative', 
      background: 'transparent',
      paddingBottom: '40px' 
    }}>
      {/* ═══ AMBIENT GLOW — large elliptical behind headline ═══ */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '100%', 
        maxWidth: '1200px',
        height: '450px',
        background: 'radial-gradient(ellipse at center, rgba(var(--c1-rgb), 0.15) 0%, rgba(var(--c2-rgb), 0.05) 50%, transparent 80%)',
        filter: 'blur(150px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div className="standard-container" style={{ position: 'relative', zIndex: 1, maxWidth: '1180px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h1 className="reveal-up hero-anim-1" style={{
            fontSize: 'clamp(3.5rem, 9vw, 6.5rem)', /* Slightly larger */
            fontWeight: 900, /* Ultra bold */
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            marginBottom: '44px',
            color: '#fff',
            maxWidth: '1200px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0',
            padding: 0,
            margin: 0,
            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <span style={{ display: 'block' }}>{data.title}</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.45)', display: 'block' }}>{data.title_accent}</span>
          </h1>

          <p className="reveal-up stagger-1 hero-anim-2" style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.35rem)',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '850px',
            marginBottom: '56px',
            textAlign: 'left',
            padding: 0,
            margin: '0 0 56px 0',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            fontWeight: 400,
            letterSpacing: '0.01em'
          }}>
            {data.subtitle}
          </p>

          <div className="reveal-up stagger-2 hero-anim-3" style={{ marginBottom: '72px', textAlign: 'left', width: '100%' }}>
            <Link href={data.cta_link} className="btn-primary" style={{ padding: 'clamp(16px, 2.5vw, 22px) clamp(32px, 5vw, 64px)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', borderRadius: '14px', display: 'inline-block', width: 'auto', minWidth: '180px', fontWeight: 600 }}>
              {data.cta_text}
            </Link>
          </div>

          <div className="reveal-up stagger-3 hero-anim-4" style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.5)',
            letterSpacing: '0.03em',
            display: 'flex',
            alignItems: 'baseline',
            gap: '10px'
          }}>
            <span style={{ fontWeight: 800, color: '#fff', fontSize: '1.2rem' }}>
              <CountUp endString={data.stats_text} />
            </span>
            views tracked for your favorite
          </div>
        </div>
      </div>
    </section>
  );
}
