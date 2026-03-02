# 🎉 新组件使用指南

## 📦 已创建的文件列表

本次更新创建了以下完整功能的文件，移除了所有 TODO 占位符：

### 1. WordPress API 客户端
**文件**: `frontend/lib/wordpress/api-client.ts`
**大小**: ~800 行
**功能**:
- 完整的 WordPress REST API 封装
- 支持文章、分类、标签、评论、媒体、用户
- 自动缓存机制（5分钟）
- 请求超时控制（默认10秒）
- JWT 认证支持

**使用示例**:
```typescript
import { getWordPressClient } from '@/lib/wordpress';

const client = getWordPressClient();

// 获取文章列表
const posts = await client.getPosts({
  page: 1,
  per_page: 10,
  categories: [1, 2],
});

// 获取单篇文章
const post = await client.getPost(123);

// 创建评论
const comment = await client.createComment({
  post: 123,
  author_name: '张三',
  author_email: 'zhang@example.com',
  content: '很好的文章！',
});
```

---

### 2. WordPress React Hooks
**文件**: `frontend/lib/wordpress/hooks.ts`
**大小**: ~600 行
**功能**:
- 便捷的 React Hooks
- 自动数据获取和缓存
- 加载状态和错误处理
- 支持分页、搜索、评论等

**使用示例**:
```typescript
import {
  usePosts,
  usePostBySlug,
  useComments,
  useSubmitComment,
} from '@/lib/wordpress';

function BlogPage() {
  const { data: posts, loading, error } = usePosts({
    per_page: 10,
    orderby: 'date',
  });

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div>
      {posts?.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

---

### 3. 增强版搜索组件
**文件**: `frontend/components/ui/SearchBarAdvanced.tsx`
**大小**: ~400 行
**功能**:
- 实时搜索建议
- 搜索历史记录
- 热门搜索关键词
- 键盘导航支持
- 防抖优化（500ms）

**使用示例**:
```typescript
import { SearchBarAdvanced } from '@/components/ui';

function Header() {
  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <SearchBarAdvanced
      placeholder="搜索文章、标签..."
      onSearch={handleSearch}
      showSuggestions
      showRecentSearches
      showTrending
    />
  );
}
```

---

### 4. 评论表单组件
**文件**: `frontend/components/blog/CommentForm.tsx`
**大小**: ~250 行
**功能**:
- 完整的评论提交功能
- 表单验证（姓名、邮箱、内容）
- 错误提示
- 加载状态
- 成功后自动清空

**使用示例**:
```typescript
import { CommentForm } from '@/components/blog';

function BlogPost({ postId }) {
  const handleSuccess = () => {
    // 刷新评论列表
    refetchComments();
  };

  return (
    <CommentForm
      postId={postId}
      onSuccess={handleSuccess}
    />
  );
}
```

---

### 5. 评论列表组件
**文件**: `frontend/components/blog/CommentList.tsx`
**大小**: ~350 行
**功能**:
- 树形评论展示
- 支持回复嵌套（最大3层）
- 相对时间显示（"刚刚"、"5分钟前"）
- 点赞和举报功能
- 回复表单

**使用示例**:
```typescript
import { CommentList, CommentForm } from '@/components/blog';

function CommentSection({ postId }) {
  return (
    <div>
      {/* 评论表单 */}
      <CommentForm postId={postId} />

      {/* 评论列表 */}
      <CommentList postId={postId} />
    </div>
  );
}
```

---

### 6. 认证提供者
**文件**: `frontend/components/auth/AuthProvider.tsx`
**大小**: ~200 行
**功能**:
- 用户登录状态管理
- JWT Token 存储
- 权限检查
- 自动登录

**使用示例**:
```typescript
// 在 layout.tsx 中包裹应用
import { AuthProvider } from '@/components/auth';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

// 在组件中使用
import { useAuth } from '@/components/auth';

function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>请先登录</div>;
  }

  return (
    <div>
      <h1>欢迎, {user?.name}</h1>
      <button onClick={logout}>退出登录</button>
    </div>
  );
}
```

---

### 7. 增强版登录表单
**文件**: `frontend/components/auth/LoginFormAdvanced.tsx`
**大小**: ~250 行
**功能**:
- 完整的登录功能
- 表单验证
- 密码显示/隐藏
- 记住我功能
- 忘记密码链接

**使用示例**:
```typescript
import { LoginFormAdvanced } from '@/components/auth';

function LoginPage() {
  const handleSuccess = () => {
    router.push('/admin');
  };

  return (
    <LoginFormAdvanced
      onSuccess={handleSuccess}
      redirectUrl="/admin"
    />
  );
}
```

---

### 8. 增强版博客详情页
**文件**: `frontend/app/(public)/blog/[slug]/page-enhanced.tsx`
**大小**: ~300 行
**功能**:
- 完整的文章展示
- 阅读时间计算
- 分享和收藏功能
- 集成评论系统
- 响应式设计

**使用示例**:
只需将文件重命名或复制为 `page.tsx` 即可使用。

---

## 🚀 快速开始

### 1. 安装依赖
确保已安装所需的依赖：
```bash
npm install framer-motion lucide-react
```

### 2. 配置环境变量
在 `.env.local` 中添加：
```bash
# WordPress API 配置
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8080
WORDPRESS_API_USERNAME=your_username
WORDPRESS_API_PASSWORD=your_password
```

### 3. 在应用中使用

#### 在布局中添加 AuthProvider
```typescript
// app/layout.tsx
import { AuthProvider } from '@/components/auth';

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

