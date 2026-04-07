'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Campaign } from '@/lib/supabase/client';
import AnalyticsGraph from './AnalyticsGraph';
import { getCampaigns } from '@/lib/actions';
import { PremiumWrapper, SpotlightCard } from './ui/PremiumUI';

const FALLBACK_CLIENTS: Campaign[] = [
  { id: '1', name: 'Dank Drops', category: 'Viral Distribution', result: '+114%', price: '$4,500', description: 'Deploys a network of 50 viral clippers to distribute Dank Drops product launches.', graph_data: '20,35,25,45,60,85,114', img_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', index_label: '01', tag: 'E-com', views_total: '12M', roi: '14x', creators_count: '50', budget_label: '$4.5K', cpm_label: '$0.38', duration_label: '30 Days', sort_order: 1, is_active: true, created_at: '', updated_at: '' },
  { id: '2', name: 'Raza AI', category: 'Product Launch', result: '+88%', price: '$6,200', description: 'Scaled Raza AI awareness through strategic short-form educational content.', graph_data: '10,15,30,40,55,70,88', img_url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&q=80', index_label: '02', tag: 'SaaS', views_total: '8.5M', roi: '9x', creators_count: '35', budget_label: '$6.2K', cpm_label: '$0.72', duration_label: '45 Days', sort_order: 2, is_active: true, created_at: '', updated_at: '' },
];

// Helper to remove any accidental wrapping quotes around strings from DB
const cleanStr = (s: string | undefined) => s?.replace(/^"+|"+$/g, '').trim() || '';

function parseGraphData(data: string | number[] | undefined): number[] {
  if (!data) return [10, 20, 30, 40, 50, 60, 70];
  if (Array.isArray(data)) return data;
  return data.toString().split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
}

function ClientCard({ client: rawClient, onClick }: { client: any; onClick: () => void }) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const client = useMemo(() => {
    return {
      ...rawClient,
      name: rawClient.name || rawClient.title || '',
      img_url: rawClient.img_url || rawClient.media_url || rawClient.img || '',
      description: rawClient.description || rawClient.purpose || '',
    };
  }, [rawClient]);

  return (
    <motion.div
      whileHover={{ scale: 1.2, zIndex: 50 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300, mass: 0.8 }}
      className="card-track-item"
      style={{ position: 'relative', cursor: 'pointer', flex: '0 0 280px' }}
    >
      <SpotlightCard
        className="reveal-card"
        style={{
          height: '420px',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '35px',
          position: 'relative',
          background: '#0c1015'
        }}
      >
        <div onClick={onClick} style={{ height: '100%', position: 'relative' }}>
          {/* SKELETON LOADER */}
          {!isLoaded && (
            <div className="skeleton-pulse" style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)', 
              backgroundSize: '200% 100%',
              zIndex: 5
            }} />
          )}

          {/* BACKGROUND IMAGE - Cinematic Focus */}
          {client.img_url && (
            <img
              src={client.img_url}
              loading="lazy"
              alt={client.name}
              onLoad={() => setIsLoaded(true)}
              onError={() => setIsLoaded(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: isLoaded ? 0.6 : 0,
                position: 'absolute',
                inset: 0,
                transition: 'opacity 1s ease'
              }}
            />
          )}

          {/* INITIAL CONTENT (Always visible overlay) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            gap: '12px',
            background: 'linear-gradient(to bottom, transparent, rgba(5,3,4,0.4) 30%, rgba(5,3,4,0.9) 95%)',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
                {cleanStr(client.name)}
              </h3>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--c1)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {cleanStr(client.result)}
              </div>
            </div>
          </div>

          {/* HOVER REVEAL EFFECT (Content at bottom) */}
          <div
            className="hover-desc-reveal"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '24px 20px',
              background: 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.92) 80%, transparent 100%)',
              zIndex: 30,
              pointerEvents: 'none'
            }}
          >
            <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 500, lineHeight: '1.5', margin: 0, opacity: 0.9 }}>
              {cleanStr(client.description)}
            </p>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

