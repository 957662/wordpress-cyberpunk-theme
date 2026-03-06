'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  icon?: React.ReactNode;
  status?: 'completed' | 'ongoing' | 'upcoming';
  image?: string;
  tags?: string[];
}

interface TimelineProps {
  events: TimelineEvent[];
  layout?: 'vertical' | 'horizontal';
  position?: 'left' | 'right' | 'alternate';
  showLine?: boolean;
  className?: string;
}

export function Timeline({
  events,
  layout = 'vertical',
  position = 'left',
  showLine = true,
  className,
}: TimelineProps) {
  if (layout === 'horizontal') {
    return <HorizontalTimeline events={events} showLine={showLine} className={className} />;
  }

  return <VerticalTimeline events={events} position={position} showLine={showLine} className={className} />;
}

interface VerticalTimelineProps {
  events: TimelineEvent[];
  position?: 'left' | 'right' | 'alternate';
  showLine?: boolean;
  className?: string;
}

function VerticalTimeline({ events, position = 'left', showLine = true, className }: VerticalTimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {showLine && (
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500 transform md:-translate-x-1/2" />
      )}

      <div className="space-y-8">
        {events.map((event, index) => {
          const isLeft = position === 'left' || (position === 'alternate' && index % 2 === 0);
          const isAlternating = position === 'alternate';

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative flex items-start gap-4',
                isAlternating && 'md:flex-row',
                isLeft && 'flex-row',
                !isLeft && !isAlternating && 'flex-row-reverse',
                isAlternating && isLeft && 'md:flex-row',
                isAlternating && !isLeft && 'md:flex-row-reverse'
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  'relative z-10 flex-shrink-0 w-8 h-8 rounded-full',
                  'bg-gradient-to-br from-cyan-500 to-blue-500',
                  'border-4 border-gray-900 dark:border-gray-800',
                  'flex items-center justify-center text-white',
                  isAlternating && 'md:absolute md:left-1/2 md:-translate-x-1/2'
                )}
              >
                {event.icon || <Calendar className="w-4 h-4" />}
              </div>

              {/* Content */}
              <div
                className={cn(
                  'flex-1 pb-8',
                  isLeft && 'pl-4',
                  !isLeft && !isAlternating && 'pr-4 text-right',
                  isAlternating && 'md:pl-0 md:pr-0 md:text-center'
                )}
              >
                <div
                  className={cn(
                    'p-4 rounded-lg bg-white dark:bg-gray-800 shadow-lg',
                    'border-l-4 border-cyan-500',
                    !isLeft && !isAlternating && 'border-l-0 border-r-4 border-cyan-500'
                  )}
                >
                  {/* Date Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                      {event.date}
                    </span>
                    {event.time && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {event.time}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h3>

                  {/* Description */}
                  {event.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                      {event.description}
                    </p>
                  )}

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  {/* Image */}
                  {event.image && (
                    <div className="mb-3 rounded-lg overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Status Badge */}
                  {event.status && (
                    <div className="mt-3">
                      <StatusBadge status={event.status} />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

interface HorizontalTimelineProps {
  events: TimelineEvent[];
  showLine?: boolean;
  className?: string;
}

function HorizontalTimeline({ events, showLine = true, className }: HorizontalTimelineProps) {
  return (
    <div className={cn('relative overflow-x-auto', className)}>
      <div className="flex items-start gap-8 min-w-max px-4 py-8">
        {showLine && (
          <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
        )}

        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex-shrink-0 w-72"
          >
            {/* Icon */}
            <div className="relative z-10 w-8 h-8 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 border-4 border-gray-900 dark:border-gray-800 flex items-center justify-center text-white">
              {event.icon || <Calendar className="w-4 h-4" />}
            </div>

            {/* Content */}
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-lg border-t-4 border-cyan-500">
              {/* Date */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-cyan-500" />
                <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                  {event.date}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                {event.title}
              </h3>

              {/* Description */}
              {event.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 text-center">
                  {event.description}
                </p>
              )}

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {event.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 text-xs font-medium rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Status */}
              {event.status && (
                <div className="mt-3 flex justify-center">
                  <StatusBadge status={event.status} />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'completed' | 'ongoing' | 'upcoming' }) {
  const statusConfig = {
    completed: {
      label: '已完成',
      className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    },
    ongoing: {
      label: '进行中',
      className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    },
    upcoming: {
      label: '即将开始',
      className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    },
  };

  const config = statusConfig[status];

  return (
    <span className={cn('px-3 py-1 text-xs font-medium rounded-full', config.className)}>
      {config.label}
    </span>
  );
}

interface MilestoneTimelineProps {
  milestones: {
    title: string;
    completed: boolean;
    date?: string;
    description?: string;
  }[];
  className?: string;
}

export function MilestoneTimeline({ milestones, className }: MilestoneTimelineProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {milestones.map((milestone, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start gap-4"
        >
          <div
            className={cn(
              'flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center',
              milestone.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500'
            )}
          >
            {milestone.completed ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="text-sm font-medium">{index + 1}</span>
            )}
          </div>

          <div className="flex-1 pb-8">
            <div
              className={cn(
                'p-4 rounded-lg border-l-4',
                milestone.completed
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
              )}
            >
              <h4
                className={cn(
                  'font-semibold mb-1',
                  milestone.completed
                    ? 'text-green-900 dark:text-green-100'
                    : 'text-gray-900 dark:text-gray-100'
                )}
              >
                {milestone.title}
              </h4>

              {milestone.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {milestone.description}
                </p>
              )}

              {milestone.date && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{milestone.date}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
