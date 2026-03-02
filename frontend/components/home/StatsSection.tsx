'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, FileText, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatItem {
  icon: any;
  value: number;
  label: string;
  suffix?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
}

export interface StatsSectionProps {
  stats?: StatItem[];
  title?: string;
  subtitle?: string;
}

const defaultStats: StatItem[] = [
  {
    icon: FileText,
    value: 150,
    suffix: '+',
    label: '文章发布',
    color: 'cyan',
  },
  {
    icon: Users,
    value: 10000,
    suffix: '+',
    label: '活跃用户',
    color: 'purple',
  },
  {
    icon: TrendingUp,
    value: 98,
    suffix: '%',
    label: '客户满意度',
    color: 'pink',
  },
  {
    icon: Award,
    value: 50,
    suffix: '+',
    label: '项目完成',
    color: 'yellow',
  },
];

const colorConfig = {
  cyan: 'text-cyan-400',
  purple: 'text-purple-400',
  pink: 'text-pink-400',
  yellow: 'text-yellow-400',
};

const StatsSection: React.FC<StatsSectionProps> = ({
  stats = defaultStats,
  title = '我们的成就',
  subtitle = '用数据说话',
}) => {
  const [animatedValues, setAnimatedValues] = useState(
    stats.map(() => 0)
  );

  useEffect(() => {
    const duration = 2000; // 动画持续时间（毫秒）
    const steps = 60;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setAnimatedValues((prev) => {
        const completed = prev.every((val, idx) => val >= stats[idx].value);
        if (completed) {
          clearInterval(timer);
          return prev;
        }

        return prev.map((val, idx) => {
          const target = stats[idx].value;
          const increment = target / steps;
          return Math.min(val + increment, target);
        });
      });
    }, interval);

    return () => clearInterval(timer);
  }, [stats]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* 内容 */}
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-sm font-semibold tracking-widest text-cyan-400 uppercase">
            {subtitle}
          </p>
          <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {title}
          </h2>
        </motion.div>

        {/* 统计卡片 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClass = stat.color ? colorConfig[stat.color] : colorConfig.cyan;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50 p-8 text-center backdrop-blur-sm transition-all hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                {/* 背景动画 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                {/* 图标 */}
                <div className="mb-4 inline-flex rounded-lg bg-gray-900/50 p-3 transition-transform duration-300 group-hover:scale-110">
                  <Icon className={cn('h-8 w-8', colorClass)} />
                </div>

                {/* 数值 */}
                <div className="mb-2 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white md:text-5xl">
                    {Math.floor(animatedValues[index])}
                  </span>
                  {stat.suffix && (
                    <span className="text-2xl font-bold text-gray-400">
                      {stat.suffix}
                    </span>
                  )}
                </div>

                {/* 标签 */}
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>

                {/* 底部装饰线 */}
                <div className={cn(
                  'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r w-0',
                  'transition-all duration-300 group-hover:w-1/2',
                  stat.color === 'cyan' && 'from-cyan-500 to-blue-500',
                  stat.color === 'purple' && 'from-purple-500 to-pink-500',
                  stat.color === 'pink' && 'from-pink-500 to-rose-500',
                  stat.color === 'yellow' && 'from-yellow-500 to-orange-500'
                )} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
