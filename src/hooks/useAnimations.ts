'use client';
import { useEffect } from 'react';

export function useAnimations() {
  useEffect(() => {

    // ── 1. NAVBAR SCROLL CLASS ──────────────
    const nav = document.querySelector('.nav-full') || document.querySelector('nav') || document.querySelector('header');
    const onScroll = () => {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
      
      const progressBar = document.getElementById('global-scroll-progress');
      if (progressBar) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${scrollPercent}%`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on mount

    // ── 2. INTERSECTION OBSERVER ────────────
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const animTargets = document.querySelectorAll(
      '.anim-fade-up, .anim-scale-in, .anim-img-reveal'
    );
    animTargets.forEach((el) => observer.observe(el));

    // ── 3. AUTO-ADD CLASSES ─────────────────
    // Sections get fade-up automatically (skip hero — it has its own entrance)
    document.querySelectorAll('section').forEach((sec) => {
      if (sec.id === 'hero') return;
      if (!sec.classList.contains('anim-fade-up') && !sec.classList.contains('reveal-up')) {
        sec.classList.add('anim-fade-up');
        observer.observe(sec);
      }
    });

    // Cards get hover-lift automatically
    document.querySelectorAll('[class*="card"], [class*="Card"]').forEach((card) => {
      if (!card.classList.contains('hover-lift')) {
        card.classList.add('hover-lift');
      }
    });

    // Buttons get btn-anim automatically
    document.querySelectorAll('a.btn-primary, a.cta-btn, button.btn-primary').forEach((btn) => {
      if (!btn.classList.contains('btn-anim')) {
        btn.classList.add('btn-anim');
      }
    });

    // Testimonial cards
    document.querySelectorAll('[class*="testimonial"], [class*="Testimonial"]').forEach((card) => {
      if (!card.classList.contains('testimonial-card')) {
        card.classList.add('testimonial-card');
      }
    });

    // FAQ items
    document.querySelectorAll('.accordion-item').forEach((item) => {
      if (!item.classList.contains('faq-item')) {
        item.classList.add('faq-item');
      }
    });

    // ── 4. NUMBER COUNTER ANIMATION ─────────
    const counterEls = document.querySelectorAll('.count-up');
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const raw = el.textContent?.replace(/[^0-9.]/g, '') || '0';
          const suffix = el.textContent?.replace(/[0-9.,]/g, '').trim() || '';
          const target = parseFloat(raw);
          if (isNaN(target)) return;
          const duration = 1800;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(ease * target);
            el.textContent = current.toLocaleString() + (suffix ? suffix : '');
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counterEls.forEach((el) => counterObserver.observe(el));

    // ── 5. MARQUEE EDGE BLUR ─────────────────
    document.querySelectorAll('.brands-marquee, [class*="marquee"], [class*="ticker"]').forEach((el) => {
      const parent = el.parentElement;
      if (parent && !parent.classList.contains('marquee-wrap')) {
        parent.classList.add('marquee-wrap');
      }
    });

    // GLOW TRANSITIONS
    const glowObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('glow-in-view');
        } else {
          entry.target.classList.remove('glow-in-view');
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.glow-transition').forEach(el => glowObserver.observe(el));

    // SCROLL PROGRESS BAR
    let progressBar = document.getElementById('global-scroll-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'global-scroll-progress';
      progressBar.style.cssText = 'position: fixed; top: 0; left: 0; height: 2px; background: var(--c2, #0052cc); z-index: 99999; width: 0%; transition: width 0.1s linear; pointer-events: none; box-shadow: 0 0 10px var(--c2, #0052cc);';
      document.body.appendChild(progressBar);
    }

    // 3D CARD TILT
    const cards = document.querySelectorAll('.hover-lift, .pro-testimonial-card, .card-track-item');
    cards.forEach(card => {
      const el = card as HTMLElement;
      
      // Skip 3D tilt for the calculator and video section
      if (el.closest('#calculator') || el.closest('#video-showcase')) return;

      el.style.transformStyle = 'preserve-3d';
      
      const onMouseMove = (e: Event) => {
        if (window.innerWidth < 768) return; // Disable on mobile
        const ev = e as MouseEvent;
        const rect = el.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        
        el.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
      };
      
      const onMouseLeave = () => {
        el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
      };

      el.addEventListener('mousemove', onMouseMove);
      el.addEventListener('mouseleave', onMouseLeave);
      
      // Store to clean up later just in case, but since it's an app re-render, passive listeners usually GC well if nodes are destroyed.
      (el as any)._tiltMove = onMouseMove;
      (el as any)._tiltLeave = onMouseLeave;
    });



    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
      counterObserver.disconnect();
      glowObserver.disconnect();
      if (progressBar && progressBar.parentNode) {
        progressBar.parentNode.removeChild(progressBar);
      }
      cards.forEach(card => {
        const el = card as HTMLElement;
        if ((el as any)._tiltMove) el.removeEventListener('mousemove', (el as any)._tiltMove);
        if ((el as any)._tiltLeave) el.removeEventListener('mouseleave', (el as any)._tiltLeave);
      });
    };
  }, []);
}