export default function SectionCampaigns() {
  const [clients, setClients] = useState(FALLBACK_CLIENTS);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCampaigns().then(data => { if (data && data.length > 0) setClients(data); }).catch(() => { });
  }, []);

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedIndex]);

  const selectedClientRaw = selectedIndex !== null ? (clients[selectedIndex] as any) : null;
  const selectedClient = useMemo(() => {
    if (!selectedClientRaw) return null;
    return {
      ...selectedClientRaw,
      name: selectedClientRaw.name || selectedClientRaw.title || '',
      img_url: selectedClientRaw.img_url || selectedClientRaw.media_url || selectedClientRaw.img || '',
      description: selectedClientRaw.description || selectedClientRaw.purpose || '',
    };
  }, [selectedClientRaw]);
  const marqueeItems = useMemo(() => {
    // If we have very few clients, repeat them enough to fill the scrolling track
    if (clients.length === 0) return [];
    if (clients.length < 3) return [...clients, ...clients, ...clients]; 
    if (clients.length < 6) return [...clients, ...clients];
    return clients;
  }, [clients]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.offsetWidth;
      const scrollAmount = direction === 'left' ? -containerWidth : containerWidth;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="campaigns">
      <div className="standard-container">
        <PremiumWrapper className="campaigns-premium-container" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 className="section-title reveal-up" style={{ textAlign: 'center', margin: '0 auto' }}>Clients</h2>
            <p className="reveal-up stagger-1" style={{ opacity: 0.5, marginTop: '16px', textAlign: 'center' }}>Proven distribution results across major niches.</p>
          </div>

          {/* NAVIGATION WRAPPER */}
          <div style={{ position: 'relative' }}>
            {/* FLOATING NAVIGATION BUTTONS - FIXED POSITIONING */}
            <div style={{ position: 'absolute', top: '50%', left: '-30px', zIndex: 100, transform: 'translateY(-50%)' }}>
               <button 
                onClick={() => scroll('left')}
                className="nav-slide-btn"
                style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', color: '#fff', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = '0 0 20px var(--c1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)'; }}
               >‹</button>
            </div>
            <div style={{ position: 'absolute', top: '50%', right: '-30px', zIndex: 100, transform: 'translateY(-50%)' }}>
               <button 
                onClick={() => scroll('right')}
                className="nav-slide-btn"
                style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', color: '#fff', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = '0 0 20px var(--c1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)'; }}
               >›</button>
            </div>

            <div
              className="marquee-container"
              ref={scrollRef}
              style={{
                overflowX: 'auto',
                scrollbarWidth: 'none',
                padding: '120px 0',
                position: 'relative',
                cursor: 'grab'
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                className="marquee-track"
                style={{
                  display: 'flex',
                  gap: '24px',
                  width: 'fit-content',
                  animation: isPaused ? 'none' : 'marquee 80s linear infinite',
                }}
              >
              {marqueeItems.map((client: Campaign, idx: number) => (
                <ClientCard
                  key={`${client.id}-${idx}`}
                  client={client}
                  onClick={() => setSelectedIndex(idx % clients.length)}
                />
              ))}
            </div>
          </div>
        </div>
        </PremiumWrapper>
      </div>

      <AnimatePresence>
        {selectedClient && (
          <motion.div 
            className="cinematic-modal-overlay" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(0,0,0,0.9)', 
              backdropFilter: 'blur(30px)', 
              zIndex: 10000, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '40px',
              overflowY: 'auto'
            }}
            onClick={() => setSelectedIndex(null)}
          >
            {/* GLOBAL CLOSE BUTTON (TOP RIGHT) */}
            <button 
              onClick={() => setSelectedIndex(null)} 
              style={{ position: 'fixed', top: '40px', right: '40px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10001, transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >✕</button>

            <motion.div 
              className="modal-content-box" 
              initial={{ scale: 0.9, opacity: 0, y: 30 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              style={{ 
                maxWidth: '1000px', 
                width: '100%', 
                background: '#0c1015', 
                borderRadius: '40px', 
                border: '1px solid rgba(255,255,255,0.08)', 
                overflow: 'hidden', 
                boxShadow: '0 50px 150px rgba(0,0,0,1)', 
                position: 'relative',
                margin: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* CAMPAIGN HERO IMAGE */}
              <div className="modal-hero-img-box" style={{ width: '100%', height: '350px', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {selectedClient.img_url && (
                  <img src={selectedClient.img_url} alt={selectedClient.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, #0c1015 100%)' }} />
                
                {/* FLOATING HEADER ON IMAGE */}
                <div className="modal-floating-header" style={{ position: 'absolute', bottom: '32px', left: '48px', right: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div className="modal-index-badge" style={{ padding: '6px 16px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '1rem', opacity: 0.8, fontWeight: 800, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }}>
                        {selectedClient.index_label || '01'}
                      </div>
                      <div>
                        <h2 className="modal-hero-title" style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-2.5px', lineHeight: 1 }}>{cleanStr(selectedClient.name)}</h2>
                        <div style={{ marginTop: '12px', padding: '4px 14px', background: 'var(--c1)', borderRadius: '20px', fontSize: '0.75rem', color: '#000', fontWeight: 800, display: 'inline-block' }}>
                          {cleanStr(selectedClient.tag || selectedClient.category)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} style={{ display: 'flex', gap: '40px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>{selectedClient.views_total || '0'}</div>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5, letterSpacing: '2px', fontWeight: 700 }}>Total Views</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--c1)' }}>{selectedClient.roi || '0x'}</div>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5, letterSpacing: '2px', fontWeight: 700 }}>Projected ROI</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="modal-inner-padding" style={{ padding: '64px 48px' }}>
                {/* PROJECT OVERVIEW / DESCRIPTION (Moved Higher) */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginBottom: '48px', background: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--c1)', borderRadius: '50%', boxShadow: '0 0 10px var(--c1)' }} />
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Project Overview</h4>
                  </div>
                  <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.8', margin: 0, fontWeight: 500 }}>
                    {selectedClient.description || 'No description available for this campaign.'}
                  </p>
                </motion.div>

                {/* 5-GRID METRICS RIBBON */}
                <div className="modal-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '48px' }}>
                  {[
                    { label: 'Total Views', val: selectedClient.views_total || '0', sub: 'VIEWS' },
                    { label: 'Creators', val: selectedClient.creators_count || '0', sub: 'CREATORS' },
                    { label: 'Budget', val: selectedClient.budget_label || selectedClient.price || '0', sub: 'BUDGET' },
                    { label: 'CPM', val: selectedClient.cpm_label || '0', sub: 'EST. CPM' },
                    { label: 'Duration', val: selectedClient.duration_label || '0', sub: 'DURATION' },
                  ].map((m, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '24px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>{m.val}</div>
                      <div style={{ fontSize: '0.6rem', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>{m.sub}</div>
                    </div>
                  ))}
                </div>


                {/* MAIN CONTENT AREA */}
                <div className="modal-content-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '48px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '8px', height: '8px', background: 'var(--c1)', borderRadius: '50%', boxShadow: '0 0 10px var(--c1)' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>The Challenge</h4>
                      </div>
                      <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8', margin: 0 }}>
                        {selectedClient.challenge_text || selectedClient.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '8px', height: '8px', background: 'var(--c1)', borderRadius: '50%', boxShadow: '0 0 10px var(--c1)' }} />
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>What We Did</h4>
                      </div>
                      <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8', margin: 0 }}>
                        {selectedClient.what_we_did_text || 'Implemented organic distribution network and strategic content hooks.'}
                      </p>
                    </div>

                    {/* SQUARE PERFORMANCE GRAPH - BOTTOM LEFT */}
                    <div style={{ marginTop: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '8px', height: '8px', background: 'var(--c1)', borderRadius: '50%', boxShadow: '0 0 10px var(--c1)' }} />
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Performance Projection</h4>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px 20px 10px 20px', height: '280px', width: '100%', maxWidth: '350px' }}>
                        <AnalyticsGraph data={parseGraphData(selectedClient.graph_data)} height={240} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* HIGHLIGHT BOX: WHY IT WORKED */}
                    <div style={{ background: 'rgba(0, 230, 118, 0.03)', border: '1px solid rgba(0, 230, 118, 0.15)', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#00e676', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
                        Why It Worked
                      </h4>
                      <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', margin: 0, fontWeight: 500 }}>
                        {selectedClient.why_it_worked_text || 'Leveraged high-intent creators to amplify brand messaging across multiple platforms simultaneously.'}
                      </p>
                    </div>

                    {/* DARK BOX: WHAT THE STUDIO LEARNED */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '24px', padding: '40px' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
                        Studio Learnings
                      </h4>
                      <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7', margin: 0 }}>
                        {selectedClient.learned_text || 'Scaling organic reach requires a balance of quantity and strict quality control at the clipper level.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
