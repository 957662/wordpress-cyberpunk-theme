# 🚀 新功能快速启动指南

**更新日期**: 2026-03-06

## ✨ 新增功能概览

本次更新为 CyberPress Platform 添加了多个核心功能组件和服务，包括博客增强功能、社交功能、搜索功能以及完整的 API 服务层。

---

## 📦 新增组件

### 1. 博客组件

#### ArticleContent - 文章内容组件
**位置**: `frontend/components/blog/ArticleContent.tsx`

**功能**:
- 自动解析文章中的标题生成目录导航
- 滚动监听，自动高亮当前阅读章节
- 平滑滚动到指定章节
- 支持多级标题（H1-H4）

**使用示例**:
```tsx
import { ArticleContent } from '@/components/blog/ArticleContent';

<ArticleContent 
  content={post.content}
  className="prose prose-invert"
/>
```

#### CommentItem - 评论项组件
**位置**: `frontend/components/blog/CommentItem.tsx`

**功能**:
- 显示评论者头像、昵称、时间
- 相对时间格式化（如"3分钟前"）
- 响应式布局

**使用示例**:
```tsx
import { CommentItem } from '@/components/blog/CommentItem';

<CommentItem 
  author={{ name: '张三', avatar: '/avatar.jpg' }}
  content="这是一条评论"
  createdAt="2026-03-06T10:00:00Z"
/>
```

### 2. 搜索组件

#### SearchInput - 智能搜索框
**位置**: `frontend/components/search/SearchInput.tsx`

**功能**:
- 实时搜索建议
- 搜索历史记录（本地存储）
- 热门搜索推荐
- 键盘快捷键（Enter搜索，Esc关闭）
- 自动完成

**使用示例**:
```tsx
import { SearchInput } from '@/components/search/SearchInput';

<SearchInput 
  placeholder="搜索文章..."
  onSearch={(query) => console.log(query)}
/>
```

### 3. 社交组件

#### ShareButton - 分享按钮
**位置**: `frontend/components/social/ShareButton.tsx`

**功能**:
- 原生分享 API（移动端优先）
- 多平台分享（Twitter, Facebook, LinkedIn）
- 复制链接功能
- Toast 提示反馈

**使用示例**:
```tsx
import { ShareButton } from '@/components/social/ShareButton';

<ShareButton 
  title="文章标题"
  url="https://example.com/post/1"
  description="文章描述"
/>
```

### 4. UI 组件

#### Avatar - 头像组件
**位置**: `frontend/components/ui/avatar.tsx`

**功能**:
- 图片显示和加载错误处理
- 多种尺寸（sm, md, lg, xl）
- 自定义 fallback 内容
- 赛博朋克风格边框

**使用示例**:
```tsx
import { Avatar } from '@/components/ui/avatar';

<Avatar 
  src="/avatar.jpg"
  alt="用户名"
  size="md"
  fallback={<UserIcon />}
/>
```

#### Textarea - 多行输入框
**位置**: `frontend/components/ui/textarea.tsx`

**功能**:
- 支持标签和错误提示
- 可调整最小高度
- 完整的表单集成

**使用示例**:
```tsx
import { Textarea } from '@/components/ui/textarea';

<Textarea 
  label="评论内容"
  placeholder="写下你的评论..."
  error={errors.comment}
  {...register('comment')}
/>
```

#### Toast - 提示组件
**位置**: `frontend/components/ui/toast.tsx`

**功能**:
- 四种类型（成功、错误、警告、信息）
- 自动消失和手动关闭
- 动画效果
- 容器支持多个提示

**使用示例**:
```tsx
import { Toast, ToastContainer } from '@/components/ui/toast';

// 单个提示
<Toast 
  message="操作成功"
  type="success"
  duration={3000}
/>

// 提示容器
<ToastContainer 
  toasts={toasts}
  onRemove={(id) => removeToast(id)}
/>
```

---

## 🔧 API 服务层

### 服务架构

所有服务都基于统一的 `ApiClient` 类构建，提供一致的接口和错误处理。

### ApiClient - API 客户端基础类
**位置**: `frontend/lib/services/api-client.ts`

**功能**:
- 统一的请求处理
- 自动错误处理和重试
- 请求/响应拦截器
- 超时控制
- 认证支持

**使用示例**:
```typescript
import { apiClient } from '@/lib/services';

const response = await apiClient.get('/api/posts');
const data = response.data;
```

### BlogService - 博客服务
**位置**: `frontend/lib/services/blog-service.ts`

**功能**:
- 获取文章列表（支持分页、筛选、排序）
- 获取文章详情
- 搜索文章
- 获取相关文章
- 创建/更新/删除文章（需认证）

**使用示例**:
```typescript
import { blogService } from '@/lib/services';

// 获取文章列表
const posts = await blogService.getPosts({ 
  page: 1, 
  limit: 10,
  category: '技术' 
});

// 获取文章详情
const post = await blogService.getPost('post-slug');

// 搜索文章
const results = await blogService.searchPosts('Next.js');
```

### AuthService - 认证服务
**位置**: `frontend/lib/services/auth-service.ts`

