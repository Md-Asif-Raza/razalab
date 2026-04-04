'use client';
import React from 'react';
import PremiumPlayer from './PremiumPlayer';

export default function SectionVideo() {
  return (
    <section id="video-showcase" className="video-section" style={{ padding: '200px 0', position: 'relative', overflow: 'hidden' }}>
      {/* CINEMATIC AMBIENT GLOW */}
      <div className="video-ambient-glow" />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '80px', width: '100%' }}>
          <h2 className="section-title">Explainer Video</h2>
        </div>

        <div className="video-modern-wrapper">
          <div className="video-glow-bezel">
            <PremiumPlayer 
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
              poster="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&q=80" 
            />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p className="milestone-text">
            Over 527 million views generated across clients
          </p>
        </div>
      </div>
    </section>
  );
}
