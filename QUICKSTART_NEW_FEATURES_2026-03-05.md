# 🚀 新功能快速启动指南

**CyberPress Platform - 2026-03-05 更新**

---

## 📧 邮件服务使用指南

### 基础使用

```typescript
import { emailService } from '@/services/email-service';

// 1. 订阅新闻邮件
const subscription = await emailService.subscribe(
  'user@example.com',
  ['tech', 'design'] // 订阅的分类
);

// 2. 取消订阅
await emailService.unsubscribe('unsubscribe-token');

// 3. 获取邮件统计
const stats = await emailService.getStats({
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});
console.log(`发送: ${stats.sent}, 打开率: ${stats.openRate}`);
```

### 创建邮件活动

```typescript
// 1. 创建活动
const campaign = await emailService.createCampaign({
  name: '周报',
  subject: '本周精选文章',
  templateId: 'template-1',
  scheduledFor: '2024-01-15T09:00:00Z'
});

// 2. 发送活动
await emailService.sendCampaign(campaign.id);

// 3. 批量发送
const result = await emailService.sendBulkEmail({
  templateId: 'template-1',
  recipients: ['user1@example.com', 'user2@example.com'],
  subject: '特别通知'
});

// 4. 检查发送状态
const status = await emailService.getBulkJobStatus(result.jobId);
console.log(`进度: ${status.progress * 100}%`);
```

---

## 🤖 AI 推荐引擎使用指南

### 获取推荐内容

```typescript
import { recommendationEngine } from '@/services/recommendation-engine';

// 1. 获取个性化推荐
const response = await recommendationEngine.getRecommendations({
  userId: 'user-123',
  currentPostId: 'post-456',
  limit: 10
});

console.log('推荐文章:', response.recommendations);

// 2. 获取相似文章
const similarPosts = await recommendationEngine.getSimilarPosts('post-456', 6);

// 3. 获取热门文章
const trendingPosts = await recommendationEngine.getTrendingPosts('week', 10);
```

### 追踪用户行为

```typescript
// 1. 追踪阅读行为
await recommendationEngine.trackBehavior(
  'user-123',
  'view',
  'post-456',
  { duration: 120 } // 阅读时长(秒)
);

// 2. 追踪点赞
await recommendationEngine.trackBehavior('user-123', 'like', 'post-456');

// 3. 追踪评论
await recommendationEngine.trackBehavior(
  'user-123',
  'comment',
  'post-456',
  { length: 150 } // 评论长度
);

// 4. 反馈推荐质量
await recommendationEngine.feedback('user-123', 'post-456', 'helpful');
```

### 使用 React Hook

```typescript
import { useRecommendations } from '@/hooks/useRecommendations';

function PostRecommendations() {
  const {
    recommendations,
    loading,
    fetchSimilarPosts,
    trackBehavior
  } = useRecommendations({
    userId: 'user-123',
    currentPostId: 'post-456',
    trackBehavior: true
  });

  useEffect(() => {
    fetchSimilarPosts('post-456');
  }, []);

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      {recommendations.map(post => (
        <div key={post.postId}>
          <h3>{post.title}</h3>
          <p>{post.reason}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 📱 PWA 功能集成指南

### 注册 Service Worker

```typescript
import { registerServiceWorker } from '@/lib/pwa/service-worker-registration';

// 在 app/layout.tsx 或根组件中注册
useEffect(() => {
  registerServiceWorker({
    onUpdate: (registration) => {
      // 新版本可用
      if (confirm('新版本可用，是否立即更新？')) {
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    },
    onSuccess: (registration) => {
      console.log('Service Worker 注册成功');
    },
    onError: (error) => {
      console.error('Service Worker 注册失败:', error);
    }
  });
}, []);
```

### 订阅推送通知

```typescript
import { serviceWorkerManager } from '@/lib/pwa/service-worker-registration';

async function subscribeToNotifications() {
  // 获取 VAPID 公钥（从服务器获取）
  const applicationServerKey = new Uint8Array([
    // 你的 VAPID 公钥
  ]);

  const subscription = await serviceWorkerManager.subscribeToPush({
    userVisibleOnly: true,
    applicationServerKey
  });

  // 将订阅信息发送到服务器
  await fetch('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription)
  });
}
```

### 使用 PWA 组件

```typescript
import { InstallPrompt } from '@/components/ui/InstallPrompt';
import { NetworkStatus } from '@/components/ui/NetworkStatus';

