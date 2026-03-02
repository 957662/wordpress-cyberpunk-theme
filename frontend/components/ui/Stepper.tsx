/**
 * 赛博朋克风格步骤条组件
 */

'use client';

import { motion } from 'framer-motion';
import { CheckIcon, ChevronRightIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'pending' | 'active' | 'completed' | 'error';
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'minimal' | 'detailed';
  className?: string;
  clickable?: boolean;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  variant = 'default',
  className,
  clickable = false,
}: StepperProps) {
  const isHorizontal = orientation === 'horizontal';

  const getStepStatus = (index: number): Step['status'] => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const handleStepClick = (index: number) => {
    if (clickable && onStepClick && index < currentStep) {
      onStepClick(index);
    }
  };

  const renderStep = (step: Step, index: number) => {
    const status = step.status || getStepStatus(index);
    const isClickable = clickable && index < currentStep;

    return (
      <motion.div
        key={step.id}
        initial={{ opacity: 0, [isHorizontal ? 'x' : 'y']: 20 }}
        animate={{ opacity: 1, [isHorizontal ? 'x' : 'y']: 0 }}
        transition={{ delay: index * 0.1 }}
        className={cn(
          'flex items-start',
          isHorizontal ? 'flex-1' : 'w-full',
          !isHorizontal && index !== steps.length - 1 && 'pb-8'
        )}
      >
        <div
          className={cn(
            'flex items-start flex-1',
            !isHorizontal && 'gap-4'
          )}
          onClick={() => handleStepClick(index)}
          className={cn(
            'flex items-start',
            isHorizontal ? 'flex-col' : 'gap-4 w-full',
            isClickable && 'cursor-pointer'
          )}
        >
          {/* Step Indicator */}
          <div className="flex items-center">
            <motion.div
              animate={{
                scale: status === 'active' ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.5, repeat: status === 'active' ? Infinity : 0 }}
              className={cn(
                'relative flex items-center justify-center w-10 h-10 rounded-lg font-display font-bold transition-all duration-300',
                {
                  'bg-cyber-cyan text-cyber-dark shadow-neon-cyan': status === 'active',
                  'bg-cyber-green text-cyber-dark shadow-neon-green': status === 'completed',
                  'bg-cyber-muted text-gray-400 border-2 border-cyber-border': status === 'pending',
                  'bg-cyber-pink text-white shadow-neon-pink': status === 'error',
                }
              )}
            >
              {status === 'completed' ? (
                <CheckIcon className="w-5 h-5" />
              ) : status === 'error' ? (
                '!'
              ) : step.icon ? (
                step.icon
              ) : (
                <span>{index + 1}</span>
              )}

              {/* Pulse Effect for Active Step */}
              {status === 'active' && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-cyber-cyan"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ zIndex: -1 }}
                />
              )}
            </motion.div>

            {/* Connector Line */}
            {index !== steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 transition-all duration-300',
                  isHorizontal ? 'mx-4 min-w-[40px]' : 'absolute left-5 top-10 w-0.5 h-full ml-4.5',
                  {
                    'bg-cyber-green shadow-neon-green': status === 'completed',
                    'bg-cyber-border': status === 'pending',
                    'bg-gradient-to-r from-cyber-cyan to-cyber-border': status === 'active',
                  }
                )}
              />
            )}
          </div>

          {/* Step Content */}
          <div className={cn(isHorizontal ? 'mt-3 text-center' : 'flex-1')}>
            <h3
              className={cn('font-display font-semibold transition-colors', {
                'text-cyber-cyan': status === 'active',
                'text-cyber-green': status === 'completed',
                'text-gray-400': status === 'pending',
                'text-cyber-pink': status === 'error',
              })}
            >
              {step.title}
            </h3>
            {step.description && variant !== 'minimal' && (
              <p
                className={cn('text-sm mt-1 transition-colors', {
                  'text-gray-300': status === 'active' || status === 'completed',
                  'text-gray-500': status === 'pending',
                })}
              >
                {step.description}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div
      className={cn(
        'w-full',
        isHorizontal ? 'flex items-start gap-2' : 'flex flex-col',
        className
      )}
    >
      {steps.map((step, index) => renderStep(step, index))}
    </div>
  );
}

// Compact variant for smaller spaces
export function StepperCompact({
  steps,
  currentStep,
  onStepClick,
  className,
}: Omit<StepperProps, 'variant' | 'orientation'>) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {steps.map((step, index) => {
        const status = step.status || (index < currentStep ? 'completed' : index === currentStep ? 'active' : 'pending');

        return (
          <div key={step.id} className="flex items-center">
            <motion.button
              onClick={() => onStepClick?.(index)}
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-md font-display font-bold text-sm transition-all',
                {
                  'bg-cyber-cyan text-cyber-dark shadow-neon-cyan': status === 'active',
                  'bg-cyber-green text-cyber-dark': status === 'completed',
                  'bg-cyber-muted text-gray-400': status === 'pending',
                }
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {status === 'completed' ? <CheckIcon className="w-4 h-4" /> : index + 1}
            </motion.button>

            {index !== steps.length - 1 && (
              <ChevronRightIcon className={cn('w-4 h-4 mx-1', {
                'text-cyber-green': status === 'completed',
                'text-cyber-border': status === 'pending',
              })} />
            )}
          </div>
        );
      })}
    </div>
  );
}
