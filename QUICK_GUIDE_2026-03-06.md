# 🚀 新功能快速使用指南

**更新日期**: 2026-03-06
**会话**: 核心Hooks和UI组件创建

---

## 📦 本次新增内容

### 1. Hooks (自定义钩子)

#### `use-comments.ts` - 评论系统Hook
完整的评论功能管理,包括列表查询、创建、删除、点赞等。

#### `use-social.ts` - 社交功能Hook
关注、点赞、收藏、分享等社交功能。

#### `use-auth.ts` - 认证系统Hook
用户登录、注册、权限管理等功能。

### 2. UI组件

#### `Skeleton.tsx` - 骨架屏组件
- 文章卡片骨架屏
- 博客列表骨架屏
- 评论骨架屏
- 侧边栏骨架屏
- 空状态组件

#### `ErrorBoundary.tsx` - 错误边界组件
- React错误边界
- 自定义错误UI
- 错误重置功能

---

## 🎯 快速开始

### 1. 评论功能

```tsx
import { useComments, useCreateComment } from '@/hooks/use-comments';

function CommentSection({ postId }) {
  // 获取评论列表
  const { data: comments, isLoading } = useComments(postId);

  // 创建评论
  const { mutate: createComment } = useCreateComment(postId);

  const handleSubmit = (content: string) => {
    createComment({
      content,
      author_name: '张三',
      author_email: 'zhangsan@example.com'
    });
  };

  if (isLoading) return <CommentSkeleton />;

  return (
    <div>
      {comments?.items.map(comment => (
        <Comment key={comment.id} {...comment} />
      ))}
      <CommentForm onSubmit={handleSubmit} />
    </div>
  );
}
```

### 2. 社交功能

```tsx
import { useFollowUser, useLike, useBookmark, useShare } from '@/hooks/use-social';

function SocialButtons({ userId, postId }) {
  // 关注功能
  const { isFollowing, toggleFollow } = useFollowUser(userId);

  // 点赞功能
  const { isLiked, likeCount, toggleLike } = useLike(postId);

  // 收藏功能
  const { isBookmarked, toggleBookmark } = useBookmark(postId);

  // 分享功能
  const { shareToSocialMedia, copyLink } = useShare(postId);

  return (
    <div className="flex gap-4">
      <button onClick={toggleFollow}>
        {isFollowing ? '取消关注' : '关注'}
      </button>

      <button onClick={toggleLike}>
        {isLiked ? '❤️' : '🤍'} {likeCount}
      </button>

      <button onClick={toggleBookmark}>
        {isBookmarked ? '⭐' : '☆'} 收藏
      </button>

      <button onClick={() => shareToSocialMedia('twitter', url, title)}>
        分享到Twitter
      </button>

      <button onClick={() => copyLink(url)}>
        复制链接
      </button>
    </div>
  );
}
```

### 3. 认证功能

```tsx
import { useAuth } from '@/hooks/use-auth';

function LoginForm() {
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      await login(
        formData.get('email') as string,
        formData.get('password') as string
      );
      // 登录成功,跳转首页
      router.push('/');
    } catch (err) {
      // 错误已在useAuth中处理
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      {error && <div className="error">{error}</div>}
      <button disabled={isLoading}>
        {isLoading ? '登录中...' : '登录'}
      </button>
    </form>
  );
}
```

### 4. 骨架屏加载

```tsx
import { ArticleCardSkeleton, CommentSkeleton } from '@/components/ui/loading/Skeleton';

function ArticleList() {
  const { data: articles, isLoading } = usePosts();

  if (isLoading) {
    return <ArticleCardSkeleton count={6} />;
  }

  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} {...article} />
      ))}
    </div>
  );
}
```

### 5. 错误边界

```tsx
import { ErrorBoundary } from '@/components/ui/error/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('应用错误:', error, errorInfo);
        // 发送错误到监控服务
      }}
    >
      <YourApp />
    </ErrorBoundary>
  );
}
```

---

## 📚 完整示例

### 带评论的文章详情页

