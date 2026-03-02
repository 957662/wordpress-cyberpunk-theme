'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { TimelineItem, TimelineProps } from './Timeline';

export interface TimelineVerticalProps extends Omit<TimelineProps, 'showYear'> {
  compact?: boolean;
  showIcon?: boolean;
}

export function TimelineVertical({
  items,
  colorScheme = 'cyan',
  animate = true,
  sortOrder = 'desc',
  compact = false,
  showIcon = true,
  onItemClick,
}: TimelineVerticalProps) {
  const colors = {
    cyan: { primary: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
    purple: { primary: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    pink: { primary: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
    green: { primary: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
    orange: { primary: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
    blue: { primary: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  };

  const sortedItems = [...items].sort((a, b) => {
    const diff = a.date.getTime() - b.date.getTime();
    return sortOrder === 'asc' ? diff : -diff;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/30 via-purple-500/30 to-pink-500/30" />

      {/* Items */}
      <div className="space-y-4">
        {sortedItems.map((item, index) => {
          const itemColors = item.color ? colors[item.color] : colors[colorScheme];

          return (
            <motion.div
              key={item.id}
              initial={animate ? { opacity: 0, x: -20 } : false}
              whileInView={animate ? { opacity: 1, x: 0 } : false}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => onItemClick?.(item)}
              className={`
                relative pl-12 p-4 rounded-lg border-2 backdrop-blur-sm
                ${itemColors.bg} ${itemColors.border}
                hover:shadow-lg transition-all duration-300 cursor-pointer
              `}
            >
              {/* Dot */}
              <div
                className={`
                  absolute left-2 top-1/2 -translate-y-1/2
                  w-4 h-4 rounded-full border-2 ${itemColors.border}
                  ${itemColors.bg}
                `}
              />

              {/* Content */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Date */}
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className={`w-3 h-3 ${itemColors.primary} flex-shrink-0`} />
                    <span className={`text-xs font-semibold ${itemColors.primary}`}>
                      {formatDate(item.date)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-100 mb-1">
                    {item.title}
                  </h3>

                  {/* Description */}
                  {!compact && item.description && (
                    <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                  )}

                  {/* Tags */}
                  {!compact && item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className={`px-2 py-0.5 rounded text-xs ${itemColors.primary} ${itemColors.bg}`}
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{item.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <ChevronRight className={`w-5 h-5 ${itemColors.primary} flex-shrink-0 mt-4`} />
              </div>

              {/* Icon */}
              {showIcon && item.icon && (
                <div className={`absolute top-4 right-4 ${itemColors.primary}`}>
                  {item.icon}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export interface TimelineHorizontalProps {
  items: TimelineItem[];
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
  animate?: boolean;
  onItemClick?: (item: TimelineItem) => void;
}

export function TimelineHorizontal({
  items,
  colorScheme = 'cyan',
  animate = true,
  onItemClick,
}: TimelineHorizontalProps) {
  const colors = {
    cyan: { primary: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
    purple: { primary: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    pink: { primary: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
    green: { primary: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
    orange: { primary: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
    blue: { primary: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="relative overflow-x-auto pb-4">
      {/* Horizontal line */}
      <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30" />

      {/* Items */}
      <div className="flex gap-6 min-w-max px-4">
        {items.map((item, index) => {
          const itemColors = item.color ? colors[item.color] : colors[colorScheme];

          return (
            <motion.div
              key={item.id}
              initial={animate ? { opacity: 0, y: 20 } : false}
              whileInView={animate ? { opacity: 1, y: 0 } : false}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => onItemClick?.(item)}
              className={`
                relative pt-12 pb-4 px-6 min-w-[280px] max-w-[320px] rounded-lg border-2 backdrop-blur-sm
                ${itemColors.bg} ${itemColors.border}
                hover:shadow-lg transition-all duration-300 cursor-pointer
              `}
            >
              {/* Dot */}
              <div
                className={`
                  absolute top-4 left-1/2 -translate-x-1/2
                  w-4 h-4 rounded-full border-2 ${itemColors.border}
                  ${itemColors.bg} z-10
                `}
              />

              {/* Content */}
              <div className="text-center">
                {/* Date */}
                <div className={`flex items-center justify-center gap-1 mb-3 ${itemColors.primary}`}>
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs font-semibold">{formatDate(item.date)}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-100 mb-2">{item.title}</h3>

                {/* Description */}
                {item.description && (
                  <p className="text-sm text-gray-400 line-clamp-3 mb-3">{item.description}</p>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {item.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`px-2 py-1 rounded text-xs ${itemColors.primary} ${itemColors.bg} border ${itemColors.border}`}
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="text-xs text-gray-500">+{item.tags.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