function App() {
  return (
    <>
      {/* PWA 安装提示 */}
      <InstallPrompt delay={3000} />

      {/* 网络状态指示器 */}
      <NetworkStatus position="top" showIndicator={true} />
    </>
  );
}
```

---

## 🔍 SEO 优化使用指南

### 生成页面元数据

```typescript
import { seoOptimizer } from '@/lib/seo/seo-optimizer';

// 1. 生成文章页面的元数据
const metadata = seoOptimizer.generateMetadata({
  title: '如何构建高性能 Web 应用',
  description: '本文介绍构建高性能 Web 应用的最佳实践...',
  image: 'https://example.com/images/article-cover.jpg',
  url: 'https://example.com/articles/high-performance-web',
  type: 'article',
  keywords: ['Web', '性能', '最佳实践'],
  author: '张三',
  publishedTime: '2024-01-15T09:00:00Z',
  modifiedTime: '2024-01-16T10:00:00Z'
});

// 2. 在 Next.js 页面中使用
export const generateMetadata = async () => {
  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.ogTitle,
      description: metadata.ogDescription,
      images: [metadata.ogImage],
    },
    other: {
      'article:published_time': metadata.publishedTime,
    },
  };
};
```

### 分析页面 SEO

```typescript
// 1. 分析当前页面
const analysis = seoOptimizer.analyzePage();

console.log(`SEO 分数: ${analysis.score}`);
console.log('问题:', analysis.issues);
console.log('建议:', analysis.suggestions);

// 2. 提取关键词
const keywords = seoOptimizer.extractKeywords(articleContent, 2);
console.log('关键词:', keywords);
```

### 生成结构化数据

```typescript
// 1. 文章结构化数据
const articleSchema = seoOptimizer.generateStructuredData('article', {
  title: '文章标题',
  description: '文章描述',
  image: 'https://example.com/image.jpg',
  author: '作者名',
  publishedTime: '2024-01-15T09:00:00Z',
  modifiedTime: '2024-01-16T10:00:00Z',
  logo: 'https://example.com/logo.png'
});

// 2. 在页面中添加
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: articleSchema }}
/>
```

---

## 📊 数据可视化使用指南

### 使用实时图表

```typescript
import { RealTimeChart } from '@/components/analytics/RealTimeChart';

function Dashboard() {
  const [chartData, setChartData] = useState([
    { timestamp: Date.now() - 3600000, value: 50 },
    { timestamp: Date.now() - 1800000, value: 65 },
    { timestamp: Date.now(), value: 80 }
  ]);

  return (
    <RealTimeChart
      data={chartData}
      color="#00f0ff"
      height={200}
      updateInterval={5000}
      onDataUpdate={(newData) => setChartData(newData)}
      yAxisFormat={(value) => `${value} 次访问`}
      xAxisFormat={(timestamp) => {
        const date = new Date(timestamp);
        return `${date.getHours()}:${date.getMinutes()}`;
      }}
    />
  );
}
```

### 使用分析卡片

```typescript
import { DataVisualizationCard } from '@/components/analytics/DataVisualizationCard';

function StatsCard() {
  return (
    <DataVisualizationCard
      title="总访问量"
      value="12,345"
      change={12.5}
      changeType="increase"
      chartColor="#00f0ff"
      icon={<VisitsIcon />}
      description="过去 30 天的总访问量"
      footer={
        <div className="text-sm text-gray-400">
          上月: 10,976
        </div>
      }
    />
  );
}
```

### 使用分析网格

```typescript
import { AnalyticsGrid } from '@/components/analytics/AnalyticsGrid';

function AnalyticsDashboard() {
  const metrics = [
    {
      title: '页面访问量',
      value: '45,678',
      change: 8.2,
      changeType: 'increase' as const,
      chartColor: '#00f0ff',
      icon: <ViewsIcon />
    },
    {
      title: '独立访客',
      value: '12,345',
      change: -2.1,
      changeType: 'decrease' as const,
      chartColor: '#ff0080',
      icon: <UsersIcon />
    },
    {
      title: '平均会话时长',
      value: '3:42',
      change: 5.5,
      changeType: 'increase' as const,
      chartColor: '#9d00ff',
      icon: <TimeIcon />
    }
  ];

  return (
    <AnalyticsGrid
      metrics={metrics}
      columns={3}
      layout="grid"
      loading={false}
    />
  );
}
```

### 使用分析 Hook

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function AnalyticsPage() {
  const {
    data,
    loading,
    error,
    realtimeVisitors,
    lastUpdated,
    refresh,
    trackPageView,
    trackEvent
  } = useAnalytics({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    interval: 'day',
    refreshInterval: 60000
  });

  // 追踪页面访问
  useEffect(() => {
    trackPageView('/analytics', '分析页面');
  }, []);

  // 追踪自定义事件
  const handleButtonClick = () => {
    trackEvent('button_click', {
      buttonId: 'export-data',
      page: '/analytics'
    });
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;

  return (
    <div>
      <h1>实时访客: {realtimeVisitors}</h1>
      <button onClick={refresh}>刷新</button>
      <button onClick={handleButtonClick}>导出数据</button>
    </div>
  );
}
```

