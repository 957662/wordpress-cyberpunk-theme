'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  container?: boolean;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'none' | 'primary' | 'secondary' | 'accent' | 'dark' | 'gradient';
  variant?: 'default' | 'cyber' | 'neon' | 'holographic';
  animate?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  id,
  container = true,
  containerSize = 'lg',
  padding = 'lg',
  background = 'none',
  variant = 'default',
  animate = true,
}) => {
  const paddingClasses: Record<string, string> = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16 md:py-24',
    xl: 'py-20 md:py-32',
  };

  const backgroundClasses: Record<string, string> = {
    none: '',
    primary: 'bg-primary',
    secondary: 'bg-secondary/50',
    accent: 'bg-accent/10',
    dark: 'bg-dark-900/50',
    gradient: 'bg-gradient-to-b from-dark-900 to-dark-800',
  };

  const variantClasses: Record<string, string> = {
    default: '',
    cyber: 'relative overflow-hidden',
    neon: 'relative',
    holographic: 'relative backdrop-blur-sm',
  };

  const content = (
    <section
      id={id}
      className={cn(
        'relative w-full',
        paddingClasses[padding],
        backgroundClasses[background],
        variantClasses[variant],
        className
      )}
    >
      {/* Variant-specific decorations */}
      {variant === 'cyber' && (
        <>
          <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyber-cyan/30" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-cyber-purple/30" />
        </>
      )}

      {variant === 'neon' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyber-cyan/20 to-transparent" />
          <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-cyber-purple/20 to-transparent" />
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-cyber-pink/20 to-transparent" />
        </div>
      )}

      {variant === 'holographic' && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 via-cyber-purple/5 to-cyber-pink/5" />
      )}

      {container ? (
        <div className={`container-${containerSize}`}>{children}</div>
      ) : (
        children
      )}
    </section>
  );

  if (animate) {
    return (
      <motion.section
        id={id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className={cn(
          'relative w-full',
          paddingClasses[padding],
          backgroundClasses[background],
          variantClasses[variant],
          className
        )}
      >
        {variant === 'cyber' && (
          <>
            <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyber-cyan/30" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-cyber-purple/30" />
          </>
        )}

        {variant === 'neon' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyber-cyan/20 to-transparent" />
            <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-cyber-purple/20 to-transparent" />
            <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-cyber-pink/20 to-transparent" />
          </div>
        )}

        {variant === 'holographic' && (
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 via-cyber-purple/5 to-cyber-pink/5" />
        )}

        {container ? (
          <div className={`container-${containerSize}`}>{children}</div>
        ) : (
          children
        )}
      </motion.section>
    );
  }

  return content;
};

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
  badge?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  description,
  className,
  align = 'left',
  badge,
}) => {
  const alignClasses: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={cn('mb-12', alignClasses[align], className)}>
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20"
        >
          {badge}
        </motion.span>
      )}

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm font-semibold text-cyber-cyan uppercase tracking-wider mb-2"
        >
          {subtitle}
        </motion.p>
      )}

      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white"
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-400 max-w-3xl"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default Section;
