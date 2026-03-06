'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string | Date;
  status?: 'completed' | 'pending' | 'error';
  icon?: React.ReactNode;
  details?: Array<{
    label: string;
    value: string;
  }>;
}

interface TimelineProps {
  events: TimelineEvent[];
  variant?: 'vertical' | 'horizontal';
  showDate?: boolean;
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  events,
  variant = 'vertical',
  showDate = true,
  className
}) => {
  if (variant === 'horizontal') {
    return (
      <div className={cn('relative overflow-x-auto', className)}>
        <div className="flex gap-8 pb-4 min-w-max">
          {events.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              {/* 时间节点 */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2',
                  event.status === 'completed' && 'bg-cyber-green/20 border-cyber-green text-cyber-green',
                  event.status === 'pending' && 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan',
                  event.status === 'error' && 'bg-cyber-pink/20 border-cyber-pink text-cyber-pink',
                  !event.status && 'bg-cyber-dark/50 border-gray-700 text-gray-500'
                )}>
                  {event.icon || (
                    event.status === 'completed' && <CheckCircle className="w-5 h-5" />
                  )}
                  {event.status === 'pending' && <Clock className="w-5 h-5" />}
                  {event.status === 'error' && <AlertCircle className="w-5 h-5" />}
                  {!event.status && <span className="text-sm font-semibold">{index + 1}</span>}
                </div>

                {/* 连接线（除了最后一个） */}
                {index < events.length - 1 && (
                  <div className="flex-1 w-0.5 bg-gray-800 my-2 min-h-[40px]" />
                )}
              </div>

              {/* 内容 */}
              <div className="pt-2">
                <h4 className="font-semibold text-white mb-1">{event.title}</h4>
                {event.description && (
                  <p className="text-sm text-gray-400 mb-2">{event.description}</p>
                )}
                {showDate && (
                  <p className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleDateString('zh-CN')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 垂直时间轴
  return (
    <div className={cn('relative space-y-6', className)}>
      {/* 中心线 */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800" />

      {events.map((event, index) => {
        const isLast = index === events.length - 1;

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-12"
          >
            {/* 时间节点 */}
            <div className={cn(
              'absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center border-2',
              event.status === 'completed' && 'bg-cyber-green/20 border-cyber-green text-cyber-green',
              event.status === 'pending' && 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan',
              event.status === 'error' && 'bg-cyber-pink/20 border-cyber-pink text-cyber-pink',
              !event.status && 'bg-cyber-dark/50 border-gray-700 text-gray-500'
            )}>
              {event.icon || (
                event.status === 'completed' && <CheckCircle className="w-4 h-4" />
              )}
              {event.status === 'pending' && <Clock className="w-4 h-4" />}
              {event.status === 'error' && <AlertCircle className="w-4 h-4" />}
              {!event.status && <span className="text-xs font-semibold">{index + 1}</span>}
            </div>

            {/* 内容 */}
            <div className="bg-cyber-dark/30 border border-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white">{event.title}</h4>
                {showDate && (
                  <span className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleDateString('zh-CN')}
                  </span>
                )}
              </div>

              {event.description && (
                <p className="text-sm text-gray-400 mb-3">{event.description}</p>
              )}

              {event.details && (
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  {event.details.map((detail, idx) => (
                    <div key={idx}>
                      <dt className="text-gray-500">{detail.label}</dt>
                      <dd className="text-gray-300 font-medium">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {/* 连接线到下一个 */}
            {!isLast && (
              <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-800 -z-10" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

// 迷你时间轴（用于卡片内）
export const TimelineMini: React.FC<{
  events: Array<{
    label: string;
    time: string;
    status?: 'completed' | 'pending' | 'error';
  }>;
  className?: string;
}> = ({ events, className }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {events.map((event, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className={cn(
            'w-2 h-2 rounded-full',
            event.status === 'completed' && 'bg-cyber-green',
            event.status === 'pending' && 'bg-cyber-cyan',
            event.status === 'error' && 'bg-cyber-pink',
            !event.status && 'bg-gray-700'
          )} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-300 truncate">{event.label}</p>
          </div>
          <span className="text-xs text-gray-500">{event.time}</span>
        </div>
      ))}
    </div>
  );
};

// 进度时间轴
export const ProgressTimeline: React.FC<{
  steps: Array<{
    title: string;
    description?: string;
  }>;
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}> = ({ steps, currentStep, onStepClick, className }) => {
  return (
    <div className={cn('relative', className)}>
      {/* 进度条 */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-800">
        <div
          className="h-full bg-cyber-cyan transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* 步骤 */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <button
              key={index}
              onClick={() => onStepClick?.(index)}
              className={cn(
                'flex flex-col items-center gap-2 cursor-pointer',
                'group'
              )}
            >
              {/* 圆圈 */}
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                isCompleted && 'bg-cyber-green border-cyber-green text-cyber-dark',
                isCurrent && 'bg-cyber-cyan border-cyber-cyan text-cyber-dark',
                !isCompleted && !isCurrent && 'bg-cyber-dark border-gray-700 text-gray-500',
                'group-hover:scale-110'
              )}>
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>

              {/* 标签 */}
              <div className="text-center">
                <p className={cn(
                  'text-sm font-medium',
                  isCompleted && 'text-cyber-green',
                  isCurrent && 'text-cyber-cyan',
                  !isCompleted && !isCurrent && 'text-gray-500'
                )}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
