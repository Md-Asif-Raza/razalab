'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalyticsGraph from './AnalyticsGraph';
import { getCampaigns } from '@/lib/actions';

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
    <motion.div className="client-crystal-card" style={{ minWidth: '380px', height: '480px', cursor: 'pointer' }} onClick={onClick} whileHover={{ y: -10 }}>
      <div className="crystal-media-wrapper" style={{ height: '60%' }}>
        <img src={client.img_url} alt={client.name} className="crystal-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div className="client-cat-badge" style={{ position: 'absolute', top: 20, left: 20 }}>{client.category}</div>
        <div className="inner-glow-highlight" />
      </div>
      <div className="crystal-text-area" style={{ padding: '32px' }}>
        <div className="crystal-divider" />
        <h3 className="client-name" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>{client.name}</h3>
        <div className="client-result-pill" style={{ color: 'var(--aura-neon)', fontWeight: 800 }}>
          {client.result} <span style={{ opacity: 0.5, fontSize: '0.7rem', fontWeight: 400 }}>Views Growth</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function SectionCampaigns() {
  const [clients, setClients] = useState(FALLBACK_CLIENTS);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [manualOffset, setManualOffset] = useState(0);

  useEffect(() => {
    getCampaigns().then(data => { if (data && data.length > 0) setClients(data); }).catch(() => {});
  }, []);

  const selectedClient = selectedIndex !== null ? clients[selectedIndex] : null;
  const marqueeItems = useMemo(() => [...clients, ...clients, ...clients], [clients]);

  const handleManualStep = (dir: 'left' | 'right') => {
    const step = 412;
    setManualOffset(prev => dir === 'left' ? prev + step : prev - step);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 2000);
  };

  return (
    <section id="campaigns" className="clients-section" style={{ padding: '200px 0' }}>
      <div className="clients-header container">
        <div style={{ textAlign: 'center', marginBottom: '80px', width: '100%' }}>
          <h2 className="section-title reveal-up">Clients</h2>
        </div>
      </div>

      <div className="marquee-container" style={{ overflow: 'hidden', padding: '40px 0', position: 'relative' }} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <button className="portfolio-side-btn left" onClick={(e) => { e.stopPropagation(); handleManualStep('left'); }} style={{ position: 'absolute', left: '20px', zIndex: 20, top: '50%', transform: 'translateY(-50%)' }}>
          <div style={{ transform: 'rotate(180deg)', display: 'flex' }}><TripleChevron /></div>
        </button>
        <button className="portfolio-side-btn right" onClick={(e) => { e.stopPropagation(); handleManualStep('right'); }} style={{ position: 'absolute', right: '20px', zIndex: 20, top: '50%', transform: 'translateY(-50%)' }}>
          <TripleChevron />
        </button>

        <motion.div
          className="marquee-track"
          animate={!isPaused ? { x: [manualOffset, manualOffset - 2060] } : { x: manualOffset }}
          transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" } }}
          style={{ display: 'flex', gap: '32px' }}
        >
          {marqueeItems.map((client, idx) => (
            <ClientCard key={`${client.id}-${idx}`} client={client} onClick={() => setSelectedIndex(idx % clients.length)} />
          ))}
        </motion.div>
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
                <img src={selectedClient.img_url} alt={selectedClient.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 40, left: 40, right: 40, background: 'rgba(5,3,4,0.6)', padding: '24px', borderRadius: '24px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '4px', opacity: 0.5, marginBottom: '8px' }}>Performance Analytics</div>
                  <AnalyticsGraph data={parseGraphData(selectedClient.graph_data)} color="var(--aura-neon)" height={120} />
                </div>
              </div>
              <div style={{ padding: '60px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: 'var(--aura-neon)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}>{selectedClient.category}</div>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#fff', marginBottom: '24px', textAlign: 'left', letterSpacing: '-2px' }}>{selectedClient.name}</h2>
                <p style={{ fontSize: '1.15rem', opacity: 0.6, lineHeight: '1.7', marginBottom: '48px' }}>{selectedClient.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: 'auto' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.7rem', opacity: 0.4, textTransform: 'uppercase', marginBottom: '8px' }}>ROI Growth</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--aura-neon)' }}>{selectedClient.result}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.7rem', opacity: 0.4, textTransform: 'uppercase', marginBottom: '8px' }}>Total Payout</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>{selectedClient.price}</div>
                  </div>
                </div>
                <div style={{ marginTop: '48px', display: 'flex', gap: '16px' }}>
                  <button onClick={() => setSelectedIndex(null)} className="speed-btn" style={{ flex: 1, padding: '18px 32px' }}>Close Case Study</button>
                  <button className="speed-btn" style={{ padding: '18px 32px', background: 'var(--aura-neon)', color: '#000', fontWeight: 800 }}>Scale Like This →</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
