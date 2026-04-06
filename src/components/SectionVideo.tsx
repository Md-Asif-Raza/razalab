'use client';
import React, { useState, useEffect } from 'react';
import PremiumPlayer from './PremiumPlayer';
import { getSiteSettings } from '@/lib/actions';
import { PremiumWrapper, SpotlightCard } from './ui/PremiumUI';

export default function SectionVideo() {
  const [data, setData] = useState({
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    video_poster: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&q=80',
    video_caption: 'Over 527 million views generated across clients',
  });

  useEffect(() => {
    getSiteSettings().then(res => {
      if (res) setData(res);
    }).catch(() => {});
  }, []);

  const isYouTube = data.video_url.includes('youtube.com') || data.video_url.includes('youtu.be');

  return (
    <section id="video-showcase">
      <div className="standard-container">
        <PremiumWrapper className="video-premium-container" style={{ padding: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="section-title">Explainer Video</h2>
          </div>

          <div className="video-modern-wrapper" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="video-glow-bezel" style={{ border: 'none', background: 'transparent' }}>
              {isYouTube ? (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', background: '#000', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                  <iframe
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '32px' }}
                    src={`https://www.youtube.com/embed/${data.video_url.match(/(?:v=|youtu\.be\/)([\w-]+)/)?.[1] || ''}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div style={{ borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                  <PremiumPlayer 
                    src={data.video_url} 
                    poster={data.video_poster} 
                  />
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.02em' }}>
              {data.video_caption}
            </p>
          </div>
        </PremiumWrapper>
      </div>
    </section>
  );
}
