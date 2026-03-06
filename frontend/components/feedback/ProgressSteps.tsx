import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Circle, Loader2 } from 'lucide-react';

export type StepStatus = 'pending' | 'current' | 'completed' | 'error';

interface Step {
  id: string;
  label: string;
  description?: string;
  status?: StepStatus;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * ProgressSteps - 进度步骤组件
 * 用于显示多步骤流程的进度
 */
export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
  onStepClick,
  className,
  orientation = 'horizontal',
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={cn(
      'flex',
      isHorizontal ? 'flex-row items-center justify-between' : 'flex-col space-y-4',
      className
    )}>
      {steps.map((step, index) => {
        const status = step.status || (() => {
          if (index < currentStep) return 'completed';
          if (index === currentStep) return 'current';
          return 'pending';
        })();

        const isClickable = onStepClick && index < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                'flex',
                isHorizontal ? 'flex-col items-center flex-1' : 'flex-row items-start'
              )}
            >
              <button
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                  status === 'completed' && 'bg-cyan-600 border-cyan-600 text-white',
                  status === 'current' && 'border-cyan-500 text-cyan-500',
                  status === 'error' && 'bg-red-600 border-red-600 text-white',
                  status === 'pending' && 'border-gray-700 text-gray-600',
                  isClickable && 'cursor-pointer hover:scale-110',
                  !isClickable && 'cursor-default'
                )}
              >
                {status === 'completed' && <Check className="w-5 h-5" />}
                {status === 'current' && <Loader2 className="w-5 h-5 animate-spin" />}
                {status === 'error' && <span className="text-lg">!</span>}
                {status === 'pending' && <Circle className="w-4 h-4" />}
              </button>

              <div className={cn(
                'mt-2 text-center',
                !isHorizontal && 'ml-3 mt-0 text-left'
              )}>
                <p className={cn(
                  'text-sm font-medium',
                  status === 'completed' && 'text-cyan-500',
                  status === 'current' && 'text-cyan-400',
                  status === 'error' && 'text-red-500',
                  status === 'pending' && 'text-gray-500'
                )}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {!isLast && (
              <div className={cn(
                'flex-1',
                isHorizontal ? 'h-0.5 mx-4 bg-gray-800' : 'ml-5 w-0.5 h-8 bg-gray-800'
              )}>
                <div
                  className={cn(
                    'h-full transition-all',
                    status === 'completed' ? 'bg-cyan-600' : 'bg-transparent',
                    isHorizontal ? 'w-full' : 'w-full'
                  )}
                  style={{
                    width: isHorizontal ? (status === 'completed' ? '100%' : '0%') : '100%',
                    height: isHorizontal ? '100%' : (status === 'completed' ? '100%' : '0%'),
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressSteps;
