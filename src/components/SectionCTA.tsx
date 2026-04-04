import Link from 'next/link';

export default function SectionCTA() {
  return (
    <section id="cta-end">
      <div className="particles-container">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}></div>
        ))}
      </div>
      <div className="cta-content container reveal-up" style={{ padding: '200px 0', textAlign: 'center' }}>
        <h2 className="section-title" style={{ opacity: 0.1, marginBottom: '32px' }}></h2>
        <h2 className="cta-title">The <span style={{ color: 'var(--c1)' }}>Raza Labs</span><br />for organic growth</h2>
        <p className="cta-sub">12 brands applied in the last 7 days. Spots fill fast — book your onboarding call before the next batch closes.</p>
        <div className="cta-actions">
          <Link href="#calculator" className="btn-primary">Get in Touch →</Link>
        </div>
      </div>
    </section>
  );
}
