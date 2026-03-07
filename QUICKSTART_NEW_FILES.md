# 🚀 新文件快速参考指南

**创建日期**: 2026-03-07

---

## 📦 文件导入指南

### 数据适配器
```typescript
// 单个适配
import { adaptPost } from '@/lib/data/adapter';
const blogPost = adaptPost(wordpressPost);

// 批量适配
import { adaptPosts } from '@/lib/data/adapter';
const blogPosts = adaptPosts(wordpressPosts);

// 提取摘要
import { extractExcerpt } from '@/lib/data/adapter';
const excerpt = extractExcerpt(htmlContent, 150);
```

### 博客类型
```typescript
import type { 
  BlogPost, 
  BlogPostListItem, 
  BlogPostDetail,
  BlogCategory,
  BlogTag 
} from '@/types/models/blog';
```

### 格式化工具
```typescript
import { 
  formatDate, 
  formatRelativeTime,
  formatNumber,
  formatFileSize,
  formatReadingTime,
  truncateText,
  escapeHtml,
  generateSlug 
} from '@/lib/utils';

// 智能日期
formatDate('2026-03-07'); // "3月7日"

// 相对时间
formatRelativeTime('2026-03-07'); // "2天前"

// 数字格式
formatNumber(1234567); // "1,234,567"

// 文件大小
formatFileSize(1024 * 1024); // "1.0 MB"
```

### 存储工具
```typescript
// LocalStorage
import { storage } from '@/lib/utils';

storage.set('key', { data: 'value' });
const data = storage.get('key');
storage.remove('key');
storage.clear();

// SessionStorage
import { sessionStorage } from '@/lib/utils';

sessionStorage.set('key', value);
const data = sessionStorage.get('key');

// Cookie
import { cookie } from '@/lib/utils';

cookie.set('name', 'value', { expires: 3600 });
const value = cookie.get('name');
cookie.remove('name');
```

### UI 组件
```typescript
// 按钮
import { CyberButton } from '@/components/ui/Button/CyberButton';

<CyberButton 
  variant="primary"  // primary | secondary | glow | outline | ghost
  size="md"         // sm | md | lg
  loading={isLoading}
  icon={<Icon />}
  onClick={handleClick}
>
  点击我
</CyberButton>

// 卡片
import { CyberCard } from '@/components/ui/Card/CyberCard';

<CyberCard 
  variant="default"  // default | glass | neon | holographic
  hover={true}
  glow={false}
  onClick={handleClick}
>
  内容
</CyberCard>

// 输入框
import { CyberInput } from '@/components/ui/Input/CyberInput';

<CyberInput
  label="用户名"
  placeholder="请输入用户名"
  variant="default"  // default | glow | underline
  error={error}
  helperText="请输入3-20个字符"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

## 🎨 组件变体说明

### CyberButton 变体
- **primary**: 主按钮 - 霓虹青背景，发光效果
- **secondary**: 次要按钮 - 赛博紫背景
- **glow**: 发光按钮 - 透明背景，霓虹边框
- **outline**: 轮廓按钮 - 灰色边框
- **ghost**: 幽灵按钮 - 透明背景

### CyberCard 变体
- **default**: 默认 - 霓虹边框
- **glass**: 玻璃态 - 半透明背景
- **neon**: 霓虹 - 强烈发光效果
- **holographic**: 全息 - 渐变背景

### CyberInput 变体
- **default**: 默认 - 圆角边框
- **glow**: 发光 - 阴影效果
- **underline**: 下划线 - 极简风格

---

## 🔧 常见用例

### 1. 博客列表页面
```typescript
import { BlogList } from '@/components/blog';
import { adaptPosts } from '@/lib/data/adapter';

const BlogPage = async () => {
  const wpPosts = await fetchWordPressPosts();
  const posts = adaptPosts(wpPosts);
  
  return (
    <BlogList 
      posts={posts}
      currentPage={1}
      totalPages={10}
      onPageChange={(page) => console.log(page)}
    />
  );
};
```

### 2. 文章详情页
```typescript
import { ArticleCard } from '@/components/blog';
import { adaptPost } from '@/lib/data/adapter';

