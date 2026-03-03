'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export interface FeaturedArticleProps {
  article: {
    id: number;
    title: string;
    excerpt: string;
    slug: string;
    date: string;
    readTime: number;
    category: {
      name: string;
      slug: string;
      color: string;
    };
    featuredImage?: string | null;
  };
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      <Link href={`/blog/${article.slug}`}>
        <div className="cyber-card overflow-hidden border-2 border-cyber-cyan/30 hover:border-cyber-cyan/60 transition-all duration-300">
          {/* Featured Badge */}
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1 bg-cyber-pink text-white text-xs font-bold rounded-full">
              精选
            </span>
          </div>

          {/* Image */}
          {article.featuredImage ? (
            <div className="relative h-64 overflow-hidden">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-cyber-dark/50 to-transparent" />
            </div>
          ) : (
            <div className="h-64 bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20" />
          )}

          {/* Content */}
          <div className="p-6 -mt-20 relative z-10">
            {/* Category */}
            <div className="mb-3">
              <span
                className="inline-block px-3 py-1 text-xs font-mono rounded-full"
                style={{
                  backgroundColor: `${article.category.color}20`,
                  color: article.category.color,
                  border: `1px solid ${article.category.color}40`,
                }}
              >
                {article.category.name}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-cyber-cyan transition-colors">
              {article.title}
            </h2>

            {/* Excerpt */}
            <p className="text-gray-400 mb-4 line-clamp-2">
              {article.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(article.date).toLocaleDateString('zh-CN')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime} 分钟
              </span>
            </div>

            {/* Read More */}
            <div className="mt-4 flex items-center gap-2 text-cyber-cyan group-hover:gap-3 transition-all">
              <span className="font-semibold">阅读全文</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
