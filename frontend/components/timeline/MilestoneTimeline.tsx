/**
 * MilestoneTimeline - 里程碑时间轴组件
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Trophy, Flag, Target } from 'lucide-react';
import { ReactNode } from 'react';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  icon?: 'trophy' | 'flag' | 'target' | ReactNode;
  achieved?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
}

export interface MilestoneTimelineProps {
  milestones: Milestone[];
  showProgress?: boolean;
  className?: string;
}

export function MilestoneTimeline({
  milestones,
  showProgress = true,
  className,
}: MilestoneTimelineProps) {
  const achievedCount = milestones.filter(m => m.achieved).length;
  const progress = (achievedCount / milestones.length) * 100;

  const defaultIcons = {
    trophy: Trophy,
    flag: Flag,
    target: Target,
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* 总进度 */}
      {showProgress && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 rounded-lg border border-cyber-border bg-cyber-card/50 backdrop-blur-sm"
        >
          <div className="text-4xl font-display font-bold text-cyber-cyan mb-2">
            {achievedCount}/{milestones.length}
          </div>
          <div className="text-sm text-gray-400 mb-4">已完成的里程碑</div>
          <div className="w-full h-2 bg-cyber-border/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}

      {/* 里程碑列表 */}
      <div className="relative">
        {/* 连接线 */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-cyber-border" />

        {/* 里程碑 */}
        <div className="space-y-6">
          {milestones.map((milestone, index) => {
            const Icon = typeof milestone.icon === 'string'
              ? defaultIcons[milestone.icon as keyof typeof defaultIcons]
              : milestone.icon;

            const color = milestone.color || 'cyan';
            const colorClasses = {
              cyan: 'text-cyber-cyan border-cyber-cyan shadow-neon-cyan',
              purple: 'text-cyber-purple border-cyber-purple shadow-neon-purple',
              pink: 'text-cyber-pink border-cyber-pink shadow-neon-pink',
              yellow: 'text-cyber-yellow border-cyber-yellow shadow-neon-yellow',
              green: 'text-cyber-green border-cyber-green shadow-[0_0_10px_#00ff88]',
            };

            const currentColor = colorClasses[color];

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'relative flex gap-4 p-4 rounded-lg border transition-all',
                  milestone.achieved
                    ? `${currentColor} bg-cyber-card/50 backdrop-blur-sm`
                    : 'border-cyber-border bg-cyber-muted/30 opacity-60'
                )}
              >
                {/* 图标 */}
                <div
                  className={cn(
                    'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 bg-cyber-card',
                    milestone.achieved ? currentColor : 'border-cyber-border'
                  )}
                >
                  {typeof Icon === 'function' ? (
                    <Icon className="w-6 h-6" />
                  ) : Icon ? (
                    Icon
                  ) : (
                    <Flag className="w-6 h-6" />
                  )}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3
                      className={cn(
                        'font-bold',
                        milestone.achieved ? 'text-white' : 'text-gray-400'
                      )}
                    >
                      {milestone.title}
                    </h3>
                    {milestone.achieved && (
                      <span className={cn('text-xs px-2 py-1 rounded', `bg-${color}`)}>
                        已达成
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-400 mb-2">{milestone.description}</p>

                  <div className="text-xs text-gray-500 font-mono">{milestone.date}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
