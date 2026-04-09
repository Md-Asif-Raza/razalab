'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/actions';

export default function SectionCTA() {
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState({
    cta_title: 'The Raza Labs',
    cta_title_accent: 'for organic growth',
    cta_subtitle: '12 brands applied in the last 7 days. Spots fill fast — book your onboarding call before the next batch closes.',
    cta_button_text: 'Get in Touch →',
    cta_button_link: '#calculator',
  });

  useEffect(() => {
    setIsMounted(true);
    getSiteSettings().then(res => {
      if (res) {
        setData(prev => ({
          ...prev,
          ...(Object.fromEntries(Object.entries(res).filter(([_, v]) => v != null && v !== '')))
        }));
      }
    }).catch(() => { });
  }, []);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    target.classList.add('animate-ripple');
    setTimeout(() => {
      target.classList.remove('animate-ripple');
    }, 800);
    if (data.cta_button_link.startsWith('#')) {
      e.preventDefault();
      document.querySelector(data.cta_button_link)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="cta-end">
      <div className="particles-container">
        {isMounted && [...Array(25)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}></div>
        ))}
      </div>
      <div className="cta-content container reveal-up" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2 className="section-title" style={{ opacity: 0.1, marginBottom: '32px' }}></h2>
        <h2 className="cta-title">{data.cta_title}<br /> <span style={{ color: 'var(--c1)' }}>{data.cta_title_accent}</span></h2>
        <p className="cta-sub">{data.cta_subtitle}</p>
        <div className="cta-actions">
          <Link href={data.cta_button_link} className="cta-btn" onClick={handleCtaClick}>{data.cta_button_text}</Link>
        </div>
      </div>
    </section>
  );
}
