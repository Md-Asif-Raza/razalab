'use client';
import { useState } from 'react';

const faqs = [
  { q: 'What exactly does Raza Labs build for my brand?', a: 'We deploy a full content distribution system — a vetted network of 500+ clippers, quality review pipelines, automated payout infrastructure, and real-time analytics. You provide your long-form content. We turn it into hundreds of short-form clips distributed natively across TikTok, Instagram Reels, YouTube Shorts, and X.' },
  { q: 'Who gets the best results from this?', a: 'Brands and creators producing regular long-form content (podcasts, streams, courses, talks) who want to scale organic reach without $25+ CPM ad spend. Our top-performing clients already have content — they just need distribution at scale.' },
  { q: 'How does a campaign actually run?', a: 'We onboard your brand in 48 hours. Clippers from our network join your campaign and post clips to their own social accounts — you get organic reach through real accounts, not ads. Every submission is quality-reviewed before approval. Clippers earn based on views generated. You only pay for results.' },
  { q: 'What does it cost compared to paid ads?', a: 'Our average effective CPM is $0.50–$1.00 — compared to $25+ for paid social ads. A typical campaign generating 10M views costs roughly $5,000–$10,000 with us versus $250,000+ in paid media. We build custom plans after a strategy call.' },
  { q: 'What do I need to get started?', a: 'Your long-form content (Google Drive or similar), brand guidelines, and a 30-minute strategy call. We handle clipper recruitment, content coaching, quality review, distribution, and payouts. Most brands launch their first campaign within 5 business days.' },
  { q: 'How fast will I see results?', a: 'Most clients see their first viral clips within 7 days of campaign launch. Average campaigns reach 1M+ views within the first month. We provide real-time dashboards so you can track performance as it happens — no waiting for monthly reports.' },
];

export default function SectionFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="faq-section container" style={{ padding: '200px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '80px', width: '100%' }}>
        <h2 className="section-title reveal-up">FAQs</h2>
      </div>
      <div className="faq-list reveal-up stagger-1" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {faqs.map((faq, idx) => (
          <div key={idx} className={`faq-item ${openIdx === idx ? 'open' : ''}`}>
            <div className="faq-q" onClick={() => toggleFaq(idx)}>
              <span className="faq-q-text">{faq.q}</span>
              <span className="faq-icon">+</span>
            </div>
            <div className="faq-a">{faq.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
