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

    // Constellation Particles
    const maxParticles = window.innerWidth < 768 ? 40 : 80;
    const particles: any[] = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
      });
    }

    // Glowing Ascending Embers
    const maxEmbers = window.innerWidth < 768 ? 15 : 30;
    const embers: any[] = [];
    for (let i = 0; i < maxEmbers; i++) {
        embers.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -(Math.random() * 1.5 + 0.5),
            radius: Math.random() * 3 + 1,
            pulse: Math.random() * Math.PI * 2
        });
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      
      // Embers (Neutral White/Slate instead of Blue)
      embers.forEach(e => {
        e.y += e.vy;
        e.x += e.vx;
        e.pulse += 0.05;
        if (e.y < -50) { e.y = h + 50; e.x = Math.random() * w; }
        if (e.x < -50) e.x = w + 50;
        if (e.x > w + 50) e.x = -50;
        
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        const alpha = (Math.sin(e.pulse) + 1) * 0.5 * 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.2)';
      });
      ctx.shadowBlur = 0; // Reset

      // Connect Constellation
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;
        if (p1.x < 0 || p1.x > w) p1.vx *= -1;
        if (p1.y < 0 || p1.y > h) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${(150 - dist) / 150 * 0.15})`;
            ctx.stroke();
          }
        }
      }

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
