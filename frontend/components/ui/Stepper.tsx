/**
 * Stepper - 步骤条组件
 * 用于显示多步骤流程的进度
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, ChevronRight } from 'lucide-react';

export interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'completed' | 'current' | 'pending' | 'error';
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabels?: boolean;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  size = 'md',
  className,
  showLabels = true,
}: StepperProps) {
  const isHorizontal = orientation === 'horizontal';

  const sizeStyles = {
    sm: {
      step: 'w-6 h-6 text-xs',
      connector: 'h-0.5',
    },
    md: {
      step: 'w-8 h-8 text-sm',
      connector: 'h-1',
    },
    lg: {
      step: 'w-10 h-10 text-base',
      connector: 'h-1.5',
    },
  };

  const getStepStatus = (index: number): Step['status'] => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div
      className={cn(
        'relative',
        isHorizontal ? 'flex items-center' : 'flex flex-col',
        className
      )}
    >
      {steps.map((step, index) => {
        const status = step.status || getStepStatus(index);
        const isClickable = onStepClick && status !== 'pending';

        return (
          <div
            key={step.id}
            className={cn(
              'flex',
              isHorizontal ? 'flex-1' : 'flex-col',
              !isHorizontal && 'mb-4 last:mb-0'
            )}
          >
            <div className={cn('flex items-center', isHorizontal ? 'w-full' : 'mb-2')}>
              <motion.div
                className={cn(
                  'relative flex items-center justify-center rounded-full font-semibold transition-all duration-300',
                  sizeStyles[size].step,
                  status === 'completed' && 'bg-cyber-cyan text-cyber-dark',
                  status === 'current' && 'bg-cyber-purple text-white shadow-lg shadow-cyber-purple/50',
                  status === 'pending' && 'bg-cyber-dark/50 border-2 border-gray-600 text-gray-400',
                  status === 'error' && 'bg-cyber-pink text-white',
                  isClickable && 'cursor-pointer hover:scale-110',
                  isHorizontal && 'flex-shrink-0'
                )}
                whileHover={isClickable ? { scale: 1.1 } : undefined}
                whileTap={isClickable ? { scale: 0.95 } : undefined}
                onClick={() => isClickable && onStepClick!(index)}
              >
                {status === 'completed' ? (
                  <Check className={cn(size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
                ) : step.icon ? (
                  step.icon
                ) : (
                  <span>{index + 1}</span>
                )}

                {status === 'current' && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-cyber-purple"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </motion.div>

              {showLabels && (
                <div className={cn('ml-3', !isHorizontal && 'ml-0 mt-2')}>
                  <div
                    className={cn(
                      'font-semibold transition-colors',
                      status === 'completed' && 'text-cyber-cyan',
                      status === 'current' && 'text-white',
                      status === 'pending' && 'text-gray-400',
                      status === 'error' && 'text-cyber-pink'
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div
                      className={cn(
                        'text-sm mt-0.5',
                        status === 'current' ? 'text-gray-300' : 'text-gray-500'
                      )}
                    >
                      {step.description}
                    </div>
                  )}
                </div>
              )}

              {index < steps.length - 1 && isHorizontal && (
                <div className="flex-1 mx-2 flex items-center">
                  <div
                    className={cn(
                      'w-full rounded-full transition-colors',
                      sizeStyles[size].connector,
                      status === 'completed' ? 'bg-cyber-cyan' : 'bg-gray-700'
                    )}
                  />
                </div>
              )}
            </div>

            {!isHorizontal && index < steps.length - 1 && (
              <div className="ml-3 mb-2">
                <div
                  className={cn(
                    'w-0.5 rounded-full transition-colors',
                    status === 'completed' ? 'bg-cyber-cyan' : 'bg-gray-700',
                    'min-h-[20px]'
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export interface StepContentProps {
  children: React.ReactNode;
  show?: boolean;
  className?: string;
}

export function StepContent({ children, show = true, className }: StepContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: show ? 1 : 0, x: show ? 0 : 20 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={cn('mt-6', className)}
    >
      {children}
    </motion.div>
  );
}

export interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  previousText?: string;
  nextText?: string;
  submitText?: string;
  className?: string;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  previousText = '上一步',
  nextText = '下一步',
  submitText = '提交',
  className,
}: StepNavigationProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className={cn('flex justify-between items-center mt-6', className)}>
      <motion.button
        whileHover={{ scale: isFirstStep ? 1 : 1.05 }}
        whileTap={{ scale: isFirstStep ? 1 : 0.95 }}
        onClick={onPrevious}
        disabled={isFirstStep}
        className={cn(
          'px-6 py-2 rounded-lg font-medium transition-all',
          'border border-cyber-cyan/30',
          isFirstStep
            ? 'opacity-50 cursor-not-allowed bg-cyber-dark/50 text-gray-500'
            : 'bg-cyber-dark text-cyber-cyan hover:bg-cyber-cyan/10'
        )}
      >
        {previousText}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isLastStep ? onSubmit : onNext}
        className={cn(
          'px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
          'bg-cyber-purple text-white hover:bg-cyber-purple/90',
          'shadow-lg shadow-cyber-purple/50'
        )}
      >
        {isLastStep ? submitText : nextText}
        {!isLastStep && <ChevronRight className="w-4 h-4" />}
      </motion.button>
    </div>
  );
}
