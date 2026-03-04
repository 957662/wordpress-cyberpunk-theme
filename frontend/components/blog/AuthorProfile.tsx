'use client';

/**
 * AuthorProfile Component
 * 作者资料卡片组件
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mail,
  Twitter,
  Github,
  Globe,
  MapPin,
  Calendar,
  FileText,
  Users,
  Award,
} from 'lucide-react';
import { Avatar } from '@/components/ui';
import { CyberButton } from '@/components/ui';
import { FollowButton } from './FollowButton';

interface AuthorProfileProps {
  /** 作者ID */
  authorId: string | number;
  /** 作者姓名 */
  name: string;
  /** 作者头像 */
  avatar?: string | null;
  /** 作者简介 */
  bio?: string;
  /** 作者职位 */
  title?: string;
  /** 作者位置 */
  location?: string;
  /** 加入时间 */
  joinedDate?: string;
  /** 文章数量 */
  postCount?: number;
  /** 粉丝数量 */
  followerCount?: number;
  /** 关注数量 */
  followingCount?: number;
  /** 社交链接 */
  socialLinks?: {
    email?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  /** 是否显示完整信息 */
  showFullProfile?: boolean;
  /** 自定义样式类名 */
  className?: string;
}

export function AuthorProfile({
  authorId,
  name,
  avatar,
  bio,
  title,
  location,
  joinedDate,
  postCount = 0,
  followerCount = 0,
  followingCount = 0,
  socialLinks = {},
  showFullProfile = true,
  className = '',
}: AuthorProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`cyber-card p-6 border border-cyber-border/50 ${className}`}
    >
      {/* 头部：头像和基本信息 */}
      <div className="flex items-start gap-4 mb-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex-shrink-0"
        >
          <Avatar
            src={avatar || undefined}
            alt={name}
            size="xl"
            className="border-2 border-cyber-cyan/30"
          />
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
          {title && (
            <p className="text-sm text-cyber-cyan mb-2">{title}</p>
          )}
          {bio && (
            <p className="text-sm text-gray-400 line-clamp-2">{bio}</p>
          )}
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-cyber-border">
        <div className="text-center">
          <div className="text-xl font-bold text-white">{postCount}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <FileText className="w-3 h-3" />
            文章
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-white">{followerCount}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <Users className="w-3 h-3" />
            粉丝
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-white">{followingCount}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <Users className="w-3 h-3" />
            关注
          </div>
        </div>
      </div>

      {/* 完整信息部分 */}
      {showFullProfile && (
        <>
          {/* 额外信息 */}
          <div className="space-y-2 mb-4 text-sm">
            {location && (
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            )}
            {joinedDate && (
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>加入于 {joinedDate}</span>
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2 mb-4">
            <FollowButton authorId={authorId} variant="primary" size="sm" className="flex-1" />
            <Link href={`/messages/new?to=${authorId}`}>
              <CyberButton variant="outline" size="sm" className="flex-1">
                私信
              </CyberButton>
            </Link>
          </div>

          {/* 社交链接 */}
          {(socialLinks.email || socialLinks.twitter || socialLinks.github || socialLinks.website) && (
            <div className="flex items-center gap-2 pt-4 border-t border-cyber-border">
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="w-10 h-10 rounded-lg bg-cyber-muted border border-cyber-border flex items-center justify-center text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all"
                  title="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-cyber-muted border border-cyber-border flex items-center justify-center text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all"
                  title="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-cyber-muted border border-cyber-border flex items-center justify-center text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {socialLinks.website && (
                <a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-cyber-muted border border-cyber-border flex items-center justify-center text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all"
                  title="Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </>
      )}

      {/* 查看完整资料链接 */}
      {!showFullProfile && (
        <Link href={`/authors/${authorId}`}>
          <motion.div
            className="text-center text-sm text-cyber-cyan hover:text-cyber-purple transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            查看完整资料 →
          </motion.div>
        </Link>
      )}
    </motion.div>
  );
}

/**
 * AuthorProfileCompact Component
 * 紧凑型作者资料卡片
 */
interface AuthorProfileCompactProps {
  /** 作者ID */
  authorId: string | number;
  /** 作者姓名 */
  name: string;
  /** 作者头像 */
  avatar?: string | null;
  /** 作者职位 */
  title?: string;
  /** 自定义样式类名 */
  className?: string;
}

export function AuthorProfileCompact({
  authorId,
  name,
  avatar,
  title,
  className = '',
}: AuthorProfileCompactProps) {
  return (
    <Link href={`/authors/${authorId}`}>
      <motion.div
        className={`
          flex items-center gap-3 p-3 rounded-lg
          cyber-card border border-cyber-border/50
          hover:border-cyber-cyan/30 transition-all
          ${className}
        `}
        whileHover={{ x: 4 }}
      >
        <Avatar
          src={avatar || undefined}
          alt={name}
          size="md"
          className="border border-cyber-border"
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate">{name}</div>
          {title && (
            <div className="text-xs text-gray-500 truncate">{title}</div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

/**
 * AuthorProfileList Component
 * 作者列表（多列）
 */
interface AuthorProfileListProps {
  /** 作者列表 */
  authors: Array<{
    id: string | number;
    name: string;
    avatar?: string | null;
    title?: string;
    postCount?: number;
    followerCount?: number;
  }>;
  /** 列数 */
  columns?: number;
  /** 自定义样式类名 */
  className?: string;
}

export function AuthorProfileList({
  authors,
  columns = 2,
  className = '',
}: AuthorProfileListProps) {
  return (
    <div className={`grid grid-cols-${columns} gap-4 ${className}`}>
      {authors.map((author, index) => (
        <motion.div
          key={author.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link href={`/authors/${author.id}`}>
            <div className="cyber-card p-4 border border-cyber-border/50 hover:border-cyber-cyan/30 transition-all">
              <div className="flex items-center gap-3">
                <Avatar
                  src={author.avatar || undefined}
                  alt={author.name}
                  size="lg"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">
                    {author.name}
                  </div>
                  {author.title && (
                    <div className="text-xs text-gray-500 truncate">
                      {author.title}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    {author.postCount !== undefined && (
                      <span>{author.postCount} 文章</span>
                    )}
                    {author.followerCount !== undefined && (
                      <span>{author.followerCount} 粉丝</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
