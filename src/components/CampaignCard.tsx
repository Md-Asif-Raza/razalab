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
      <div className="absolute inset-0">
        {campaign.media_url ? (
          <Image
            src={campaign.media_url}
            alt={campaign.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        {/* Top: Verified Badge */}
        {campaign.verified && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 w-fit"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Verified
            </span>
          </motion.div>
        )}

        {/* Bottom: Campaign Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
              {campaign.title}
            </h3>
            <p className="text-sm text-gray-300">by {campaign.creator}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Budget</p>
              <p className="text-lg font-semibold text-white">
                ${campaign.budget.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Earned</p>
              <p className="text-lg font-semibold text-cyan-400">
                ${campaign.earned.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Platforms */}
          {campaign.platforms && campaign.platforms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {campaign.platforms.map((platform) => (
                <motion.span
                  key={platform}
                  whileHover={{ scale: 1.1 }}
                  className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/80 capitalize"
                >
                  {platform}
                </motion.span>
              ))}
            </div>
          )}
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
