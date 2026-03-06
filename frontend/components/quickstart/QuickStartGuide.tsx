/**
 * 快速开始指南组件
 * 帮助新用户快速了解和使用平台功能
 */

'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  completed?: boolean;
}

interface QuickStartGuideProps {
  steps: Step[];
  onComplete?: () => void;
  className?: string;
}

export function QuickStartGuide({
  steps,
  onComplete,
  className,
}: QuickStartGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isCompleted = completedSteps.has(currentStepData.id);

  const handleNext = () => {
    if (!isCompleted) {
      setCompletedSteps(prev => new Set(prev).add(currentStepData.id));
    }

    if (isLastStep) {
      onComplete?.();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {/* 进度指示器 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              className="flex flex-col items-center flex-1"
              disabled={index > currentStep && !completedSteps.has(steps[currentStep].id)}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300',
                  completedSteps.has(step.id)
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : index === currentStep
                    ? 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400'
                    : 'bg-gray-800 border-2 border-gray-700 text-gray-500'
                )}
              >
                {completedSteps.has(step.id) ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-xs text-center hidden sm:block',
                  index === currentStep ? 'text-white' : 'text-gray-500'
                )}
              >
                {step.title}
              </span>
            </button>
          ))}
        </div>
        {/* 进度条 */}
        <div className="relative h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* 内容区域 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 sm:p-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-400">
              {currentStepData.description}
            </p>
          </div>

          <div className="min-h-[300px]">
            {currentStepData.content}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                currentStep === 0
                  ? 'text-gray-500'
                  : 'text-gray-300 hover:bg-gray-800'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              上一步
            </button>

            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-200',
                    index === currentStep
                      ? 'bg-cyan-400 w-6'
                      : completedSteps.has(steps[index].id)
                      ? 'bg-purple-500'
                      : 'bg-gray-700'
                  )}
                  aria-label={`步骤 ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className={cn(
                'flex items-center gap-2 px-6 py-2 rounded-lg',
                'bg-gradient-to-r from-cyan-500 to-purple-500',
                'text-white font-medium',
                'hover:shadow-lg hover:shadow-cyan-500/25',
                'transition-all duration-200'
              )}
            >
              {isLastStep ? '完成' : '下一步'}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 步骤计数 */}
      <div className="text-center mt-4 text-sm text-gray-500">
        步骤 {currentStep + 1} / {steps.length}
      </div>
    </div>
  );
}

/**
 * 快速开始指南卡片
 */
interface QuickStartCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel: string;
  onAction: () => void;
  completed?: boolean;
  className?: string;
}

export function QuickStartCard({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  completed = false,
  className,
}: QuickStartCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        'p-6 bg-gray-900/50 border border-gray-800 rounded-lg',
        'hover:border-cyan-500/50 transition-all duration-300',
        completed && 'border-green-500/30',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400">
          {icon}
        </div>
        {completed && (
          <div className="p-1 bg-green-500/20 rounded-full">
            <Check className="w-4 h-4 text-green-400" />
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        {description}
      </p>

      <button
        onClick={onAction}
        className={cn(
          'w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
          completed
            ? 'bg-green-500/20 text-green-400'
            : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
        )}
      >
        {completed ? '已完成' : actionLabel}
      </button>
    </motion.div>
  );
}
