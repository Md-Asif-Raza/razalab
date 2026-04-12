'use client';
import React from 'react';

export default function BgAdmin() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -2, background: '#050304' }}>
      <div style={{
        position: 'absolute', inset: -50,
        backgroundImage: `linear-gradient(rgba(0, 102, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 102, 255, 0.05) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        animation: 'panGrid 20s linear infinite',
        transform: 'perspective(1000px) rotateX(60deg) scale(2.5) translateY(-100px)',
        transformOrigin: 'top center'
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(5,3,4,0) 0%, #050304 80%)'
      }} />
      <style>{`
        @keyframes panGrid {
          0% { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
      `}</style>
    </div>
  );
}
