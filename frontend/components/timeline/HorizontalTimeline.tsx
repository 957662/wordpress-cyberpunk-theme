/**
 * HorizontalTimeline - 水平时间轴组件
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { CheckCircle2, Circle } from 'lucide-react';

export interface HorizontalTimelineProps {
  steps: Array<{
    title: string;
    description?: string;
    status: 'completed' | 'current' | 'pending';
  }>;
  className?: string;
}

export function HorizontalTimeline({
  steps,
  className,
}: HorizontalTimelineProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* 进度条 */}
      <div className="relative">
        {/* 背景线 */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-cyber-border transform -translate-y-1/2" />

        {/* 进度线 */}
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-cyber-cyan to-cyber-purple transform -translate-y-1/2"
          initial={{ width: 0 }}
          animate={{
            width: `${((steps.filter(s => s.status === 'completed').length) / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* 步骤 */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                {/* 图标 */}
                <div
                  className={cn(
                    'relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 bg-cyber-card',
                    isCompleted && 'border-cyber-cyan shadow-neon-cyan',
                    isCurrent && 'border-cyber-purple shadow-neon-purple animate-pulse',
                    step.status === 'pending' && 'border-cyber-border'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-cyber-cyan" />
                  ) : (
                    <Circle
                      className={cn(
                        'w-5 h-5',
                        isCurrent ? 'text-cyber-purple' : 'text-cyber-border'
                      )}
                    />
                  )}
                </div>

                {/* 标题 */}
                <div className="mt-4 text-center">
                  <div
                    className={cn(
                      'text-sm font-medium mb-1',
                      isCompleted && 'text-cyber-cyan',
                      isCurrent && 'text-cyber-purple',
                      step.status === 'pending' && 'text-gray-500'
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 max-w-[120px]">
                      {step.description}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
