'use client';

import React from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberTimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export interface CyberTimelineProps {
  items: CyberTimelineItem[];
  variant?: 'default' | 'glow' | 'neon' | 'hologram';
  className?: string;
}

export const CyberTimeline: React.FC<CyberTimelineProps> = ({
  items,
  variant = 'default',
  className,
}) => {
  const variantStyles = {
    default: {
      line: 'bg-cyan-500/30',
      dot: 'bg-cyan-500',
      glow: 'shadow-cyan-500/50',
    },
    glow: {
      line: 'bg-fuchsia-500/30',
      dot: 'bg-fuchsia-500',
      glow: 'shadow-fuchsia-500/50',
    },
    neon: {
      line: 'bg-pink-500/30',
      dot: 'bg-pink-500',
      glow: 'shadow-pink-500/50',
    },
    hologram: {
      line: 'bg-purple-500/30',
      dot: 'bg-purple-500',
      glow: 'shadow-purple-500/50',
    },
  };

  const itemVariantStyles = {
    default: 'border-cyan-500/30',
    success: 'border-green-500/30',
    warning: 'border-yellow-500/30',
    error: 'border-red-500/30',
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn('relative', className)}>
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800">
        <div className={cn('absolute inset-0 w-full', styles.line)} />
      </div>

      {/* Timeline items */}
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={item.id} className="relative flex items-start gap-4">
            {/* Timeline dot */}
            <div
              className={cn(
                'relative z-10 w-8 h-8 rounded-full border-2 border-gray-900 flex items-center justify-center',
                styles.dot
              )}
              style={{
                boxShadow: `0 0 10px ${variant === 'default' ? 'rgba(0, 240, 255, 0.5)' :
                                    variant === 'glow' ? 'rgba(157, 0, 255, 0.5)' :
                                    variant === 'neon' ? 'rgba(255, 0, 128, 0.5)' :
                                    'rgba(157, 0, 255, 0.5)'}`,
              }}
            >
              {item.icon || <div className="w-2 h-2 rounded-full bg-white" />}
            </div>

            {/* Timeline content */}
            <div className="flex-1 min-w-0">
              <div
                className={cn(
                  'p-4 border rounded-lg backdrop-blur-sm',
                  itemVariantStyles[item.variant || 'default']
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                    {item.description && (
                      <p className="mt-1 text-sm text-gray-300">{item.description}</p>
                    )}
                  </div>
                  {item.date && (
                    <span className="text-xs text-gray-400 whitespace-nowrap">{item.date}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CyberTimeline;
