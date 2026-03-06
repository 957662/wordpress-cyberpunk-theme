/**
 * CyberTimeline - 赛博朋克时间轴组件
 * 垂直时间轴展示
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { ReactNode } from 'react';

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  content?: ReactNode;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
}

export interface CyberTimelineProps {
  items: TimelineItem[];
  variant?: 'left' | 'right' | 'alternate';
  className?: string;
}

export function CyberTimeline({
  items,
  variant = 'alternate',
  className,
}: CyberTimelineProps) {
  const colors = {
    cyan: 'border-cyber-cyan bg-cyber-cyan text-cyber-cyan shadow-neon-cyan',
    purple: 'border-cyber-purple bg-cyber-purple text-cyber-purple shadow-neon-purple',
    pink: 'border-cyber-pink bg-cyber-pink text-cyber-pink shadow-neon-pink',
    yellow: 'border-cyber-yellow bg-cyber-yellow text-cyber-yellow shadow-neon-yellow',
    green: 'border-cyber-green bg-cyber-green text-cyber-green shadow-[0_0_10px_#00ff88]',
  };

  return (
    <div className={cn('relative', className)}>
      {/* 中心线 */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyber-cyan via-cyber-purple to-cyber-pink transform -translate-x-1/2" />

      {/* 时间轴项目 */}
      <div className="space-y-12">
        {items.map((item, index) => {
          const isLeft = variant === 'left' || (variant === 'alternate' && index % 2 === 0);
          const color = item.color || 'cyan';
          const colorClasses = colors[color];

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={cn(
                'relative flex items-center',
                isLeft ? 'justify-start' : 'justify-end'
              )}
            >
              {/* 内容 */}
              <div
                className={cn(
                  'w-5/12 p-6 rounded-lg border bg-cyber-card/50 backdrop-blur-sm',
                  colorClasses
                )}
              >
                {/* 图标 */}
                {item.icon && (
                  <div className={cn('mb-4', colorClasses.split(' ')[2])}>
                    {item.icon}
                  </div>
                )}

                {/* 日期 */}
                <div className={cn('text-sm font-mono mb-2', colorClasses.split(' ')[2])}>
                  {item.date}
                </div>

                {/* 标题 */}
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>

                {/* 描述 */}
                {item.description && (
                  <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                )}

                {/* 自定义内容 */}
                {item.content}
              </div>

              {/* 中心点 */}
              <div
                className={cn(
                  'absolute left-1/2 w-4 h-4 rounded-full border-2 transform -translate-x-1/2 z-10',
                  colorClasses
                )}
              >
                <div className="absolute inset-1 rounded-full bg-current animate-pulse" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
