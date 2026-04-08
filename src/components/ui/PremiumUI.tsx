'use client';
import React, { useRef, useState, ReactNode } from 'react';

/**
 * PremiumWrapper - A rectangular container with a cursor-tracking border glow.
 * Now wraps SpotlightCard to unify the vibrant glow effect across all big sections.
 */
export const PremiumWrapper = ({ children, className = "", style = {} }: { children: ReactNode, className?: string, style?: React.CSSProperties }) => {
  return (
    <SpotlightCard size="big" className={`premium-wrapper-unified ${className}`} style={style}>
      {children}
    </SpotlightCard>
  );
};

export const SpotlightCard = ({ children, className = "", style = {}, size = "big" }: { children: ReactNode, className?: string, style?: any, size?: "big" | "small" }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-card ${size === "big" ? "glow-big" : "glow-small"} ${className}`}
      style={{ ...style } as any}
    >
      {/* INITIAL BORDER (FAINT) */}
      <div className="spotlight-border-base" />
      
      {/* DYNAMIC BORDER HIGHLIGHT */}
      <div className="spotlight-border-glow" />

      {/* DYNAMIC SURFACE GLOW */}
      <div className="spotlight-surface-glow" />
      
      <div className="spotlight-content">
        {children}
      </div>
    </div>
  );
};
