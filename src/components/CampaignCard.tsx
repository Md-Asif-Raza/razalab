'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Campaign } from '@/types';

interface CampaignCardProps {
  campaign: Campaign;
  index: number;
}

export function CampaignCard({ campaign, index }: CampaignCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 200,
      }}
      viewport={{ once: true, amount: 0.3 }}
      className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 overflow-hidden">
        {campaign.img_url ? (
          <Image
            src={campaign.img_url}
            alt={campaign.name}
            fill
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
        )}
        {/* Only dim the bottom area for text readability, not the entire image */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        {/* Top: Category Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 w-fit bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">
            {campaign.category}
          </span>
        </motion.div>

        {/* Bottom: Campaign Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
              {campaign.name}
            </h3>
            <p className="text-xs text-gray-400 font-medium">{campaign.result}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Budget</p>
              <p className="text-lg font-bold text-white font-outfit">
                {campaign.price}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Scale</p>
              <p className="text-lg font-bold text-cyan-400 font-outfit">
                {campaign.views_total || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
    </motion.div>
  );
}