```tsx
'use client';

import { usePostBySlug } from '@/hooks/use-posts';
import { useComments, useCreateComment } from '@/hooks/use-comments';
import { useLike, useBookmark } from '@/hooks/use-social';
import { ArticleDetailSkeleton } from '@/components/ui/loading/Skeleton';
import { ErrorBoundary } from '@/components/ui/error/ErrorBoundary';

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  return (
    <ErrorBoundary>
      <ArticleContent slug={params.slug} />
    </ErrorBoundary>
  );
}

function ArticleContent({ slug }: { slug: string }) {
  // 获取文章详情
  const { data: post, isLoading: postLoading } = usePostBySlug(slug);

  // 获取评论
  const { data: comments, isLoading: commentsLoading } = useComments(post?.id);

  // 创建评论
  const { mutate: createComment } = useCreateComment(post?.id);

  // 点赞和收藏
  const { isLiked, likeCount, toggleLike } = useLike(post?.id);
  const { isBookmarked, toggleBookmark } = useBookmark(post?.id);

  if (postLoading) return <ArticleDetailSkeleton />;

  if (!post) return <div>文章未找到</div>;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* 文章头部 */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-cyber-cyan mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 mb-4">
          <img
            src={post.author.avatar_url}
            alt={post.author.full_name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <div className="font-semibold">{post.author.full_name}</div>
            <div className="text-sm text-cyber-muted">
              {formatDate(post.published_at)}
            </div>
          </div>
        </div>

        {/* 社交按钮 */}
        <div className="flex gap-4">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 ${isLiked ? 'text-cyber-pink' : ''}`}
          >
            <span>{isLiked ? '❤️' : '🤍'}</span>
            <span>{likeCount}</span>
          </button>

          <button
            onClick={toggleBookmark}
            className={isBookmarked ? 'text-cyber-yellow' : ''}
          >
            {isBookmarked ? '⭐' : '☆'} 收藏
          </button>
        </div>
      </header>

      {/* 特色图片 */}
      {post.featured_image && (
        <img
          src={post.featured_image}
          alt={post.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
      )}

      {/* 文章内容 */}
      <div
        className="prose prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 文章元数据 */}
      <div className="flex items-center gap-4 mb-8 text-sm text-cyber-muted">
        <span>👁️ {post.view_count} 浏览</span>
        <span>⏱️ {post.reading_time} 分钟阅读</span>
        <span>💬 {post.comment_count} 评论</span>
      </div>

      {/* 标签 */}
      <div className="flex gap-2 mb-12">
        {post.tags.map(tag => (
          <span
            key={tag.id}
            className="px-3 py-1 bg-cyber-cyan/10 text-cyber-cyan rounded-full text-sm"
          >
            #{tag.name}
          </span>
        ))}
      </div>

      {/* 评论区 */}
      <section className="border-t border-cyber-cyan/20 pt-8">
        <h2 className="text-2xl font-bold text-cyber-cyan mb-6">
          评论 ({comments?.total || 0})
        </h2>

        {commentsLoading ? (
          <CommentSkeleton count={5} />
        ) : (
          <>
            {/* 评论列表 */}
            <div className="space-y-6 mb-8">
              {comments?.items.map(comment => (
                <Comment key={comment.id} {...comment} />
              ))}
            </div>

            {/* 评论表单 */}
            <CommentForm
              onSubmit={(data) => createComment(data)}
              postId={post.id}
            />
          </>
        )}
      </section>
    </article>
  );
}
```

---

## 🎨 使用技巧

### 1. 组合多个Hook

```tsx
function useArticleInteractions(postId: number) {
  const like = useLike(postId);
  const bookmark = useBookmark(postId);
  const { shareToSocialMedia } = useShare(postId);

  return {
    ...like,
    ...bookmark,
    shareToSocialMedia,
  };
}
```

### 2. 错误处理

```tsx
const { data, isLoading, error } = useComments(postId);

if (error) {
  return (
    <EmptyState
      title="加载失败"
      description={error.message}
      action={
        <button onClick={() => window.location.reload()}>
          重试
        </button>
      }
    />
  );
}
```

### 3. 加载状态优化

```tsx
// 使用骨架屏
{isLoading && <ArticleCardSkeleton />}

// 显示加载文本
{isLoading && <LoadingPlaceholder text="加载中..." />}

// 组合使用
{isLoading ? (
  <ArticleCardSkeleton />
) : data?.length === 0 ? (
  <EmptyState title="暂无数据" />
) : (
  <ArticleList data={data} />
)}
```

---

## 🔧 配置要求

### 环境变量

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 依赖包

确保已安装以下依赖:

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.0.0",
    "framer-motion": "^11.0.0",
    "zustand": "^4.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

---

## 📞 获取帮助

- 查看完整文档: `/SESSION_CREATION_REPORT_2026-03-06.md`
- 检查文件: `./verify-session-files-20260306.sh`
- 项目README: `/README.md`

---

**祝您使用愉快! 🎉**
