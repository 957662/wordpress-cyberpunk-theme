'use client';

import React from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberStep {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'completed' | 'current' | 'pending';
}

export interface CyberStepperProps {
  steps: CyberStep[];
  currentStep: number;
  variant?: 'default' | 'glow' | 'neon' | 'hologram';
  orientation?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  className?: string;
}

export const CyberStepper: React.FC<CyberStepperProps> = ({
  steps,
  currentStep,
  variant = 'default',
  orientation = 'horizontal',
  showLabels = true,
  className,
}) => {
  const variantStyles = {
    default: {
      completed: 'bg-cyan-500 border-cyan-500 text-white',
      current: 'bg-cyan-500/20 border-cyan-500 text-cyan-400',
      pending: 'bg-gray-800 border-gray-600 text-gray-400',
      line: 'bg-cyan-500',
    },
    glow: {
      completed: 'bg-fuchsia-500 border-fuchsia-500 text-white',
      current: 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-400',
      pending: 'bg-gray-800 border-gray-600 text-gray-400',
      line: 'bg-fuchsia-500',
    },
    neon: {
      completed: 'bg-pink-500 border-pink-500 text-white',
      current: 'bg-pink-500/20 border-pink-500 text-pink-400',
      pending: 'bg-gray-800 border-gray-600 text-gray-400',
      line: 'bg-pink-500',
    },
    hologram: {
      completed: 'bg-purple-500 border-purple-500 text-white',
      current: 'bg-purple-500/20 border-purple-500 text-purple-400',
      pending: 'bg-gray-800 border-gray-600 text-gray-400',
      line: 'bg-purple-500',
    },
  };

  const styles = variantStyles[variant];
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'flex',
          isHorizontal ? 'flex-row items-center' : 'flex-col items-start'
        )}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          const status = isCompleted ? 'completed' : isCurrent ? 'current' : 'pending';

          return (
            <React.Fragment key={step.id}>
              <div className={cn('flex items-center', isHorizontal ? 'flex-1' : 'w-full')}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full border-2 flex items-center justify-center',
                      'transition-all duration-300',
                      styles[status]
                    )}
                    style={{
                      boxShadow: isCurrent
                        ? `0 0 20px ${variant === 'default' ? 'rgba(0, 240, 255, 0.5)' :
                                       variant === 'glow' ? 'rgba(157, 0, 255, 0.5)' :
                                       variant === 'neon' ? 'rgba(255, 0, 128, 0.5)' :
                                       'rgba(157, 0, 255, 0.5)'}`
                        : undefined,
                    }}
                  >
                    {step.icon || (
                      <span className="text-sm font-semibold">
                        {isCompleted ? '✓' : index + 1}
                      </span>
                    )}
                  </div>
                  {showLabels && isHorizontal && (
                    <div className="mt-2 text-center">
                      <p className={cn(
                        'text-sm font-medium',
                        status === 'completed' && 'text-cyan-400',
                        status === 'current' && 'text-white',
                        status === 'pending' && 'text-gray-400'
                      )}>
                        {step.title}
                      </p>
                    </div>
                  )}
                </div>
                {showLabels && !isHorizontal && (
                  <div className="ml-4 flex-1">
                    <p className={cn(
                      'text-sm font-medium',
                      status === 'completed' && 'text-cyan-400',
                      status === 'current' && 'text-white',
                      status === 'pending' && 'text-gray-400'
                    )}>
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                    )}
                  </div>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'transition-all duration-300',
                    isHorizontal ? 'flex-1 h-0.5 mx-4' : 'w-0.5 h-8 my-2',
                    status === 'completed' ? styles.line : 'bg-gray-700'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CyberStepper;
