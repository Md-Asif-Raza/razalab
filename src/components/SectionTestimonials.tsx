'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const reviews = [
  { id: 1, name: 'Alex Poly', handle: '@alex_j_poly', content: 'The consistency they provided was elite. Our growth spiked in 3 weeks.', avatar: 'https://i.pravatar.cc/150?u=1', stars: 5 },
  { id: 2, name: 'Jordan Hayes', handle: '@jordanclipped', content: 'Our distribution scaling was seamless. Totally hands-off.', avatar: 'https://i.pravatar.cc/150?u=2', stars: 5 },
  { id: 3, name: 'Nikita V', handle: '@nik_v_content', content: 'Raza Labs is the only network that actually understands hooks.', avatar: 'https://i.pravatar.cc/150?u=3', stars: 5 }
];

export default function SectionTestimonials() {
  const [index, setIndex] = useState(0);

  return (
    <section id="reviews" style={{ padding: '200px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '80px', width: '100%' }}>
        <h2 className="section-title reveal-up">Reviews</h2>
      </div>

      <div className="glass-panel-container container reveal-up">
        {/* WE REUSE THE SAME 'PRO' CARD STYLES FROM SECTIONWHYCHOOSE FOR CONSISTENCY */}
        <div className="pro-testimonial-row">
          <AnimatePresence mode="wait">
            {reviews.slice(index, index + 3).map((r) => (
              <motion.div 
                key={r.id}
                className="pro-testimonial-card shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <div className="pro-avatar">
                  <img src={r.avatar} alt={r.name} />
                </div>
                <h3 className="pro-name">{r.name}</h3>
                <div className="pro-role">{r.handle}</div>
                <div style={{ color: 'var(--aura-neon)', fontSize: '0.7rem', marginBottom: '16px' }}>{'★'.repeat(r.stars)}</div>
                <p className="pro-quote">&quot;{r.content}&quot;</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
