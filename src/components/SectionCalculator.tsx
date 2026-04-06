'use client';
import { useState, useEffect } from 'react';
import { getSiteSettings } from '@/lib/actions';
import { PremiumWrapper, SpotlightCard } from './ui/PremiumUI';

export default function SectionCalculator() {
  const [clippers, setClippers] = useState(10);
  const [posts, setPosts] = useState(2);
  const [platforms, setPlatforms] = useState(3);
  const [days, setDays] = useState(7);
  const [viewsPerPost, setViewsPerPost] = useState(15000);

  const [calcConfig, setCalcConfig] = useState({
    target_cpm: 25.00,
    organic_cpm: 1.00
  });

  useEffect(() => {
    getSiteSettings().then(res => {
      if (res) {
        setCalcConfig({
          target_cpm: Number(res.target_cpm) || 25.00,
          organic_cpm: Number(res.organic_cpm) || 1.00
        });
        if (res.platform_multiplier) setPlatforms(Number(res.platform_multiplier));
        if (res.days_multiplier) setDays(Number(res.days_multiplier));
      }
    }).catch(() => { });
  }, []);

  const weeklyPosts = clippers * posts * platforms * days;
  const weeklyViews = weeklyPosts * viewsPerPost;
  const monthlyViews = weeklyViews * 4;
  const annualViews = monthlyViews * 12;
  
  const paidCost = (annualViews / 1000) * calcConfig.target_cpm;
  const organicCost = (annualViews / 1000) * calcConfig.organic_cpm;
  const savings = Math.round(paidCost - organicCost);

  return (
    <section id="calculator" style={{ position: 'relative', overflow: 'visible' }}>
      <div className="section-starter-glow" />
      <div className="glow-blend-divider" />
      <div className="standard-container">
        <div style={{ textAlign: 'left', marginBottom: '80px' }}>
          <h2 className="section-title reveal-up" style={{ textAlign: 'left', margin: 0 }}>ROI Calculator</h2>
          <p className="reveal-up stagger-1" style={{ opacity: 0.5, marginTop: '16px', textAlign: 'left' }}>Project your growth through the Raza Labs distribution engine.</p>
        </div>

        <PremiumWrapper className="calc-premium-container" style={{ padding: '0', borderRadius: '48px' }}>
          <div className="dual-pane-calc reveal-up" style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 450px', background: 'transparent' }}>
            {/* LEFT PANE: CONFIGURATION */}
            <div style={{ padding: '60px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '40px', letterSpacing: '-0.5px' }}>Strategic Variables</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div className="calc-slider-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.6 }}>Clippers (Creators)</span>
                    <span style={{ fontWeight: 800, color: 'var(--c1)' }}>{clippers}</span>
                  </div>
                  <input type="range" min="1" max="100" value={clippers} onChange={(e) => setClippers(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--c1)' }} />
                </div>

                <div className="calc-slider-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.6 }}>Daily Posts per Clipper</span>
                    <span style={{ fontWeight: 800, color: 'var(--c1)' }}>{posts}</span>
                  </div>
                  <input type="range" min="1" max="10" value={posts} onChange={(e) => setPosts(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--c1)' }} />
                </div>

                <div className="calc-slider-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.6 }}>Platforms Distributed</span>
                    <span style={{ fontWeight: 800, color: 'var(--c1)' }}>{platforms}</span>
                  </div>
                  <input type="range" min="1" max="5" value={platforms} onChange={(e) => setPlatforms(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--c1)' }} />
                </div>

                <div className="calc-slider-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.6 }}>Days Active per Week</span>
                    <span style={{ fontWeight: 800, color: 'var(--c1)' }}>{days}</span>
                  </div>
                  <input type="range" min="1" max="7" value={days} onChange={(e) => setDays(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--c1)' }} />
                </div>

                <div className="calc-slider-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.6 }}>Avg. Views per Post</span>
                    <span style={{ fontWeight: 800, color: 'var(--c1)' }}>{viewsPerPost.toLocaleString()}</span>
                  </div>
                  <input type="range" min="1000" max="100000" step="1000" value={viewsPerPost} onChange={(e) => setViewsPerPost(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--c1)' }} />
                </div>
              </div>
            </div>

            {/* RIGHT PANE: PROJECTION RESULTS */}
            <div style={{ padding: '60px', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
              <div className="reveal-up">
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', opacity: 0.4 }}>Annual Content Savings</span>
                <div style={{ fontSize: '4.5rem', fontWeight: 900, color: '#fff', margin: '20px 0', letterSpacing: '-3px' }}>
                  ${savings.toLocaleString()}
                </div>
                
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '60%', margin: '40px auto' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--c1)' }}>{(monthlyViews / 1000000).toFixed(1)}M</div>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.4, letterSpacing: '1px', marginTop: '4px' }}>Monthly Views</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{(annualViews / 1000000).toFixed(1)}M</div>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.4, letterSpacing: '1px', marginTop: '4px' }}>Annual Scale</div>
                  </div>
                </div>

                <div style={{ marginTop: '60px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6' }}>
                    Calculated using organic ecosystem efficiency (<strong>${calcConfig.organic_cpm}/CPM</strong>) versus traditional paid media (<strong>${calcConfig.target_cpm}/CPM</strong>).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PremiumWrapper>
      </div>
    </section>
  );
}
