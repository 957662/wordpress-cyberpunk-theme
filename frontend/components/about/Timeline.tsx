/**
 * 项目发展时间线组件
 * 展示项目的重要里程碑
 */

'use client';

import { motion } from 'framer-motion';
import { Calendar, Rocket, Code, Users, Trophy, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  status?: 'completed' | 'in-progress' | 'planned';
}

const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    date: '2023-01',
    title: '项目启动',
    description: 'CyberPress 项目正式立项，确定技术栈和设计方向',
    icon: <Rocket className="w-6 h-6" />,
    color: 'cyan',
    status: 'completed',
  },
  {
    id: '2',
    date: '2023-03',
    title: '基础架构搭建',
    description: '完成 Next.js + WordPress Headless 架构搭建',
    icon: <Code className="w-6 h-6" />,
    color: 'purple',
    status: 'completed',
  },
  {
    id: '3',
    date: '2023-06',
    title: '核心功能开发',
    description: '实现博客、作品集、搜索等核心功能模块',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'pink',
    status: 'completed',
  },
  {
    id: '4',
    date: '2023-09',
    title: 'UI/UX 优化',
    description: '完成赛博朋克风格设计和动画效果',
    icon: <Users className="w-6 h-6" />,
    color: 'yellow',
    status: 'completed',
  },
  {
    id: '5',
    date: '2023-12',
    title: 'Beta 版本发布',
    description: '开放内测，收集用户反馈并进行优化',
    icon: <Trophy className="w-6 h-6" />,
    color: 'green',
    status: 'completed',
  },
  {
    id: '6',
    date: '2024-03',
    title: '正式版本 v1.0',
    description: '正式发布 v1.0 版本，开始大规模推广',
    icon: <Calendar className="w-6 h-6" />,
    color: 'cyan',
    status: 'in-progress',
  },
  {
    id: '7',
    date: '2024-06',
    title: '移动端优化',
    description: '优化移动端体验，支持 PWA 离线访问',
    icon: <Rocket className="w-6 h-6" />,
    color: 'purple',
    status: 'planned',
  },
  {
    id: '8',
    date: '2024-09',
    title: '社区功能',
    description: '添加用户系统、评论、点赞等社交功能',
    icon: <Users className="w-6 h-6" />,
    color: 'pink',
    status: 'planned',
  },
];

const colorClasses = {
  cyan: {
    bg: 'bg-cyber-cyan/10',
    border: 'border-cyber-cyan',
    text: 'text-cyber-cyan',
    glow: 'shadow-neon-cyan',
  },
  purple: {
    bg: 'bg-cyber-purple/10',
    border: 'border-cyber-purple',
    text: 'text-cyber-purple',
    glow: 'shadow-neon-purple',
  },
  pink: {
    bg: 'bg-cyber-pink/10',
    border: 'border-cyber-pink',
    text: 'text-cyber-pink',
    glow: 'shadow-neon-pink',
  },
  yellow: {
    bg: 'bg-cyber-yellow/10',
    border: 'border-cyber-yellow',
    text: 'text-cyber-yellow',
    glow: 'shadow-neon-yellow',
  },
  green: {
    bg: 'bg-cyber-green/10',
    border: 'border-cyber-green',
    text: 'text-cyber-green',
    glow: '0 0 10px rgba(0, 255, 136, 0.5)',
  },
};

const statusBadges = {
  completed: '已完成',
  'in-progress': '进行中',
  planned: '计划中',
};

const statusColors = {
  completed: 'bg-green-500/10 text-green-400 border-green-500/30',
  'in-progress': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  planned: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
};

export function Timeline() {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            发展历程
          </h2>
          <p className="text-gray-400 text-lg">
            从构想到现实，记录每一个重要时刻
          </p>
        </motion.div>

        {/* 时间线 */}
        <div className="relative">
          {/* 中心线 */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyber-cyan via-cyber-purple to-cyber-pink transform -translate-x-1/2 hidden md:block" />

          {/* 事件列表 */}
          <div className="space-y-12">
            {timelineEvents.map((event, index) => {
              const isLeft = index % 2 === 0;
              const colors = colorClasses[event.color];

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'relative flex items-center',
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse',
                    'flex-col'
                  )}
                >
                  {/* 日期标签 */}
                  <div
                    className={cn(
                      'flex-shrink-0 w-full md:w-1/2 px-4',
                      isLeft ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12',
                      'mb-4 md:mb-0'
                    )}
                  >
                    <div className="inline-block px-4 py-2 rounded-lg bg-cyber-muted border border-cyber-border">
                      <span className={cn('text-sm font-mono', colors.text)}>
                        {event.date}
                      </span>
                    </div>
                  </div>

                  {/* 中心点 */}
                  <div className="absolute left-1/2 top-0 transform -translate-x-1/2 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-cyber-dark border-2 z-10">
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center',
                        colors.bg,
                        colors.border,
                        'border-2'
                      )}
                    >
                      {event.icon}
                    </div>
                  </div>

                  {/* 内容卡片 */}
                  <div
                    className={cn(
                      'flex-1 w-full md:w-1/2 px-4',
                      isLeft ? 'md:pl-12' : 'md:pr-12'
                    )}
                  >
                    <motion.div
                      whileHover={{ y: -5, borderColor: colors.border }}
                      className={cn(
                        'p-6 rounded-xl border border-cyber-border bg-cyber-card/50 backdrop-blur-sm transition-all group',
                        'hover:shadow-lg'
                      )}
                    >
                      {/* 状态标签 */}
                      {event.status && (
                        <div className="mb-3">
                          <span
                            className={cn(
                              'inline-block px-2 py-1 text-xs rounded border',
                              statusColors[event.status]
                            )}
                          >
                            {statusBadges[event.status]}
                          </span>
                        </div>
                      )}

                      {/* 图标 - 移动端显示 */}
                      <div className="md:hidden mb-3">
                        <div
                          className={cn(
                            'inline-flex p-3 rounded-lg',
                            colors.bg,
                            colors.text
                          )}
                        >
                          {event.icon}
                        </div>
                      </div>

                      {/* 标题 */}
                      <h3
                        className={cn(
                          'text-xl font-display font-bold text-white mb-2 group-hover:',
                          colors.text
                        )}
                      >
                        {event.title}
                      </h3>

                      {/* 描述 */}
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {event.description}
                      </p>

                      {/* 装饰线 */}
                      <div
                        className={cn(
                          'mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-500',
                          'bg-gradient-to-r',
                          isLeft
                            ? 'from-cyber-cyan to-cyber-purple'
                            : 'from-cyber-purple to-cyber-pink'
                        )}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 未来展望 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 border border-cyber-border">
            <Sparkles className="w-5 h-5 text-cyber-cyan" />
            <span className="text-gray-300">更多精彩功能，敬请期待...</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Timeline;
