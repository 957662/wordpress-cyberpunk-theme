'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Calendar, MapPin, Link as LinkIcon, Mail, Github, Twitter } from 'lucide-react';
import Link from 'next/link';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { FollowButton } from '@/components/blog/FollowButton';
import { Button } from '@/components/ui/Button';

interface Author {
  id: number;
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  website?: string;
  email?: string;
  social?: {
    github?: string;
    twitter?: string;
  };
  stats: {
    posts: number;
    followers: number;
    views: number;
  };
  joined_date: string;
  location?: string;
}

interface Post {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  date: string;
  featured_media?: string;
  reading_time?: number;
}

export default function AuthorPage() {
  const params = useParams();
  const authorId = params.id as string;

  const [author, setAuthor] = useState<Author | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'activity'>('posts');

  useEffect(() => {
    const fetchAuthorData = async () => {
      setLoading(true);

      try {
        // 模拟加载作者数据
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockAuthor: Author = {
          id: parseInt(authorId),
          name: '技术博主',
          slug: `author-${authorId}`,
          description: '全栈开发工程师，热爱分享技术经验和学习心得。专注于 React、Next.js、Node.js 等技术栈。',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorId}`,
          website: 'https://example.com',
          email: 'author@example.com',
          social: {
            github: 'https://github.com/author',
            twitter: 'https://twitter.com/author'
          },
          stats: {
            posts: 42,
            followers: 1234,
            views: 56780
          },
          joined_date: '2023-01-01',
          location: '北京'
        };

        // 模拟作者文章
        const mockPosts: Post[] = Array.from({ length: 6 }, (_, i) => ({
          id: i + 1,
          slug: `post-${i + 1}`,
          title: { rendered: `这是作者的第 ${i + 1} 篇文章标题` },
          excerpt: { rendered: '<p>文章摘要内容...</p>' },
          date: new Date(Date.now() - i * 86400000).toISOString(),
          reading_time: 5 + Math.floor(Math.random() * 10)
        }));

        setAuthor(mockAuthor);
        setPosts(mockPosts);
      } catch (error) {
        console.error('加载作者数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [authorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="cyber-card p-12 text-center">
          <p className="text-gray-400 text-lg mb-4">作者不存在</p>
          <Link href="/blog">
            <Button>返回博客</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 作者头部 */}
      <section className="border-b border-cyber-border bg-gradient-to-b from-cyber-darker to-cyber-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            {/* 头像 */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyber-cyan shadow-neon-cyan">
                {author.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-cyber-darker flex items-center justify-center">
                    <span className="text-4xl font-bold text-cyber-cyan">
                      {author.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 作者信息 */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-display font-bold text-white mb-2">
                    {author.name}
                  </h1>
                  {author.description && (
                    <p className="text-gray-400 text-lg">{author.description}</p>
                  )}
                </div>

                <FollowButton
                  userId={author.id}
                  followerCount={author.stats.followers}
                  size="lg"
                />
              </div>

              {/* 社交链接 */}
              <div className="flex flex-wrap gap-4 mb-4">
                {author.website && (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyber-cyan transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>个人网站</span>
                  </a>
                )}
                {author.email && (
                  <a
                    href={`mailto:${author.email}`}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyber-cyan transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>邮箱</span>
                  </a>
                )}
                {author.social?.github && (
                  <a
                    href={author.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyber-cyan transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
                {author.social?.twitter && (
                  <a
                    href={author.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyber-cyan transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>Twitter</span>
                  </a>
                )}
              </div>

              {/* 位置和加入时间 */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {author.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{author.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>加入于 {new Date(author.joined_date).toLocaleDateString('zh-CN')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 统计数据 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-cyber-border"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-cyber-cyan mb-1">
                {author.stats.posts}
              </div>
              <div className="text-sm text-gray-400">文章</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyber-purple mb-1">
                {author.stats.followers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">关注者</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyber-pink mb-1">
                {author.stats.views.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">浏览量</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 内容区 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 标签页 */}
        <div className="flex gap-1 mb-6 overflow-x-auto">
          {[
            { key: 'posts', label: '文章', count: author.stats.posts },
            { key: 'about', label: '关于', count: null },
            { key: 'activity', label: '动态', count: null }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                'px-6 py-3 rounded-t-lg font-medium transition-colors whitespace-nowrap flex items-center gap-2',
                activeTab === tab.key
                  ? 'bg-cyber-card text-cyber-cyan border-b-2 border-cyber-cyan'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-cyber-cyan/10 text-cyber-cyan">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 内容 */}
        <div className="cyber-card p-6">
          {activeTab === 'posts' && (
            <div>
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <ArticleCard
                      key={post.id}
                      post={post as any}
                      variant="compact"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">暂无文章</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-bold text-white mb-4">关于作者</h3>
              {author.description && (
                <p className="text-gray-300 leading-relaxed">{author.description}</p>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="text-center py-12">
              <p className="text-gray-400">暂无动态</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
