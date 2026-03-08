# CyberPress Platform - 服务层快速开始指南

## 🚀 快速开始

本指南将帮助你快速上手 CyberPress Platform 的服务层。

## 📦 服务概览

### 前端服务

| 服务 | 功能 | 文件路径 |
|------|------|----------|
| WordPress Client | WordPress REST API 集成 | `services/wordpress/` |
| Analytics | 数据分析和追踪 | `services/analytics/analytics-service.ts` |
| AI Analyzer | AI 内容分析 | `services/ai/ai-analyzer-service.ts` |
| Notification | 实时通知推送 | `services/realtime/realtime-notification-service.ts` |
| Cache | 缓存管理 | `services/cache/cache-service.ts` |

### 后端服务

| 服务 | 功能 | 文件路径 |
|------|------|----------|
| Recommendation | 智能推荐系统 | `services/recommendation_service_enhanced.py` |

## 🎯 常见使用场景

### 1. 获取文章列表

```typescript
import { usePosts } from '@/services';

function PostList() {
  const { data: posts, isLoading, error } = usePosts({
    per_page: 10,
    page: 1,
    _embed: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {posts?.map(post => (
        <article key={post.id}>
          <h2>{post.title.rendered}</h2>
          <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
        </article>
      ))}
    </div>
  );
}
```

### 2. 获取单篇文章

```typescript
import { usePost } from '@/services';

function PostDetail({ postId }: { postId: number }) {
  const { data: post, isLoading, error } = usePost(postId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <article>
      <h1>{post.title.rendered}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </article>
  );
}
```

### 3. 初始化 Analytics

```typescript
import { initAnalytics } from '@/services';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // 初始化 Analytics
    const analytics = initAnalytics({
      enabled: true,
      apiEndpoint: process.env.NEXT_PUBLIC_ANALYTICS_API,
      batchSize: 10,
      flushInterval: 30000,
    });

    return () => {
      analytics.destroy();
    };
  }, []);

  return <YourApp />;
}
```

### 4. 使用 AI 分析内容

```typescript
import { getAIAnalyzer } from '@/services';

async function analyzeContent(content: string) {
  const analyzer = getAIAnalyzer();

  // 分析内容
  const analysis = await analyzer.analyzeContent(content, 'My Post Title');
  console.log('Summary:', analysis.summary);
  console.log('Keywords:', analysis.keywords);
  console.log('Sentiment:', analysis.sentiment);

  // 检查质量
  const quality = await analyzer.checkQuality(content);
  console.log('Quality Score:', quality.score);
  console.log('Issues:', quality.issues);

  // SEO 分析
  const seo = await analyzer.analyzeSEO(content, 'Title', 'Description');
  console.log('SEO Score:', seo.contentScore);
}
```

### 5. 设置实时通知

```typescript
import { getNotificationService } from '@/services';
import { useEffect } from 'react';

function NotificationProvider({ userId, token }: { userId: number; token: string }) {
  useEffect(() => {
    const notifications = getNotificationService();

    // 连接到 WebSocket
    notifications.connect(userId, token);

    // 监听所有通知
    const unsubscribe = notifications.on('*', (notification) => {
      console.log('New notification:', notification);
      // 显示通知 UI
      toast(notification.message);
    });

    // 请求通知权限
    notifications.requestPermission();

    return () => {
      unsubscribe();
      notifications.disconnect();
    };
  }, [userId, token]);

  return null;
}
```

### 6. 使用缓存服务

```typescript
import { cache, getCached, setCached } from '@/services';

// 方式1: 使用 cache 函数（推荐）
async function getExpensiveData(id: number) {
  return cache(
    `data:${id}`,
    async () => {
      // 这个函数只会在缓存未命中时执行
      const response = await fetch(`/api/data/${id}`);
      return response.json();
    },
    { ttl: 60000 } // 缓存1分钟
  );
}

// 方式2: 手动管理缓存
async function manualCacheExample(id: number) {
  // 尝试从缓存获取
  const cached = getCached(`data:${id}`);
  if (cached) {
    return cached;
  }

  // 缓存未命中，获取数据
  const response = await fetch(`/api/data/${id}`);
  const data = await response.json();

  // 存入缓存
  setCached(`data:${id}`, data, { ttl: 60000 });

  return data;
}
```

### 7. 追踪事件

```typescript
import { getAnalytics } from '@/services';

function trackUserActions() {
  const analytics = getAnalytics();

  // 追踪页面浏览
  analytics.trackPageView('/blog/post-1', 'My Post Title');

  // 追踪自定义事件
  analytics.trackEvent('Engagement', 'Click', 'Share Button', 1);

  // 追踪文章浏览
  analytics.trackPostView(123, 'My Post Title');

  // 追踪评论
  analytics.trackComment(123, 'My Post Title');

  // 追踪点赞
  analytics.trackLike('post', 123, 'My Post Title');

  // 追踪搜索
  analytics.trackSearch('react hooks', 25);
}
```

## 🔧 配置说明

### WordPress 配置

```typescript
// config/wordpress.ts
export const wordpressConfig = {
  baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://your-site.com',
  username: process.env.WORDPRESS_USERNAME,
  password: process.env.WORDPRESS_APP_PASSWORD,
  timeout: 10000,
};
```

### Analytics 配置

```typescript
// config/analytics.ts
export const analyticsConfig = {
  enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
  apiEndpoint: process.env.NEXT_PUBLIC_ANALYTICS_API,
  batchSize: 10,
  flushInterval: 30000,
  sessionTimeout: 1800000,
};
```

