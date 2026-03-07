'use client';

import { motion } from 'framer-motion';

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className = '' }: LoadingCardProps) {
  return (
    <div className={`cyber-card rounded-lg border border-cyber-border p-6 ${className}`}>
      <div className="animate-pulse space-y-4">
        {/* Category Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-6 w-20 bg-cyber-cyan/20 rounded-full" />
          <div className="h-4 w-24 bg-cyber-purple/20 rounded" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-7 bg-cyber-cyan/20 rounded w-3/4" />
          <div className="h-7 bg-cyber-cyan/10 rounded w-1/2" />
        </div>

        {/* Excerpt */}
        <div className="space-y-2 pt-2">
          <div className="h-4 bg-cyber-border/30 rounded" />
          <div className="h-4 bg-cyber-border/20 rounded w-5/6" />
          <div className="h-4 bg-cyber-border/10 rounded w-4/6" />
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 pt-4">
          <div className="h-4 w-24 bg-cyber-border/20 rounded" />
          <div className="h-4 w-16 bg-cyber-border/10 rounded" />
        </div>
      </div>
    </div>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <LoadingCard />
        </motion.div>
      ))}
    </div>
  );
}

export function LoadingList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <LoadingCard />
        </motion.div>
      ))}
    </div>
  );
}
