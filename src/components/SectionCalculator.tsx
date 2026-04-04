'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SectionCalculator() {
  const [clippers, setClippers] = useState(1);
  const [posts, setPosts] = useState(1);
  const [views, setViews] = useState(5000);

  const platforms = 3; 
  const days = 7;
  
  const weeklyPosts = clippers * posts * platforms * days;
  const annualViews = weeklyPosts * views * 52;
  const paidCost = (annualViews / 1000) * 25; 
  const organicCost = (annualViews / 1000) * 1; 
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
                <input type="range" min="1" max="10" step="1" value={clippers} onChange={(e) => setClippers(parseInt(e.target.value))} />
              </div>

              <div className="input-field">
                <div className="field-label">
                  <span>Daily Posts per Clipper</span>
                  <span className="field-val" style={{ color: '#4d96ff' }}>{posts}</span>
                </div>
                <input type="range" min="1" max="5" step="1" value={posts} onChange={(e) => setPosts(parseInt(e.target.value))} />
              </div>

              <div className="input-field">
                <div className="field-label">
                  <span>Platform Target Views</span>
                  <span className="field-val" style={{ color: '#4d96ff' }}>{views.toLocaleString()}</span>
                </div>
                <input type="range" min="5000" max="100000" step="5000" value={views} onChange={(e) => setViews(parseInt(e.target.value))} />
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
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#00e676' }}>25.0x</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.88rem', opacity: 0.5, lineHeight: '1.6' }}>
                This reflects the difference between paid media costs and our organic ecosystem efficiency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
