# CyberPress Platform 快速入门指南

## 安装与运行

### 1. 安装依赖
```bash
cd frontend
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看网站

### 3. 构建生产版本
```bash
npm run build
npm run start
```

## 核心概念

### 组件使用

#### 1. 使用特效组件

```tsx
// 打字机效果
import { TypingEffect } from '@/components/effects/TypingEffect';

<TypingEffect
  text={['欢迎来到 CyberPress', '探索赛博朋克风格']}
  speed={100}
  loop
/>

// 磁性按钮
import { MagneticWrapper } from '@/components/effects/MagneticWrapper';

<MagneticWrapper strength={0.5}>
  <CyberButton>悬停试试</CyberButton>
</MagneticWrapper>
```

#### 2. 使用 UI 组件

```tsx
import { CyberButton } from '@/components/ui/CyberButton';
import { ArticleCard } from '@/components/blog/ArticleCard';

// 按钮
<CyberButton variant="primary" size="lg">
  点击我
</CyberButton>

// 文章卡片
<ArticleCard
  article={{
    id: 1,
    title: '文章标题',
    excerpt: '文章摘要',
    slug: 'article-slug',
    date: '2024-03-07',
    readTime: 5,
    category: { name: '技术', slug: 'tech', color: '#00f0ff' },
    author: { name: '作者' },
    tags: ['标签1', '标签2'],
  }}
/>
```

#### 3. 使用布局组件

```tsx
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Section } from '@/components/layout/Section';

export default function Page() {
  return (
    <>
      <Header />

      <Section variant="muted" padding="lg">
        <h1>页面标题</h1>
      </Section>

      <Footer />
    </>
  );
}
```

### 工具函数使用

#### 1. 字符串工具

```tsx
import { capitalize, truncate, randomString } from '@/lib/utils/string';

const title = capitalize('hello world'); // "Hello world"
const short = truncate('Long text here...', 10); // "Long te..."
const random = randomString(8); // "aB3xY9pQ"
```

#### 2. 日期工具

```tsx
import { formatDate, getRelativeTime } from '@/lib/utils/date';

const dateStr = formatDate('2024-03-07', 'long'); // "2024年03月07日"
const relative = getRelativeTime('2024-03-07'); // "3天前"
```

#### 3. 验证工具

```tsx
import { isValidEmail, isValidPhone } from '@/lib/utils/validation';

isValidEmail('test@example.com'); // true
isValidPhone('13800138000'); // true
```

### 服务使用

#### 1. 通知服务

```tsx
import { notification } from '@/lib/services/notification';

// 成功通知
notification.success('保存成功！');

// 错误通知
notification.error('发生错误，请重试');

// 加载通知
const toastId = notification.loading('加载中...');

// 更新通知
// 后续可以使用 toastId 来更新或关闭通知
```

#### 2. 存储服务

```tsx
import { storage } from '@/lib/services/storage';

// 保存数据
storage.setLocal('user', { name: 'John', age: 30 });

// 获取数据
const user = storage.getLocal('user');

// 删除数据
storage.removeLocal('user');

// 检查是否存在
if (storage.hasLocal('user')) {
  // ...
}

// sessionStorage 用法相同
storage.setSession('temp', 'data');
```

### 自定义 Hooks

#### 1. useDebounce - 防抖

```tsx
import { useDebounce } from '@/hooks/useDebounce';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);

// 使用 debouncedSearchTerm 进行搜索
```

#### 2. useLocalStorage - 本地存储

```tsx
import { useLocalStorage } from '@/hooks/useLocalStorage';

const [theme, setTheme] = useLocalStorage('theme', 'dark');

// theme 会自动保存到 localStorage
```

#### 3. useMediaQuery - 媒体查询

```tsx
import { useMediaQuery, useIsMobile } from '@/hooks/useMediaQuery';

const isMobile = useIsMobile();
const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
```

## 创建新页面

### 1. 基本页面结构

```tsx
// app/new-page/page.tsx
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Section } from '@/components/layout/Section';

export default function NewPage() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <Header />

      <main>
        <Section>
          <h1>新页面标题</h1>
          <p>页面内容</p>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
```

### 2. 添加元数据

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '新页面 - CyberPress',
  description: '页面描述',
  keywords: ['关键词1', '关键词2'],
};
```

### 3. 客户端交互

```tsx
'use client';

import { useState } from 'react';

export default function InteractivePage() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
}
```

## 样式指南

### 颜色使用

```tsx
// 使用 Tailwind 类名
<div className="bg-cyber-dark text-white">
  <span className="text-cyber-cyan">青色文字</span>
  <span className="text-cyber-purple">紫色文字</span>
</div>

// 使用自定义样式
<div style={{ color: '#00f0ff' }}>
  自定义颜色
</div>
```

### 卡片样式

```tsx
<div className="cyber-card">
  卡片内容
</div>

// 带变体的卡片
<div className="cyber-card featured">
  精选卡片
</div>
```

### 动画类

```tsx
// 淡入动画
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  内容
</motion.div>

// 滑入动画
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
>
  内容
</motion.div>
```

## 常见任务

### 添加新的 API 端点

```tsx
// app/api/new-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

### 创建新的布局

```tsx
// app/new-route/layout.tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="custom-layout">
      {children}
    </div>
  );
}
```

### 添加中间件

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 中间件逻辑
  return NextResponse.next();
}

export const config = {
  matcher: '/protected/:path*',
};
```

## 调试技巧

### 1. 查看状态

```tsx
useEffect(() => {
  console.log('组件挂载');
  console.log('当前状态:', state);
}, []);
```

### 2. 性能监控

```tsx
useEffect(() => {
  const start = performance.now();

  return () => {
    const end = performance.now();
    console.log(`渲染耗时: ${end - start}ms`);
  };
});
```

### 3. 错误处理

```tsx
try {
  // 可能出错的代码
} catch (error) {
  console.error('发生错误:', error);
  notification.error('操作失败');
}
```

## 部署前检查

### 1. 类型检查
```bash
npm run type-check
```

### 2. 代码检查
```bash
npm run lint
```

### 3. 构建测试
```bash
npm run build
```

### 4. 测试运行
```bash
npm test
```

## 常见问题

### Q: 如何更改主题颜色？
A: 编辑 `tailwind.config.ts` 中的 `colors` 配置。

### Q: 如何添加新的字体？
A: 在 `app/layout.tsx` 中导入 Google Fonts 或其他字体服务。

### Q: 如何优化图片？
A: 使用 Next.js 的 `Image` 组件，它会自动优化。

### Q: 如何添加 PWA 支持？
A: 已包含基本 PWA 配置，可以修改 `manifest.json` 自定义。

## 获取帮助

- 查看组件文档: `COMPONENTS.md`
- 查看项目总结: `PROJECT-SUMMARY.md`
- 查看已创建文件: `CREATED-FILES.md`
- 提交 Issue: GitHub Issues

## 下一步

1. ✅ 安装依赖并启动项目
2. ✅ 浏览现有组件和页面
3. ✅ 尝试创建新页面
4. ✅ 添加自定义功能
5. ✅ 部署到生产环境

祝您开发愉快！ 🚀

---

**最后更新**: 2024-03-07
**版本**: 1.0.0
