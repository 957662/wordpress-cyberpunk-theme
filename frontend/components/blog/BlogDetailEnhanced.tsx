/**
 * 博客详情页组件
 * 展示文章完整内容、评论、相关文章等
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  User,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ArticleCardEnhanced } from './ArticleCardEnhancedNew';

// 文章详情数据类型
export interface ArticleDetail {
  id: string | number;
  title: string;
  slug: string;
  content: string; // HTML 或 Markdown
  excerpt: string;
  featuredImage?: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  categories: Array<{
    name: string;
    slug: string;
    color?: string;
  }>;
  tags: Array<{
    name: string;
    slug: string;
  }>;
  publishedAt: string;
  updatedAt?: string;
  readTime: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface BlogDetailProps {
  article: ArticleDetail;
  relatedArticles?: ArticleDetail[];
  prevArticle?: ArticleDetail;
  nextArticle?: ArticleDetail;
}

export function BlogDetail({
  article,
  relatedArticles = [],
  prevArticle,
  nextArticle,
}: BlogDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-dark via-gray-950 to-cyber-dark">
      {/* 文章头部 */}
      <article className="border-b border-cyber-cyan/20">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 面包屑 */}
            <nav className="mb-6 text-sm text-gray-500">
              <Link href="/blog" className="hover:text-cyber-cyan transition-colors">
                博客
              </Link>
              <span className="mx-2">/</span>
              {article.categories.map((cat, index) => (
                <span key={cat.slug}>
                  {index > 0 && <span className="mx-2">/</span>}
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="hover:text-cyber-cyan transition-colors"
                  >
                    {cat.name}
                  </Link>
                </span>
              ))}
              <span className="mx-2">/</span>
              <span className="text-gray-400">{article.title}</span>
            </nav>

            {/* 标题 */}
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>

            {/* 摘要 */}
            <p className="text-xl text-gray-400 mb-8 max-w-3xl">{article.excerpt}</p>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                {article.author.avatar && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-cyber-cyan/50">
                    <Image
                      src={article.author.avatar}
                      alt={article.author.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                )}
                <div>
                  <div className="text-white font-medium">{article.author.name}</div>
                  {article.author.bio && (
                    <div className="text-xs">{article.author.bio}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} 分钟</span>
              </div>

              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{article.viewCount} 浏览</span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                点赞 ({article.likeCount})
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                收藏
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
            </div>
          </motion.div>
        </div>
      </article>

      {/* 文章内容 */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 特色图片 */}
          {article.featuredImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-[400px] rounded-xl overflow-hidden mb-12"
            >
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </motion.div>
          )}

          {/* 文章正文 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* 标签 */}
          <div className="mt-12 pt-8 border-t border-cyber-cyan/20">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="px-3 py-1 text-sm bg-cyber-dark/50 border border-cyber-cyan/30 rounded-full text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan transition-all"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>

          {/* 作者信息 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 p-6 bg-cyber-dark/50 border border-cyber-cyan/20 rounded-xl"
          >
            <div className="flex items-start gap-4">
              {article.author.avatar && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-cyber-cyan/50 flex-shrink-0">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {article.author.name}
                </h3>
                {article.author.bio && (
                  <p className="text-gray-400 text-sm mb-3">{article.author.bio}</p>
                )}
                <Button variant="outline" size="sm">
                  关注作者
                </Button>
              </div>
            </div>
          </motion.div>

          {/* 上一篇/下一篇导航 */}
          {(prevArticle || nextArticle) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {prevArticle && (
                <Link
                  href={`/blog/${prevArticle.slug}`}
                  className="p-6 bg-cyber-dark/50 border border-cyber-cyan/20 rounded-xl hover:border-cyber-cyan/50 transition-all group"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <ArrowLeft className="w-4 h-4" />
                    上一篇
                  </div>
                  <h4 className="text-white font-semibold group-hover:text-cyber-cyan transition-colors line-clamp-2">
                    {prevArticle.title}
                  </h4>
                </Link>
              )}
              {nextArticle && (
                <Link
                  href={`/blog/${nextArticle.slug}`}
                  className="p-6 bg-cyber-dark/50 border border-cyber-cyan/20 rounded-xl hover:border-cyber-cyan/50 transition-all group"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    下一篇
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <h4 className="text-white font-semibold group-hover:text-cyber-cyan transition-colors line-clamp-2">
                    {nextArticle.title}
                  </h4>
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* 相关文章 */}
      {relatedArticles.length > 0 && (
        <section className="border-t border-cyber-cyan/20">
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-2xl font-display font-bold text-white mb-8">
              相关文章
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((article) => (
                <ArticleCardEnhanced key={article.id} {...article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 评论区 */}
      <section className="border-t border-cyber-cyan/20">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-display font-bold text-white mb-8">
            评论 ({article.commentCount})
          </h2>
          {/* 这里可以集成评论组件 */}
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>评论功能即将推出</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BlogDetail;
