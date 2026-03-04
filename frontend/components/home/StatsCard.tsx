'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface StatsCardProps {
  value: string;
  label: string;
  suffix: string;
  color: string;
}

export function StatsCard({ value, label, suffix, color }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="cyber-card group"
    >
      <div className="p-6 text-center">
        <div className="relative inline-block mb-4">
          <motion.div
            className="absolute inset-0 rounded-lg blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"
            style={{ backgroundColor: color }}
          />
          <div
            className="relative text-4xl md:text-5xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}99)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {value}
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 text-cyber-text-secondary">
          <span className="text-lg">{suffix}</span>
          <span className="text-sm">{label}</span>
        </div>
      </div>
    </motion.div>
  );
}
