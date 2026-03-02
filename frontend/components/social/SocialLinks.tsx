/**
 * SocialLinks - 社交媒体链接组件
 * 显示个人或品牌的社交媒体链接
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Youtube,
  Instagram,
  Twitch,
  Disc,
} from 'lucide-react';

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}

export interface SocialLinksProps {
  links?: SocialLink[];
  className?: string;
  variant?: 'default' | 'minimal' | 'glow' | 'rounded';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const defaultLinks: SocialLink[] = [
  { name: 'GitHub', url: '#', icon: Github, color: '#ffffff' },
  { name: 'Twitter', url: '#', icon: Twitter, color: '#1DA1F2' },
  { name: 'LinkedIn', url: '#', icon: Linkedin, color: '#0077B5' },
  { name: 'Email', url: 'mailto:contact@example.com', icon: Mail, color: '#00f0ff' },
];

export const SocialLinks = ({
  links = defaultLinks,
  className,
  variant = 'default',
  size = 'md',
  showLabel = false,
}: SocialLinksProps) => {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        {links.map((link) => (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            className="text-gray-400 hover:text-white transition-colors"
            title={link.name}
          >
            <link.icon className={iconSizes[size]} />
          </motion.a>
        ))}
      </div>
    );
  }

  if (variant === 'glow') {
    return (
      <div className={cn('flex items-center gap-3 flex-wrap', className)}>
        {links.map((link) => (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'inline-flex items-center justify-center rounded-lg',
              sizeStyles[size],
              'bg-cyber-dark border border-cyber-border',
              'hover:shadow-[0_0_20px_currentColor] transition-all'
            )}
            style={{ color: link.color || '#00f0ff' }}
            title={link.name}
          >
            <link.icon className={iconSizes[size]} />
          </motion.a>
        ))}
      </div>
    );
  }

  if (variant === 'rounded') {
    return (
      <div className={cn('flex items-center gap-3 flex-wrap', className)}>
        {links.map((link) => (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'inline-flex items-center justify-center rounded-full',
              sizeStyles[size],
              'bg-cyber-dark border border-cyber-border',
              'text-gray-400 hover:text-white transition-all'
            )}
            title={link.name}
          >
            <link.icon className={iconSizes[size]} />
          </motion.a>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3 flex-wrap', className)}>
      {links.map((link) => (
        <motion.a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-cyber-dark/50 border border-cyber-border',
            'text-gray-400 hover:text-white hover:border-cyber-cyan/50 transition-all'
          )}
        >
          <link.icon className={iconSizes[size]} />
          {showLabel && <span className="text-sm font-medium">{link.name}</span>}
        </motion.a>
      ))}
    </div>
  );
};

export default SocialLinks;