---

## 🛠️ 完整示例

### 博客文章页面（集成所有功能）

```typescript
'use client';

import { useEffect, useState } from 'react';
import { seoOptimizer } from '@/lib/seo/seo-optimizer';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useAnalytics } from '@/hooks/useAnalytics';
import { RealTimeChart } from '@/components/analytics/RealTimeChart';
import { ReadingProgress } from '@/components/features/ReadingProgress';
import { InstallPrompt } from '@/components/ui/InstallPrompt';
import { NetworkStatus } from '@/components/ui/NetworkStatus';

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState(null);

  // 使用推荐引擎
  const {
    recommendations,
    fetchSimilarPosts,
    trackBehavior
  } = useRecommendations({
    currentPostId: params.id,
    trackBehavior: true
  });

  // 使用分析
  const { trackPageView, trackEvent } = useAnalytics();

  useEffect(() => {
    // 获取文章数据
    fetchPost(params.id).then(setPost);

    // 获取相似文章
    fetchSimilarPosts(params.id);

    // 追踪页面访问
    trackPageView(`/blog/${params.id}`, post?.title);

    // 生成 SEO 元数据
    if (post) {
      const metadata = seoOptimizer.generateMetadata({
        title: post.title,
        description: post.excerpt,
        image: post.coverImage,
        type: 'article',
        keywords: post.tags,
        author: post.author.name,
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt
      });

      // 更新页面标题
      document.title = metadata.title;
    }
  }, [params.id]);

  const handleLike = async () => {
    // 追踪点赞行为
    await trackBehavior('like', params.id);
    await trackEvent('post_like', { postId: params.id });
  };

  if (!post) return <div>加载中...</div>;

  return (
    <>
      {/* PWA 功能 */}
      <InstallPrompt />
      <NetworkStatus />
      <ReadingProgress />

      {/* 文章内容 */}
      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        <button onClick={handleLike}>点赞</button>
      </article>

      {/* 推荐文章 */}
      <section>
        <h2>相似文章</h2>
        {recommendations.map(rec => (
          <div key={rec.postId}>
            <h3>{rec.title}</h3>
            <p>{rec.reason}</p>
          </div>
        ))}
      </section>

      {/* 文章阅读数据 */}
      <section>
        <h2>阅读趋势</h2>
        <RealTimeChart
          data={post.viewHistory}
          height={150}
          color="#00f0ff"
        />
      </section>
    </>
  );
}
```

---

## 📝 API 端点

### 通知 API

```typescript
// 获取通知
GET /api/notifications?userId=123&unreadOnly=true&limit=20

// 创建通知
POST /api/notifications
{
  "userId": "123",
  "type": "comment",
  "title": "新评论",
  "message": "有人评论了你的文章",
  "data": { "postId": "456" }
}

// 批量更新通知
PATCH /api/notifications
{
  "notificationIds": ["1", "2", "3"],
  "action": "markAsRead"
}

// 删除通知
DELETE /api/notifications?userId=123&type=system
```

---

## 🧪 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test email-service.test.ts
npm test useAnalytics.test.ts

# 运行测试并生成覆盖率报告
npm test -- --coverage

# 监听模式
npm test -- --watch
```

---

## ✅ 集成检查清单

- [ ] 注册 Service Worker
- [ ] 配置推送通知
- [ ] 设置邮件服务
- [ ] 集成推荐引擎
- [ ] 添加 SEO 元数据
- [ ] 配置数据可视化
- [ ] 设置分析追踪
- [ ] 添加单元测试
- [ ] 配置 PWA manifest
- [ ] 优化离线体验

---

## 📚 相关文档

- [完整 API 文档](./API_DOCUMENTATION.md)
- [组件文档](./COMPONENTS.md)
- [测试指南](./TESTING.md)
- [部署指南](./DEPLOYMENT.md)

---

**创建时间**: 2026-03-05
**版本**: 1.0.0
**状态**: ✅ 已完成并验证
