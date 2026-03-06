'use client';

/**
 * 作者简介组件
 * 显示作者信息和简介
 * 支持关注、社交链接等功能
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Calendar, Link as LinkIcon, Github, Twitter, Globe, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FollowButton } from './FollowButton';

export interface Author {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinedDate?: string;
  website?: string;
  github?: string;
  twitter?: string;
  email?: string;
  stats?: {
    posts?: number;
    followers?: number;
    following?: number;
  };
}

interface AuthorBioProps {
  author: Author;
  currentUserId?: string;
  isFollowing?: boolean;
  onFollow?: (authorId: string) => void;
  onUnfollow?: (authorId: string) => void;
  className?: string;
  variant?: 'card' | 'compact' | 'minimal';
}

export function AuthorBio({
  author,
  currentUserId,
  isFollowing = false,
  onFollow,
  onUnfollow,
  className = '',
  variant = 'card',
}: AuthorBioProps) {
  const [imageError, setImageError] = useState(false);
  const isOwnProfile = currentUserId === author.id;

  if (variant === 'minimal') {
    return <MinimalAuthorBio author={author} className={className} />;
  }

  if (variant === 'compact') {
    return (
      <CompactAuthorBio
        author={author}
        isFollowing={isFollowing}
        onFollow={onFollow}
        onUnfollow={onUnfollow}
        isOwnProfile={isOwnProfile}
        className={className}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative overflow-hidden rounded-lg',
        'bg-cyber-card border border-cyber-border',
        'hover:border-cyber-cyan/50 transition-all duration-300',
        'hover:shadow-lg hover:shadow-cyber-cyan/10',
        className
      )}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 via-transparent to-cyber-purple/5 pointer-events-none" />

      <div className="relative p-6">
        {/* 头部：头像和基本信息 */}
        <div className="flex items-start gap-4">
          {/* 头像 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative flex-shrink-0"
          >
            <div className="w-20 h-20 rounded-full bg-cyber-muted overflow-hidden border-2 border-cyber-border hover:border-cyber-cyan transition-colors">
              {author.avatar && !imageError ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10 text-cyber-muted" />
                </div>
              )}
            </div>
            {/* 在线指示器 */}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-cyber-green rounded-full border-2 border-cyber-card" />
          </motion.div>

          {/* 信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-1">
                  {author.name}
                </h3>
                <p className="text-sm text-cyber-muted mb-2">
                  @{author.username}
                </p>
                {author.bio && (
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {author.bio}
                  </p>
                )}
              </div>

              {/* 关注按钮 */}
              {!isOwnProfile && onFollow && onUnfollow && (
                <FollowButton
                  userId={author.id}
                  isFollowing={isFollowing}
                  onFollow={() => onFollow(author.id)}
                  onUnfollow={() => onUnfollow(author.id)}
                />
              )}
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        {author.stats && (
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-cyber-border">
            <StatItem label="文章" value={author.stats.posts} />
            <StatItem label="粉丝" value={author.stats.followers} />
            <StatItem label="关注" value={author.stats.following} />
          </div>
        )}

        {/* 附加信息 */}
        <div className="mt-4 space-y-2">
          {author.location && (
            <div className="flex items-center gap-2 text-sm text-cyber-muted">
              <MapPin className="w-4 h-4" />
              <span>{author.location}</span>
            </div>
          )}

          {author.joinedDate && (
            <div className="flex items-center gap-2 text-sm text-cyber-muted">
              <Calendar className="w-4 h-4" />
              <span>加入于 {author.joinedDate}</span>
            </div>
          )}

          {/* 社交链接 */}
          <div className="flex items-center gap-3 mt-4">
            {author.website && (
              <SocialLink
                href={author.website}
                icon={<Globe className="w-4 h-4" />}
                label="网站"
              />
            )}
            {author.github && (
              <SocialLink
                href={`https://github.com/${author.github}`}
                icon={<Github className="w-4 h-4" />}
                label="GitHub"
              />
            )}
            {author.twitter && (
              <SocialLink
                href={`https://twitter.com/${author.twitter}`}
                icon={<Twitter className="w-4 h-4" />}
                label="Twitter"
              />
            )}
            {author.email && (
              <SocialLink
                href={`mailto:${author.email}`}
                icon={<Mail className="w-4 h-4" />}
                label="Email"
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 紧凑版作者简介
function CompactAuthorBio({
  author,
  isFollowing,
  onFollow,
  onUnfollow,
  isOwnProfile,
  className,
}: {
  author: Author;
  isFollowing?: boolean;
  onFollow?: (authorId: string) => void;
  onUnfollow?: (authorId: string) => void;
  isOwnProfile?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="w-12 h-12 rounded-full bg-cyber-muted overflow-hidden flex-shrink-0">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-6 h-6 text-cyber-muted" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-white truncate">
            {author.name}
          </h4>
          {!isOwnProfile && onFollow && onUnfollow && (
            <FollowButton
              userId={author.id}
              isFollowing={isFollowing}
              onFollow={() => onFollow(author.id)}
              onUnfollow={() => onUnfollow(author.id)}
              variant="minimal"
            />
          )}
        </div>
        <p className="text-xs text-cyber-muted">@{author.username}</p>
      </div>
    </div>
  );
}

// 极简版作者简介
function MinimalAuthorBio({ author, className }: { author: Author; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="w-8 h-8 rounded-full bg-cyber-muted overflow-hidden flex-shrink-0">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-4 h-4 text-cyber-muted" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{author.name}</p>
      </div>
    </div>
  );
}

// 统计项组件
function StatItem({ label, value }: { label: string; value?: number }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-lg font-bold text-white">
        {value ?? 0}
      </span>
      <span className="text-sm text-cyber-muted">{label}</span>
    </div>
  );
}

// 社交链接组件
function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center justify-center',
        'w-8 h-8 rounded-md',
        'bg-cyber-muted/50 hover:bg-cyber-cyan/20',
        'text-cyber-muted hover:text-cyber-cyan',
        'transition-all duration-200'
      )}
      aria-label={label}
    >
      {icon}
    </a>
  );
}

export default AuthorBio;
