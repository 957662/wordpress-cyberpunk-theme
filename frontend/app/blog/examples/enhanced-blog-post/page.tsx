'use client';

/**
 * 增强型博客文章示例页面
 * 展示所有新创建的组件的使用方法
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag as TagIcon } from 'lucide-react';

// 导入新创建的组件
import { CodeHighlighter, InlineCode } from '@/components/blog/CodeHighlighter';
import { TableOfContentsEnhanced } from '@/components/blog/TableOfContentsEnhanced';
import { LikeButton } from '@/components/blog/LikeButton';
import { ShareButton } from '@/components/blog/ShareButton';
import { FavoriteButton } from '@/components/blog/FavoriteButton';
import { SearchBarEnhanced } from '@/components/blog/SearchBarEnhanced';
import {
  ReadingTimeCalculator,
  ReadingProgress,
  ArticleMetrics,
} from '@/components/blog/ReadingTimeCalculator';
import { ArticleActionBar, ArticleFooter } from '@/components/blog/ArticleActionBar';

// 导入工具函数
import {
  countWords,
  calculateReadingTime,
  formatReadingTime,
  extractTableOfContents,
  ensureHeadingIds,
} from '@/lib/utils/article';

// 示例文章内容
const SAMPLE_POST = {
  id: 'example-post-1',
  title: '如何构建现代化的赛博朋克风格博客',
  slug: 'building-cyberpunk-blog',
  content: `
    <p>在本文中,我们将探讨如何使用 Next.js 和 Tailwind CSS 构建一个具有赛博朋克风格的现代化博客平台。</p>

    <h2 id="introduction">项目介绍</h2>
    <p>CyberPress Platform 是一个全新的博客平台,采用了独特的赛博朋克设计语言。它结合了霓虹色彩、故障效果和流畅动画,为用户提供沉浸式的阅读体验。</p>

    <h2 id="features">核心特性</h2>
    <p>我们的博客平台包含以下核心特性:</p>

    <h3 id="code-highlighting">代码高亮</h3>
    <p>内置强大的代码高亮功能,支持多种编程语言和主题。例如,下面是一段 TypeScript 代码:</p>

    <pre><code class="language-typescript">interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: Date;
}

async function getPost(id: string): Promise<Post> {
  const response = await fetch(\`/api/posts/\${id}\`);
  return response.json();
}</code></pre>

    <h3 id="table-of-contents">智能目录</h3>
    <p>自动生成文章目录,支持滚动高亮和进度指示。让读者可以快速导航到感兴趣的章节。</p>

    <h3 id="social-features">社交互动</h3>
    <p>完整的社交功能,包括点赞、分享、收藏等。让读者可以与内容进行互动。</p>

    <h2 id="getting-started">快速开始</h2>
    <p>要开始使用 CyberPress Platform,请按照以下步骤操作:</p>

    <h3 id="installation">安装依赖</h3>
    <p>首先,克隆项目并安装依赖:</p>

    <pre><code class="language-bash">git clone https://github.com/yourusername/cyberpress-platform.git
cd cyberpress-platform/frontend
npm install</code></pre>

    <h3 id="configuration">配置环境</h3>
    <p>创建环境变量文件:</p>

    <pre><code class="language-bash">cp .env.example .env.local</code></pre>

    <h2 id="conclusion">总结</h2>
    <p>CyberPress Platform 是一个功能强大、设计独特的博客平台。它不仅提供了优秀的阅读体验,还包含了丰富的互动功能。希望本文能帮助你快速上手!</p>
  `,
  author: {
    id: 'author-1',
    name: 'AI Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AI',
    bio: '全栈开发工程师,专注于前端技术和用户体验设计。',
  },
  category: {
    id: 'cat-1',
    name: '前端开发',
    slug: 'frontend',
  },
  tags: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', '赛博朋克'],
  createdAt: '2026-03-06T10:00:00Z',
  views: 1234,
  likes: 42,
  comments: 8,
};

export default function EnhancedBlogPostExample() {
  const [post] = useState(SAMPLE_POST);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const contentRef = useRef<HTMLElement>(null);

  // 确保标题有 ID 并提取目录
  const contentWithIds = ensureHeadingIds(post.content);
  const headings = extractTableOfContents(contentWithIds, 2, 3);
  const wordCount = countWords(contentWithIds);
  const readingTime = calculateReadingTime(contentWithIds, 200, 0);

  // 处理点赞
  const handleLike = async (postId: string, isLiked: boolean) => {
    console.log('点赞状态:', isLiked);
    setLiked(isLiked);
    setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
  };

  // 处理收藏
  const handleFavorite = async (postId: string, isFavorited: boolean) => {
    console.log('收藏状态:', isFavorited);
    setFavorited(isFavorited);
  };

  // 处理分享
  const handleShare = (platform: string) => {
    console.log('分享到:', platform);
  };

  // 处理搜索
  const handleSearch = (query: string) => {
    console.log('搜索:', query);
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 阅读进度指示器 */}
      <ReadingProgress contentRef={contentRef} />

      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50 bg-cyber-dark/80 backdrop-blur-sm border-b border-cyber-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/blog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyber-border hover:border-cyber-cyan transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-cyber-cyan" />
              <span className="text-white">返回博客</span>
            </motion.button>
          </Link>

          <SearchBarEnhanced
            placeholder="搜索文章..."
            onSearch={handleSearch}
            showHistory={true}
            showTrending={true}
            className="w-80"
          />
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          {/* 左侧文章内容 */}
          <div className="space-y-8">
            {/* 文章头部 */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cyber-muted/20 border border-cyber-border rounded-lg p-8"
            >
              <h1 className="text-4xl font-bold text-white mb-4">
                {post.title}
              </h1>

              {/* 文章元信息 */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-cyber-muted mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TagIcon className="w-4 h-4" />
                  <span>{post.category.name}</span>
                </div>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* 阅读时间 */}
              <ReadingTimeCalculator
                content={contentWithIds}
                wordsPerMinute={200}
                showWords={true}
                showViews={true}
                views={post.views}
                variant="compact"
                className="mb-6"
              />
            </motion.article>

            {/* 文章内容 */}
            <motion.article
              ref={contentRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="prose prose-invert prose-cyber max-w-none"
              dangerouslySetInnerHTML={{ __html: contentWithIds }}
            />

            {/* 文章指标 */}
            <ArticleMetrics
              readingTime={readingTime}
              wordCount={wordCount}
              views={post.views}
              likes={likesCount}
              comments={post.comments}
              publishDate={post.createdAt}
            />

            {/* 交互工具栏 */}
            <ArticleActionBar
              postId={post.id}
              initialLikes={likesCount}
              initialLiked={liked}
              initialFavorited={favorited}
              onLike={handleLike}
              onFavorite={handleFavorite}
              variant="horizontal"
            />

            {/* 文章底部 */}
            <ArticleFooter
              author={post.author}
              tags={post.tags}
              category={post.category.name}
              showAuthorCard={true}
              showTags={true}
              nextPost={{
                title: '下一篇文章标题',
                slug: 'next-post',
              }}
              prevPost={{
                title: '上一篇文章标题',
                slug: 'prev-post',
              }}
              postId={post.id}
              initialLikes={likesCount}
              initialLiked={liked}
              initialFavorited={favorited}
              onLike={handleLike}
              onFavorite={handleFavorite}
            />
          </div>

          {/* 右侧边栏 */}
          <aside className="space-y-6">
            {/* 目录导航 */}
            <TableOfContentsEnhanced
              headings={headings}
              tocLabel="目录"
              showProgress={true}
              enableCollapse={true}
              defaultCollapsed={false}
            />

            {/* 快速操作 */}
            <div className="bg-cyber-muted/20 border border-cyber-border rounded-lg p-4">
              <h3 className="font-semibold text-white mb-4">快速操作</h3>
              <div className="space-y-2">
                <LikeButton
                  postId={post.id}
                  initialLikes={likesCount}
                  initialLiked={liked}
                  onLike={handleLike}
                  showCount={true}
                  size="md"
                  variant="outline"
                  className="w-full"
                />
                <FavoriteButton
                  postId={post.id}
                  initialFavorited={favorited}
                  onFavorite={handleFavorite}
                  showCount={false}
                  size="md"
                  variant="outline"
                  className="w-full"
                />
                <ShareButton
                  url={`https://example.com/blog/${post.slug}`}
                  title={post.title}
                  onShare={handleShare}
                  size="md"
                  variant="outline"
                  showPlatforms={true}
                  className="w-full"
                />
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 代码高亮示例 */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          <span className="text-cyber-cyan">代码高亮</span>示例
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* TypeScript 示例 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">TypeScript</h3>
            <CodeHighlighter
              code={`interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const user: User = {
  id: '1',
  name: 'Alice',
  email: 'alice@example.com',
  role: 'admin'
};

console.log(greetUser(user));`}
              language="typescript"
              theme="dark"
              showLineNumbers={true}
              showCopyButton={true}
            />
          </div>

          {/* Python 示例 */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Python</h3>
            <CodeHighlighter
              code={`from typing import List, Optional
from dataclasses import dataclass

@dataclass
class User:
    id: str
    name: str
    email: str
    role: str

def greet_user(user: User) -> str:
    return f"Hello, {user.name}!"

user = User(
    id="1",
    name="Alice",
    email="alice@example.com",
    role="admin"
)

print(greet_user(user))`}
              language="python"
              theme="dracula"
              showLineNumbers={true}
              showCopyButton={true}
            />
          </div>
        </div>
      </section>

      {/* 内联代码示例 */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          <span className="text-cyber-cyan">内联代码</span>示例
        </h2>
        <p className="text-cyber-muted mb-4">
          你可以在文本中使用 <InlineCode>const x = 42</InlineCode> 这样的内联代码。
          它们会自动应用赛博朋克风格的高亮效果。
        </p>
        <p className="text-cyber-muted">
          还可以使用 <InlineCode>npm install</InlineCode> 或{' '}
          <InlineCode>git clone</InlineCode> 等命令示例。
        </p>
      </section>
    </div>
  );
}
