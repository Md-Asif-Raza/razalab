'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

interface GlassFormProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  loading?: boolean;
}

export function GlassForm({
  children,
  onSubmit,
  title,
  loading = false,
}: GlassFormProps) {
  return (
    <GlassCard className="p-8 max-w-2xl mx-auto">
      <form onSubmit={onSubmit} className="space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-8"
        >
          {title}
        </motion.h2>

        {children}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 
                       text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 
                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </motion.div>
      </form>
    </GlassCard>
  );
}
