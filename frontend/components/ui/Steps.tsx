/**
 * Steps Component
 * 步骤条组件
 */

'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * 步骤项
 */
export interface Step {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'pending' | 'current' | 'completed';
}

/**
 * Steps 组件属性
 */
export interface StepsProps {
  steps: Step[];
  currentStep: number;
  onChange?: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  variant?: 'default' | 'cyber' | 'minimal';
}

/**
 * Steps 组件
 */
export function Steps({
  steps,
  currentStep,
  onChange,
  orientation = 'horizontal',
  className,
  variant = 'default'
}: StepsProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'flex-row items-center justify-between' : 'flex-col items-start space-y-4',
        className
      )}
    >
      {steps.map((step, index) => {
        const status = index < currentStep ? 'completed' :
                      index === currentStep ? 'current' : 'pending';
        const isClickable = onChange && index < currentStep;

        return (
          <React.Fragment key={index}>
            {/* 步骤项 */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-center',
                isHorizontal ? 'flex-1' : 'w-full'
              )}
            >
              <button
                onClick={() => isClickable && onChange(index)}
                disabled={!isClickable}
                className={cn(
                  'flex items-start space-x-3 flex-1',
                  isClickable && 'cursor-pointer',
                  !isClickable && 'cursor-default'
                )}
              >
                {/* 步骤图标/数字 */}
                <div
                  className={cn(
                    'relative flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-all',
                    status === 'completed' && 'bg-cyber-cyan border-cyber-cyan text-white',
                    status === 'current' && 'border-cyber-cyan text-cyber-cyan',
                    status === 'pending' && 'border-gray-300 text-gray-400',
                    variant === 'cyber' && status === 'current' && 'shadow-neon'
                  )}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* 步骤内容 */}
                <div className="flex-1 min-w-0 text-left">
                  <div
                    className={cn(
                      'text-sm font-medium',
                      status === 'current' && 'text-cyber-cyan',
                      status === 'completed' && 'text-gray-900 dark:text-gray-100',
                      status === 'pending' && 'text-gray-500'
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div
                      className={cn(
                        'text-xs mt-1',
                        status === 'current' && 'text-gray-700 dark:text-gray-300',
                        status === 'completed' && 'text-gray-500',
                        status === 'pending' && 'text-gray-400'
                      )}
                    >
                      {step.description}
                    </div>
                  )}
                </div>
              </button>
            </motion.div>

            {/* 连接线 */}
            {index < steps.length - 1 && isHorizontal && (
              <div className="flex-1 h-0.5 mx-2">
                <div
                  className={cn(
                    'h-full transition-all',
                    status === 'completed' ? 'bg-cyber-cyan' : 'bg-gray-300'
                  )}
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/**
 * StepContent 组件 - 显示当前步骤的内容
 */
export interface StepContentProps {
  steps: Step[];
  currentStep: number;
  children: React.ReactNode;
  className?: string;
}

export function StepContent({ steps, currentStep, children, className }: StepContentProps) {
  const currentStepData = steps[currentStep];

  return (
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={cn('mt-8', className)}
    >
      {currentStepData && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-cyber-cyan mb-2">
            {currentStepData.title}
          </h2>
          {currentStepData.description && (
            <p className="text-gray-600 dark:text-gray-400">
              {currentStepData.description}
            </p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
}

/**
 * StepNavigation 组件 - 上一步/下一步导航
 */
export interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onFinish?: () => void;
  previousLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  className?: string;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onFinish,
  previousLabel = '上一步',
  nextLabel = '下一步',
  finishLabel = '完成',
  className
}: StepNavigationProps) {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className={cn('flex justify-between mt-8', className)}>
      <button
        onClick={onPrevious}
        disabled={isFirstStep || !onPrevious}
        className={cn(
          'px-4 py-2 rounded border transition-colors',
          isFirstStep ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
      >
        {previousLabel}
      </button>

      <button
        onClick={isLastStep ? onFinish : onNext}
        className={cn(
          'px-4 py-2 rounded bg-cyber-cyan text-white hover:bg-cyber-cyan/80 transition-colors'
        )}
      >
        {isLastStep ? finishLabel : nextLabel}
      </button>
    </div>
  );
}
