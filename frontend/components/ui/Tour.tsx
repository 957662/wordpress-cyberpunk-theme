'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TourStep {
  target: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void;
}

export interface TourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  showProgress?: boolean;
  showDots?: boolean;
  className?: string;
}

const TourContext = createContext<{
  startTour: () => void;
  closeTour: () => void;
} | null>(null);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

export const TourProvider: React.FC<{
  children: React.ReactNode;
  steps: TourStep[];
  onComplete?: () => void;
}> = ({ children, steps, onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const startTour = () => setIsOpen(true);
  const closeTour = () => setIsOpen(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      steps[currentStep]?.action?.();
    } else {
      closeTour();
      onComplete?.();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    closeTour();
    onComplete?.();
  };

  return (
    <TourContext.Provider value={{ startTour, closeTour }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <Tour
            steps={steps}
            isOpen={isOpen}
            onClose={closeTour}
            currentStep={currentStep}
            onNext={handleNext}
            onPrev={handlePrev}
            onSkip={handleSkip}
          />
        )}
      </AnimatePresence>
    </TourContext.Provider>
  );
};

export interface TourInnerProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

function Tour({ steps, isOpen, onClose, currentStep, onNext, onPrev, onSkip }: TourInnerProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const step = steps[currentStep];

  useEffect(() => {
    const targetElement = document.querySelector(step.target);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const scrollX = window.pageXOffset;
      const scrollY = window.pageYOffset;
      
      setPosition({
        top: rect.top + scrollY,
        left: rect.left + scrollX
      });

      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, step.target]);

  const getPositionClasses = () => {
    switch (step.position || 'bottom') {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-4';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-4';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-4';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-4';
      case 'center':
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      default:
        return 'top-full left-1/2 -translate-x-1/2 mt-4';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Highlight Target */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed z-40 pointer-events-none"
        style={{
          top: position.top,
          left: position.left,
          width: step.position === 'center' ? '100vw' : 'auto',
          height: step.position === 'center' ? '100vh' : 'auto'
        }}
      >
        {!step.position === 'center' && (
          <div className="absolute inset-0 ring-2 ring-cyan-500 ring-offset-2 rounded-lg animate-pulse" />
        )}
      </motion.div>

      {/* Tour Tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={cn(
          'fixed z-50 w-80 bg-gray-900 border border-cyan-500/50 rounded-xl shadow-2xl shadow-cyan-500/20',
          getPositionClasses()
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
          <h3 className="text-lg font-semibold text-cyan-400">{step.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-300 leading-relaxed">{step.description}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-cyan-500/20">
          {/* Progress */}
          <div className="text-sm text-gray-400">
            {currentStep + 1} / {steps.length}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSkip}
              className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              跳过
            </button>

            <div className="flex items-center gap-1">
              {currentStep > 0 && (
                <button
                  onClick={onPrev}
                  className="p-2 text-gray-400 hover:text-white hover:bg-cyan-500/10 rounded-lg transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
              )}

              <button
                onClick={onNext}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center gap-1"
              >
                {currentStep === steps.length - 1 ? '完成' : '下一步'}
                {currentStep < steps.length - 1 && <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-800 rounded-b-xl overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
          />
        </div>
      </motion.div>
    </>
  );
}

export { Tour as TourComponent };
