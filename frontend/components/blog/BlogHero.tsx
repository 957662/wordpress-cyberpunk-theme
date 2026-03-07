'use client';

/**
 * BlogHero Component
 * 博客页面头部组件
 */

import React from 'react';
import { motion } from 'framer-motion';
import { GlitchText } from '@/components/effects';
import { cn } from '@/lib/utils';

export interface BlogHeroProps {
  title: string;
  description: string;
  backgroundImage?: string;
  className?: string;
}

export function BlogHero({
  title,
  description,
  backgroundImage,
  className,
}: BlogHeroProps) {
  return (
    <section
      className={cn(
        'relative py-20 px-4 overflow-hidden',
        'bg-gradient-to-br from-cyber-dark via-cyber-muted to-cyber-dark',
        className
      )}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 scanlines opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyber-dark" />

      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 240, 255, 0.15) 1px, transparent 0)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="relative container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Title */}
          <h1 className="mb-6">
            <GlitchText
              text={title}
              className="text-5xl md:text-7xl font-bold text-white"
              glitchColors={['#00f0ff', '#9d00ff', '#ff0080']}
            />
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
          >
            {description}
          </motion.p>

          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-8 h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent mx-auto"
            style={{ maxWidth: '200px' }}
          />
        </motion.div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-cyber-cyan rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyber-purple rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
    </section>
  );
}

export default BlogHero;
