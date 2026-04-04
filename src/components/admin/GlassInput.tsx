'use client';
import { InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function GlassInput({
  label,
  error,
  ...props
}: GlassInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      {label && (
        <label className="block text-sm font-medium text-white/90">
          {label}
        </label>
      )}

      <input
        {...props}
        className="w-full px-4 py-3 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10
                   text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500
                   focus:border-transparent transition-all duration-300 hover:bg-white/8"
      />

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
