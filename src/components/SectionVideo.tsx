'use client';
import React, { useState, useEffect } from 'react';
import PremiumPlayer from './PremiumPlayer';
import { getSiteSettings } from '@/lib/actions';

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
    <section id="video-showcase" className="video-section" style={{ padding: '200px 0', position: 'relative', overflow: 'hidden' }}>
      {/* CINEMATIC AMBIENT GLOW */}
      <div className="video-ambient-glow" />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '80px', width: '100%' }}>
          <h2 className="section-title">Explainer Video</h2>
        </div>

        <div className="video-modern-wrapper">
          <div className="video-glow-bezel">
            {isYouTube ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%', background: '#000', borderRadius: '24px' }}>
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '24px' }}
                  src={`https://www.youtube.com/embed/${data.video_url.match(/(?:v=|youtu\.be\/)([\w-]+)/)?.[1] || ''}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <PremiumPlayer 
                src={data.video_url} 
                poster={data.video_poster} 
              />
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p className="milestone-text">
            {data.video_caption}
          </p>
        </div>
      </div>
    </section>
  );
}
