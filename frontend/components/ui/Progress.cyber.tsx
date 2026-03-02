'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'cyber';
  showLabel?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
  label?: string;
}

export function CyberProgress({
  value,
  max = 100,
  size = 'md',
  variant = 'cyber',
  showLabel = false,
  showPercentage = true,
  animated = true,
  label
}: ProgressBarProps) {
  const [currentValue, setCurrentValue] = useState(0);
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  useEffect(() => {
    if (animated) {
      setTimeout(() => setCurrentValue(percentage), 100);
    } else {
      setCurrentValue(percentage);
    }
  }, [percentage, animated]);

  const sizeClasses = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

  return (
    <div className="w-full">
      {showLabel && label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">{label}</span>
          {showPercentage && (
            <span className="text-sm text-cyan-400">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      
      <div className={`w-full ${sizeClasses[size]} bg-gray-800 rounded-full overflow-hidden border border-cyan-500/20`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: \`\${currentValue}%\` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full relative"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default CyberProgress;
