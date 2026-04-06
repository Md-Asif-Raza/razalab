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
    <section id="hero">
      <div className="hero-bg-glow"></div>
      <div className="hero-grid-overlay"></div>

      <div className="hero-content-left">
        <h1 className="hero-h1 reveal-up">
          {data.title} <span className="hero-accent">{data.title_accent}</span>
        </h1>

        <p className="hero-sub reveal-up stagger-1">
          {data.subtitle}
        </p>

        <div className="hero-actions reveal-up stagger-2">
          <Link href={data.cta_link} className="btn-primary">{data.cta_text}</Link>
        </div>

        <div className="hero-views-line reveal-up stagger-3">
          <CountUp endString={data.stats_text} /> views tracked for your favorite
        </div>
      </div>
    </section>
  );
}
