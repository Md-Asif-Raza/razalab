'use client';
import { useState, useEffect } from 'react';
import { getBrands } from '@/lib/actions';

const FALLBACK_BRANDS = [
  { name: 'Cantina', is_bold: false },
  { name: 'LOOKSMAX AI', is_bold: true },
  { name: 'RIZZ', is_bold: false },
  { name: 'Loveable', is_bold: false },
  { name: 'Stella Clipping Campaign', is_bold: false },
  { name: 'Atlas Ai', is_bold: false },
  { name: 'Dropship.io', is_bold: false },
  { name: 'Find GPT', is_bold: false },
  { name: 'Joe Rogan + ReplitClip', is_bold: false },
  { name: 'Sameer clipping', is_bold: false },
  { name: 'canffen ai', is_bold: false },
  { name: 'Rebet', is_bold: false },
  { name: 'taller app', is_bold: false },
];

export default function SectionBrands() {
  const [brands, setBrands] = useState(FALLBACK_BRANDS);

  useEffect(() => {
    getBrands().then(data => {
      if (data && data.length > 0) setBrands(data);
    }).catch(() => {});
  }, []);

  return (
    <section id="brands">
      <div className="brands-heading reveal-up">
        <h2>Trusted by <span className="brands-accent">leading</span> brands worldwide</h2>
      </div>

      <div className="brands-marquee reveal-up stagger-1">
        <div className="brands-track">
          {brands.map((b, i) => (
            <div key={i} className={`brand-item ${b.is_bold ? 'brand-bold' : ''}`}>{b.name}</div>
          ))}
          {/* Duplicate for infinite loop */}
          {brands.map((b, i) => (
            <div key={`dup-${i}`} className={`brand-item ${b.is_bold ? 'brand-bold' : ''}`}>{b.name}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
