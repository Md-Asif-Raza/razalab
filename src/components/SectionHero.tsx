import Link from 'next/link';
import CountUp from '@/components/CountUp';

export default function SectionHero() {
  return (
    <section id="hero">
      <div className="hero-bg-glow"></div>
      <div className="hero-grid-overlay"></div>

      <div className="hero-content-left">
        <h1 className="hero-h1 reveal-up">
          The Raza Labs <span className="hero-accent">for organic marketing</span>
        </h1>

        <p className="hero-sub reveal-up stagger-1">
          We&apos;ll build you a mass content distribution system that scales your brand to new heights with an army of clippers. We have generated over <strong>527 M+views</strong> for our clients with our systems. From creators to brands, we make your content explode across all platforms.
        </p>

        <div className="hero-actions reveal-up stagger-2">
          <Link href="#cta-end" className="btn-primary">Get In Touch</Link>
        </div>

        <div className="hero-views-line reveal-up stagger-3">
          <CountUp endString="527,00,000+" /> views tracked for your favorite
        </div>
      </div>
    </section>
  );
}