const ArticlePage = async ({ params }) => {
  const wpPost = await fetchWordPressPost(params.slug);
  const post = adaptPost(wpPost);
  
  return <ArticleCard post={post} variant="featured" />;
};
```

### 3. 搜索组件
```typescript
import { BlogSearch } from '@/components/blog';

<BlogSearch 
  onSearch={(query) => console.log(query)}
  placeholder="搜索文章..."
/>
```

### 4. 评论系统
```typescript
import { CommentSystem } from '@/components/blog';

<CommentSystem 
  postId="123"
  onCommentSubmit={(comment) => console.log(comment)}
/>
```

---

## 🎯 类型定义

### BlogPost 类型
```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  publishedAt?: string;
  readingTime?: number;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  status?: 'draft' | 'published' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 🌟 赛博朋克配色

```css
/* Tailwind 配置 */
colors: {
  'cyber-dark': '#0a0a0f',      /* 深空黑 */
  'cyber-cyan': '#00f0ff',      /* 霓虹青 */
  'cyber-purple': '#9d00ff',    /* 赛博紫 */
  'cyber-pink': '#ff0080',      /* 激光粉 */
  'cyber-green': '#00ff88',     /* 赛博绿 */
  'cyber-yellow': '#f0ff00',    /* 电压黄 */
  'cyber-muted': '#1a1a2e',     /* 深空蓝 */
}

/* 使用示例 */
className="bg-cyber-dark text-cyber-cyan border-cyber-purple"
```

---

## 📱 响应式尺寸

### 组件尺寸
```typescript
// 按钮
size="sm"  // 小: px-3 py-1.5 text-sm
size="md"  // 中: px-4 py-2 text-base
size="lg"  // 大: px-6 py-3 text-lg

// 网格布局
grid-cols-1         // 手机: 1列
md:grid-cols-2      // 平板: 2列
lg:grid-cols-3      // 桌面: 3列
xl:grid-cols-4      // 大屏: 4列
```

---

## ⚡ 性能优化

### 懒加载
```typescript
// 动态导入
const CyberButton = dynamic(() => 
  import('@/components/ui/Button/CyberButton')
);
```

### 图片优化
```typescript
import Image from 'next/image';

<Image
  src={post.featuredImage}
  alt={post.title}
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### 代码分割
```typescript
// 路由级别代码分割
// app/blog/[slug]/page.tsx
export default async function BlogPage({ params }) {
  // 服务器组件
}
```

---

## 🐛 调试技巧

### 查看适配后的数据
```typescript
import { adaptPost } from '@/lib/data/adapter';

const wpPost = await fetchData();
const post = adaptPost(wpPost);

console.log('Adapted post:', post);
console.log('Title:', post.title);
console.log('Author:', post.author?.name);
```

### 验证类型
```typescript
import type { BlogPost } from '@/types/models/blog';

const isBlogPost = (data: any): data is BlogPost => {
  return (
    typeof data.id === 'string' &&
    typeof data.title === 'string' &&
    typeof data.slug === 'string'
  );
};
```

### 错误处理
```typescript
try {
  const posts = adaptPosts(data);
} catch (error) {
  console.error('Data adaptation failed:', error);
  // 使用默认值
  const posts = [];
}
```

---

## 📚 更多资源

### 文档
- `DEVELOPMENT_DELIVERABLES_REPORT.md` - 详细开发报告
- `FILES_CREATED_THIS_SESSION.txt` - 文件清单
- `DELIVERY_SUCCESS_2026-03-07.md` - 交付报告

### 相关文件
- `/frontend/lib/data/adapter.ts` - 数据适配器源码
- `/frontend/types/models/blog.ts` - 类型定义源码
- `/frontend/lib/utils/format.ts` - 格式化工具源码
- `/frontend/lib/utils/storage.ts` - 存储工具源码

---

## ✅ 快速检查清单

使用新文件前，确保：

- [x] 已安装依赖: `npm install`
- [x] TypeScript 配置正确
- [x] Tailwind CSS 配置包含赛博朋克颜色
- [x] Framer Motion 已安装
- [x] 路径别名 `@/` 配置正确

---

**创建时间**: 2026-03-07  
**版本**: 1.0.0  
**状态**: ✅ 可用

