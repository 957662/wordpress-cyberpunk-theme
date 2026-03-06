'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, Eye, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface BlogPostLayoutProps {
  children: React.ReactNode;
  className?: string;
}

interface PostHeaderProps {
  title: string;
  excerpt: string;
  coverImage?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  readingTime: number;
  views?: number;
  category?: string;
  tags?: string[];
  onBack?: () => void;
  onShare?: () => void;
}

interface PostContentProps {
  children: React.ReactNode;
  className?: string;
}

interface PostFooterProps {
  author?: {
    name: string;
    bio?: string;
    avatar?: string;
    social?: {
      twitter?: string;
      github?: string;
      linkedin?: string;
    };
  };
  tags?: string[];
  className?: string;
}

export function BlogPostLayout({ children, className }: BlogPostLayoutProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('max-w-4xl mx-auto', className)}
    >
      {children}
    </motion.article>
  );
}

export function PostHeader({
  title,
  excerpt,
  coverImage,
  author,
  publishedAt,
  readingTime,
  views,
  category,
  tags,
  onBack,
  onShare,
}: PostHeaderProps) {
  return (
    <header className="space-y-6 mb-12">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ x: -4 }}
          onClick={onBack}
          className="flex items-center gap-2 text-cyber-cyan hover:text-cyber-pink transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Blog</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShare}
          className="p-2 bg-cyber-dark border border-cyber-cyan/30 rounded-lg text-cyber-cyan hover:text-cyber-pink hover:border-cyber-pink/50 transition-all"
        >
          <Share2 size={20} />
        </motion.button>
      </div>

      {/* Category */}
      {category && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block"
        >
          <span className="px-4 py-2 bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 text-cyber-cyan font-semibold rounded-full border border-cyber-cyan/30">
            {category}
          </span>
        </motion.div>
      )}

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
      >
        {title}
      </motion.h1>

      {/* Excerpt */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-gray-400"
      >
        {excerpt}
      </motion.p>

      {/* Cover Image */}
      {coverImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-cyber-cyan/30"
        >
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent" />
        </motion.div>
      )}

      {/* Meta Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap items-center gap-6 text-sm text-gray-400"
      >
        {author && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple flex items-center justify-center">
              {author.avatar ? (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <User size={20} className="text-white" />
              )}
            </div>
            <span className="text-white font-semibold">{author.name}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>{readingTime} min read</span>
        </div>

        {views !== undefined && (
          <div className="flex items-center gap-2">
            <Eye size={16} />
            <span>{views} views</span>
          </div>
        )}
      </motion.div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-2"
        >
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag}`}
              className="px-3 py-1 bg-cyber-dark/60 border border-cyber-cyan/30 rounded-full text-sm text-cyber-cyan hover:border-cyber-pink/50 hover:text-cyber-pink transition-all"
            >
              #{tag}
            </Link>
          ))}
        </motion.div>
      )}
    </header>
  );
}

export function PostContent({ children, className }: PostContentProps) {
  return (
    <div
      className={cn(
        'prose prose-lg prose-invert max-w-none',
        'prose-headings:text-white',
        'prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6',
        'prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4',
        'prose-p:text-gray-300 prose-p:leading-relaxed',
        'prose-a:text-cyber-cyan prose-a:no-underline hover:prose-a:text-cyber-pink',
        'prose-strong:text-white',
        'prose-code:text-cyber-pink prose-code:bg-cyber-dark/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
        'prose-pre:bg-cyber-dark/80 prose-pre:border prose-pre:border-cyber-cyan/30',
        'prose-blockquote:border-l-4 prose-blockquote:border-cyber-cyan prose-blockquote:bg-cyber-dark/30 prose-blockquote:py-2 prose-blockquote:px-4',
        'prose-img:rounded-lg prose-img:border prose-img:border-cyber-cyan/30',
        'prose-hr:border-cyber-cyan/30',
        className
      )}
    >
      {children}
    </div>
  );
}

export function PostFooter({ author, tags, className }: PostFooterProps) {
  return (
    <footer className={cn('mt-16 pt-8 border-t border-cyber-cyan/30', className)}>
      {/* Author Bio */}
      {author && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cyber-dark/60 border border-cyber-cyan/30 rounded-lg p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple flex items-center justify-center flex-shrink-0">
              {author.avatar ? (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <User size={32} className="text-white" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">About {author.name}</h3>
              {author.bio && <p className="text-gray-400 mb-3">{author.bio}</p>}
              {author.social && (
                <div className="flex gap-3">
                  {author.social.twitter && (
                    <a
                      href={author.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyber-cyan hover:text-cyber-pink transition-colors"
                    >
                      Twitter
                    </a>
                  )}
                  {author.social.github && (
                    <a
                      href={author.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyber-cyan hover:text-cyber-pink transition-colors"
                    >
                      GitHub
                    </a>
                  )}
                  {author.social.linkedin && (
                    <a
                      href={author.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyber-cyan hover:text-cyber-pink transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-400 font-semibold">Tags:</span>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag}`}
              className="px-3 py-1 bg-cyber-dark/60 border border-cyber-cyan/30 rounded-full text-sm text-cyber-cyan hover:border-cyber-pink/50 hover:text-cyber-pink transition-all"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </footer>
  );
}
