'use client';

/**
 * 步骤进度条组件
 * 用于向导流程或注册流程
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  completedSteps?: number[];
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  clickable?: boolean;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export function StepProgress({
  steps,
  currentStep,
  completedSteps = [],
  variant = 'horizontal',
  size = 'md',
  showLabels = true,
  clickable = false,
  onStepClick,
  className,
}: StepProgressProps) {
  const sizeMap = {
    sm: { circle: 'w-8 h-8', text: 'text-sm', gap: 'gap-2' },
    md: { circle: 'w-12 h-12', text: 'text-base', gap: 'gap-3' },
    lg: { circle: 'w-16 h-16', text: 'text-lg', gap: 'gap-4' },
  };

  const currentSize = sizeMap[size];

  const getStepStatus = (index: number) => {
    if (completedSteps.includes(index)) return 'completed';
    if (index === currentStep) return 'current';
    if (index < currentStep) return 'completed';
    return 'pending';
  };

  const getStepStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-cyber-green border-cyber-green text-cyber-dark shadow-neon-cyan';
      case 'current':
        return 'bg-cyber-cyan border-cyber-cyan text-cyber-dark shadow-neon-cyan animate-pulse';
      default:
        return 'bg-cyber-dark border-gray-700 text-gray-500';
    }
  };

  if (variant === 'vertical') {
    return (
      <div className={cn('space-y-4', className)}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative">
              {/* Connecting Line */}
              {!isLast && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-800">
                  <motion.div
                    className="h-full bg-cyber-green"
                    initial={{ height: 0 }}
                    animate={{ height: status === 'completed' ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}

              {/* Step */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn('flex gap-4', currentSize.gap)}
              >
                {/* Circle */}
                <motion.div
                  whileHover={clickable && status !== 'pending' ? { scale: 1.05 } : {}}
                  onClick={() => clickable && status !== 'pending' && onStepClick?.(index)}
                  className={cn(
                    'flex-shrink-0 rounded-full border-2 flex items-center justify-center font-semibold transition-all',
                    currentSize.circle,
                    getStepStyles(status),
                    clickable && status !== 'pending' && 'cursor-pointer'
                  )}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>

                {/* Content */}
                {showLabels && (
                  <div className="flex-1 pt-2">
                    <h4
                      className={cn(
                        'font-semibold',
                        status === 'pending' ? 'text-gray-500' : 'text-white'
                      )}
                    >
                      {step.title}
                    </h4>
                    {step.description && (
                      <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex-1">
              <div className="flex items-center">
                {/* Circle */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={clickable && status !== 'pending' ? { scale: 1.05 } : {}}
                  onClick={() => clickable && status !== 'pending' && onStepClick?.(index)}
                  className={cn(
                    'rounded-full border-2 flex items-center justify-center font-semibold transition-all mx-auto',
                    currentSize.circle,
                    getStepStyles(status),
                    clickable && status !== 'pending' && 'cursor-pointer'
                  )}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>

                {/* Line */}
                {!isLast && (
                  <div className="flex-1 h-0.5 bg-gray-800 mx-2">
                    <motion.div
                      className="h-full bg-cyber-green"
                      initial={{ width: 0 }}
                      animate={{ width: status === 'completed' ? '100%' : '0%' }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  </div>
                )}
              </div>

              {/* Label */}
              {showLabels && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="mt-3 text-center"
                >
                  <h4
                    className={cn(
                      'font-semibold text-sm',
                      status === 'pending' ? 'text-gray-500' : 'text-white'
                    )}
                  >
                    {step.title}
                  </h4>
                  {step.description && size !== 'sm' && (
                    <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                  )}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepProgress;