#### 使用搜索组件
```typescript
// app/(public)/page.tsx
import { SearchBarAdvanced } from '@/components/ui';

export default function HomePage() {
  return (
    <div>
      <SearchBarAdvanced
        onSearch={(query) => console.log('搜索:', query)}
      />
    </div>
  );
}
```

#### 使用博客组件
```typescript
// app/(public)/blog/page.tsx
import { usePosts, PostCard } from '@/components/blog';

export default function BlogPage() {
  const { data: posts, loading } = usePosts({ per_page: 12 });

  if (loading) return <div>加载中...</div>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts?.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

---

## 📚 API 参考

### WordPress Client 方法

#### 文章相关
- `getPosts(params)` - 获取文章列表
- `getPost(id)` - 获取单篇文章
- `getPostBySlug(slug)` - 根据slug获取文章
- `createPost(post)` - 创建文章
- `updatePost(id, post)` - 更新文章
- `deletePost(id, force)` - 删除文章

#### 分类相关
- `getCategories(params)` - 获取分类列表
- `getCategory(id)` - 获取单个分类

#### 标签相关
- `getTags(params)` - 获取标签列表
- `getTag(id)` - 获取单个标签

#### 评论相关
- `getComments(params)` - 获取评论列表
- `getComment(id)` - 获取单条评论
- `createComment(comment)` - 创建评论
- `updateComment(id, comment)` - 更新评论
- `deleteComment(id, force)` - 删除评论

#### 媒体相关
- `getMedia(params)` - 获取媒体列表
- `getMediaItem(id)` - 获取单个媒体
- `uploadMedia(file, data)` - 上传媒体

#### 用户相关
- `getUsers(params)` - 获取用户列表
- `getUser(id)` - 获取单个用户
- `getCurrentUser()` - 获取当前用户

#### 搜索相关
- `search(query, params)` - 全局搜索

### React Hooks

#### 数据获取
- `usePosts(params)` - 文章列表
- `usePost(id)` - 单篇文章
- `usePostBySlug(slug)` - 根据slug获取文章
- `useRelatedPosts(postId, categories, limit)` - 相关文章

#### 分类和标签
- `useCategories(params)` - 分类列表
- `useCategory(id)` - 单个分类
- `useTags(params)` - 标签列表
- `useTag(id)` - 单个标签
- `usePopularTags(limit)` - 热门标签

#### 评论
- `useComments(postId)` - 文章评论
- `useSubmitComment()` - 提交评论

#### 媒体
- `useFeaturedImage(mediaId)` - 特色图片
- `useUploadMedia()` - 上传媒体

#### 用户
- `useUser(userId)` - 用户信息
- `useCurrentUser()` - 当前用户

#### 搜索
- `useSearch()` - 搜索
- `useSearchSuggestions(minLength)` - 搜索建议

#### 工具
- `usePagination(totalItems, itemsPerPage)` - 分页
- `useCacheManager()` - 缓存管理

---

## 🎯 特性亮点

### 1. 完整的 TypeScript 支持
所有组件都使用 TypeScript 编写，提供完整的类型定义。

### 2. 自动缓存
WordPress API 客户端内置 5 分钟缓存，减少服务器请求。

### 3. 错误处理
所有 Hooks 都包含错误处理，方便统一处理错误情况。

### 4. 加载状态
所有数据获取都有加载状态，可以轻松显示加载动画。

### 5. 响应式设计
所有组件都支持响应式设计，适配各种屏幕尺寸。

### 6. 赛博朋克风格
使用项目的赛博朋克主题，保持视觉一致性。

---

## 🔧 自定义配置

### 修改缓存时间
```typescript
import { initWordPressClient } from '@/lib/wordpress';

const client = initWordPressClient({
  baseUrl: 'http://localhost:8080',
  timeout: 10000,
});

// 自定义缓存时间
client.cacheTimeout = 10 * 60 * 1000; // 10分钟
```

### 修改搜索防抖时间
在 `SearchBarAdvanced.tsx` 中修改：
```typescript
const delayDebounce = setTimeout(async () => {
  // 搜索逻辑
}, 500); // 修改这个值（毫秒）
```

### 自定义热门搜索关键词
在 `SearchBarAdvanced.tsx` 中修改：
```typescript
const trendingSearches = [
  'Next.js',
  'React',
  // 添加你自己的关键词
];
```

---

## 📝 注意事项

1. **WordPress 后端**: 确保你的 WordPress 后端已启用 REST API
2. **CORS 配置**: 如果前后端分离，需要配置 CORS
3. **JWT 认证**: 需要安装 JWT Authentication 插件
4. **环境变量**: 确保正确配置环境变量

---

## 🐛 故障排除

### 问题: 获取数据失败
**解决方案**:
- 检查 WordPress API URL 是否正确
- 确认 WordPress 后端正在运行
- 检查网络连接

### 问题: 评论提交失败
**解决方案**:
- 确认 WordPress 评论设置允许评论
- 检查用户权限
- 查看浏览器控制台错误信息

### 问题: 登录失败
**解决方案**:
- 确认用户名和密码正确
- 检查 JWT 插件是否已安装
- 查看浏览器控制台错误信息

---

## 📞 技术支持

如有问题或建议，请联系：
- **GitHub Issues**: https://github.com/cyberpress/platform/issues
- **Email**: support@cyberpress.com
- **Documentation**: docs/README.md

---

**创建时间**: 2026-03-03
**版本**: 1.0.0
**开发团队**: AI Development Team 🤖