**功能**:
- 用户登录/注册
- 令牌管理（自动存储和刷新）
- 当前用户信息获取
- 登出
- 密码重置

**使用示例**:
```typescript
import { authService } from '@/lib/services';

// 登录
const { user, token } = await authService.login({
  email: 'user@example.com',
  password: 'password'
});

// 检查认证状态
if (authService.isAuthenticated()) {
  const user = authService.getCurrentUser();
}

// 登出
await authService.logout();
```

### SocialService - 社交服务
**位置**: `frontend/lib/services/social-service.ts`

**功能**:
- 点赞/取消点赞
- 收藏/取消收藏
- 关注/取消关注用户
- 评论管理（获取、添加、删除）
- 获取关注/粉丝列表

**使用示例**:
```typescript
import { socialService } from '@/lib/services';

// 点赞文章
await socialService.toggleLike('post-id', token);

// 添加评论
await socialService.addComment('post-id', '评论内容', undefined, token);

// 关注用户
await socialService.toggleFollow('user-id', token);
```

---

## 📄 新增页面

### Analytics - 数据分析页面
**位置**: `frontend/app/(public)/analytics/page.tsx`

**功能**:
- 网站统计数据展示
- 热门文章排行
- 趋势分析
- 快速操作入口

**访问地址**: `http://localhost:3000/analytics`

---

## 🎯 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 访问应用

- **前端**: http://localhost:3000
- **数据分析**: http://localhost:3000/analytics
- **阅读列表**: http://localhost:3000/reading-list

---

## 💡 使用示例

### 完整的博客详情页示例

```tsx
import { ArticleContent } from '@/components/blog/ArticleContent';
import { CommentSystem } from '@/components/blog/CommentSystem';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { ShareButton } from '@/components/social/ShareButton';
import { LikeButton } from '@/components/social/LikeButton';
import { BookmarkButton } from '@/components/social/BookmarkButton';
import { blogService } from '@/lib/services';

export default async function BlogPostPage({ params }) {
  const post = await blogService.getPost(params.slug);
  const relatedPosts = await blogService.getRelatedPosts(post.id);

  return (
    <article>
      <h1>{post.title}</h1>
      
      {/* 文章内容 */}
      <ArticleContent content={post.content} />
      
      {/* 社交按钮 */}
      <div className="flex gap-3 my-6">
        <LikeButton postId={post.id} />
        <BookmarkButton postId={post.id} />
        <ShareButton title={post.title} />
      </div>
      
      {/* 相关文章 */}
      <RelatedPosts posts={relatedPosts} currentPostId={post.id} />
      
      {/* 评论区 */}
      <CommentSystem postId={post.id} />
    </article>
  );
}
```

### 搜索页面示例

```tsx
import { SearchInput } from '@/components/search/SearchInput';
import { blogService } from '@/lib/services';

export default function SearchPage() {
  const [results, setResults] = useState([]);

  const handleSearch = async (query: string) => {
    const data = await blogService.searchPosts(query);
    setResults(data.posts);
  };

  return (
    <div>
      <SearchInput onSearch={handleSearch} />
      {/* 显示搜索结果 */}
    </div>
  );
}
```

---

## 🔑 认证集成示例

```tsx
'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/lib/services';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查是否已登录
    if (authService.isAuthenticated()) {
      const currentUser = authService.getUser();
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const auth = await authService.login({ email, password });
    setUser(auth.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## 🎨 自定义样式

所有组件都使用 Tailwind CSS 构建，遵循赛博朋克设计系统：

### 颜色变量

```css
--cyber-dark: #0a0a0f      /* 深空黑 */
--cyber-cyan: #00f0ff      /* 霓虹青 */
--cyber-purple: #9d00ff    /* 赛博紫 */
--cyber-pink: #ff0080      /* 激光粉 */
--cyber-green: #00ff88     /* 赛博绿 */
--cyber-yellow: #f0ff00    /* 电压黄 */
```

### 工具类

```tsx
// 霓虹发光效果
className="neon-glow"

// 赛博朋克卡片
className="cyber-card"

// 渐变背景
className="bg-gradient-to-r from-cyber-cyan to-cyber-purple"
```

---

## 📚 更多文档

- [项目概述](./PROJECT_OVERVIEW.md)
- [开发任务](./DEVELOPMENT_TASKS.md)
- [API 文档](./API_DOCUMENTATION.md)
- [组件使用指南](./COMPONENT_USAGE_GUIDE.md)

---

## 🐛 故障排除

### 问题：API 请求失败

**解决方案**:
1. 检查后端服务是否运行
2. 验证 `NEXT_PUBLIC_API_URL` 环境变量
3. 查看浏览器控制台的网络请求

### 问题：认证不生效

**解决方案**:
1. 清除浏览器 localStorage
2. 检查令牌是否正确存储
3. 验证 API 响应中的 token 字段

### 问题：组件样式不正确

**解决方案**:
1. 确保安装了所有依赖
2. 检查 Tailwind CSS 配置
3. 验证颜色变量是否定义

---

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

---

**最后更新**: 2026-03-06  
**维护者**: AI Development Team
