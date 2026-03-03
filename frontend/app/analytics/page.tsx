/**
 * 数据分析页面
 * 展示网站访问统计、内容表现、用户行为等数据
 */

import { Metadata } from 'next';
import CyberAnalytics from '@/components/cyber/CyberAnalytics';
import { wpAPI } from '@/lib/wordpress-api-enhanced';

export const metadata: Metadata = {
  title: '数据分析 - CyberPress',
  description: '查看网站流量、用户行为和内容表现数据',
  keywords: ['数据分析', '网站统计', '流量分析', '用户行为'],
};

async function getAnalyticsData() {
  try {
    // 获取基础统计数据
    const [postsRes, categoriesRes] = await Promise.all([
      wpAPI.getPosts({ per_page: 100, orderby: 'date', order: 'desc' }),
      wpAPI.getCategories({ per_page: 20 }),
    ]);

    // 模拟生成分析数据（实际项目应从分析API获取）
    return {
      overview: {
        totalViews: {
          label: '总浏览量',
          value: '12,345',
          change: 12.5,
          changeType: 'increase' as const,
          icon: null, // Eye icon
        },
        uniqueVisitors: {
          label: '独立访客',
          value: '8,901',
          change: 8.2,
          changeType: 'increase' as const,
          icon: null, // Users icon
        },
        avgTimeOnPage: {
          label: '平均停留时间',
          value: '3:45',
          change: -5.3,
          changeType: 'decrease' as const,
          icon: null, // Activity icon
        },
        bounceRate: {
          label: '跳出率',
          value: '42.3%',
          change: -2.1,
          changeType: 'increase' as const,
          icon: null, // TrendingDown icon
        },
      },
      content: {
        topPosts: postsRes.posts.slice(0, 5).map((post) => ({
          id: post.id.toString(),
          title: post.title.rendered.replace(/<[^>]*>/g, ''),
          views: Math.floor(Math.random() * 2000) + 500,
          likes: Math.floor(Math.random() * 100) + 20,
          comments: Math.floor(Math.random() * 50) + 5,
          shares: Math.floor(Math.random() * 30) + 5,
        })),
        topCategories: categoriesRes.slice(0, 5).map((cat) => ({
          name: cat.name,
          count: cat.count,
          percentage: Math.round((cat.count / postsRes.posts.length) * 100),
        })),
      },
      audience: {
        devices: [
          { type: 'desktop' as const, count: 5678, percentage: 55 },
          { type: 'mobile' as const, count: 3456, percentage: 34 },
          { type: 'tablet' as const, count: 1234, percentage: 11 },
        ],
        locations: [
          { country: '中国', city: '北京', count: 2345, percentage: 28 },
          { country: '中国', city: '上海', count: 1876, percentage: 22 },
          { country: '中国', city: '深圳', count: 1543, percentage: 18 },
          { country: '美国', city: '纽约', count: 987, percentage: 12 },
          { country: '日本', city: '东京', count: 765, percentage: 9 },
        ],
      },
      timeline: Array.from({ length: 30 }, (_, i) => {
        const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
        return {
          date: date.toISOString().split('T')[0],
          views: Math.floor(Math.random() * 1000) + 500,
          visitors: Math.floor(Math.random() * 500) + 200,
        };
      }),
    };
  } catch (error) {
    console.error('Failed to fetch analytics data:', error);
    return null;
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="min-h-screen bg-cyber-dark py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面头部 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-glow-cyan">数据分析</span>
          </h1>
          <p className="text-gray-400">
            深入了解你的网站表现和用户行为
          </p>
        </div>

        {/* 分析组件 */}
        <CyberAnalytics data={data || undefined} />
      </div>
    </div>
  );
}
