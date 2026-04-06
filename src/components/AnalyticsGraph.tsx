'use client';
import { motion } from 'framer-motion';

interface AnalyticsGraphProps {
  data: number[];
  color?: string;
  height?: number;
}

// =============================================
// HELPER: Generate SVG Bezier Path for smooth curves
// =============================================
function getBezierPath(points: { x: number, y: number }[]) {
  if (points.length < 2) return '';
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const cp1x = (points[i].x + points[i + 1].x) / 2;
    path += ` C ${cp1x},${points[i].y} ${cp1x},${points[i + 1].y} ${points[i + 1].x},${points[i + 1].y}`;
  }
  return path;
}

export default function AnalyticsGraph({
  data = [10, 25, 45, 30, 55, 70, 95],
  color = '#00e676',
  height = 120
}: AnalyticsGraphProps) {
  const max = Math.max(...data, 100);
  const min = Math.min(...data, 0);
  const padding = 12;
  const width = 300;

  // Generate mapped coordinates
  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * (width - padding * 2) + padding,
    y: height - ((val - min) / (max - min)) * (height - padding * 2) - padding
  }));

  const linePath = getBezierPath(points);
  const areaPath = linePath + ` L ${width - padding},${height} L ${padding},${height} Z`;

  return (
    <div className="analytics-graph-wrapper" style={{ width: '100%', height, position: 'relative' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="analytics-svg"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dynamic Grid Lines */}
        {data.map((_, i) => (
          <line
            key={`grid-${i}`}
            x1={(i / (data.length - 1)) * (width - padding * 2) + padding}
            y1={0}
            x2={(i / (data.length - 1)) * (width - padding * 2) + padding}
            y2={height}
            stroke="white"
            strokeOpacity="0.06"
            strokeWidth="1"
          />
        ))}

        {/* Area Under Curve */}
        <motion.path
          d={areaPath}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Smooth Bezier Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#neonGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Pro Data Points (Circles) */}
        {points.map((p, i) => (
          <motion.circle
            key={`point-${i}`}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="#fff"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + (i * 0.1), type: 'spring' }}
            style={{ filter: 'drop-shadow(0 0 4px #fff)' }}
          />
        ))}
      </svg>
    </div>
  );
}
