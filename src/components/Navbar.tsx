'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getSiteSettings } from '@/lib/actions';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [socials, setSocials] = useState({
    instagram_url: 'https://instagram.com',
    youtube_url: 'https://youtube.com',
    twitter_url: 'https://x.com'
  });
  const [ctaData, setCtaData] = useState({
    text: 'Book a Call',
    link: 'https://calendly.com/'
  });

  useEffect(() => {
    getSiteSettings().then(res => {
      if (res) {
        setSocials({
          instagram_url: res.instagram_url || 'https://instagram.com',
          youtube_url: res.youtube_url || 'https://youtube.com',
          twitter_url: res.twitter_url || 'https://x.com'
        });
        setCtaData({
          text: res.navbar_cta_text || 'Book a Call',
          link: res.navbar_cta_link || 'https://calendly.com/'
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  // If on admin or login, hide navbar
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) return null;

  return (
    <>
      <nav className={`nav-full ${!visible ? 'nav-hidden' : ''} ${scrolled || isMobileMenuOpen ? 'nav-scrolled' : ''}`}>
        <Link href="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', transition: 'transform 0.3s ease', textDecoration: 'none', zIndex: 1001, minWidth: 0 }}> {/* FIX: min-width 0 for flex shrink */}
          <div className="logo-circle" style={{ 
            width: 44, height: 44, borderRadius: '50%', background: '#000', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'pointer',
            flexShrink: 0 // FIX: prevent shrinking on mobile
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img src="/logo.png" alt="Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 'clamp(0.75rem, 2vw, 1rem)', letterSpacing: '-0.5px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}> {/* FIX: responsive font size + overflow hidden */}Raza<span style={{ color: 'var(--c1)' }}>Labs</span></span>
        </Link>
        <ul className="nav-links desktop-only">
          <li><a href="#hero" onClick={(e) => handleNavClick(e, '#hero')}>Home</a></li>
          <li><a href="#campaigns" onClick={(e) => handleNavClick(e, '#campaigns')}>Clients</a></li>
          <li><a href="#testimonials" onClick={(e) => handleNavClick(e, '#testimonials')}>Testimonials</a></li>
          <li><a href="#faq" onClick={(e) => handleNavClick(e, '#faq')}>FAQ</a></li>
        </ul>
         <div className="nav-socials desktop-only">
          <a href={socials.instagram_url} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#ig-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f09433" />
                  <stop offset="25%" stopColor="#e6683c" />
                  <stop offset="50%" stopColor="#dc2743" />
                  <stop offset="75%" stopColor="#cc2366" />
                  <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a href={socials.youtube_url} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" fill="#FF0000" stroke="none"/>
               <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#FFFFFF" stroke="#FFFFFF"/>
            </svg>
          </a>
          <a href={socials.twitter_url} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="X">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DA1F2">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
        
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu" style={{ zIndex: 1001, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          {isMobileMenuOpen ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>
      </nav>

      {/* Full screen mobile menu overlay */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          <li><a href="#hero" onClick={(e) => handleNavClick(e, '#hero')}>Home</a></li>
          <li><a href="#campaigns" onClick={(e) => handleNavClick(e, '#campaigns')}>Clients</a></li>
          <li><a href="#testimonials" onClick={(e) => handleNavClick(e, '#testimonials')}>Testimonials</a></li>
          <li><a href="#faq" onClick={(e) => handleNavClick(e, '#faq')}>FAQ</a></li>
        </ul>
        
        <div className="mobile-nav-socials">
          <a href={socials.instagram_url} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#ig-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f09433" />
                  <stop offset="25%" stopColor="#e6683c" />
                  <stop offset="50%" stopColor="#dc2743" />
                  <stop offset="75%" stopColor="#cc2366" />
                  <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a href={socials.youtube_url} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" fill="#FF0000" stroke="none"/>
               <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#FFFFFF" stroke="#FFFFFF"/>
            </svg>
          </a>
          <a href={socials.twitter_url} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="X">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DA1F2">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
