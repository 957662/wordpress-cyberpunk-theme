# 🚀 新组件快速参考

## 📦 快速导入

```typescript
// WordPress API
import {
  getWordPressClient,
  usePosts,
  usePostBySlug,
  useComments,
} from '@/lib/wordpress';

// 搜索组件
import { SearchBarAdvanced } from '@/components/ui';

// 评论组件
import { CommentForm, CommentList } from '@/components/blog';

// 认证组件
import { AuthProvider, useAuth, LoginFormAdvanced } from '@/components/auth';
```

---

## 🎯 常用场景

### 1. 获取文章列表
```typescript
const { data: posts, loading } = usePosts({
  per_page: 12,
  orderby: 'date',
});
```

### 2. 获取单篇文章
```typescript
const { data: post, loading } = usePostBySlug('post-slug');
```

### 3. 搜索功能
```typescript
<SearchBarAdvanced
  onSearch={(query) => router.push(`/search?q=${query}`)}
/>
```

### 4. 评论系统
```typescript
<CommentForm postId={post.id} />
<CommentList postId={post.id} />
```

### 5. 用户认证
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

---

## 🔧 配置

### 环境变量
```bash
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8080
WORDPRESS_API_USERNAME=your_username
WORDPRESS_API_PASSWORD=your_password
```

### 布局配置
```typescript
<AuthProvider>
  {children}
</AuthProvider>
```

---

## 📚 文档

- 完整使用指南: `NEW_COMPONENTS_USAGE_GUIDE.md`
- 创建报告: `CREATION_REPORT_2026_03_03.md`
- 项目文档: `README.md`

---

**创建时间**: 2026-03-03
**版本**: 1.0.0
