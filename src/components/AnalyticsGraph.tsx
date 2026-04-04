'use client';
import { motion } from 'framer-motion';

interface AnalyticsGraphProps {
  data: number[];
  color?: string;
  height?: number;
}

export default function AnalyticsGraph({ 
  data = [10, 25, 45, 30, 55, 70, 95], 
  color = '#5a6882', 
  height = 120 
}: AnalyticsGraphProps) {
  const max = Math.max(...data, 100);
  const min = Math.min(...data, 0);
  const padding = 10;
  const width = 300;

  // Generate points for the path
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((val - min) / (max - min)) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(' ');

  // Area path logic
  const areaPath = `M ${padding},${height} ` + 
                 data.map((val, i) => {
                   const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
                   const y = height - ((val - min) / (max - min)) * (height - padding * 2) - padding;
                   return `L ${x},${y}`;
                 }).join(' ') + 
                 ` L ${width - padding},${height} Z`;

  return (
    <div className="analytics-graph-container" style={{ width: '100%', height }}>
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="analytics-svg"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Area Fill */}
        <motion.path
          d={areaPath}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Path Line */}
        <motion.polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Vertical lines like in reference */}
        {data.map((_, i) => (
          <line 
            key={i}
            x1={(i / (data.length - 1)) * (width - padding * 2) + padding}
            y1={0}
            x2={(i / (data.length - 1)) * (width - padding * 2) + padding}
            y2={height}
            stroke="white"
            strokeOpacity="0.05"
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
}
