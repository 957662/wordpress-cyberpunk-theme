# 新组件快速使用指南

本文档提供刚刚创建的新组件的快速使用方法和集成指南。

---

## 📦 目录

1. [代码高亮组件](#代码高亮组件-codeblock)
2. [评论系统](#评论系统-commentsystem)
3. [性能优化 Hooks](#性能优化-hooks)
4. [集成示例](#集成示例)

---

## 🎨 代码高亮组件 (CodeBlock)

### 导入

```tsx
import { CodeBlock, InlineCode, PreCode } from '@/components/code-highlight';
```

### 基础用法

```tsx
// 简单代码块
<CodeBlock
  code={`const greeting = "Hello, World!";\nconsole.log(greeting);`}
  language="javascript"
/>

// 带标题和复制按钮
<CodeBlock
  code={`
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
  `}
  language="javascript"
  title="fibonacci.js"
  showCopyButton={true}
  lineNumbers={true}
/>

// 不同的主题
<CodeBlock
  code={`print("Hello, Python!")`}
  language="python"
  theme="atom" // 'dark' | 'atom' | 'tomorrow'
/>
```

### 行内代码

```tsx
<p>
  安装依赖使用命令: <InlineCode>npm install</InlineCode>
</p>
```

### 预格式化代码

```tsx
<PreCode>
  {`Some pre-formatted code
   that preserves whitespace
   and formatting`}
</PreCode>
```

### Props

| Prop | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| code | string | **必填** | 代码内容 |
| language | string | 'javascript' | 编程语言 |
| title | string | - | 代码块标题 |
| lineNumbers | boolean | true | 是否显示行号 |
| theme | 'dark' \| 'atom' \| 'tomorrow' | 'dark' | 主题 |
| showCopyButton | boolean | true | 显示复制按钮 |
| maxHeight | string | '600px' | 最大高度 |

### 支持的语言

```javascript
javascript, typescript, python, java, c, cpp, csharp, go,
rust, php, ruby, swift, kotlin, scala, html, css, scss,
sql, json, xml, yaml, markdown, bash, shell, powershell
```

---

## 💬 评论系统 (CommentSystem)

### 导入

```tsx
import { CommentSystem } from '@/components/comment';
```

### 基础用法

```tsx
// 基础评论系统
<CommentSystem
  postId="post-123"
  initialComments={comments}
/>

// 带用户信息的完整评论系统
<CommentSystem
  postId="post-123"
  initialComments={comments}
  currentUser={{
    id: 'user-123',
    name: '张三',
    avatar: '/avatars/zhangsan.jpg'
  }}
  allowReplies={true}
  allowLikes={true}
  onCommentSubmit={handleSubmit}
  onCommentDelete={handleDelete}
  onCommentLike={handleLike}
/>
```

### 数据结构

```typescript
// 评论数据结构
interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string; // ISO date string
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
  parentId?: string;
}

// 用户数据结构
interface User {
  id: string;
  name: string;
  avatar?: string;
}
```

### 回调函数

```typescript
// 提交评论
const handleSubmit = async (content: string, parentId?: string) => {
  await fetch('/api/comments', {
    method: 'POST',
    body: JSON.stringify({
      post_id: postId,
      content,
      parent_id: parentId
    })
  });
};

// 删除评论
const handleDelete = async (commentId: string) => {
  await fetch(`/api/comments/${commentId}`, {
    method: 'DELETE'
  });
};

// 点赞评论
const handleLike = async (commentId: string) => {
  await fetch(`/api/comments/${commentId}/like`, {
    method: 'POST'
  });
};
```

### Props

| Prop | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| postId | string | **必填** | 文章 ID |
| initialComments | Comment[] | [] | 初始评论列表 |
| currentUser | User | - | 当前登录用户 |
| allowReplies | boolean | true | 是否允许回复 |
| allowLikes | boolean | true | 是否允许点赞 |
| onCommentSubmit | function | - | 提交评论回调 |
| onCommentDelete | function | - | 删除评论回调 |
| onCommentLike | function | - | 点赞评论回调 |

---

## ⚡ 性能优化 Hooks

### 导入

```tsx
import {
  useImageOptimization,
  useDebounce,
  useDebouncedCallback,
  useThrottle,
  useThrottledCallback,
  useIntersectionObserver,
  useLazyLoad
} from '@/hooks/performance';
```

### 图片优化 (useImageOptimization)

```tsx
function ImageComponent() {
  const { isLoaded, isError, src, imgRef } = useImageOptimization(
    '/images/large-image.jpg',
    {
      threshold: 0.1,        // 10% 可见时加载
      rootMargin: '50px',    // 提前 50px 开始加载
      enabled: true,         // 是否启用懒加载
    }
  );

  return (
    <img
      ref={imgRef}
      src={src}
      alt="Optimized Image"
      className={isLoaded ? 'loaded' : 'loading'}
    />
  );
}
```

### 防抖 (useDebounce)

```tsx
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500); // 500ms 延迟

  useEffect(() => {
    // 只有在停止输入 500ms 后才会执行
    if (debouncedSearch) {
      performSearch(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="搜索..."
    />
  );
}
```

### 防抖回调 (useDebouncedCallback)

```tsx
const handleChange = useDebouncedCallback((value: string) => {
  // 这个函数会在停止输入 500ms 后执行
  saveToServer(value);
}, 500);

<input onChange={(e) => handleChange(e.target.value)} />
```

### 节流 (useThrottle)

```tsx
function ScrollComponent() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 100); // 每 100ms 最多更新一次

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div>Scroll Position: {throttledScrollY}</div>;
}
```

### 交叉观察器 (useIntersectionObserver)

```tsx
function FadeInComponent() {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,  // 50% 可见时触发
    triggerOnce: true, // 只触发一次
  });

  return (
    <div
      ref={ref}
      className={isIntersecting ? 'visible' : 'hidden'}
    >
      {isIntersecting && <Content />}
    </div>
  );
}
```

### 懒加载 (useLazyLoad)

```tsx
function HeavyComponent() {
  const { ref, isVisible } = useLazyLoad({
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      {isVisible ? (
        <ExpensiveComponent />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
```

---

## 🔗 集成示例

### 博客详情页完整示例

```tsx
// app/blog/[slug]/page.tsx
import { CodeBlock } from '@/components/code-highlight';
import { CommentSystem } from '@/components/comment';
import { RelatedPosts } from '@/components/related-posts';
import { useDebounce } from '@/hooks/performance';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  // 加载文章数据
  useEffect(() => {
    fetchPost(params.slug).then(setPost);
    fetchComments(params.slug).then(setComments);
  }, [params.slug]);

  if (!post) return <Loading />;

  return (
    <article className="blog-post">
      {/* 文章标题 */}
      <h1>{post.title}</h1>

      {/* 文章元信息 */}
      <div className="meta">
        <span>{post.author}</span>
        <span>{post.date}</span>
        <span>{post.readTime} min read</span>
      </div>

      {/* 文章内容 */}
      <div className="content">
        {post.sections.map((section, index) => (
          <section key={index}>
            <h2 id={section.id}>{section.title}</h2>

            {/* 如果包含代码，使用 CodeBlock */}
            {section.code && (
              <CodeBlock
                code={section.code}
                language={section.language}
                title={section.filename}
                showCopyButton={true}
              />
            )}

            <p>{section.content}</p>
          </section>
        ))}
      </div>

      {/* 相关文章推荐 */}
      <div className="related-posts mt-12">
        <RelatedPosts
          currentPostId={post.id}
          posts={allPosts}
          limit={4}
          variant="grid"
          strategy="tags"
        />
      </div>

      {/* 评论区 */}
      <div className="comments mt-12">
        <CommentSystem
          postId={post.id}
          initialComments={comments}
          currentUser={currentUser}
          allowReplies={true}
          allowLikes={true}
          onCommentSubmit={handleCommentSubmit}
          onCommentDelete={handleCommentDelete}
          onCommentLike={handleCommentLike}
        />
      </div>
    </article>
  );
}
```

### 搜索页面示例

```tsx
// app/search/page.tsx
'use client';

import { useDebounce } from '@/hooks/performance';
import { useState, useEffect } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 防抖搜索
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      setIsSearching(true);
      searchPosts(debouncedQuery)
        .then(setResults)
        .finally(() => setIsSearching(false));
    }
  }, [debouncedQuery]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索文章..."
        className="search-input"
      />

      {isSearching && <div>搜索中...</div>}

      <ul>
        {results.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🎯 最佳实践

### 1. 代码高亮

- ✅ **始终指定正确的语言** 以获得最佳语法高亮
- ✅ **添加有意义的标题** 帮助用户理解代码用途
- ✅ **启用复制按钮** 提升用户体验
- ❌ **避免过大的代码块** 考虑拆分或使用折叠

### 2. 评论系统

- ✅ **验证用户输入** 防止 XSS 和垃圾评论
- ✅ **实现分页加载** 大量评论时优化性能
- ✅ **提供实时反馈** 显示提交状态
- ❌ **不要在客户端存储敏感数据** 始终通过 API 验证

### 3. 性能优化

- ✅ **图片懒加载** 减少初始加载时间
- ✅ **搜索防抖** 减少 API 请求
- ✅ **滚动节流** 优化性能
- ❌ **避免过度优化** 只在需要时使用

---

## 🐛 常见问题

### Q: 代码高亮不工作？

**A**: 确保安装了依赖：
```bash
npm install react-syntax-highlighter
npm install --save-dev @types/react-syntax-highlighter
```

### Q: 评论提交失败？

**A**: 检查：
1. 后端 API 是否正确配置
2. 用户是否已登录
3. 是否启用了 CSRF 保护

### Q: 图片懒加载不生效？

**A**: 确保浏览器支持 IntersectionObserver，或添加 polyfill：
```bash
npm install intersection-observer
```

---

## 📚 更多资源

- [完整 API 文档](./API_DOCUMENTATION.md)
- [组件开发指南](./DEVELOPMENT_GUIDE.md)
- [性能优化指南](./PERFORMANCE_GUIDE.md)

---

**更新时间**: 2026-03-07
**版本**: 1.0.0
