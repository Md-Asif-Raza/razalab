'use client';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
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

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = () => {};
  const handleMouseLeave = () => {};

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
      onClick={onClick}
      style={{
        position: 'relative',
        cursor: 'pointer',
        flex: '0 0 min(280px, 75vw)', // FIX: responsive card width
        perspective: '1000px',
        zIndex: 1
      }}
      className="card-track-item reveal-card"
      whileHover={{ scale: 1.2, zIndex: 100 }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 20 
      }}
    >
      {/* Card Ambient Glow */}
      <div style={{
        position: 'absolute',
        bottom: '-25px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '75%',
        height: '100px',
        background: 'radial-gradient(ellipse at center, rgba(90, 104, 130, 0.50) 0%, rgba(70, 80, 150, 0.25) 40%, transparent 70%)',
        filter: 'blur(25px)',
        pointerEvents: 'none',
        zIndex: -1,
        opacity: 0.8,
        transition: 'opacity 0.4s ease',
      }} />
      <SpotlightCard
        size="big"
        className="reveal-card shimmer-card"
        style={{
          height: '420px',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '32px',
          position: 'relative'
        }}
      >
        <div onClick={onClick} style={{ height: '100%', position: 'relative' }}>
          {/* SHIMMER EFFECT OVERLAY */}
          <div className="card-shimmer-sweep" />

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
                opacity: isLoaded ? 0.85 : 0,
                filter: 'brightness(0.85)',
                position: 'absolute',
                inset: 0,
                transition: 'opacity 1s ease',
              }}
            />
          )}

          {/* CONTENT (Always visible overlay) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            gap: '12px',
            background: 'linear-gradient(to bottom, transparent 10%, rgba(5,3,4,0.3) 40%, rgba(5,3,4,0.85) 100%)',
            zIndex: 40,
            pointerEvents: 'none',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'auto' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
                {cleanStr(client.name)}
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ padding: '4px 10px', background: 'rgba(0, 230, 118, 0.1)', border: '1px solid rgba(0, 230, 118, 0.2)', borderRadius: '10px', color: '#00e676', fontWeight: 800, fontSize: '0.8rem' }}>{cleanStr(client.result)}</div>
                <div style={{ padding: '4px 10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff', fontWeight: 600, fontSize: '0.8rem' }}>{cleanStr(client.price)}</div>
              </div>

              {/* DESCRIPTION TEXT - SLIDES DOWN ON HOVER */}
              <div className="hover-desc-wrapper" style={{ transform: "translateZ(50px)" }}>
                <div className="hover-desc-inner">
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 500, lineHeight: '1.6', margin: 0, paddingTop: '10px' }}>
                    {cleanStr(client.description)}
                  </p>
                </div>
              </div>
            </div>
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
    const lenis = (window as any).lenis;
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      lenis?.start();
    };
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
    // For a seamless -50% translation loop, we need two identical sets.
    // When few items exist, repeat them enough to fill the viewport first.
    if (clients.length === 0) return [];
    const minItems = Math.max(6, Math.ceil(8 / clients.length)) * clients.length;
    const singleSet: Campaign[] = [];
    while (singleSet.length < minItems) {
      singleSet.push(...clients);
    }
    return [...singleSet, ...singleSet]; // duplicate for seamless -50% loop
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

  // Mobile Auto-Scroll Logic
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // Small delay to ensure layout is ready
      const timer = setTimeout(() => {
        const element = document.getElementById('campaigns');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section id="campaigns" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="standard-container" style={{ marginBottom: '60px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center' }}
        >
          <h2 className="section-title" style={{ textAlign: 'center', margin: '0 auto', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, letterSpacing: '-2px' }}>Clients</h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.5, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ marginTop: '16px', textAlign: 'center', fontSize: '1.25rem' }}
          >Proven distribution results across major niches.</motion.p>
        </motion.div>
      </div>

      <div className="standard-container" style={{ maxWidth: '1520px' }}>
        <PremiumWrapper className="campaigns-premium-container" style={{ paddingTop: 'clamp(40px, 8vw, 80px)', paddingBottom: 'clamp(40px, 8vw, 80px)', borderRadius: '48px', overflow: 'hidden' }}> {/* FIX: responsive padding on mobile */}
          <div style={{ position: 'relative' }}>
            {/* FLOATING SIDE NAVIGATION (DESKTOP) */}
            <button
              onClick={() => scroll('left')}
              className="nav-slide-btn portfolio-side-btn left hidden lg-flex"
              aria-label="Previous slide"
              style={{
                position: 'absolute',
                top: '50%',
                left: '24px',
                transform: 'translateY(-50%)',
                zIndex: 100,
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >‹</button>
            <button
              onClick={() => scroll('right')}
              className="nav-slide-btn portfolio-side-btn right hidden lg-flex"
              aria-label="Next slide"
              style={{
                position: 'absolute',
                top: '50%',
                right: '24px',
                transform: 'translateY(-50%)',
                zIndex: 100,
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >›</button>
            <div
              className="marquee-container"
              ref={scrollRef}
              style={{
                overflowX: 'auto',
                scrollbarWidth: 'none',
                padding: 'clamp(40px, 8vw, 80px) 0', // FIX: responsive padding on mobile
                position: 'relative',
                cursor: 'grab',
                width: '100%' // FIX: ensure full width
              }}
            >
              <div
                className={`marquee-track marquee-track-animation ${isPaused ? 'is-paused' : ''}`}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                style={{
                  display: 'flex',
                  gap: '24px',
                  width: 'fit-content'
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

            {/* MOBILE ONLY NAVIGATION CONTROLS */}
            <div className="navigation-control-group flex justify-center gap-6 mt-8 lg-hidden">
              <button
                onClick={() => scroll('left')}
                className="nav-slide-btn"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#0066FF',
                  color: '#fff',
                  fontSize: '1.8rem',
                  border: 'none',
                  boxShadow: '0 8px 24px rgba(0, 102, 255, 0.4)'
                }}
                aria-label="Previous slide"
              >‹</button>
              <button
                onClick={() => scroll('right')}
                className="nav-slide-btn"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#0066FF',
                  color: '#fff',
                  fontSize: '1.8rem',
                  border: 'none',
                  boxShadow: '0 8px 24px rgba(0, 102, 255, 0.4)'
                }}
                aria-label="Next slide"
              >›</button>
            </div>

          </div>
        </PremiumWrapper>
      </div>

      <AnimatePresence>
        {selectedClient && (
          <motion.div
            className="cinematic-modal-overlay"
            data-lenis-prevent="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5, 3, 4, 0.95)',
              backdropFilter: 'blur(40px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'flex-start', // FULL-PAGE: Start from top
              justifyContent: 'center',
              padding: 'clamp(0px, 0vw, 40px)', // No padding on outer for seamless feel
              overflowY: 'auto',
              scrollBehavior: 'smooth'
            }}
            onClick={() => setSelectedIndex(null)}
          >
            {/* GLOBAL CLOSE BUTTON (TOP RIGHT) */}
            <button
              onClick={() => setSelectedIndex(null)}
              style={{ 
                position: 'fixed', 
                top: 'clamp(20px, 4vw, 40px)', 
                right: 'clamp(20px, 4vw, 40px)', 
                background: 'rgba(5, 3, 4, 0.6)', 
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)', 
                color: '#fff', 
                width: 'clamp(48px, 10vw, 64px)', 
                height: 'clamp(48px, 10vw, 64px)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer', 
                zIndex: 10001, 
                transition: 'all 0.3s ease', 
                fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                boxShadow: '0 0 30px rgba(0,0,0,0.5), 0 0 15px rgba(255,255,255,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--c1)';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.borderColor = 'var(--c1)';
                e.currentTarget.style.boxShadow = '0 0 30px var(--c1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(5, 3, 4, 0.6)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0,0,0,0.5), 0 0 15px rgba(255,255,255,0.1)';
              }}
            >✕</button>

            <motion.div
              className="modal-content-box"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              style={{
                maxWidth: '1280px', // INCREASED: wider modal content
                width: '100%',
                background: '#0c1015',
                borderRadius: '0 0 40px 40px', // No top radius for seamless full-page feel
                border: '1px solid rgba(255,255,255,0.08)',
                borderTop: 'none',
                overflow: 'hidden',
                boxShadow: '0 50px 150px rgba(0,0,0,1)',
                position: 'relative',
                margin: '0 auto 100px auto', // Bottom margin for scrolling space
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* CAMPAIGN HERO IMAGE — Increased height for full photo visibility */}
              <div className="modal-hero-img-box" style={{
                width: '100%',
                height: 'clamp(500px, 85vh, 900px)', // INCREASED: immersive full hero
                position: 'relative',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                background: '#050304',
                overflow: 'hidden'
              }}>
                {selectedClient.img_url && (
                  <img
                    src={selectedClient.img_url}
                    alt={selectedClient.name}
                    onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                    onError={(e) => (e.currentTarget.style.opacity = '1')}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top center', // FIX: ensure heads are not cut off
                      opacity: 0,
                      transition: 'opacity 0.8s ease'
                    }}
                  />
                )}
                {/* Refined gradient: deeper at bottom, clearer at top */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, transparent 30%, rgba(12, 16, 21, 0.4) 60%, #0c1015 100%)'
                }} />

                {/* FLOATING HEADER ON IMAGE */}
                <div className="modal-floating-header" style={{
                  position: 'absolute',
                  bottom: '32px',
                  left: 'clamp(20px, 5vw, 48px)',
                  right: 'clamp(20px, 5vw, 48px)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: '20px',
                  zIndex: 10
                }}>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div className="modal-index-badge" style={{ padding: '6px 16px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '1rem', opacity: 0.8, fontWeight: 800, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }}>
                        {selectedClient.index_label || '01'}
                      </div>
                      <div>
                        <h2 className="modal-hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-2.5px', lineHeight: 1 }}>{cleanStr(selectedClient.name)}</h2>
                        <div style={{ marginTop: '12px', padding: '4px 14px', background: 'var(--c1)', borderRadius: '20px', fontSize: '0.75rem', color: '#000', fontWeight: 800, display: 'inline-block' }}>
                          {cleanStr(selectedClient.tag || selectedClient.category)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} style={{ display: 'flex', gap: '40px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 900, color: '#fff' }}>{selectedClient.views_total || '0'}</div>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5, letterSpacing: '2px', fontWeight: 700 }}>Total Views</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 900, color: 'var(--c1)' }}>{selectedClient.roi || '0x'}</div>
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

      {/* ═══ BOTTOM FADE MASK — cards dissolve into background ═══ */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '120px',
        background: 'linear-gradient(to bottom, transparent, #050304)',
        pointerEvents: 'none',
        zIndex: 10,
      }} />
    </section>
  );
}

