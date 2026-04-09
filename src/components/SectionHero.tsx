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
    }).catch(() => {});
  }, []);

  return (
    <section id="hero" style={{ padding: '160px 0 80px 0' }}>
      <div className="standard-container">
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h1 className="reveal-up" style={{ 
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

          <p className="reveal-up stagger-1" style={{ 
            fontSize: '1.25rem',
            lineHeight: 1.6, 
            color: 'rgba(255, 255, 255, 0.6)', 
            maxWidth: '800px',
            marginBottom: '48px',
            textAlign: 'left',
            padding: 0,
            margin: '0 0 48px 0'
          }}>
            {data.subtitle}
          </p>

          <div className="reveal-up stagger-2" style={{ marginBottom: '64px', textAlign: 'left' }}>
            <Link href={data.cta_link} className="btn-primary" style={{ padding: '18px 48px', fontSize: '1rem', borderRadius: '12px' }}>
              {data.cta_text}
            </Link>
          </div>

          <div className="reveal-up stagger-3" style={{ 
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
