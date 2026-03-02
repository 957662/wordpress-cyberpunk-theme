'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  User,
  Tag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export interface ArticleDetailProps {
  article: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage?: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
      bio?: string;
    };
    categories: Array<{
      id: string;
      name: string;
      slug: string;
      color?: string;
    }>;
    tags?: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
    publishedAt: string;
    updatedAt?: string;
    readTime: number;
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };
  relatedArticles?: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage?: string;
    publishedAt: string;
  }>;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  relatedArticles = []
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likeCount);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const [toc, setToc] = useState<Array<{ id: string; text: string; level: number }>>([]);

  useEffect(() => {
    // 提取目录
    const headings = article.content.match(/^#{1,3}\s+.+$/gm) || [];
    const tocItems = headings.map((heading) => {
      const level = heading.match(/^#+/)?.[0].length || 1;
      const text = heading.replace(/^#+\s+/, '');
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return { id, text, level };
    });
    setToc(tocItems);
  }, [article.content]);

  useEffect(() => {
    // 滚动监听，高亮当前章节
    const handleScroll = () => {
      const headings = document.querySelectorAll('h2, h3');
      const scrollPosition = window.scrollY + 100;

      headings.forEach((heading) => {
        const id = heading.id;
        const top = (heading as HTMLElement).offsetTop;
        const bottom = top + (heading as HTMLElement).offsetHeight;

        if (scrollPosition >= top && scrollPosition < bottom) {
          setActiveHeading(id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = async () => {
    try {
      // TODO: 调用 API 点赞
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      // TODO: 调用 API 收藏
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('收藏失败:', error);
    }
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = article.title;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      copy: url
    };

    if (platform === 'copy') {
      await navigator.clipboard.writeText(url);
      alert('链接已复制到剪贴板');
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    }

    setShowShareMenu(false);
  };

  const markdownComponents = {
    h1: ({ node, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 id={props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} className="text-4xl font-bold text-white mt-8 mb-4 pb-2 border-b border-cyber-cyan/30" {...props} />
    ),
    h2: ({ node, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 id={props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} className="text-3xl font-bold text-white mt-8 mb-4" {...props} />
    ),
    h3: ({ node, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 id={props.children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')} className="text-2xl font-semibold text-white mt-6 mb-3" {...props} />
    ),
    p: ({ node, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="text-gray-300 leading-relaxed mb-4" {...props} />
    ),
    a: ({ node, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
      <a className="text-cyber-cyan hover:text-cyber-purple underline transition-colors" {...props} />
    ),
    ul: ({ node, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2" {...props} />
    ),
    ol: ({ node, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2" {...props} />
    ),
    blockquote: ({ node, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote className="border-l-4 border-cyber-cyan pl-4 py-2 my-4 bg-cyber-cyan/5 italic text-gray-300" {...props} />
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <code className="px-2 py-1 rounded bg-dark-bg border border-dark-border text-cyber-cyan text-sm" {...props}>
            {children}
          </code>
        );
      }
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      return (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          className="rounded-lg my-4"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    },
    img: ({ node, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <div className="my-6 rounded-lg overflow-hidden">
        <img className="w-full h-auto" {...props} />
      </div>
    )
  };

  return (
    <div className="min-h-screen">
      {/* 文章头部 */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-12"
      >
        {/* 面包屑 */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-cyber-cyan transition-colors">
            首页
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/blog" className="hover:text-cyber-cyan transition-colors">
            博客
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-400">{article.title}</span>
        </nav>

        {/* 特色图片 */}
        {article.featuredImage && (
          <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-8 shadow-neon-cyan">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
          </div>
        )}

        {/* 标题和元信息 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {article.categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-cyber-cyan to-blue-500 text-white hover:shadow-neon transition-shadow"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          <p className="text-xl text-gray-400 mb-6">{article.excerpt}</p>

          {/* 作者信息 */}
          <div className="flex items-center gap-4 mb-6">
            {article.author.avatar && (
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-cyber-cyan/50">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <Link
                href={`/authors/${article.author.id}`}
                className="text-white font-semibold hover:text-cyber-cyan transition-colors"
              >
                {article.author.name}
              </Link>
              {article.author.bio && (
                <p className="text-sm text-gray-500">{article.author.bio}</p>
              )}
            </div>
          </div>

          {/* 统计信息 */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pb-6 border-b border-dark-border">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDistanceToNow(new Date(article.publishedAt), {
                addSuffix: true,
                locale: zhCN
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {article.readTime} 分钟阅读
            </span>
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {article.viewCount} 次浏览
            </span>
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {article.commentCount} 条评论
            </span>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                isLiked
                  ? 'bg-cyber-pink/20 border-cyber-pink text-cyber-pink'
                  : 'bg-dark-bg border-dark-border text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                isBookmarked
                  ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
                  : 'bg-dark-bg border-dark-border text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? '已收藏' : '收藏'}</span>
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dark-border bg-dark-bg text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
              >
                <Share2 className="w-5 h-5" />
                <span>分享</span>
              </motion.button>

              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 left-0 bg-dark-bg border border-dark-border rounded-lg shadow-xl z-10 min-w-[200px]"
                  >
                    {['twitter', 'facebook', 'linkedin', 'copy'].map((platform) => (
                      <button
                        key={platform}
                        onClick={() => handleShare(platform)}
                        className="w-full px-4 py-3 text-left text-gray-400 hover:text-cyber-cyan hover:bg-dark-bg/50 transition-colors first:rounded-t-lg last:rounded-b-lg capitalize"
                      >
                        {platform === 'copy' ? '复制链接' : `分享到 ${platform}`}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.article>

      {/* 文章内容和目录 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 主要内容 */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-invert max-w-none"
          >
            <ReactMarkdown components={markdownComponents}>
              {article.content}
            </ReactMarkdown>
          </motion.div>

          {/* 标签 */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-dark-border">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-cyber-cyan" />
                相关标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="px-3 py-1 rounded-lg bg-dark-bg border border-dark-border text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 侧边栏 - 目录 */}
        {toc.length > 0 && (
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden lg:block lg:col-span-1"
          >
            <div className="sticky top-24 bg-dark-bg/50 border border-dark-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">目录</h3>
              <nav className="space-y-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm transition-colors ${
                      activeHeading === item.id
                        ? 'text-cyber-cyan font-semibold'
                        : 'text-gray-400 hover:text-cyber-cyan'
                    } ${item.level === 3 ? 'pl-4' : ''}`}
                    style={{
                      paddingLeft: item.level === 2 ? '1rem' : item.level === 3 ? '2rem' : '0'
                    }}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </motion.aside>
        )}
      </div>

      {/* 相关文章 */}
      {relatedArticles.length > 0 && (
        <section className="mt-16 pt-8 border-t border-dark-border">
          <h2 className="text-3xl font-bold text-white mb-8">相关文章</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                href={`/blog/${related.slug}`}
                className="group rounded-xl bg-dark-bg/50 border border-dark-border overflow-hidden hover:border-cyber-cyan/50 transition-all"
              >
                {related.featuredImage && (
                  <div className="relative w-full h-48">
                    <Image
                      src={related.featuredImage}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyber-cyan transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{related.excerpt}</p>
                  <span className="text-xs text-gray-500 mt-2 block">
                    {formatDistanceToNow(new Date(related.publishedAt), {
                      addSuffix: true,
                      locale: zhCN
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ArticleDetail;
