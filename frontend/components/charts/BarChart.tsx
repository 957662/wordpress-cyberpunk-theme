'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BarData {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  data: BarData[];
  title?: string;
  description?: string;
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  showValues?: boolean;
  barWidth?: number;
  gap?: number;
  animationDuration?: number;
  className?: string;
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
  orientation?: 'vertical' | 'horizontal';
}

const colorSchemes = {
  cyan: {
    primary: 'bg-cyan-500',
    secondary: 'bg-cyan-400',
    gradient: 'from-cyan-500 to-cyan-400',
    text: 'text-cyan-400',
  },
  purple: {
    primary: 'bg-purple-500',
    secondary: 'bg-purple-400',
    gradient: 'from-purple-500 to-purple-400',
    text: 'text-purple-400',
  },
  pink: {
    primary: 'bg-pink-500',
    secondary: 'bg-pink-400',
    gradient: 'from-pink-500 to-pink-400',
    text: 'text-pink-400',
  },
  green: {
    primary: 'bg-green-500',
    secondary: 'bg-green-400',
    gradient: 'from-green-500 to-green-400',
    text: 'text-green-400',
  },
  orange: {
    primary: 'bg-orange-500',
    secondary: 'bg-orange-400',
    gradient: 'from-orange-500 to-orange-400',
    text: 'text-orange-400',
  },
  blue: {
    primary: 'bg-blue-500',
    secondary: 'bg-blue-400',
    gradient: 'from-blue-500 to-blue-400',
    text: 'text-blue-400',
  },
};

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  description,
  height = 300,
  showGrid = true,
  showLabels = true,
  showValues = true,
  barWidth = 40,
  gap = 10,
  animationDuration = 0.8,
  className,
  colorScheme = 'cyan',
  orientation = 'vertical',
}) => {
  const colors = colorSchemes[colorScheme];

  const maxValue = useMemo(() => {
    return Math.max(...data.map((d) => d.value), 1);
  }, [data]);

  const chartVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const barVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: animationDuration,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  if (orientation === 'horizontal') {
    return (
      <div className={cn('w-full', className)}>
        {(title || description) && (
          <div className="mb-6">
            {title && (
              <h3 className={cn('text-xl font-bold text-white mb-2', colors.text)}>
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-gray-400">{description}</p>
            )}
          </div>
        )}

        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {data.map((item, index) => {
            const barColor = item.color || colors;
            const percentage = (item.value / maxValue) * 100;

            return (
              <motion.div
                key={index}
                variants={barVariants}
                className="flex items-center gap-4"
              >
                {showLabels && (
                  <span className="w-24 text-sm text-gray-400 text-right flex-shrink-0">
                    {item.label}
                  </span>
                )}

                <div className="flex-1 relative">
                  {showGrid && (
                    <div className="absolute inset-0 flex justify-between">
                      {[0, 25, 50, 75, 100].map((tick) => (
                        <div
                          key={tick}
                          className="h-full border-l border-gray-700/50"
                        />
                      ))}
                    </div>
                  )}

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: animationDuration, delay: index * 0.1 }}
                    className={cn(
                      'h-8 rounded-lg bg-gradient-to-r relative overflow-hidden',
                      typeof barColor === 'string' ? '' : barColor.gradient
                    )}
                    style={{
                      backgroundColor: typeof barColor === 'string' ? barColor : undefined,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </motion.div>
                </div>

                {showValues && (
                  <span className={cn('w-16 text-sm font-semibold', colors.text)}>
                    {item.value}
                  </span>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className={cn('text-xl font-bold text-white mb-2', colors.text)}>
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-400">{description}</p>
          )}
        </div>
      )}

      <div style={{ height }}>
        {showGrid && (
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 25, 50, 75, 100].map((tick) => (
              <div
                key={tick}
                className="w-full border-t border-gray-700/50"
              />
            ))}
          </div>
        )}

        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          className="relative h-full flex items-end justify-center gap-3 px-4"
        >
          {data.map((item, index) => {
            const barColor = item.color || colors;
            const percentage = (item.value / maxValue) * 100;

            return (
              <motion.div
                key={index}
                variants={barVariants}
                className="flex flex-col items-center gap-2"
                style={{ width: barWidth }}
              >
                <div className="relative flex-1 w-full flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${percentage}%` }}
                    transition={{ duration: animationDuration, delay: index * 0.1 }}
                    className={cn(
                      'w-full rounded-t-lg bg-gradient-to-t relative overflow-hidden',
                      typeof barColor === 'string' ? '' : barColor.gradient
                    )}
                    style={{
                      backgroundColor: typeof barColor === 'string' ? barColor : undefined,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent" />
                  </motion.div>
                </div>

                {showLabels && (
                  <span className="text-xs text-gray-400 text-center truncate w-full">
                    {item.label}
                  </span>
                )}

                {showValues && (
                  <span className={cn('text-sm font-semibold', colors.text)}>
                    {item.value}
                  </span>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default BarChart;
