'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<StepProps>;
  validation?: (data: any) => boolean | Promise<boolean>;
  skipValidation?: boolean;
}

interface StepProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
  onNext?: () => void;
  onPrev?: () => void;
}

interface FormWizardProps {
  steps: WizardStep[];
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  initialData?: Record<string, any>;
  submitButtonText?: string;
  showProgress?: boolean;
  showStepNumbers?: boolean;
  allowSkip?: boolean;
  className?: string;
}

export function FormWizard({
  steps,
  onSubmit,
  initialData = {},
  submitButtonText = '提交',
  showProgress = true,
  showStepNumbers = true,
  allowSkip = false,
  className,
}: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingStep, setIsSubmittingStep] = useState(false);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const currentStepData = steps[currentStep];

  // 更新表单数据
  const handleChange = useCallback((field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // 清除该字段的错误
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // 验证当前步骤
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    if (currentStepData.skipValidation) return true;

    const stepElement = document.getElementById(`wizard-step-${currentStep}`);
    if (!stepElement) return true;

    // 检查必填字段
    const requiredFields = stepElement.querySelectorAll('[required]');
    let isValid = true;
    const newErrors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      const input = field as HTMLInputElement;
      if (!input.value.trim()) {
        newErrors[input.name] = '此项为必填项';
        isValid = false;
      }
    });

    // 自定义验证
    if (isValid && currentStepData.validation) {
      try {
        const result = await currentStepData.validation(data);
        if (!result) {
          newErrors._form = '验证失败，请检查输入';
          isValid = false;
        }
      } catch (error) {
        newErrors._form = error instanceof Error ? error.message : '验证失败';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [currentStep, currentStepData, data]);

  // 下一步
  const handleNext = async () => {
    setIsSubmittingStep(true);

    const isValid = await validateCurrentStep();

    if (isValid) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));

      if (currentStep < steps.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setVisitedSteps((prev) => new Set([...prev, nextStep]));
        setErrors({});
      }
    }

    setIsSubmittingStep(false);
  };

  // 上一步
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await onSubmit(data);
    } catch (error) {
      setErrors({
        _submit: error instanceof Error ? error.message : '提交失败，请重试',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 跳转到指定步骤
  const handleGoToStep = (step: number) => {
    if (allowSkip || completedSteps.has(step)) {
      setCurrentStep(step);
      setVisitedSteps((prev) => new Set([...prev, step]));
      setErrors({});
    }
  };

  const StepComponent = currentStepData.component;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {/* 进度条 */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              {showStepNumbers && `步骤 ${currentStep + 1}/${steps.length}`}
            </h2>
            <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
          </div>

          {/* 进度条 */}
          <div className="h-2 bg-cyber-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* 步骤指示器 */}
          <div className="flex items-center justify-between mt-4">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(index);
              const isCurrent = index === currentStep;
              const isVisited = visitedSteps.has(index);
              const canClick = allowSkip || isVisited || isCompleted;

              return (
                <motion.button
                  key={step.id}
                  whileHover={canClick ? { scale: 1.05 } : {}}
                  whileTap={canClick ? { scale: 0.95 } : {}}
                  onClick={() => canClick && handleGoToStep(index)}
                  disabled={!canClick}
                  className="flex-1 flex items-center gap-2"
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                      isCompleted && 'bg-cyber-green text-black',
                      isCurrent && 'bg-cyber-cyan text-black',
                      !isCompleted && !isCurrent && 'bg-cyber-muted text-gray-500',
                      !canClick && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  <div
                    className={cn(
                      'hidden sm:block text-left text-sm',
                      isCurrent && 'text-white font-medium',
                      !isCurrent && 'text-gray-500'
                    )}
                  >
                    <div className="truncate max-w-[120px]">{step.title}</div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="flex-1 h-px bg-cyber-border mx-2" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {errors._form && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-cyber-pink/10 border border-cyber-pink/30 rounded-lg text-cyber-pink"
        >
          {errors._form}
        </motion.div>
      )}

      {/* 步骤内容 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          id={`wizard-step-${currentStep}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-cyber-card border border-cyber-border rounded-xl p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              {currentStepData.title}
            </h3>
            {currentStepData.description && (
              <p className="text-sm text-gray-400">{currentStepData.description}</p>
            )}
          </div>

          <StepComponent
            data={data}
            onChange={handleChange}
            errors={errors}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </motion.div>
      </AnimatePresence>

      {/* 导航按钮 */}
      <div className="mt-6 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: currentStep > 0 ? 1.05 : 1 }}
          whileTap={{ scale: currentStep > 0 ? 0.95 : 1 }}
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
            currentStep > 0
              ? 'bg-cyber-card border border-cyber-border hover:border-cyber-cyan text-white'
              : 'bg-cyber-muted opacity-50 cursor-not-allowed text-gray-500'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          上一步
        </motion.button>

        {isLastStep ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium
              bg-gradient-to-r from-cyber-cyan to-cyber-purple
              hover:shadow-lg hover:shadow-cyber-cyan/25
              transition-all disabled:opacity-50 disabled:cursor-not-allowed
              text-black"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                提交中...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {submitButtonText}
              </>
            )}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={isSubmittingStep}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium
              bg-gradient-to-r from-cyber-cyan to-cyber-purple
              hover:shadow-lg hover:shadow-cyber-cyan/25
              transition-all disabled:opacity-50 disabled:cursor-not-allowed
              text-black"
          >
            {isSubmittingStep ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                验证中...
              </>
            ) : (
              <>
                下一步
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}

// 表单验证 Hook
export function useFormWizard(initialData?: Record<string, any>) {
  const [data, setData] = useState(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const setValue = useCallback((field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => new Set([...prev, field]));
  }, []);

  const setError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const validate = useCallback((
    validations: Record<string, (value: any) => string | undefined>
  ): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.entries(validations).forEach(([field, validator]) => {
      const error = validator(data[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [data]);

  const reset = useCallback(() => {
    setData(initialData || {});
    setErrors({});
    setTouched(new Set());
  }, [initialData]);

  return {
    data,
    errors,
    touched,
    setValue,
    setError,
    clearError,
    validate,
    reset,
    isTouched: (field: string) => touched.has(field),
    hasError: (field: string) => !!errors[field],
  };
}
