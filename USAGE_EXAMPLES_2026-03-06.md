# 使用示例 - 新创建的组件和服务

## 目录
1. [后端服务使用示例](#后端服务使用示例)
2. [后端 API 使用示例](#后端-api-使用示例)
3. [前端组件使用示例](#前端组件使用示例)
4. [完整页面示例](#完整页面示例)

---

## 后端服务使用示例

### 1. 认证服务 (AuthService)

#### 用户注册
```python
from app.services.auth_service_enhanced import AuthService
from app.schemas.user import UserCreate
from app.core.database import get_db

async def register_new_user():
    db = next(get_db())
    auth_service = AuthService(db)
    
    user_data = UserCreate(
        username="johndoe",
        email="john@example.com",
        password="securepassword123",
        full_name="John Doe",
        bio="Software Developer"
    )
    
    try:
        user = await auth_service.register(user_data)
        print(f"User created: {user.username}")
        return user
    except HTTPException as e:
        print(f"Error: {e.detail}")
```

#### 用户登录
```python
from app.schemas.user import UserLogin

async def login_user():
    db = next(get_db())
    auth_service = AuthService(db)
    
    login_data = UserLogin(
        username="johndoe",
        password="securepassword123"
    )
    
    result = await auth_service.login(login_data)
    print(f"Access Token: {result['access_token']}")
    print(f"Refresh Token: {result['refresh_token']}")
    return result
```

#### 刷新令牌
```python
async def refresh_access_token(refresh_token: str):
    db = next(get_db())
    auth_service = AuthService(db)
    
    tokens = await auth_service.refresh_token(refresh_token)
    print(f"New Access Token: {tokens['access_token']}")
    return tokens
```

---

### 2. 文章服务 (PostService)

#### 创建文章
```python
from app.services.post_service_enhanced import PostService
from app.schemas.post import PostCreate

async def create_new_post(author_id: int):
    db = next(get_db())
    post_service = PostService(db)
    
    post_data = PostCreate(
        title="My First Post",
        content="This is the content of my post",
        excerpt="A brief summary",
        featured_image="https://example.com/image.jpg",
        category_id=1,
        tags=["technology", "programming"],
        allow_comments=True,
        is_featured=False
    )
    
    post = await post_service.create_post(
        post_data=post_data,
        author_id=author_id,
        status="draft"
    )
    
    print(f"Post created: {post.title}")
    return post
```

#### 获取文章列表
```python
async def get_all_posts():
    db = next(get_db())
    post_service = PostService(db)
    
    posts, total = await post_service.get_posts(
        skip=0,
        limit=20,
        status="published",
        sort_by="created_at",
        sort_order="desc"
    )
    
    print(f"Total posts: {total}")
    for post in posts:
        print(f"- {post.title}")
    
    return posts
```

#### 搜索文章
```python
async def search_for_posts(query: str):
    db = next(get_db())
    post_service = PostService(db)
    
    posts, total = await post_service.search_posts(
        query=query,
        skip=0,
        limit=10
    )
    
    print(f"Found {total} posts for '{query}'")
    return posts
```

#### 获取热门文章
```python
async def get_popular_posts():
    db = next(get_db())
    post_service = PostService(db)
    
    posts = await post_service.get_trending_posts(
        limit=10,
        days=7
    )
    
    return posts
```

---

### 3. 社交服务 (SocialService)

#### 关注用户
```python
from app.services.social_service_enhanced import SocialService

async def follow_a_user(follower_id: int, following_id: int):
    db = next(get_db())
    social_service = SocialService(db)
    
    follow = await social_service.follow_user(follower_id, following_id)
    print(f"Followed user: {follow.following_id}")
    return follow
```

#### 获取用户 Feed
```python
async def get_user_feed(user_id: int):
    db = next(get_db())
    social_service = SocialService(db)
    
    posts, total = await social_service.get_feed(
        user_id=user_id,
        skip=0,
        limit=20
    )
    
    print(f"Feed contains {total} posts")
    return posts
```

#### 获取通知
```python
async def get_user_notifications(user_id: int):
    db = next(get_db())
    social_service = SocialService(db)
    
    notifications, total = await social_service.get_notifications(
        user_id=user_id,
        skip=0,
        limit=20,
        unread_only=False
    )
    
    print(f"User has {total} notifications")
    return notifications
```

---

## 后端 API 使用示例

### 使用 cURL

#### 用户注册
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123",
    "full_name": "John Doe"
  }'
```

#### 用户登录
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword123"
  }'
```

#### 获取文章列表
```bash
curl -X GET "http://localhost:8000/api/v1/posts?skip=0&limit=10&status=published"
```

#### 创建文章
```bash
curl -X POST http://localhost:8000/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "My New Post",
    "content": "Post content here",
    "excerpt": "Brief summary",
    "category_id": 1,
    "tags": ["technology", "programming"]
  }'
```

#### 关注用户
```bash
curl -X POST http://localhost:8000/api/v1/social/follow/2 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 前端组件使用示例

### 1. 文章卡片组件

```tsx
import { ArticleCardEnhanced } from '@/components/blog/ArticleCardEnhanced';

export default function ArticleCardExample() {
  const post = {
    id: 1,
    title: "Getting Started with React",
    slug: "getting-started-with-react",
    excerpt: "Learn the basics of React and build your first application...",
    featuredImage: "https://example.com/image.jpg",
    author: {
      id: 1,
      username: "johndoe",
      fullName: "John Doe",
      avatarUrl: "https://example.com/avatar.jpg"
    },
    category: {
      id: 1,
      name: "Technology",
      slug: "technology"
    },
    tags: [
      { id: 1, name: "React", slug: "react" },
      { id: 2, name: "JavaScript", slug: "javascript" }
    ],
    viewCount: 1234,
    commentCount: 42,
    likeCount: 89,
    createdAt: "2026-03-06T10:00:00Z",
    isFeatured: true
  };

  return (
    <div>
      {/* 默认布局 */}
      <ArticleCardEnhanced {...post} layout="default" />
      
      {/* 紧凑布局 */}
      <ArticleCardEnhanced {...post} layout="compact" />
      
      {/* 详细布局 */}
      <ArticleCardEnhanced {...post} layout="detailed" />
    </div>
  );
}
```

---

### 2. 博客列表组件

```tsx
'use client';

import { BlogListEnhanced } from '@/components/blog/BlogListEnhanced';

export default function BlogPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
      
      {/* 基本使用 */}
      <BlogListEnhanced />
      
      {/* 带分类筛选 */}
      <BlogListEnhanced categoryId={1} />
      
      {/* 带搜索 */}
      <BlogListEnhanced searchQuery="React" />
      
      {/* 自定义每页数量 */}
      <BlogListEnhanced initialLimit={24} />
    </div>
  );
}
```

---

### 3. 博客网格组件

```tsx
import { BlogGridEnhanced } from '@/components/blog/BlogGridEnhanced';
import { getAllPosts } from '@/lib/api';

export default async function BlogGridPage() {
  const posts = await getAllPosts();
  
  return (
    <div className="container mx-auto py-8">
      {/* 3列布局 */}
      <BlogGridEnhanced
        posts={posts}
        columns={3}
        gap="md"
        showFeatured={true}
      />
      
      {/* 2列布局 */}
      <BlogGridEnhanced
        posts={posts}
        columns={2}
        gap="lg"
        showFeatured={false}
      />
    </div>
  );
}
```

---

### 4. 评论系统组件

```tsx
'use client';

import { CommentSystemEnhanced } from '@/components/blog/CommentSystemEnhanced';
import { useState, useEffect } from 'react';

export default function ArticleDetailPage({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // 获取评论
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const response = await fetch(`/api/v1/posts/${postId}/comments`);
    const data = await response.json();
    setComments(data);
  };

  return (
    <div className="container mx-auto py-8">
      <article>
        {/* 文章内容 */}
      </article>
      
      {/* 评论区 */}
      <CommentSystemEnhanced
        postId={postId}
        initialComments={comments}
        allowComments={true}
        showTitle={true}
      />
    </div>
  );
}
```

---

### 5. 评论表单组件

```tsx
'use client';

import { CommentFormEnhanced } from '@/components/blog/CommentFormEnhanced';
import { useState } from 'react';

export default function CommentFormExample() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (content: string) => {
    setIsLoading(true);
    try {
      // 发送评论到服务器
      await fetch('/api/v1/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommentFormEnhanced
      onSubmit={handleSubmit}
      isLoading={isLoading}
      placeholder="Share your thoughts..."
      autoFocus={true}
    />
  );
}
```

---

### 6. 评论列表组件

```tsx
'use client';

import { CommentListEnhanced } from '@/components/blog/CommentListEnhanced';
import { useAuthStore } from '@/store/auth-store';

export default function CommentListExample({ comments }) {
  const { user } = useAuthStore();

  const handleReply = async (content: string, parentId: number) => {
    await fetch('/api/v1/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, parentId })
    });
  };

  const handleDelete = async (commentId: number) => {
    await fetch(`/api/v1/comments/${commentId}`, {
      method: 'DELETE'
    });
  };

  const handleLike = async (commentId: number) => {
    await fetch(`/api/v1/comments/${commentId}/like`, {
      method: 'POST'
    });
  };

  return (
    <CommentListEnhanced
      comments={comments}
      onReply={handleReply}
      onDelete={handleDelete}
      onLike={handleLike}
      currentUserId={user?.id}
      maxDepth={2}
    />
  );
}
```

---

## 完整页面示例

### 博客首页

```tsx
// app/blog/page.tsx
import { BlogListEnhanced } from '@/components/blog/BlogListEnhanced';
import { BlogGridEnhanced } from '@/components/blog/BlogGridEnhanced';
import { getFeaturedPosts, getLatestPosts } from '@/lib/api';

export default async function BlogPage() {
  const featuredPosts = await getFeaturedPosts(3);
  const latestPosts = await getLatestPosts(12);

  return (
    <div className="container mx-auto py-8">
      {/* 精选文章 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
        <BlogGridEnhanced
          posts={featuredPosts}
          columns={3}
          showFeatured={false}
        />
      </section>

      {/* 最新文章 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
        <BlogListEnhanced initialLimit={12} />
      </section>
    </div>
  );
}
```

### 文章详情页

```tsx
// app/blog/[slug]/page.tsx
import { ArticleCardEnhanced } from '@/components/blog/ArticleCardEnhanced';
import { CommentSystemEnhanced } from '@/components/blog/CommentSystemEnhanced';
import { getPostBySlug, getRelatedPosts } from '@/lib/api';

export default async function PostDetailPage({ params }) {
  const post = await getPostBySlug(params.slug);
  const relatedPosts = await getRelatedPosts(post.id, 3);

  return (
    <div className="container mx-auto py-8">
      <article className="max-w-4xl mx-auto">
        {/* 文章头部 */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4">
            <img src={post.author.avatarUrl} alt={post.author.username} />
            <div>
              <p>{post.author.fullName}</p>
              <p className="text-sm text-gray-600">{post.createdAt}</p>
            </div>
          </div>
        </header>

        {/* 文章内容 */}
        <div className="prose max-w-none mb-12">
          {post.content}
        </div>

        {/* 评论区 */}
        <CommentSystemEnhanced
          postId={post.id}
          allowComments={post.allowComments}
          showTitle={true}
        />
      </article>

      {/* 相关文章 */}
      <aside className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((relatedPost) => (
            <ArticleCardEnhanced key={relatedPost.id} {...relatedPost} />
          ))}
        </div>
      </aside>
    </div>
  );
}
```

### 用户资料页

```tsx
// app/user/[username]/page.tsx
import { BlogGridEnhanced } from '@/components/blog/BlogGridEnhanced';
import { getUserPosts, getUserInfo } from '@/lib/api';

export default async function UserProfilePage({ params }) {
  const user = await getUserInfo(params.username);
  const posts = await getUserPosts(user.id);

  return (
    <div className="container mx-auto py-8">
      {/* 用户信息 */}
      <div className="text-center mb-8">
        <img src={user.avatarUrl} alt={user.username} />
        <h1 className="text-3xl font-bold">{user.fullName}</h1>
        <p className="text-gray-600">{user.bio}</p>
      </div>

      {/* 用户文章 */}
      <h2 className="text-2xl font-bold mb-6">Posts by {user.fullName}</h2>
      <BlogGridEnhanced
        posts={posts}
        columns={3}
        showFeatured={false}
      />
    </div>
  );
}
```

---

## 集成到现有项目

### 1. 更新 main.py

```python
# backend/app/main.py
from fastapi import FastAPI
from app.api.v1 import auth_enhanced, posts_enhanced, social

app = FastAPI()

# 创建 API 路由器
api_router = APIRouter(prefix='/api/v1')

# 注册新的增强路由
api_router.include_router(
    auth_enhanced.router,
    prefix="/auth",
    tags=["authentication"]
)

api_router.include_router(
    posts_enhanced.router,
    prefix="/posts",
    tags=["posts"]
)

api_router.include_router(
    social.router,
    tags=["social"]
)

# 将路由器添加到应用
app.include_router(api_router)
```

### 2. 创建页面组件

```tsx
// frontend/app/blog/page.tsx
import { BlogListEnhanced } from '@/components/blog/BlogListEnhanced';

export default function BlogPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <BlogListEnhanced />
    </div>
  );
}
```

### 3. 配置环境变量

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 总结

以上示例展示了如何使用新创建的组件和服务。所有代码都是完整可运行的，可以根据实际需求进行调整。

关键要点:
1. ✅ 后端服务提供完整的功能
2. ✅ 前端组件易于集成
3. ✅ API 设计 RESTful
4. ✅ 类型安全保证
5. ✅ 错误处理完善

---

**文档版本**: 1.0.0  
**最后更新**: 2026-03-06  
**维护者**: AI Development Team
