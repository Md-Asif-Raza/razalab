'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PremiumPlayer from './PremiumPlayer';
import { getSiteSettings } from '@/lib/actions';
import { PremiumWrapper, SpotlightCard } from './ui/PremiumUI';

export default function SectionVideo() {
  const [data, setData] = useState({
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    video_poster: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&q=80',
    video_caption: 'Over 527 million views generated across clients',
    video_cta_text: 'Book a Call \u2192',
    video_cta_link: 'https://calendly.com/razalabs',
  });
  const [showVideo, setShowVideo] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSiteSettings().then(res => {
      if (res) {
        // Merge with defaults — only override fields that have non-empty values from DB
        setData(prev => ({
          video_url: res.video_url || prev.video_url,
          video_poster: res.video_poster || prev.video_poster,
          video_caption: res.video_caption || prev.video_caption,
          video_cta_text: res.video_cta_text || prev.video_cta_text,
          video_cta_link: res.video_cta_link || prev.video_cta_link,
        }));
      }
    }).catch(() => { });
  }, []);

  // Lazy-load video when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShowVideo(true); observer.disconnect(); } },
      { threshold: 0.1, rootMargin: '200px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const isYouTube = data.video_url.includes('youtube.com') || data.video_url.includes('youtu.be');
  const youtubeId = data.video_url.match(/(?:v=|youtu\.be\/)([\w-]+)/)?.[1] || '';

  // Determine if the CTA link is external
  const isExternalLink = data.video_cta_link.startsWith('http');

  return (
    <section id="video-showcase" ref={sectionRef}>
      <div className="standard-container">
        <PremiumWrapper className="video-premium-container" style={{ padding: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="section-title" style={{ textAlign: 'center', margin: '0 auto' }}>Explainer Video</h2>
          </div>

          <div className="video-modern-wrapper" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="video-glow-bezel" style={{ border: 'none', background: 'transparent' }}>
              {isYouTube ? (
                <div style={{
                  position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden',
                  maxWidth: '100%', background: '#000', borderRadius: '32px',
                  boxShadow: '0 20px 60px rgba(90, 104, 130, 0.2), 0 0 80px rgba(90, 104, 130, 0.08)'
                }}>
                  {showVideo ? (
                    <iframe
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '32px', border: 'none' }}
                      src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div
                      onClick={() => setShowVideo(true)}
                      style={{
                        position: 'absolute', inset: 0, cursor: 'pointer',
                        background: `url(https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg) center/cover no-repeat`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '32px',
                      }}
                    >
                      <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s ease',
                      }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(90, 104, 130, 0.2)' }}>
                  <PremiumPlayer
                    src={data.video_url}
                    poster={data.video_poster}
                  />
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.02em', marginBottom: '32px' }}>
              {data.video_caption}
            </p>
            {isExternalLink ? (
              <a
                href={data.video_cta_link}
                className="btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.video_cta_text}
              </a>
            ) : (
              <Link href={data.video_cta_link} className="btn-primary">
                {data.video_cta_text}
              </Link>
            )}
          </div>
        </PremiumWrapper>
      </div>
    </section>
  );
}
