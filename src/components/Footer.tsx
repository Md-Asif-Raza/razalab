'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/actions';

export default function Footer() {
  const [socials, setSocials] = useState({
    instagram_url: 'https://instagram.com',
    youtube_url: 'https://youtube.com',
    twitter_url: 'https://x.com'
  });

  useEffect(() => {
    getSiteSettings().then(res => {
      if (res) {
        setSocials({
          instagram_url: res.instagram_url || 'https://instagram.com',
          youtube_url: res.youtube_url || 'https://youtube.com',
          twitter_url: res.twitter_url || 'https://x.com'
        });
      }
    }).catch(() => {});
  }, []);

  return (
    <>
      <footer style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: 'clamp(24px, 4vw, 40px)', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}> {/* FIX: responsive footer layout */}
        <div className="footer-logo">Raza<span>Labs</span></div>
        <ul className="footer-links" style={{ display: 'flex', gap: 'clamp(12px, 2vw, 28px)', listStyle: 'none', flexWrap: 'wrap', justifyContent: 'center' }}> {/* FIX: responsive gap + wrap */}
          <li><Link href="#hero">Home</Link></li>
          <li><Link href="#campaigns">Clients</Link></li>
          <li><Link href="#video-showcase">Explainer</Link></li>
          <li><Link href="#faq">FAQ</Link></li>
        </ul>
        <div className="footer-socials" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <a href={socials.instagram_url} target="_blank" rel="noopener noreferrer" className="social-btn nav-slide-btn" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href={socials.youtube_url} target="_blank" rel="noopener noreferrer" className="social-btn nav-slide-btn" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="YouTube">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
          </a>
          <a href={socials.twitter_url} target="_blank" rel="noopener noreferrer" className="social-btn nav-slide-btn" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="X">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
      </footer>
      <div className="footer-copy" style={{ fontSize: 'clamp(7px, 1vw, 12px)', textAlign: 'center', padding: '20px', opacity: 0.5 }}> {/* FIX: responsive footer text */}
        <Link href="/login" style={{ fontSize: '7px', opacity: 0.05, textDecoration: 'none', color: 'inherit', marginRight: '4px' }}>A</Link>
        © 2026 Raza Labs — All Rights Reserved.
      </div>
    </>
  );
}
