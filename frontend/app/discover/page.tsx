/**
 * 发现页面 - 推荐用户和内容
 * Discover Page
 */

import { Metadata } from 'next';
import { UserCard } from '@/components/social/UserCard';
import { SocialStatsCard } from '@/components/social/SocialStatsCard';

export const metadata: Metadata = {
  title: '发现 - CyberPress',
  description: '发现有趣的用户和内容',
};

// 模拟推荐用户数据
const recommendedUsers = [
  {
    id: '1',
    username: 'alice_dev',
    display_name: 'Alice Developer',
    avatar_url: '/images/avatars/alice.png',
    bio: '全栈开发者 | React 爱好者 | 开源贡献者',
    location: '上海',
    website: 'https://alice.dev',
    followers_count: 1250,
    following_count: 342,
  },
  {
    id: '2',
    username: 'bob_design',
    display_name: 'Bob Designer',
    avatar_url: '/images/avatars/bob.png',
    bio: 'UI/UX 设计师 | 产品设计 | 设计系统',
    location: '北京',
    followers_count: 890,
    following_count: 256,
  },
  {
    id: '3',
    username: 'charlie_tech',
    display_name: 'Charlie Tech',
    avatar_url: '/images/avatars/charlie.png',
    bio: '技术博主 | AI 研究员 | 创业者',
    location: '深圳',
    followers_count: 2340,
    following_count: 189,
  },
];

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">发现</h1>
          <p className="text-cyber-muted">探索有趣的人和内容</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trending Topics */}
            <section className="cyber-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">热门话题</h2>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'React', 'TypeScript', 'AI', 'Web3', 'Design'].map(topic => (
                  <button
                    key={topic}
                    className="px-4 py-2 rounded-lg bg-cyber-secondary hover:bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30 transition-colors"
                  >
                    #{topic}
                  </button>
                ))}
              </div>
            </section>

            {/* Recommended Users */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">推荐关注</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedUsers.map(user => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </section>

            {/* Trending Posts */}
            <section className="cyber-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">热门文章</h2>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <article
                    key={i}
                    className="p-4 rounded-lg bg-cyber-secondary/30 hover:bg-cyber-secondary/50 transition-colors cursor-pointer"
                  >
                    <h3 className="font-semibold text-white mb-2">
                      热门文章标题 {i}
                    </h3>
                    <p className="text-sm text-cyber-muted line-clamp-2">
                      这是文章的简介内容，描述文章的主要内容和亮点...
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-cyber-muted">
                      <span>作者名</span>
                      <span>2024-03-03</span>
                      <span>❤️ {100 * i}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <SocialStatsCard
              userId="current-user"
              variant="detailed"
              showTrends
            />

            {/* Quick Links */}
            <div className="cyber-card p-6">
              <h3 className="font-semibold text-white mb-4">快速链接</h3>
              <div className="space-y-2">
                <a
                  href="/feed"
                  className="block p-2 rounded hover:bg-cyber-secondary text-cyber-cyan transition-colors"
                >
                  查看动态
                </a>
                <a
                  href="/tags"
                  className="block p-2 rounded hover:bg-cyber-secondary text-cyber-cyan transition-colors"
                >
                  浏览标签
                </a>
                <a
                  href="/newsletter"
                  className="block p-2 rounded hover:bg-cyber-secondary text-cyber-cyan transition-colors"
                >
                  订阅通讯
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
