'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTechStack } from '@/lib/actions';

interface TechStackItem {
  name: string;
  icon: string;
  description: string;
}

const FALLBACK_TECH: TechStackItem[] = [
  { name: 'Next.js 16', icon: '⚡', description: 'App Router with React 19' },
  { name: 'Supabase', icon: '🗄️', description: 'PostgreSQL + Auth' },
  { name: 'Framer Motion', icon: '✨', description: 'High-fidelity animations' },
  { name: 'Tailwind CSS', icon: '🎨', description: 'Utility-first styling' },
];

export default function SectionTechStack() {
  const [techStack, setTechStack] = useState(FALLBACK_TECH);

  useEffect(() => {
    getTechStack().then(data => {
      if (data && data.length > 0) setTechStack(data);
    }).catch(() => {});
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="tech-stack" className="relative py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Built with Modern Tech</h2>
          <p className="text-xl text-white/60">Enterprise-grade stack for seamless performance</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((tech, index) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ y: -8, scale: 1.05 }} className="group relative p-6 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="relative z-10">
                <div className="text-4xl mb-4">{tech.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{tech.name}</h3>
                <p className="text-sm text-white/60">{tech.description}</p>
              </div>
              <motion.div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
