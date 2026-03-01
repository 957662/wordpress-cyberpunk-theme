/**
 * 时间线组件
 * 垂直时间线展示
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  /** 唯一标识 */
  id: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description?: string;
  /** 时间 */
  date: string;
  /** 图标 */
  icon?: React.ReactNode;
  /** 标签 */
  tags?: string[];
  /** 链接 */
  link?: string;
}

export interface TimelineProps {
  /** 时间线项目 */
  items: TimelineItem[];
  /** 主题颜色 */
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  /** 自定义类名 */
  className?: string;
}

const colorStyles = {
  cyan: 'border-cyber-cyan bg-cyber-cyan text-cyber-cyan shadow-neon-cyan',
  purple: 'border-cyber-purple bg-cyber-purple text-cyber-purple shadow-neon-purple',
  pink: 'border-cyber-pink bg-cyber-pink text-cyber-pink shadow-neon-pink',
  yellow: 'border-cyber-yellow bg-cyber-yellow text-cyber-yellow shadow-neon-yellow',
};

export function Timeline({ items, color = 'cyan', className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {/* 时间线主线 */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-cyber-border" />

      {/* 时间线项目 */}
      <div className="space-y-8">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-12"
          >
            {/* 时间点 */}
            <motion.div
              whileHover={{ scale: 1.2 }}
              className={cn(
                'absolute left-0 top-0 w-8 h-8 rounded-full border-2',
                'flex items-center justify-center z-10',
                colorStyles[color]
              )}
            >
              {item.icon || (
                <div className="w-2 h-2 rounded-full bg-cyber-dark" />
              )}
            </motion.div>

            {/* 内容卡片 */}
            <div className="cyber-card">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-display font-bold text-white">
                  {item.title}
                </h3>
                <time className="text-sm text-cyber-cyan font-mono whitespace-nowrap">
                  {item.date}
                </time>
              </div>

              {item.description && (
                <p className="text-gray-400 mb-3">{item.description}</p>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded bg-cyber-muted text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-cyber-cyan hover:underline"
                >
                  查看详情 →
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
