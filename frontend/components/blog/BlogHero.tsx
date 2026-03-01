/**
 * BlogHero - 博客页面头部
 * 大标题、描述和特色内容
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import GlitchEffect from '@/components/effects/GlitchEffect';

interface BlogHeroProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function BlogHero({
  title = '博客',
  description = '探索技术、分享经验、记录成长',
  className = '',
}: BlogHeroProps) {
  return (
    <section
      className={cn(
        'relative py-20 md:py-32 overflow-hidden',
        'bg-gradient-to-br from-cyber-dark via-cyber-muted to-cyber-dark',
        className
      )}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* 内容 */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 标题 */}
          <GlitchEffect text={title} intensity="medium" speed="normal">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-100 mb-6">
              {title}
            </h1>
          </GlitchEffect>

          {/* 描述 */}
          <motion.p
            className="text-xl md:text-2xl text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {description}
          </motion.p>

          {/* 装饰线 */}
          <motion.div
            className="flex items-center justify-center space-x-4"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-cyber-cyan" />
            <div className="w-2 h-2 bg-cyber-cyan rotate-45" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-cyber-cyan" />
          </motion.div>
        </motion.div>
      </div>

      {/* 扫描线效果 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.1) 2px, rgba(0, 240, 255, 0.1) 4px)',
          }}
        />
      </div>
    </section>
  );
}
