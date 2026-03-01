/**
 * 博客卡片组件
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, TagIcon, UserIcon, ArrowIcon } from '@/components/icons';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate, stripHtml } from '@/lib/utils';
import type { WPPost } from '@/lib/wordpress/client';

export interface BlogCardProps {
  post: WPPost & {
    category?: { name: string; slug: string };
    author?: { name: string; avatar?: string };
  };
  variant?: 'default' | 'compact' | 'featured';
  index?: number;
}

export function BlogCard({ post, variant = 'default', index = 0 }: BlogCardProps) {
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
  const excerpt = stripHtml(post.excerpt.rendered);
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const author = post._embedded?.author?.[0];

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
      >
        <Link href={`/blog/${post.slug}`}>
          <Card hover className="p-4 h-full">
            <div className="flex gap-4">
              {featuredImage && (
                <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden">
                  <Image
                    src={featuredImage.source_url}
                    alt={featuredImage.alt_text || post.title.rendered}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-display font-bold text-white mb-2 line-clamp-2 hover:text-cyber-cyan transition-colors"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    {formatDate(post.date)}
                  </span>
                  {categories.length > 0 && (
                    <span className="text-cyber-cyan">
                      {categories[0].name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card hover variant="hologram" className="h-full overflow-hidden group">
          {/* Featured Image */}
          {featuredImage && (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={featuredImage.source_url}
                alt={featuredImage.alt_text || post.title.rendered}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark to-transparent opacity-60" />

              {/* Category Badge */}
              {categories.length > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge variant="primary" size="sm">
                    {categories[0].name}
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <span className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {formatDate(post.date)}
              </span>
              {author && (
                <span className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-1" />
                  {author.name}
                </span>
              )}
            </div>

            {/* Title */}
            <h3
              className="font-display font-bold text-xl mb-3 line-clamp-2 group-hover:text-cyber-cyan transition-colors"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            {/* Excerpt */}
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
              {excerpt}
            </p>

            {/* Tags */}
            {categories.length > 1 && (
              <div className="flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-cyber-purple" />
                <div className="flex flex-wrap gap-2">
                  {categories.slice(1, 3).map((cat) => (
                    <Badge key={cat.id} variant="secondary" size="sm">
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Read More */}
            <div className="flex items-center text-cyber-cyan mt-4 group-hover:gap-3 transition-all">
              <span className="font-medium">阅读更多</span>
              <ArrowIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
