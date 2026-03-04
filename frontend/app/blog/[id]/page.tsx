'use client';

import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, Eye, Share2, ArrowLeft, Bookmark, Heart } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CyberButton } from '@/components/ui/CyberButton';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// 注册语言
SyntaxHighlighter.registerLanguage('tsx', tsx);

// 模拟文章数据
const mockPost = {
  id: 1,
  title: '深入理解 Next.js 14 App Router',
  excerpt: '全面解析 Next.js 14 的新特性，包括 Server Components、Server Actions 和改进的缓存策略。',
  content: `
# 深入理解 Next.js 14 App Router

Next.js 14 带来了许多令人兴奋的新特性，特别是 App Router 的改进。让我们深入了解一下。

## Server Components

Server Components 是 React 18 引入的新特性，允许组件在服务器上渲染：

\`\`\`tsx
// Server Component 示例
async function BlogPost({ id }: { id: string }) {
  const post = await fetchPost(id);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
\`\`\`

## Server Actions

Server Actions 允许你在服务器上直接执行函数：

\`\`\`tsx
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  // 处理表单数据...
  redirect('/blog');
}
\`\`\`

## 缓存策略

Next.js 14 引入了改进的缓存策略：

1. **Request Memoization**: 相同的请求会被自动去重
2. **Data Cache**: 响应数据会被缓存
3. **Full Route Cache**: 完整的路由缓存

## 总结

Next.js 14 的 App Router 为构建现代化的 Web 应用提供了强大的工具。
  `,
  date: '2024-01-15',
  readTime: 8,
  category: '前端开发',
  author: {
    name: '张三',
    avatar: '/avatars/default.jpg',
    bio: '全栈开发者，专注于 React 和 Next.js 生态系统',
  },
  tags: ['Next.js', 'React', 'SSR'],
  views: 1234,
  likes: 89,
};

const relatedPosts = [
  {
    id: 2,
    title: 'TypeScript 高级类型系统指南',
    excerpt: '从基础到高级，掌握 TypeScript 的强大特性...',
    date: '2024-01-12',
    readTime: 12,
  },
  {
    id: 3,
    title: 'Tailwind CSS 性能优化实践',
    excerpt: '学习如何优化 Tailwind CSS 项目...',
    date: '2024-01-10',
    readTime: 6,
  },
];

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const post = mockPost;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Link href="/blog">
              <CyberButton variant="ghost" icon={<ArrowLeft className="w-4 h-4" />}>
                返回博客列表
              </CyberButton>
            </Link>
          </motion.div>

          {/* Article Header */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="cyber-card overflow-hidden"
          >
            {/* Hero Image */}
            <div className="relative h-64 md:h-96 bg-gradient-to-br from-cyber-card-bg to-cyber-bg">
              <div className="absolute inset-0 bg-[url('/patterns/circuit.svg')] opacity-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="inline-block px-3 py-1 rounded-full bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan text-sm font-medium mb-4">
                  {post.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-glow-cyan">
                  {post.title}
                </h1>
                <p className="text-cyber-text-secondary text-lg">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="p-6 border-b border-cyber-cyan/20">
              <div className="flex flex-wrap items-center gap-6 text-sm text-cyber-text-secondary">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white font-bold">
                    {post.author.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-cyber-text">{post.author.name}</div>
                    <div className="text-xs">{post.author.bio}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.date}>
                    {format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN })}
                  </time>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} 分钟阅读</span>
                </div>

                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views} 次阅读</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="px-3 py-1 rounded-lg bg-cyber-bg/50 border border-cyber-cyan/20 text-sm text-cyber-text-secondary hover:border-cyber-cyan/50 hover:text-cyber-cyan transition-all duration-300"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Article Content */}
            <div className="p-6 md:p-8">
              <div className="prose prose-invert prose-cyber max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-cyber-cyan/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CyberButton variant="outline" size="sm" icon={<Bookmark className="w-4 h-4" />}>
                    收藏
                  </CyberButton>
                  <CyberButton variant="outline" size="sm" icon={<Heart className="w-4 h-4" />}>
                    {post.likes}
                  </CyberButton>
                </div>

                <CyberButton variant="outline" size="sm" icon={<Share2 className="w-4 h-4" />}>
                  分享
                </CyberButton>
              </div>
            </div>
          </motion.article>

          {/* Related Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-glow-cyan">相关文章</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.id}`}
                  className="cyber-card group"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-cyber-cyan transition-colors duration-300">
                      {relatedPost.title}
                    </h3>
                    <p className="text-cyber-text-secondary text-sm mb-4 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-cyber-text-secondary">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <time dateTime={relatedPost.date}>
                          {format(new Date(relatedPost.date), 'yyyy-MM-dd')}
                        </time>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{relatedPost.readTime} 分钟</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
