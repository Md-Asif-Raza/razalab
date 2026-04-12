'use client';
import React from 'react';

export default function BgAuth() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -2, background: '#050304' }}>
      {/* Orb 1 */}
      <div style={{
        position: 'absolute', top: '10%', left: '20%', width: '40vw', height: '40vw',
        background: 'radial-gradient(circle, rgba(0, 102, 255, 0.15) 0%, transparent 70%)',
        filter: 'blur(80px)',
        animation: 'float1 14s ease-in-out infinite alternate',
      }} />
      {/* Orb 2 */}
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%', width: '35vw', height: '35vw',
        background: 'radial-gradient(circle, rgba(90, 104, 130, 0.2) 0%, transparent 70%)',
        filter: 'blur(100px)',
        animation: 'float2 18s ease-in-out infinite alternate',
      }} />
      <style>{`
        @keyframes float1 { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(100px, 50px) scale(1.2); } }
        @keyframes float2 { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(-80px, -60px) scale(1.1); } }
      `}</style>
    </div>
  );
}
