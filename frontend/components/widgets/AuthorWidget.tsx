/**
 * 作者信息 Widget
 * 显示作者头像、简介和社交链接
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserIcon, TwitterIcon, GitHubIcon, MailIcon } from '@/components/icons';
import { Widget } from './base/Widget';
import { cn } from '@/lib/utils';

export interface Author {
  name: string;
  bio?: string;
  avatar?: string;
  email?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

export interface AuthorWidgetProps {
  /** 作者信息 */
  author: Author;
  /** 是否显示完整简介 */
  fullBio?: boolean;
  /** Widget 标题 */
  title?: string;
  /** 自定义类名 */
  className?: string;
}

export function AuthorWidget({
  author,
  fullBio = false,
  title = '关于作者',
  className,
}: AuthorWidgetProps) {
  const socialLinks = [
    { icon: TwitterIcon, href: author.twitter, label: 'Twitter', visible: !!author.twitter },
    { icon: GitHubIcon, href: author.github, label: 'GitHub', visible: !!author.github },
    { icon: MailIcon, href: `mailto:${author.email}`, label: 'Email', visible: !!author.email },
  ].filter(link => link.visible);

  return (
    <Widget title={title} icon={<UserIcon className="w-5 h-5" />} className={className}>
      <div className="text-center space-y-4">
        {/* 头像 */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="inline-block"
        >
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-20 h-20 rounded-full border-2 border-cyber-cyan shadow-neon-cyan mx-auto"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple mx-auto flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-white" />
            </div>
          )}
        </motion.div>

        {/* 名称 */}
        <div>
          <h3 className="font-display font-bold text-lg text-white">
            {author.name}
          </h3>
          {author.website && (
            <Link
              href={author.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyber-cyan hover:underline"
            >
              访问网站
            </Link>
          )}
        </div>

        {/* 简介 */}
        {author.bio && (
          <p className={cn(
            'text-gray-400 text-sm',
            fullBio ? '' : 'line-clamp-3'
          )}>
            {author.bio}
          </p>
        )}

        {/* 社交链接 */}
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-3 pt-2">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.label !== 'Email' ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={link.label}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'p-2 rounded-lg border border-cyber-border',
                  'bg-cyber-dark/50 hover:bg-cyber-cyan/10',
                  'text-gray-400 hover:text-cyber-cyan',
                  'transition-all duration-300'
                )}
              >
                <link.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </Widget>
  );
}
