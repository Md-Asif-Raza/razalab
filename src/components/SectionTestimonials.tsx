'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getReviews } from '@/lib/actions';
import { SpotlightCard } from './ui/PremiumUI';

const FALLBACK = [
  { id: '1', name: 'Alex Poly', handle: '@alex_j_poly', content: 'The consistency they provided was elite. Our growth spiked in 3 weeks.', avatar_url: 'https://i.pravatar.cc/150?u=1', stars: 5 },
  { id: '2', name: 'Jordan Hayes', handle: '@jordanclipped', content: 'Our distribution scaling was seamless. Totally hands-off.', avatar_url: 'https://i.pravatar.cc/150?u=2', stars: 5 },
  { id: '3', name: 'Nikita V', handle: '@nik_v_content', content: 'Raza Labs is the only network that actually understands hooks.', avatar_url: 'https://i.pravatar.cc/150?u=3', stars: 5 },
];

const PER_PAGE = 3;

export default function SectionTestimonials() {
  const [items, setItems] = useState(FALLBACK);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getReviews().then(data => { if (data && data.length > 0) setItems(data); }).catch(() => {});
  }, []);

  const totalPages = Math.ceil(items.length / PER_PAGE);
  const visibleItems = useMemo(() => {
    const start = page * PER_PAGE;
    return items.slice(start, start + PER_PAGE);
  }, [items, page]);

  return (
    <section id="reviews">
      <div style={{ textAlign: 'center', marginBottom: '80px', width: '100%' }}>
        <h2 className="section-title reveal-up">Reviews</h2>
      </div>

      <div className="glass-panel-container container reveal-up">
        <div className="pro-testimonial-row">
          <AnimatePresence mode="wait">
            {visibleItems.map((r) => (
              <motion.div key={r.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
                <SpotlightCard size="small" className="pro-testimonial-card shadow-lg" style={{ borderRadius: '24px' }}>
                  <div className="pro-avatar" style={{ position: 'relative', overflow: 'hidden' }}>
                    {r.avatar_url && (
                      <Image
                        src={r.avatar_url}
                        alt={r.name}
                        fill
                        sizes="90px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <h3 className="pro-name">{r.name}</h3>
                  <div className="pro-role">{r.handle}</div>
                  <div style={{ color: 'var(--aura-neon)', fontSize: '0.7rem', marginBottom: '16px' }}>{'★'.repeat(r.stars || 5)}</div>
                  <p className="pro-quote">{r.content}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="navigation-control-group" style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '40px' }}>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            className="nav-slide-btn"
            aria-label="Previous reviews"
            disabled={page === 0}
            style={{ opacity: page === 0 ? 0.35 : 1 }}
          >‹</button>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            className="nav-slide-btn"
            aria-label="Next reviews"
            disabled={page >= totalPages - 1}
            style={{ opacity: page >= totalPages - 1 ? 0.35 : 1 }}
          >›</button>
        </div>
      </div>
    </section>
  );
}
