'use client';
import { useEffect, useRef } from 'react';

export default function BgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const particles: any[] = [
      { x: w * 0.5, y: h * 0.8, radius: 450, color: 'rgba(255, 50, 50, 0.12)', vx: 0.1, vy: -0.05, baseSize: 450 },
      { x: w * 0.2, y: h * 0.2, radius: 400, color: 'rgba(90, 104, 130, 0.08)', vx: -0.08, vy: 0.1, baseSize: 400 },
      { x: w * 0.8, y: h * 0.4, radius: 350, color: 'rgba(29, 41, 56, 0.06)', vx: 0.12, vy: 0.08, baseSize: 350 }
    ];

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      time += 0.005;
      
      particles.forEach(p => {
        // Breathing effect
        const pulse = Math.sin(time + p.radius) * 50;
        const currentRadius = p.baseSize + pulse;

        // Slow movement
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -currentRadius) p.x = w + currentRadius;
        if (p.x > w + currentRadius) p.x = -currentRadius;
        if (p.y < -currentRadius) p.y = h + currentRadius;
        if (p.y > h + currentRadius) p.y = -currentRadius;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.8
      }}
    />
  );
}
