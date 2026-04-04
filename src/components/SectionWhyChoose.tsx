'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTestimonials } from '@/lib/actions';

const FALLBACK = [
  { id: '01', name: 'Sarah Jones', role: 'High ROI Clips', quote: 'Turn long-form content into viral clips that generate more views, followers, and revenue without extra recording.', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { id: '02', name: 'Marcus Chen', role: 'Performance-Driven Editing', quote: 'Every clip is edited using proven hooks, pacing, and retention techniques based on what actually performs across platforms.', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { id: '03', name: 'Elena Rodriguez', role: 'Scalable Clip Volume', quote: 'Increase or decrease your clip output anytime, perfect for growing creators and teams at any stage.', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
  { id: '04', name: 'David Smith', role: 'Content Security', quote: 'Your content stays private, protected, and handled with strict confidentiality throughout the entire process.', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
  { id: '05', name: 'Jessica Lee', role: 'Optimised Editing Workflow', quote: 'Streamlined systems allow fast turnarounds while maintaining consistent, high-quality clips every time.', avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80' },
  { id: '06', name: 'Chris Evans', role: 'Creator Support Team', quote: 'Direct access to a dedicated team that understands creators, trends, and platform demands 24/7.', avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80' },
];

export default function SectionWhyChoose() {
  const [items, setItems] = useState(FALLBACK);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getTestimonials().then(data => { if (data && data.length > 0) setItems(data); }).catch(() => {});
  }, []);

  const maxIdx = Math.max(0, items.length - 3);
  const next = () => setIndex((index + 1) % (maxIdx + 1));
  const prev = () => setIndex((index - 1 + (maxIdx + 1)) % (maxIdx + 1));

  return (
    <section id="testimonial-features" style={{ padding: '200px 0', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: '80px', width: '100%' }}>
        <h2 className="section-title reveal-up">Testimonials</h2>
      </div>

      <div className="glass-panel-container container reveal-up">
        <div className="pro-testimonial-row">
          <AnimatePresence mode="wait">
            {items.slice(index, index + 3).map((t) => (
              <motion.div key={t.id} className="pro-testimonial-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <div className="pro-avatar">
                  <img src={t.avatar_url} alt={t.name} />
                </div>
                <h3 className="pro-name">{t.name}</h3>
                <div className="pro-role">{t.role}</div>
                <p className="pro-quote">&quot;{t.quote}&quot;</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '60px' }}>
          <button onClick={prev} className="speed-btn" style={{ padding: '12px 24px' }}>←</button>
          <button onClick={next} className="speed-btn" style={{ padding: '12px 24px' }}>→</button>
        </div>
      </div>
    </section>
  );
}
