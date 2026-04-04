'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Transparent at top, glass-blurred on scroll
      setScrolled(currentScrollY > 50);

      // Hide immediately on scroll down, show on scroll up
      const diff = currentScrollY - lastScrollY;
      if (diff > 5 && currentScrollY > 100) {
        setVisible(false);
      } else if (diff < -5) {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
          Raza<span>Labs</span>
        </Link>
        <ul className="nav-links">
          <li><Link href="#hero">Home</Link></li>
          <li><Link href="#campaigns">Clients</Link></li>
          <li><Link href="#testimonials">Testimonials</Link></li>
          <li><Link href="#faq">FAQ</Link></li>
        </ul>
        <div className="nav-right">
          <div className="nav-socials">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="nav-social-icon" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="nav-social-icon" aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="nav-social-icon" aria-label="X">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
          <Link href="#cta-end" className="nav-cta">Get In Touch</Link>
        </div>
      </nav>

      {/* Circle logo — animated reveal ONLY when main navbar is HIDDEN */}
      <div 
        className={`nav-circle-logo-container ${scrolled && !visible ? 'visible' : ''}`} 
        style={{ 
          display: scrolled && !visible ? 'flex' : 'none',
          pointerEvents: scrolled && !visible ? 'auto' : 'none' 
        }}
      >
        <Link href="/" className="nav-circle-wrapper" style={{ 
          width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', 
          borderRadius: '50%', background: '#000', border: '1px solid rgba(255,255,255,0.15)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img src="/logo.png" alt="Raza Labs" style={{ width: '75%', height: '75%', objectFit: 'contain' }} />
        </Link>
      </div>
    </>
  );
}
