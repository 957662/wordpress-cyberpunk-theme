'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'absolute' | 'percentage';
  icon?: React.ReactNode;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'percentage',
  icon,
  color = 'cyan',
  className = '',
}: StatCardProps) {
  const colors = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
    pink: 'from-pink-500/20 to-pink-500/5 border-pink-500/30',
    yellow: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30',
    green: 'from-green-500/20 to-green-500/5 border-green-500/30',
  };

  const isPositive = change !== undefined && change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden bg-gradient-to-br ${colors[color]} border rounded-2xl p-6 backdrop-blur-sm ${className}`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-gray-900/50 rounded-xl border border-white/10">
            {icon}
          </div>

          {change !== undefined && (
            <div
              className={`flex items-center gap-1 text-sm font-semibold ${
                isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {isPositive ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span>
                {changeType === 'percentage' ? `${change}%` : change}
              </span>
            </div>
          )}
        </div>

        <h3 className="text-cyan-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-cyan-100">{value}</p>
      </div>

      {/* Decorative glow */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-current opacity-10 blur-3xl rounded-full" />
    </motion.div>
  );
}
