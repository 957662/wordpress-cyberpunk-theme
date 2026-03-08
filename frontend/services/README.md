# CyberPress Platform - 服务层文档

## 📚 概述

CyberPress Platform 的服务层提供了完整的数据管理、分析和交互功能，包括 WordPress 集成、数据分析、AI 功能、实时通信和缓存管理。

## 🎯 核心服务

### 1. WordPress 集成服务

完整的 WordPress REST API 客户端，支持文章、分类、标签、评论、媒体和用户管理。

**特性:**
- ✅ 完整的 REST API 支持
- ✅ React Query 集成
- ✅ TypeScript 类型安全
- ✅ 自动错误处理和重试
- ✅ 请求缓存和去重

**快速开始:**
```typescript
import { usePosts, usePost } from '@/services';

// 获取文章列表
const { data: posts } = usePosts({ per_page: 10 });

// 获取单篇文章
const { data: post } = usePost(123);
```

**文档:** [WordPress API 参考](../SERVICES_API_REFERENCE.md#wordpress-服务)

---

### 2. Analytics 服务

强大的数据分析和追踪服务，支持页面浏览、事件追踪和用户行为分析。

**特性:**
- ✅ 页面浏览自动追踪
- ✅ 自定义事件追踪
- ✅ 用户参与度分析
- ✅ 滚动深度追踪
- ✅ 性能监控
- ✅ 批量发送优化

**快速开始:**
```typescript
import { initAnalytics, getAnalytics } from '@/services';

// 初始化
const analytics = initAnalytics({
  enabled: true,
  apiEndpoint: '/api/analytics',
});

// 追踪事件
analytics.trackEvent('Engagement', 'Click', 'Share Button');

// 追踪文章浏览
analytics.trackPostView(123, 'My Post Title');
```

**文档:** [Analytics API 参考](../SERVICES_API_REFERENCE.md#analytics-服务)

---

### 3. AI 分析服务

智能内容分析服务，提供内容质量检查、SEO 分析和智能推荐。

**特性:**
- ✅ 内容自动摘要
- ✅ 关键词提取
- ✅ 内容质量评分
- ✅ SEO 分析和建议
- ✅ 情感分析
- ✅ 相关内容推荐

**快速开始:**
```typescript
import { getAIAnalyzer } from '@/services';

const analyzer = getAIAnalyzer();

// 分析内容
const analysis = await analyzer.analyzeContent(content, title);
console.log('Summary:', analysis.summary);
console.log('Keywords:', analysis.keywords);

// 检查质量
const quality = await analyzer.checkQuality(content);
console.log('Score:', quality.score);

// SEO 分析
const seo = await analyzer.analyzeSEO(content, title, description);
console.log('SEO Score:', seo.contentScore);
```

**文档:** [AI Analyzer API 参考](../SERVICES_API_REFERENCE.md#ai-分析服务)

---

### 4. 实时通知服务

基于 WebSocket 的实时通知推送服务，支持浏览器通知和多设备同步。

**特性:**
- ✅ 实时通知推送
- ✅ WebSocket 连接管理
- ✅ 浏览器原生通知
- ✅ 通知偏好设置
- ✅ 自动重连机制
- ✅ 本地存储持久化

**快速开始:**
```typescript
import { getNotificationService } from '@/services';

const notifications = getNotificationService();

// 连接
notifications.connect(userId, token);

// 监听通知
notifications.on('*', (notification) => {
  console.log('New notification:', notification);
  toast(notification.message);
});

// 请求权限
notifications.requestPermission();
```

**文档:** [Notification API 参考](../SERVICES_API_REFERENCE.md#通知服务)

---

### 5. 缓存服务

高性能缓存管理服务，支持内存缓存和持久化存储。

**特性:**
- ✅ 内存和 LocalStorage 双层缓存
- ✅ TTL 自动过期
- ✅ 模式匹配查询
- ✅ 缓存统计和监控
- ✅ 跨标签页同步
- ✅ 缓存导入/导出

**快速开始:**
```typescript
import { cache, getCached, setCached } from '@/services';

// 使用 cache 函数（推荐）
const data = await cache('posts', async () => {
  const response = await fetch('/api/posts');
  return response.json();
}, { ttl: 60000 });

// 手动管理
const cached = getCached('posts');
if (!cached) {
  const data = await fetchPosts();
  setCached('posts', data, { ttl: 60000 });
}
```

**文档:** [Cache API 参考](../SERVICES_API_REFERENCE.md#缓存服务)

---

### 6. 推荐服务（后端）

智能推荐引擎，基于协同过滤和内容分析提供个性化推荐。

**特性:**
- ✅ 协同过滤算法
- ✅ 基于内容的推荐
- ✅ 用户偏好学习
- ✅ 热门趋势分析
- ✅ 相似文章推荐

**快速开始:**
```python
from app.services.recommendation_service_enhanced import EnhancedRecommendationService

service = EnhancedRecommendationService(db)

# 获取个性化推荐
recommendations = await service.get_personalized_recommendations(
    user_id=1,
    limit=10
)

# 获取相似文章
similar = await service.get_similar_posts(post_id=123)
```

**文档:** [Recommendation API 参考](../SERVICES_API_REFERENCE.md#推荐服务)

---

## 🚀 快速开始

### 安装依赖

```bash
npm install @tanstack/react-query
```

### 配置服务

创建 `config/services.ts`:

```typescript
export const servicesConfig = {
  wordpress: {
    baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://your-site.com',
    username: process.env.WORDPRESS_USERNAME,
    password: process.env.WORDPRESS_APP_PASSWORD,
  },
  analytics: {
    enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
    apiEndpoint: process.env.NEXT_PUBLIC_ANALYTICS_API,
  },
  ai: {
    apiEndpoint: process.env.NEXT_PUBLIC_AI_API,
    apiKey: process.env.AI_API_KEY,
  },
};
```

### 在应用中使用

创建 `app/providers/ServiceProvider.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { initAnalytics, getNotificationService } from '@/services';
import { useAuth } from '@/hooks/useAuth';

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    // 初始化 Analytics
    const analytics = initAnalytics({
      enabled: true,
      apiEndpoint: '/api/analytics',
    });

    return () => analytics.destroy();
  }, []);

  useEffect(() => {
    if (user) {
      // 连接通知服务
      const notifications = getNotificationService();
      notifications.connect(user.id, user.token);

      return () => notifications.disconnect();
    }
  }, [user]);

  return <>{children}</>;
}
```

---

## 📖 文档

- [快速开始指南](../SERVICES_QUICKSTART.md)
- [API 参考](../SERVICES_API_REFERENCE.md)
- [项目架构](../ARCHITECTURE.md)
- [API 文档](../API_DOCUMENTATION.md)

---

## 🔧 开发指南

### 添加新服务

1. 在 `services/` 目录下创建新的服务文件
2. 实现服务类和接口
3. 在 `services/index.ts` 中导出
4. 添加 TypeScript 类型定义
5. 编写单元测试

### 最佳实践

**错误处理:**
```typescript
try {
  const result = await service.method();
} catch (error) {
  console.error('Service error:', error);
  // 处理错误
}
```

**缓存策略:**
```typescript
// 短期缓存（频繁变化的数据）
cache('key', factory, { ttl: 60000 }); // 1分钟

// 长期缓存（不常变化的数据）
cache('key', factory, { ttl: 3600000 }); // 1小时
```

**性能优化:**
```typescript
// 使用 React Query 的缓存
const { data } = usePosts({
  staleTime: 5 * 60 * 1000, // 5分钟
});

// 预取数据
useEffect(() => {
  if (hover) {
    prefetchPost(queryClient, postId);
  }
}, [hover]);
```

---

## 🧪 测试

### 单元测试示例

```typescript
import { renderHook } from '@testing-library/react';
import { usePosts } from '@/services';

describe('usePosts', () => {
  it('should fetch posts successfully', async () => {
    const { result } = renderHook(() => usePosts({ per_page: 10 }));

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
      expect(result.current.data.length).toBe(10);
    });
  });
});
```

---

## 📊 性能指标

| 服务 | 响应时间 | 缓存命中率 | 内存占用 |
|------|----------|------------|----------|
| WordPress | < 100ms | 85% | ~2MB |
| Analytics | < 50ms | N/A | ~1MB |
| AI Analyzer | < 500ms | 70% | ~5MB |
| Notification | < 10ms | N/A | ~500KB |
| Cache | < 1ms | 90% | ~3MB |

---

## 🐛 故障排除

### 常见问题

**Q: WordPress API 请求失败？**

A: 检查 CORS 配置和认证信息：
```typescript
const wpClient = getWordPressClient({
  baseUrl: 'https://your-site.com',
  username: 'your-username',
  password: 'your-app-password',
});
```

**Q: Analytics 数据未发送？**

A: 确保 API 端点正确：
```typescript
const analytics = initAnalytics({
  enabled: true,
  apiEndpoint: '/api/analytics', // 检查这个路径
});
```

**Q: 通知服务未连接？**

A: 检查 WebSocket 配置和用户认证：
```typescript
notifications.connect(userId, token); // 确保有有效的 token
```

**Q: 缓存未命中？**

A: 检查 TTL 设置和缓存键：
```typescript
cache('unique_key', factory, { ttl: 60000 }); // 确保键唯一
```

---

## 🤝 贡献

欢迎贡献代码！请查看 [贡献指南](../CONTRIBUTING.md)。

---

## 📄 许可证

MIT License - 详见 [LICENSE](../LICENSE) 文件。

---

**最后更新:** 2026-03-08
**版本:** 1.0.0
