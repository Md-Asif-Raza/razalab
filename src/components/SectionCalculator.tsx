'use client';

import React, { useState, useEffect } from 'react';
import { getSiteSettings } from '@/lib/actions';
import Link from 'next/link';

// ROI Calculator in Pinterest Aesthetic
// Bulletproof Architecture with Inline Styles for Core Columns

const calcConfig = {
  target_cpm: 25.00,
  organic_cpm: 1.00,
  avg_ctr: 0.05,
  conversion_rate: 0.02
};

export default function SectionCalculator() {
  const [clippers, setClippers] = useState(10);
  const [posts, setPosts] = useState(2);
  const [platforms, setPlatforms] = useState(1);
  const [viewsPerPost, setViewsPerPost] = useState(15000);
  const [settings, setSettings] = useState({
    cta_text: 'Book Your Strategic Consultation \u2192',
    cta_link: '#cta-end'
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    getSiteSettings().then(res => {
      if (res) {
        setSettings({
          cta_text: res.cta_button_text || 'Book Your Strategic Consultation \u2192',
          cta_link: res.cta_button_link || '#cta-end'
        });
      }
    }).catch(() => {});
  }, []);

  const totalMonthlyPosts = clippers * posts * 4.33;
  const monthlyViews = totalMonthlyPosts * platforms * viewsPerPost;
  const annualViews = monthlyViews * 12;
  const organicValue = (annualViews / 1000) * calcConfig.target_cpm;
  const organicCost = (annualViews / 1000) * calcConfig.organic_cpm;
  const savings = organicValue - organicCost;

  return (
    <section id="roi-calculator" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="section-starter-glow" />
      <div className="glow-blend-divider" />
      <div className="standard-container" style={{ position: 'relative', zIndex: 30, maxWidth: '1180px' }}>
        <div className="text-center" style={{ marginBottom: '60px' }}>
          <h2 className="section-title reveal-up" style={{ textAlign: 'center', margin: '0 auto', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800 }}>ROI Calculator</h2>
          <p className="reveal-up stagger-1" style={{ opacity: 0.4, marginTop: '24px', textAlign: 'center', fontSize: '1.25rem', maxWidth: '700px', margin: '24px auto 0' }}>Project your growth through the Raza Labs distribution engine.</p>
        </div>

        <div className="calc-main-container" style={{ // FIX: CRITICAL responsive calc container
          background: '#0c1015', 
          border: '1px solid rgba(255,255,255,0.03)', 
          borderRadius: '32px', 
          padding: 'clamp(16px, 4vw, 24px)', // FIX: responsive padding
          boxShadow: '0 32px 128px rgba(0,0,0,0.8)',
          width: '100%', // FIX: full width
          maxWidth: '100%', // FIX: prevent overflow
          overflow: 'hidden', // FIX: clip any overflow
          boxSizing: 'border-box' // FIX: padding included in width
        }}> 
          <div className="dual-pane-calc"> 

            
            {/* LEFT COLUMN: STRATEGIC VARIABLES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '3px', height: '24px', backgroundColor: '#3b82f6', borderRadius: '99px' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'rgba(255,255,255,0.9)' }}>Strategic Variables</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.3 }}>Clippers</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#3b82f6' }}>{clippers.toLocaleString('en-US')}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={clippers} 
                  onChange={(e) => setClippers(parseInt(e.target.value))} 
                  style={{ width: '100%', maxWidth: '100%', cursor: 'pointer', accentColor: '#3b82f6', height: '4px', boxSizing: 'border-box' }} // FIX: full width + box-sizing
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.3 }}>Weekly Posts</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#3b82f6' }}>{posts.toLocaleString('en-US')}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={posts} 
                  onChange={(e) => setPosts(parseInt(e.target.value))} 
                  style={{ width: '100%', maxWidth: '100%', cursor: 'pointer', accentColor: '#3b82f6', height: '4px', boxSizing: 'border-box' }} // FIX: full width + box-sizing
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.3 }}>Scale</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#3b82f6' }}>{platforms.toLocaleString('en-US')}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={platforms} 
                  onChange={(e) => setPlatforms(parseInt(e.target.value))} 
                  style={{ width: '100%', maxWidth: '100%', cursor: 'pointer', accentColor: '#3b82f6', height: '4px', boxSizing: 'border-box' }} // FIX: full width + box-sizing
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.3 }}>Video Views</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#3b82f6' }}>{isMounted ? viewsPerPost.toLocaleString('en-US') : viewsPerPost}</span>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="100000" 
                  step="1000"
                  value={viewsPerPost} 
                  onChange={(e) => setViewsPerPost(parseInt(e.target.value))} 
                  style={{ width: '100%', maxWidth: '100%', cursor: 'pointer', accentColor: '#3b82f6', height: '4px', boxSizing: 'border-box' }} // FIX: full width + box-sizing
                />
              </div>
            </div>

            {/* RIGHT COLUMN: PROJECTION RESULTS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="calc-result-card" style={{ // FIX: added className for mobile override
                background: '#161b22', 
                borderRadius: '24px', // FIX: smaller radius for mobile fit
                padding: 'clamp(24px, 4vw, 40px) clamp(16px, 3vw, 32px)', // FIX: responsive padding
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
                overflow: 'hidden', // FIX: prevent any child from overflowing
                width: '100%' // FIX: ensure it fills container
              }}>
                <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>Est. Annual Value</span>
                <div style={{ fontSize: 'clamp(1.5rem, 5vw, 4.5rem)', fontWeight: 900, color: '#3b82f6', lineHeight: 1, letterSpacing: '-0.05em', marginBottom: '12px', wordBreak: 'break-word', textAlign: 'center', maxWidth: '100%', overflow: 'hidden' }}> {/* FIX: clamp font + responsive sizing */}
                  ${isMounted ? savings.toLocaleString('en-US') : savings}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 800, opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '32px' }}>SAVED ANNUALLY</div>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}>Monthly Reach</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'rgba(255,255,255,0.9)' }}>{(monthlyViews / 1000000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M+</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}>Annual Volume</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'rgba(255,255,255,0.9)' }}>{(annualViews / 1000000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
