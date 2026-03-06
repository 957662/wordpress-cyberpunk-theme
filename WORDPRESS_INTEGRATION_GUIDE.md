# WordPress 集成快速开始指南

本指南将帮助你快速集成 WordPress REST API 到 CyberPress Platform 中。

## 📋 目录

- [环境配置](#环境配置)
- [基础用法](#基础用法)
- [React Hooks](#react-hooks)
- [服务端渲染](#服务端渲染)
- [高级功能](#高级功能)
- [故障排除](#故障排除)

## 🔧 环境配置

### 1. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
# WordPress REST API URL
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com

# API 认证（可选）
NEXT_PUBLIC_WORDPRESS_USERNAME=
NEXT_PUBLIC_WORDPRESS_PASSWORD=

# 请求超时时间（毫秒）
NEXT_PUBLIC_WORDPRESS_TIMEOUT=10000
```

### 2. 验证连接

确保你的 WordPress 站点启用了 REST API：
- 访问 `https://your-wordpress-site.com/wp-json`
- 应该看到 JSON 响应

## 🚀 基础用法

### 客户端组件

```tsx
'use client';

import { useWordPressPosts } from '@/lib/wordpress';
import { BlogGrid } from '@/components/blog';

export function MyBlogPage() {
  const { data: posts, loading, error } = useWordPressPosts({
    per_page: 12,
    orderby: 'date',
    order: 'desc',
    _embed: true,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <BlogGrid posts={posts} />;
}
```

## 📚 更多资源

- [WordPress REST API 手册](https://developer.wordpress.org/rest-api/)
- [Next.js 文档](https://nextjs.org/docs)
- [项目示例代码](./frontend/lib/wordpress/examples.ts)

---

如有问题，请查看项目文档或提交 Issue。
