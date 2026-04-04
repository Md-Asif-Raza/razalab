'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getSiteSettings } from '@/lib/actions';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      setVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // If on admin or login, hide navbar
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) return null;

  return (
    <>
      {/* Full navbar — visible at top */}
      <nav className={`nav-full ${!visible ? 'nav-hidden' : ''} ${scrolled ? 'nav-scrolled' : ''}`}>
        <Link href="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', transition: 'transform 0.3s ease', textDecoration: 'none' }}>
          <div className="logo-circle" style={{ 
            width: 44, height: 44, borderRadius: '50%', background: '#000', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img src="/logo.png" alt="Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.5px', color: '#fff' }}>Raza<span style={{ color: 'var(--c1)' }}>Labs</span></span>
        </Link>
        <ul className="nav-links">
          <li><Link href="#hero">Home</Link></li>
          <li><Link href="#campaigns">Clients</Link></li>
          <li><Link href="#video-showcase">Explainer</Link></li>
          <li><Link href="#faq">FAQ</Link></li>
        </ul>
        <div className="nav-socials">
          <a href={socials.instagram_url} target="_blank" rel="noopener noreferrer" className="social-icon">IG</a>
          <a href={socials.youtube_url} target="_blank" rel="noopener noreferrer" className="social-icon">YT</a>
          <a href={socials.twitter_url} target="_blank" rel="noopener noreferrer" className="social-icon">X</a>
        </div>
      </nav>

      {/* Floating circle logo — reveal on scroll when main nav hidden */}
      <div className={`nav-circle-logo-container ${!visible && scrolled ? 'visible' : ''}`}>
        <Link href="/" className="nav-circle-logo-link">
          <div className="logo-circle-mini">
            <img src="/logo.png" alt="Logo" />
          </div>
        </Link>
      </div>
    </>
  );
}
