'use client';
import { useEffect, useState, useRef } from 'react';

export default function CountUp({
  endString,
  duration = 1500
}: {
  endString: string;
  duration?: number;
}) {
  const [count, setCount] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Parse the endString to find the number and suffix
    const match = endString.match(/^([\d.]+)([a-zA-Z+%]*)$/);
    if (!match) {
      setCount(endString);
      return;
    }
    const endNum = parseFloat(match[1]);
    const suffix = match[2];

    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setCount('0.0'); // Instantly unhide upon intersection lock
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          
          // Expo Out interpolation
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = endNum * easeProgress;
          
          if (progress < 1) {
            const formatted = endNum % 1 !== 0 ? currentVal.toFixed(1) : Math.floor(currentVal).toString();
            setCount(formatted + suffix);
            requestAnimationFrame(step);
          } else {
            setCount(endString);
          }
        };
        requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.7 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [endString, duration]);

  // Hide entirely if "0" to resolve the baseline zero-state visual flicker
  return <span ref={ref} style={{ opacity: count === '0' ? 0 : 1 }}>{count}</span>;
}
