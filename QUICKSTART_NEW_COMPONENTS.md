# 🚀 快速开始指南 - 新组件集成

本指南帮助你快速集成和使用本次会话创建的新组件。

---

## 📋 目录

1. [数据库设置](#1-数据库设置)
2. [搜索组件](#2-搜索组件)
3. [加载屏幕](#3-加载屏幕)
4. [分析服务](#4-分析服务)
5. [通知服务](#5-通知服务)
6. [缓存服务](#6-缓存服务)
7. [验证工具](#7-验证工具)

---

## 1. 数据库设置

### 步骤 1: 运行 SQL 脚本

```bash
# 连接到 MySQL
mysql -u root -p

# 创建数据库（如果还没有）
CREATE DATABASE cyberpress_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 使用数据库
USE cyberpress_db;

# 运行 schema（如果还没有运行）
SOURCE backend/database/schema.sql;

# 运行初始化数据
SOURCE backend/database/init.sql;
```

### 步骤 2: 验证安装

```sql
-- 检查表是否创建成功
SHOW TABLES;

-- 检查示例数据
SELECT * FROM posts LIMIT 5;
SELECT * FROM categories WHERE type = 'category';
SELECT * FROM categories WHERE type = 'tag';
```

---

## 2. 搜索组件

### 基础使用

```tsx
// app/search/page.tsx
import { AdvancedSearch } from '@/components/search/AdvancedSearch';

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search</h1>

      <AdvancedSearch
        placeholder="搜索文章、标签、作者..."
        showFilters={true}
        onSearch={(query, filters) => {
          console.log('搜索查询:', query);
          console.log('筛选条件:', filters);
          // 执行搜索...
        }}
      />
    </div>
  );
}
```

### 与 API 集成

```tsx
'use client';

import { useState } from 'react';
import { AdvancedSearch, SearchFilters } from '@/components/search/AdvancedSearch';

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string, filters: SearchFilters) => {
    setLoading(true);

    // 构建查询参数
    const params = new URLSearchParams({ q: query });
    if (filters.category) params.set('category', filters.category);
    if (filters.tags?.length) params.set('tags', filters.join(','));

    try {
      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdvancedSearch onSearch={handleSearch} />

      {loading ? (
        <p>搜索中...</p>
      ) : (
        <div>
          {results.map((post) => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 3. 加载屏幕

### 全屏加载

```tsx
'use client';

import { useState } from 'react';
import { LoadingScreen } from '@/components/layout/LoadingScreen';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <LoadingScreen
        isLoading={isLoading}
        type="cyber"
        message="初始化系统..."
        minDuration={1500}
        onComplete={() => console.log('加载完成')}
      />

      {!isLoading && (
        <div>
          <h1>页面内容</h1>
        </div>
      )}
    </>
  );
}
```

### 带进度的加载

```tsx
'use client';

import { useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/layout/LoadingScreen';

export default function Page() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟加载进度
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <LoadingScreen
      isLoading={isLoading}
      type="bar"
      message={`加载中... ${progress}%`}
      progress={progress}
    />
  );
}
```

### 便捷组件

```tsx
import { PageLoader, InlineLoader } from '@/components/layout/LoadingScreen';

// 全屏页面加载器
export default function LoadingPage() {
  return <PageLoader message="加载中..." />;
}

// 行内加载器
export function DataTable() {
  return (
    <div>
      <InlineLoader size="md" />
    </div>
  );
}
```

---

## 4. 分析服务

### 初始化

```tsx
// app/layout.tsx
import { getAnalytics } from '@/lib/services/AnalyticsService';

export default function RootLayout({ children }) {
  useEffect(() => {
    // 初始化分析服务
    const analytics = getAnalytics({
      trackingId: process.env.NEXT_PUBLIC_GA_ID,
      gtmId: process.env.NEXT_PUBLIC_GTM_ID,
      debug: process.env.NODE_ENV === 'development',
    });

    analytics.initialize();
  }, []);

  return <html><body>{children}</body></html>;
}
```

### 页面浏览追踪

```tsx
'use client';

import { usePathname } from 'next/navigation';
import { getAnalytics } from '@/lib/services/AnalyticsService';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const analytics = getAnalytics();

  useEffect(() => {
    analytics.pageView({
      path: pathname,
      title: document.title,
    });
  }, [pathname]);

  return null;
}
```

### 事件追踪

```tsx
'use client';

import { getAnalytics } from '@/lib/services/AnalyticsService';

export function LikeButton({ postId }) {
  const analytics = getAnalytics();

  const handleLike = () => {
    // 点赞逻辑...

    // 追踪事件
    analytics.trackLike(postId);
  };

  return <button onClick={handleLike}>Like</button>;
}
```

### 性能追踪

```tsx
'use client';

import { getAnalytics } from '@/lib/services/AnalyticsService';
import type { PerformanceData } from '@/components/performance/PerformanceMonitor';

export function PerformanceTracker({ data }: { data: PerformanceData }) {
  const analytics = getAnalytics();

  useEffect(() => {
    if (data) {
      analytics.trackPerformance(data);
    }
  }, [data]);

  return null;
}
```

---

## 5. 通知服务

### 请求权限并显示通知

```tsx
'use client';

import { getNotificationService } from '@/lib/services/NotificationService';

export function NotificationButton() {
  const notifications = getNotificationService();

  const handleNotify = async () => {
    // 请求权限
    const permission = await notifications.requestPermission();

    if (permission === 'granted') {
      // 显示通知
      notifications.showBrowserNotification('新消息', {
        body: '您有新的评论',
        icon: '/icons/icon-192x192.png',
      });
    }
  };

  return <button onClick={handleNotify}>发送通知</button>;
}
```

### 应用内通知

```tsx
'use client';

import { getNotificationService } from '@/lib/services/NotificationService';

export function SaveButton() {
  const notifications = getNotificationService();

  const handleSave = async () => {
    try {
      // 保存逻辑...

      notifications.success('保存成功', '您的更改已保存');
    } catch (error) {
      notifications.error('保存失败', error.message);
    }
  };

  return <button onClick={handleSave}>保存</button>;
}
```

### 推送通知订阅

```tsx
'use client';

import { useState } from 'react';
import { getNotificationService } from '@/lib/services/NotificationService';

export function PushNotificationToggle() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const notifications = getNotificationService();

  const handleSubscribe = async () => {
    const subscription = await notifications.subscribeToPush({
      vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_KEY!,
    });

    if (subscription) {
      setIsSubscribed(true);
      notifications.success('推送通知已开启');
    }
  };

  const handleUnsubscribe = async () => {
    const success = await notifications.unsubscribeFromPush();
    if (success) {
      setIsSubscribed(false);
      notifications.info('推送通知已关闭');
    }
  };

  return (
    <button onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}>
      {isSubscribed ? '关闭推送' : '开启推送'}
    </button>
  );
}
```

---

## 6. 缓存服务

### 基础使用

```tsx
'use client';

import { getCache } from '@/lib/services/CacheService';

export function UserProfile({ userId }: { userId: string }) {
  const cache = getCache();

  const loadUser = async () => {
    // 尝试从缓存获取
    const cached = cache.get(`user:${userId}`);
    if (cached) {
      return cached;
    }

    // 从 API 获取
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();

    // 存入缓存（5分钟过期）
    cache.set(`user:${userId}`, user, { ttl: 300000 });

    return user;
  };

  // ...
}
```

### 异步缓存

```tsx
'use client';

import { useState, useEffect } from 'react';
import { getCache } from '@/lib/services/CacheService';

export function PostsList() {
  const [posts, setPosts] = useState([]);
  const cache = getCache();

  useEffect(() => {
    const loadPosts = async () => {
      // 自动缓存或获取
      const data = await cache.getOrSet(
        'posts',
        () => fetch('/api/posts').then(r => r.json()),
        { ttl: 60000 } // 1分钟
      );

      setPosts(data);
    };

    loadPosts();
  }, []);

  return (
    <div>
      {posts.map(post => <div key={post.id}>{post.title}</div>)}
    </div>
  );
}
```

### 函数记忆化

```tsx
'use client';

import { getCache } from '@/lib/services/CacheService';

export function ExpensiveCalculation({ input }: { input: number }) {
  const cache = getCache();

  // 记忆化昂贵函数
  const fibonacci = cache.memoize((n: number): number => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  });

  const result = fibonacci(input);

  return <div>Result: {result}</div>;
}
```

---

## 7. 验证工具

### 表单验证

```tsx
'use client';

