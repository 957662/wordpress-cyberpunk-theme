/**
 * 博客详情组件
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, TagIcon, UserIcon } from '@/components/icons';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, stripHtml } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import type { WPPost } from '@/lib/wordpress/client';

export interface BlogDetailProps {
  post: WPPost;
}

export function BlogDetail({ post }: BlogDetailProps) {
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const author = post._embedded?.author?.[0];

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link href="/blog">
        <motion.div
          whileHover={{ x: -4 }}
          className="inline-flex items-center text-cyber-cyan mb-8 cursor-pointer"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回博客列表
        </motion.div>
      </Link>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/blog?category=${cat.slug}`}>
                <Badge variant="primary" className="cursor-pointer">
                  {cat.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1
          className="font-display font-bold text-4xl md:text-5xl mb-6 leading-tight"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
          <div className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-cyber-cyan" />
            <span>{formatDate(post.date)}</span>
          </div>
          {author && (
            <div className="flex items-center">
              <UserIcon className="w-5 h-5 mr-2 text-cyber-purple" />
              <span>{author.name}</span>
            </div>
          )}
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-cyber-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{Math.ceil(post.content.rendered.split(' ').length / 200)} min read</span>
          </div>
        </div>
      </motion.div>

      {/* Featured Image */}
      {featuredImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative h-[400px] rounded-lg overflow-hidden mb-8"
        >
          <Image
            src={featuredImage.source_url}
            alt={featuredImage.alt_text || post.title.rendered}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/50 to-transparent" />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="prose prose-invert prose-lg max-w-none"
      >
        <Card variant="glass" className="p-8">
          <div
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            className="blog-content"
          />
        </Card>
      </motion.div>

      {/* Tags */}
      {categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <TagIcon className="w-5 h-5 text-cyber-purple" />
            <span className="font-medium">标签</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/blog?tag=${cat.slug}`}>
                <Badge variant="secondary" className="cursor-pointer hover:bg-cyber-purple/30">
                  {cat.name}
                </Badge>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Share */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 pt-8 border-t border-cyber-border"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-display font-bold mb-2">分享这篇文章</h3>
            <p className="text-gray-400 text-sm">如果你喜欢这篇文章，不妨分享给更多人</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Twitter
            </Button>
            <Button variant="outline" size="sm">
              Facebook
            </Button>
            <Button variant="outline" size="sm">
              复制链接
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Author Box */}
      {author && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card variant="hologram" className="p-6">
            <div className="flex items-start gap-4">
              {author.avatar_urls?.['96'] && (
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={author.avatar_urls['96']}
                    alt={author.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="font-display font-bold text-lg mb-1">{author.name}</h3>
                <p className="text-gray-400 text-sm">
                  {author.description || '热爱技术与分享的博主'}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </article>
  );
}