### AI 服务配置

```typescript
// config/ai.ts
export const aiConfig = {
  apiEndpoint: process.env.NEXT_PUBLIC_AI_API,
  apiKey: process.env.AI_API_KEY,
};
```

## 📚 React Hooks 参考

### WordPress Hooks

```typescript
// 文章相关
usePosts(params?)
usePost(id, options?)
usePostBySlug(slug, options?)
useFeaturedPosts(limit?)
useRecentPosts(limit?)

// 分类相关
useCategories(params?)
useCategory(id)
useCategoryPosts(categoryId, perPage?)

// 标签相关
useTags(params?)
useTag(id)
useTagPosts(tagId, perPage?)

// 评论相关
useComments(postId?)
usePostComments(postId)

// 媒体相关
useMedia(params?)
useMediaItem(id)

// 用户相关
useUsers(params?)
useUser(id)

// 搜索
useSearch(query, enabled?)

// Mutations
useCreatePost()
useUpdatePost()
useDeletePost()
useCreateComment()
useUploadMedia()
```

## 🎨 实际示例

### 博客列表页面

```typescript
'use client';

import { usePosts, useCategories } from '@/services';
import { useState } from 'react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { data: posts, isLoading } = usePosts({
    per_page: 12,
    categories: selectedCategory || undefined,
    _embed: true,
  });

  const { data: categories } = useCategories();

  return (
    <div>
      {/* 分类过滤 */}
      <div className="mb-8">
        <button onClick={() => setSelectedCategory(null)}>全部</button>
        {categories?.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={selectedCategory === cat.id ? 'active' : ''}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 文章列表 */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts?.map(post => (
            <article key={post.id} className="card">
              <h2>{post.title.rendered}</h2>
              <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
              <a href={`/blog/${post.slug}`}>阅读更多</a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 文章详情页面

```typescript
'use client';

import { usePost, usePostComments } from '@/services';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

export default function PostDetailPage({ params }: { params: { slug: string } }) {
  const { data: post, isLoading } = usePostBySlug(params.slug);
  const { data: comments } = usePostComments(post?.id);
  const analytics = useAnalytics();

  useEffect(() => {
    if (post) {
      // 追踪文章浏览
      analytics.trackPostView(post.id, post.title.rendered);
    }
  }, [post, analytics]);

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <article>
      <h1>{post.title.rendered}</h1>

      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />

      {/* 评论区 */}
      <section>
        <h2>评论 ({comments?.length || 0})</h2>
        {comments?.map(comment => (
          <div key={comment.id}>
            <strong>{comment.author_name}</strong>
            <p>{comment.content.rendered}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
```

## 🔍 调试技巧

### 启用详细日志

```typescript
// 开发环境启用详细日志
if (process.env.NODE_ENV === 'development') {
  // WordPress 客户端会自动记录请求
  // Analytics 会记录事件
  // 通知服务会记录连接状态
}
```

### 查看缓存状态

```typescript
import { getCacheService } from '@/services';

function debugCache() {
  const cache = getCacheService();

  console.log('Cache Stats:', cache.getStats());
  console.log('Cache Size:', cache.getReadableSize());

  // 清理过期条目
  const cleaned = cache.cleanExpired();
  console.log('Cleaned entries:', cleaned);
}
```

### 测试通知

```typescript
import { getNotificationService } from '@/services';

function testNotification() {
  const notifications = getNotificationService();

  // 检查连接状态
  console.log('Connected:', notifications.connected());

  // 获取统计
  console.log('Stats:', notifications.getStats());

  // 获取未读通知
  console.log('Unread:', notifications.getUnreadNotifications());
}
```

## 📖 更多资源

- [WordPress REST API 文档](https://developer.wordpress.org/rest-api/)
- [React Query 文档](https://tanstack.com/query/latest)
- [项目架构文档](./ARCHITECTURE.md)
- [API 文档](./API_DOCUMENTATION.md)

## ❓ 常见问题

### Q: 如何处理 API 错误？

A: 所有服务都有内置的错误处理。你也可以使用 React Query 的 `onError` 回调：

```typescript
const { error } = usePosts({
  onError: (error) => {
    console.error('Failed to fetch posts:', error);
    // 显示错误提示
    toast.error('加载失败，请稍后重试');
  },
});
```

### Q: 如何自定义缓存策略？

A: 使用缓存服务时可以指定 TTL 和持久化选项：

```typescript
setCached('key', data, {
  ttl: 60000,        // 1分钟
  persistent: true,  // 持久化到 localStorage
  metadata: {        // 自定义元数据
    source: 'api',
    version: 1,
  },
});
```

### Q: 如何优化性能？

A:
1. 使用 React Query 的缓存
2. 启用 Analytics 的批量发送
3. 使用缓存服务减少 API 调用
4. 预取下一步可能需要的数据

```typescript
// 预取示例
import { prefetchPost } from '@/services';

function PostList() {
  const { data: posts } = usePosts();

  return (
    <div>
      {posts?.map(post => (
        <Link
          key={post.id}
          href={`/blog/${post.slug}`}
          onMouseEnter={() => prefetchPost(queryClient, post.id)}
        >
          {post.title.rendered}
        </Link>
      ))}
    </div>
  );
}
```

---

**需要帮助？** 查看 [项目文档](./README.md) 或提交 Issue。