import { useState } from 'react';
import {
  validateEmail,
  validatePassword,
  commonRules,
  FormValidator
} from '@/lib/utils/ValidationUtils';

export function RegisterForm() {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    const validator = new FormValidator();

    validator.addRule('email', {
      validate: (value) => validateEmail(value),
      message: '请输入有效的邮箱地址',
    });

    validator.addRule('password', {
      validate: (value) => validatePassword(value).isValid,
      message: '密码至少8位，包含大小写字母和数字',
    });

    const result = validator.validateAll(formData);
    const isValid = Object.values(result).every(r => r.isValid);

    if (!isValid) {
      const errorMessages: Record<string, string> = {};
      Object.entries(result).forEach(([field, r]) => {
        if (!r.isValid) {
          errorMessages[field] = r.errors[0];
        }
      });
      setErrors(errorMessages);
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // 提交表单...
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {errors.password && <span className="error">{errors.password}</span>}

      <button type="submit">注册</button>
    </form>
  );
}
```

### 简单验证

```tsx
import { validateEmail, validatePhoneNumber, validateUrl } from '@/lib/utils/ValidationUtils';

// 验证邮箱
const isValidEmail = validateEmail('user@example.com');

// 验证手机号
const isValidPhone = validatePhoneNumber('13800138000');

