'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Sparkles,
  Zap,
  Shield,
  Rocket
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  showParticles?: boolean;
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'Build Amazing Web Experiences',
  subtitle = 'Next.js + Tailwind CSS + Framer Motion',
  description = 'Create stunning, performant, and accessible web applications with our modern component library. Built with the latest technologies and best practices.',
  primaryCta = {
    label: 'Get Started',
    href: '/docs',
  },
  secondaryCta = {
    label: 'View Components',
    href: '/components',
  },
  showParticles = true,
  className,
}) => {
  const features = [
    {
      icon: Zap,
      label: 'Lightning Fast',
      color: 'cyan',
    },
    {
      icon: Shield,
      label: 'Secure',
      color: 'purple',
    },
    {
      icon: Sparkles,
      label: 'Beautiful',
      color: 'pink',
    },
    {
      icon: Rocket,
      label: 'Scalable',
      color: 'green',
    },
  ];

  return (
    <section className={cn('relative min-h-screen flex items-center justify-center overflow-hidden', className)}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Particle Effect */}
      {showParticles && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-8"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-cyan-400">New Components Added</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-cyan-400 mb-6 font-semibold"
        >
          {subtitle}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto"
        >
          {description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Link
            href={primaryCta.href}
            className={cn(
              'group px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500',
              'text-white font-semibold rounded-lg',
              'hover:shadow-lg hover:shadow-cyan-500/50',
              'transition-all duration-300',
              'flex items-center gap-2'
            )}
          >
            {primaryCta.label}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href={secondaryCta.href}
            className={cn(
              'group px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10',
              'text-white font-semibold rounded-lg',
              'hover:bg-white/10 hover:border-white/20',
              'transition-all duration-300',
              'flex items-center gap-2'
            )}
          >
            <Play className="w-4 h-4" />
            {secondaryCta.label}
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-colors"
              >
                <Icon className={cn('w-6 h-6 mx-auto mb-2', feature.color === 'cyan' && 'text-cyan-400', feature.color === 'purple' && 'text-purple-400', feature.color === 'pink' && 'text-pink-400', feature.color === 'green' && 'text-green-400')} />
                <p className="text-sm font-medium text-white">{feature.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-white rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
