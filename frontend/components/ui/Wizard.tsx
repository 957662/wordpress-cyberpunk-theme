'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Steps } from './Steps';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  validate?: () => boolean | Promise<boolean>;
  onSubmit?: () => void | Promise<void>;
}

export interface WizardProps {
  steps: WizardStep[];
  onFinish?: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: 'default' | 'neon' | 'cyber';
  showProgress?: boolean;
  allowSkip?: boolean;
  className?: string;
}

const variantStyles = {
  default: {
    header: 'border-gray-800',
    button: 'bg-gray-700 hover:bg-gray-600 text-white',
  },
  neon: {
    header: 'border-cyan-500/30',
    button: 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50',
  },
  cyber: {
    header: 'border-purple-500/30',
    button: 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/50',
  },
};

export const Wizard: React.FC<WizardProps> = ({
  steps,
  onFinish,
  onCancel,
  variant = 'default',
  showProgress = true,
  allowSkip = false,
  className,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const styles = variantStyles[variant];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const validateCurrentStep = useCallback(async () => {
    if (currentStepData.validate) {
      const isValid = await currentStepData.validate();
      return isValid;
    }
    return true;
  }, [currentStepData]);

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    if (currentStepData.onSubmit) {
      setIsSubmitting(true);
      try {
        await currentStepData.onSubmit();
        setCompletedSteps((prev) => new Set(prev).add(currentStep));
      } catch (error) {
        console.error('Step submit error:', error);
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else if (onFinish) {
      setIsSubmitting(true);
      try {
        await onFinish();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    if (allowSkip && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToStep = (index: number) => {
    // 只能回到已经完成的步骤
    if (index < currentStep || completedSteps.has(index)) {
      setCurrentStep(index);
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className={cn('w-full', className)}>
      {/* 头部进度 */}
      {showProgress && (
        <div className={cn('mb-6 pb-6 border-b', styles.header)}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {currentStepData.title}
            </h2>
            <span className="text-sm text-gray-400">
              步骤 {currentStep + 1} / {steps.length}
            </span>
          </div>

          {/* 进度条 */}
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* 步骤指示器 */}
      <div className="mb-6">
        <Steps
          steps={steps.map((step, index) => ({
            title: step.title,
            status:
              index < currentStep
                ? 'completed'
                : index === currentStep
                ? 'current'
                : 'pending',
          }))}
          variant={variant}
          onStepClick={allowSkip ? goToStep : undefined}
        />
      </div>

      {/* 步骤内容 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="mb-6"
        >
          {currentStepData.description && (
            <p className="text-gray-400 mb-4">{currentStepData.description}</p>
          )}
          {currentStepData.content}
        </motion.div>
      </AnimatePresence>

      {/* 操作按钮 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <div className="flex gap-2">
          {!isFirstStep && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isSubmitting}
              size="md"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              上一步
            </Button>
          )}

          {allowSkip && !isLastStep && (
            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={isSubmitting}
              size="md"
            >
              跳过
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {onCancel && (
            <Button
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
              size="md"
            >
              取消
            </Button>
          )}

          <Button
            variant={variant}
            onClick={handleNext}
            disabled={isSubmitting}
            size="md"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                处理中...
              </>
            ) : isLastStep ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                完成
              </>
            ) : (
              <>
                下一步
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Wizard;