// 验证 URL
const isValidUrl = validateUrl('https://example.com');
```

---

## 🔧 环境变量配置

创建 `.env.local` 文件：

```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX

# Web Push (VAPID)
NEXT_PUBLIC_VAPID_KEY=your_vapid_public_key

# WordPress API
NEXT_PUBLIC_WP_API_URL=https://your-wordpress-site.com/wp-json
```

---

## 📦 安装依赖

如果缺少依赖，请安装：

```bash
npm install framer-motion lucide-react
```

---

## 🎯 快速测试

### 1. 测试搜索组件

访问 `/search` 页面，尝试：
- 输入搜索关键词
- 使用高级筛选
- 保存搜索

### 2. 测试加载屏幕

```tsx
// app/test/loading/page.tsx
'use client';

import { useState } from 'react';
import { LoadingScreen } from '@/components/layout/LoadingScreen';

export default function TestLoading() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <LoadingScreen
        isLoading={loading}
        type="cyber"
        message="测试加载..."
      />

      {!loading && (
        <div className="p-8">
          <h1>加载完成！</h1>
          <button onClick={() => setLoading(true)}>重新加载</button>
        </div>
      )}
    </>
  );
}
```

### 3. 测试通知

```tsx
// app/test/notification/page.tsx
'use client';

import { getNotificationService } from '@/lib/services/NotificationService';

export default function TestNotification() {
  const notifications = getNotificationService();

  return (
    <div className="p-8 space-y-4">
      <button
        onClick={() => notifications.success('成功', '操作成功')}
      >
        测试成功通知
      </button>

      <button
        onClick={() => notifications.error('错误', '操作失败')}
      >
        测试错误通知
      </button>

      <button
        onClick={() => notifications.warning('警告', '请注意')}
      >
        测试警告通知
      </button>

      <button
        onClick={() => notifications.info('信息', '新消息')}
      >
        测试信息通知
      </button>
    </div>
  );
}
```

---

## 📚 更多资源

- [完整文件列表](./FILES_CREATED_THIS_SESSION_2026_03_03.md)
- [项目 README](./README.md)
- [组件文档](./CREATED_COMPONENTS.md)

---

**开始构建你的赛博朋克博客平台吧！** 🚀
