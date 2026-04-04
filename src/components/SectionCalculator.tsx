'use client';
import { useState, useEffect } from 'react';
import { getSiteSettings } from '@/lib/actions';

export default function SectionCalculator() {
  const [clippers, setClippers] = useState(1);
  const [posts, setPosts] = useState(1);
  const [views, setViews] = useState(5000);
  
  const [calcConfig, setCalcConfig] = useState({
    target_cpm: 25.00,
    organic_cpm: 1.00,
    platform_multiplier: 3,
    days_multiplier: 7
  });

  useEffect(() => {
    getSiteSettings().then(res => {
      if (res) {
        setCalcConfig({
          target_cpm: Number(res.target_cpm) || 25.00,
          organic_cpm: Number(res.organic_cpm) || 1.00,
          platform_multiplier: Number(res.platform_multiplier) || 3,
          days_multiplier: Number(res.days_multiplier) || 7
        });
      }
    }).catch(() => {});
  }, []);

  const weeklyPosts = clippers * posts * calcConfig.platform_multiplier * calcConfig.days_multiplier;
  const annualViews = weeklyPosts * views * 52;
  const paidCost = (annualViews / 1000) * calcConfig.target_cpm; 
  const organicCost = (annualViews / 1000) * calcConfig.organic_cpm; 
  const savings = Math.round(paidCost - organicCost);

  return (
    <section id="calculator" style={{ padding: '200px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px', width: '100%' }}>
          <h2 className="section-title reveal-up">Calculator</h2>
        </div>

        <div className="dual-pane-calc reveal-up">
          {/* LEFT: STRATEGIC INPUTS */}
          <div className="calc-pane-left">
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Strategic Inputs</h3>
              <p style={{ opacity: 0.5, fontSize: '0.88rem' }}>Adjust the variables to see your distribution potential.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div className="input-field">
                <div className="field-label">
                  <span>Clippers Team Size</span>
                  <span className="field-val" style={{ color: '#4d96ff' }}>{clippers}</span>
                </div>
                <input type="range" min="1" max="100" step="1" value={clippers} onChange={(e) => setClippers(parseInt(e.target.value))} />
              </div>

              <div className="input-field">
                <div className="field-label">
                  <span>Daily Posts per Clipper</span>
                  <span className="field-val" style={{ color: '#4d96ff' }}>{posts}</span>
                </div>
                <input type="range" min="1" max="10" step="1" value={posts} onChange={(e) => setPosts(parseInt(e.target.value))} />
              </div>

              <div className="input-field">
                <div className="field-label">
                  <span>Platform Target Views</span>
                  <span className="field-val" style={{ color: '#4d96ff' }}>{views.toLocaleString()}</span>
                </div>
                <input type="range" min="5000" max="1000000" step="5000" value={views} onChange={(e) => setViews(parseInt(e.target.value))} />
              </div>
            </div>
          </div>

          {/* RIGHT: PROJECTED GROWTH */}
          <div className="calc-pane-right">
            <div className="highlight-subcard">
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.6 }}>Total Projected Savings</span>
              <div className="giant-val">${savings.toLocaleString('en-US')}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '32px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.4, textTransform: 'uppercase', marginBottom: '4px' }}>Annual Scale</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{(annualViews / 1000000).toFixed(1)}M+</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.4, textTransform: 'uppercase', marginBottom: '4px' }}>Efficiency</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#00e676' }}>{(calcConfig.target_cpm / calcConfig.organic_cpm).toFixed(1)}x</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.88rem', opacity: 0.5, lineHeight: '1.6' }}>
                This reflects the difference between paid media costs (${calcConfig.target_cpm}/CPM) and our organic ecosystem efficiency (${calcConfig.organic_cpm}/CPM).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
