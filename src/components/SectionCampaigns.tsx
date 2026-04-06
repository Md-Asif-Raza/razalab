'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalyticsGraph from './AnalyticsGraph';
import { getCampaigns } from '@/lib/actions';
import { PremiumWrapper, SpotlightCard } from './ui/PremiumUI';

const FALLBACK_CLIENTS = [
  { id: '1', name: 'Dank Drops', category: 'Viral Distribution', result: '+114%', price: '$4,500', description: 'We deployed a network of 50 viral clippers to distribute Dank Drops product launches. Resulted in 12M+ organic views in 30 days.', graph_data: '20,35,25,45,60,85,114', img_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80' },
  { id: '2', name: 'Raza AI', category: 'Product Launch', result: '+88%', price: '$6,200', description: 'Scaled Raza AI awareness through strategic short-form educational content. Generated over 8.5M views and 40k signups.', graph_data: '10,15,30,40,55,70,88', img_url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&q=80' },
  { id: '3', name: 'Nectar', category: 'UGC Campaign', result: '+210%', price: '$3,800', description: 'Automated UGC distribution for Nectar e-commerce. Achieved 210% increase in social traffic and significant ROAS boost.', graph_data: '15,45,80,120,160,190,210', img_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80' },
  { id: '4', name: 'Glitch', category: 'Artist Strategy', result: '+156%', price: '$5,500', description: 'Strategic artist positioning through trend-aligned clips. Scaled Glitch from 10k to 250k followers in 3 months.', graph_data: '5,25,50,75,100,130,156', img_url: 'https://images.unsplash.com/photo-1633167606207-38433714614f?w=800&q=80' },
  { id: '5', name: 'Aether', category: 'SaaS Growth', result: '+94%', price: '$7,000', description: 'Applied the distribution engine to Aether SaaS features. Generated consistent monthly organic reach of 5M+ views.', graph_data: '30,40,35,55,65,80,94', img_url: 'https://images.unsplash.com/photo-1620121692029-d088224efc74?w=800&q=80' },
];

function parseGraphData(data: string | number[] | undefined): number[] {
  if (!data) return [10, 20, 30, 40, 50, 60, 70];
  if (Array.isArray(data)) return data;
  return data.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
}

const TripleChevron = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
    <polyline points="7 7 12 12 7 17" />
    <polyline points="13 7 18 12 13 17" />
  </svg>
);

function ClientCard({ client, onClick }: { client: any; onClick: () => void }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      style={{ position: 'relative', cursor: 'pointer', flex: '0 0 350px' }}
    >
      <SpotlightCard 
        className="reveal-card" 
        style={{ 
          height: '450px', 
          width: '100%',
          overflow: 'hidden',
          borderRadius: '32px'
        }}
      >
        <div onClick={onClick} style={{ height: '100%', position: 'relative' }}>
          {/* BACKGROUND IMAGE */}
          <img 
            src={client.img_url} 
            loading="lazy" 
            alt={client.name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              opacity: 0.4
            }} 
          />

          {/* INITIAL STATS OVERLAY (GROW & MONEY) */}
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            padding: '32px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent, rgba(0,0,0,0.8))'
          }}>
            <div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', display: 'inline-block', marginBottom: '12px' }}>
                {client.category}
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-1px' }}>{client.name}</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(0, 230, 118, 0.1)', border: '1px solid rgba(0, 230, 118, 0.2)', padding: '12px', borderRadius: '16px' }}>
                <div style={{ fontSize: '0.65rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '2px' }}>Growth</div>
                <div style={{ color: '#00e676', fontWeight: 800, fontSize: '1.25rem' }}>{client.result}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '12px', borderRadius: '16px' }}>
                <div style={{ fontSize: '0.65rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '2px' }}>Payout</div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.25rem' }}>{client.price}</div>
              </div>
            </div>
          </div>

          {/* HOVER DESCRIPTION REVEAL (BOTTOM ALIGNED) */}
          <div 
            className="hover-desc-reveal"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(5, 3, 4, 1) 0%, rgba(5, 3, 4, 0.98) 70%, transparent 100%)',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              opacity: 0,
              transform: 'translateY(100%)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              zIndex: 30, /* Higher z-index to stay above initial stats */
              pointerEvents: 'none'
            }}
          >
            <div style={{ marginBottom: 'auto', paddingTop: '20px' }}>
               <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                 Project Overview
               </div>
               <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>{client.name}</h4>
            </div>
            
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '32px' }}>
              {client.description}
            </p>
            
            <button style={{ background: 'var(--c1)', color: '#fff', border: 'none', padding: '16px 28px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, alignSelf: 'flex-start', cursor: 'pointer', pointerEvents: 'auto' }}>
              Scale Like This →
            </button>
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

  useEffect(() => {
    getCampaigns().then(data => { if (data && data.length > 0) setClients(data); }).catch(() => {});
  }, []);

  const selectedClient = selectedIndex !== null ? clients[selectedIndex] : null;
  const marqueeItems = useMemo(() => [...clients, ...clients, ...clients, ...clients], [clients]);

  return (
    <section id="campaigns">
      <div className="standard-container">
        <PremiumWrapper className="campaigns-premium-container">
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 className="section-title reveal-up">Clients</h2>
            <p style={{ opacity: 0.5, marginTop: '16px' }}>Proven distribution results across major niches.</p>
          </div>

          <div 
            className="marquee-container" 
            style={{ 
              overflow: 'visible', 
              padding: '60px 0', 
              position: 'relative',
              maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
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
                animation: 'marquee 80s linear infinite',
                animationPlayState: isPaused ? 'paused' : 'running'
              }}
            >
              {marqueeItems.map((client, idx) => (
                <ClientCard 
                  key={`${client.id}-${idx}`} 
                  client={client} 
                  onClick={() => setSelectedIndex(idx % clients.length)} 
                />
              ))}
            </div>
          </div>
        </PremiumWrapper>
      </div>

      <AnimatePresence>
        {selectedClient && (
          <motion.div className="cinematic-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(32px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div className="modal-content-box" initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 40 }}
              style={{ maxWidth: '1100px', width: '100%', background: '#050304', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1.2fr 1fr', boxShadow: '0 50px 150px rgba(0,0,0,1)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ height: '100%', minHeight: '600px', position: 'relative' }}>
                <img src={selectedClient.img_url} loading="lazy" alt={selectedClient.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 40, left: 40, right: 40, background: 'rgba(5,3,4,0.6)', padding: '24px', borderRadius: '24px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '4px', opacity: 0.5, marginBottom: '8px' }}>Performance Analytics</div>
                  <AnalyticsGraph data={parseGraphData(selectedClient.graph_data)} color="#00e676" height={120} />
                </div>
              </div>
              <div style={{ padding: '60px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: '#00e676', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}>{selectedClient.category}</div>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#fff', marginBottom: '24px', textAlign: 'left', letterSpacing: '-2px' }}>{selectedClient.name}</h2>
                <p style={{ fontSize: '1.15rem', opacity: 0.6, lineHeight: '1.7', marginBottom: '48px' }}>{selectedClient.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: 'auto' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.7rem', opacity: 0.4, textTransform: 'uppercase', marginBottom: '8px' }}>ROI Growth</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00e676' }}>{selectedClient.result}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.7rem', opacity: 0.4, textTransform: 'uppercase', marginBottom: '8px' }}>Total Payout</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>{selectedClient.price}</div>
                  </div>
                </div>
                <div style={{ marginTop: '48px', display: 'flex', gap: '16px' }}>
                  <button onClick={() => setSelectedIndex(null)} className="btn-ghost" style={{ flex: 1, padding: '18px 32px' }}>Close Case Study</button>
                  <button className="btn-primary" style={{ padding: '18px 32px', background: 'var(--c1)', color: '#fff', fontWeight: 800 }}>Scale Like This →</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
