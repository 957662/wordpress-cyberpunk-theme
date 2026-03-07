/**
 * 社交链接 Widget
 * 显示社交媒体和联系方式链接
 */

'use client';

import { motion } from 'framer-motion';
import { GithubIcon, TwitterIcon, MailIcon, RssIcon, LinkedinIcon, YoutubeIcon, InstagramIcon, TwitchIcon } from '@/components/icons';
import { Widget } from './base/Widget';
import { cn } from '@/lib/utils';

export type SocialPlatform =
  | 'github'
  | 'twitter'
  | 'email'
  | 'rss'
  | 'linkedin'
  | 'youtube'
  | 'instagram'
  | 'twitch'
  | 'custom';

export interface SocialLink {
  /** 平台类型 */
  platform: SocialPlatform;
  /** 链接地址 */
  url: string;
  /** 显示名称 */
  name: string;
  /** 自定义图标（当 platform 为 'custom' 时使用） */
  customIcon?: React.ReactNode;
  /** 描述文字 */
  description?: string;
}

export interface SocialLinksWidgetProps {
  /** 社交链接列表 */
  links: SocialLink[];
  /** Widget 标题 */
  title?: string;
  /** 显示风格 */
  variant?: 'grid' | 'list' | 'icons';
  /** 图标大小 */
  iconSize?: 'sm' | 'md' | 'lg';
  /** 是否显示描述 */
  showDescription?: boolean;
  /** 自定义类名 */
  className?: string;
}

const iconMap: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  twitter: TwitterIcon,
  email: MailIcon,
  rss: RssIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
  twitch: TwitchIcon,
  custom: () => null,
};

const iconColors: Record<SocialPlatform, string> = {
  github: 'hover:text-white hover:bg-gray-800',
  twitter: 'hover:text-white hover:bg-sky-500',
  email: 'hover:text-white hover:bg-red-500',
  rss: 'hover:text-white hover:bg-orange-500',
  linkedin: 'hover:text-white hover:bg-blue-600',
  youtube: 'hover:text-white hover:bg-red-600',
  instagram: 'hover:text-white hover:bg-gradient-to-br from-purple-600 to-pink-500',
  twitch: 'hover:text-white hover:bg-purple-600',
  custom: 'hover:text-white hover:bg-cyber-cyan',
};

const iconSizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export function SocialLinksWidget({
  links,
  title = '社交媒体',
  variant = 'list',
  iconSize = 'md',
  showDescription = true,
  className,
}: SocialLinksWidgetProps) {
  const getIcon = (link: SocialLink) => {
    if (link.platform === 'custom' && link.customIcon) {
      return link.customIcon;
    }
    const IconComponent = iconMap[link.platform];
    return <IconComponent className={iconSizes[iconSize]} />;
  };

  // 网格风格
  if (variant === 'grid') {
    return (
      <Widget title={title} className={className}>
        <div className="grid grid-cols-4 gap-3">
          {links.map((link, index) => (
            <motion.a
              key={link.platform + index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'flex items-center justify-center rounded-lg',
                'bg-cyber-dark border border-cyber-border',
                'text-gray-400 transition-all duration-300',
                iconColors[link.platform]
              )}
              title={link.name}
              aria-label={link.name}
            >
              {getIcon(link)}
            </motion.a>
          ))}
        </div>
      </Widget>
    );
  }

  // 仅图标风格
  if (variant === 'icons') {
    return (
      <Widget title={title} className={className}>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {links.map((link, index) => (
            <motion.a
              key={link.platform + index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                'flex items-center justify-center rounded-full',
                'bg-cyber-dark border border-cyber-border',
                'text-gray-400 transition-all duration-300',
                iconColors[link.platform]
              )}
              title={link.name}
              aria-label={link.name}
            >
              {getIcon(link)}
            </motion.a>
          ))}
        </div>
      </Widget>
    );
  }

  // 列表风格（默认）
  return (
    <Widget title={title} className={className}>
      <div className="space-y-2">
        {links.map((link, index) => (
          <motion.a
            key={link.platform + index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg',
              'bg-cyber-dark/50 border border-cyber-border',
              'hover:border-cyber-cyan transition-all duration-300',
              'group hover:shadow-neon-cyan'
            )}
          >
            {/* 图标 */}
            <div className={cn(
              'flex items-center justify-center rounded-lg',
              'text-cyber-cyan group-hover:text-white transition-colors',
              iconColors[link.platform]
            )}>
              {getIcon(link)}
            </div>

            {/* 名称和描述 */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white group-hover:text-cyber-cyan transition-colors">
                {link.name}
              </div>
              {showDescription && link.description && (
                <div className="text-xs text-gray-500 truncate">
                  {link.description}
                </div>
              )}
            </div>

            {/* 外部链接图标 */}
            <svg
              className="w-4 h-4 text-gray-600 group-hover:text-cyber-cyan transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </motion.a>
        ))}
      </div>
    </Widget>
  );
}
