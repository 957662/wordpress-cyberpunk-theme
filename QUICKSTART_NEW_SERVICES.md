# 新功能快速开始指南

欢迎使用 CyberPress Platform 的新功能！本指南将帮助您快速上手新添加的服务和组件。

---

## 📚 目录

1. [分析服务](#分析服务)
2. [缓存服务](#缓存服务)
3. [通知服务](#通知服务)
4. [打印功能](#打印功能)
5. [反馈小部件](#反馈小部件)
6. [工具函数](#工具函数)

---

## 🎯 分析服务

分析服务帮助您追踪用户行为和应用性能。

### 基础用法

```typescript
import { useAnalytics } from '@/lib/services/analytics';

function MyComponent() {
  const analytics = useAnalytics();

  const handleClick = () => {
    // 追踪按钮点击
    analytics.trackInteraction('button', 'click', {
      buttonId: 'submit',
      page: '/home'
    });
  };

  return <button onClick={handleClick}>点击我</button>;
}
```

### 追踪页面访问

```typescript
import { useEffect } from 'react';
import { useAnalytics } from '@/lib/services/analytics';

function BlogPage({ slug }) {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.trackPageView({
      path: `/blog/${slug}`,
      title: '博客文章',
    });
  }, [slug]);

  return <div>博客内容...</div>;
}
```

### 性能监控

分析服务会自动追踪：
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

### 查看统计

```typescript
const stats = analytics.getSessionStats();
console.log('会话统计:', stats);
// 输出: { sessionId: '...', eventCount: 5, ... }
```

---

## 💾 缓存服务

缓存服务提供内存和持久化缓存功能，提升应用性能。

### 基础缓存

```typescript
import { useCache, CacheTTL } from '@/lib/services/cache';

const cache = useCache();

// 设置缓存（5分钟过期）
cache.set('user_data', userData, {
  ttl: CacheTTL.MINUTE * 5,
  persist: true, // 持久化到 localStorage
});

// 获取缓存
const data = cache.get('user_data');

// 删除缓存
cache.delete('user_data');
```

### 使用标签

```typescript
import { CacheTags } from '@/lib/services/cache';

// 设置带标签的缓存
cache.set('posts:latest', postsData, {
  ttl: CacheTTL.HOUR,
  tags: [CacheTags.POST, CacheTags.API],
});

// 按标签删除所有相关缓存
cache.deleteByTag(CacheTags.POST);
```

### Get Or Set 模式

```typescript
// 自动获取或设置缓存
const posts = await cache.getOrSet(
  'posts_list',
  async () => {
    const response = await fetch('/api/posts');
    return response.json();
  },
  { ttl: CacheTTL.MINUTE * 10 }
);
```

### 缓存统计

```typescript
const stats = cache.getStats();
console.log('缓存统计:', stats);
// 输出: { memorySize: 15, storageSize: 8, ... }
```

---

## 🔔 通知服务

通知服务提供美观的通知和对话框功能。

### 显示通知

```typescript
import { useNotification } from '@/lib/services/notifications';

function MyForm() {
  const notification = useNotification();

  const handleSubmit = async () => {
    try {
      await submitForm();
      notification.success('表单提交成功！');
    } catch (error) {
      notification.error('提交失败，请重试');
    }
  };

  return <button onClick={handleSubmit}>提交</button>;
}
```

### 确认对话框

```typescript
function DeleteButton() {
  const notification = useNotification();

  const handleDelete = () => {
    notification.confirm('确定要删除此项目吗？此操作无法撤销。', {
      title: '确认删除',
      onConfirm: async () => {
        await deleteItem();
        notification.success('删除成功');
      },
      confirmLabel: '删除',
      cancelLabel: '取消',
    });
  };

  return <button onClick={handleDelete}>删除</button>;
}
```

### 加载状态

```typescript
function DataLoader() {
  const notification = useNotification();

  const loadData = async () => {
    const loadingId = notification.loading('正在加载数据...');

    try {
      const data = await fetchData();
      notification.resolveLoading(loadingId, '数据加载完成');
    } catch (error) {
      notification.rejectLoading(loadingId, '加载失败');
    }
  };

  return <button onClick={loadData}>加载数据</button>;
}
```

---

## 🖨️ 打印功能

打印功能让您的页面可以完美打印输出。

### 基础打印按钮

```typescript
import { PrintButton } from '@/components/utility';

function DocumentPage() {
  return (
    <div>
      <PrintButton label="打印文档" />
      <div>文档内容...</div>
    </div>
  );
}
```

### 控制打印显示

```typescript
import { PrintContainer } from '@/components/utility';

function Page() {
  return (
    <div>
      {/* 屏幕显示，打印隐藏 */}
      <PrintContainer hideOnPrint>
        <button>返回</button>
        <nav>导航菜单</nav>
      </PrintContainer>

      {/* 打印显示，屏幕隐藏 */}
      <PrintContainer showOnlyOnPrint>
        <div>机密信息：仅打印时显示</div>
      </PrintContainer>

      <div>主要内容...</div>
    </div>
  );
}
```

### 自定义打印页眉页脚

```typescript
import { PrintHeader, PrintFooter } from '@/components/utility';

function Document() {
  return (
    <div>
      <PrintHeader>
        <div className="flex justify-between">
          <span>机密文档</span>
          <span>2026-03-03</span>
        </div>
      </PrintHeader>

      <div>文档内容...</div>

      <PrintFooter>
        <div className="text-center">
          第 <span className="print:current-page">1</span> 页
        </div>
      </PrintFooter>
    </div>
  );
}
```

### 打印回调

```typescript
<PrintButton
  label="打印报告"
  onBeforePrint={async () => {
    console.log('准备打印...');
    await prepareForPrint();
    return true; // 返回 false 取消打印
  }}
  onAfterPrint={() => {
    console.log('打印完成');
    cleanupAfterPrint();
  }}
/>
```

---

## 💬 反馈小部件

反馈小部件让您轻松收集用户反馈。

### 基础用法

```typescript
import { FeedbackWidget } from '@/components/feedback';

function Layout({ children }) {
  return (
    <>
      {children}

      <FeedbackWidget
        position="bottom-right"
        onSubmit={async (feedback) => {
          // 发送反馈到服务器
          await fetch('/api/feedback', {
            method: 'POST',
            body: JSON.stringify(feedback),
          });
        }}
      />
    </>
  );
}
```

### 自定义配置

```typescript
<FeedbackWidget
  position="bottom-left"  // 位置：bottom-right, bottom-left, top-right, top-left
  showEmail={true}        // 显示邮箱输入
  showRating={true}       // 显示评分
  categories={['功能建议', '问题反馈', '使用体验', '其他']}
  title="意见反馈"
  successMessage="感谢您的宝贵意见！"
/>
```

### 处理反馈数据

```typescript
// app/api/feedback/route.ts
export async function POST(request: Request) {
  const feedback = await request.json();

  // feedback 包含：
  // - rating?: number (评分 1-5)
  // - category: string (分类)
  // - message: string (反馈内容)
  // - email?: string (邮箱)
  // - userAgent: string (浏览器信息)
  // - timestamp: number (时间戳)

  // 保存到数据库或发送邮件
  await saveFeedback(feedback);

  return Response.json({ success: true });
}
```

---

## 🛠️ 工具函数

### 验证工具

```typescript
import {
  isEmail,
  isPhoneNumber,
  checkPasswordStrength,
  createValidator
} from '@/lib/utils/validation';

// 基础验证
isEmail('user@example.com'); // true
isPhoneNumber('13800138000'); // true

// 密码强度检查
const strength = checkPasswordStrength('MyP@ssw0rd');
console.log(strength);
// { score: 4, level: 'strong', suggestions: [] }

// 创建验证器
const validator = createValidator()
  .required('请输入用户名')
  .minLength(3, '用户名至少3位')
  .maxLength(20, '用户名最多20位');

const result = validator.validate(username);
if (!result.valid) {
  console.error(result.errors);
}
```

### 打印工具

```typescript
import {
  print,
  isPrintMode,
  onPrintStart
} from '@/lib/utils/print';

// 触发打印
print();

// 检查是否在打印模式
if (isPrintMode()) {
  // 应用打印样式
}

// 监听打印事件
const cleanup = onPrintStart(() => {
  console.log('开始打印');
});

// 清理监听器
cleanup();
```

---

## 📊 完整示例

### 博客文章页面（包含所有功能）

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useAnalytics } from '@/lib/services/analytics';
import { useCache, CacheTTL } from '@/lib/services/cache';
import { useNotification } from '@/lib/services/notifications';
import { PrintButton } from '@/components/utility';
import { FeedbackWidget } from '@/components/feedback';

export default function BlogPost({ slug }) {
  const analytics = useAnalytics();
  const cache = useCache();
  const notification = useNotification();
  const [post, setPost] = useState(null);

  useEffect(() => {
    // 追踪页面访问
    analytics.trackPageView({
      path: `/blog/${slug}`,
      title: post?.title || '博客文章',
    });
  }, [slug, post]);

  useEffect(() => {
    // 使用缓存加载文章
    cache.getOrSet(
      `post:${slug}`,
      async () => {
        const response = await fetch(`/api/posts/${slug}`);
        if (!response.ok) throw new Error('加载失败');
        return response.json();
      },
      { ttl: CacheTTL.HOUR }
    ).then(data => {
      setPost(data);
    }).catch(error => {
      notification.error('文章加载失败');
      analytics.trackError(error);
    });
  }, [slug]);

  if (!post) return <div>加载中...</div>;

  return (
    <article>
      {/* 打印按钮 */}
      <div className="flex justify-between items-center mb-4">
        <PrintButton onBeforePrint={() => analytics.trackInteraction('print', 'click')} />
      </div>

      {/* 文章内容 */}
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* 反馈小部件 */}
      <FeedbackWidget
        position="bottom-right"
        onSubmit={async (feedback) => {
          await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...feedback,
              context: `blog:${slug}`,
            }),
          });
          notification.success('感谢您的反馈！');
        }}
      />
    </article>
  );
}
```

---

## 🎓 最佳实践

### 1. 合理使用缓存

```typescript
// ✅ 好：API 响应使用缓存
cache.getOrSet('api:data', fetchApiData, { ttl: CacheTTL.MINUTE * 5 });

// ❌ 差：频繁变化的数据不要缓存
cache.set('realtime_data', data); // 应该使用更短的 TTL
```

### 2. 适当的错误追踪

```typescript
// ✅ 好：追踪有用的上下文信息
analytics.trackError(error, {
  component: 'LoginForm',
  action: 'submit',
  userId: user.id,
});

// ❌ 差：不追踪敏感信息
analytics.trackError(error, {
  password: user.password, // 不要记录密码！
});
```

### 3. 通知的正确使用

```typescript
// ✅ 好：提供上下文
notification.success('文章《{title}》已发布');

// ❌ 差：模糊的消息
notification.success('操作成功'); // 哪个操作？
```

---

## 📚 更多资源

- [完整 API 文档](./docs/API.md)
- [组件示例](./app/examples)
- [TypeScript 类型定义](./types)

---

**需要帮助？** 查看 [项目 README](./README.md) 或提交 Issue。
