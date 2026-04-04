'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  delay = 0,
  hover = true,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={
        hover
          ? {
              y: -8,
              boxShadow: '0 20px 40px rgba(0, 255, 200, 0.1)',
            }
          : {}
      }
      transition={{
        duration: 0.6,
        delay,
        type: 'spring',
        stiffness: 100,
      }}
      viewport={{ once: true }}
      onClick={onClick}
      className={`relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-colors duration-300 overflow-hidden group ${onClick ? 'cursor-pointer' : ''} ${className || ''}`}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
