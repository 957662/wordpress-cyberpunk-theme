# CyberPress Platform - 快速参考指南

## 🚀 快速启动

### 开发环境启动
```bash
# 前端开发
cd frontend
npm install
npm run dev

# 后端开发（WordPress）
cd backend
docker-compose up -d
```

### 访问地址
- 前端: http://localhost:3000
- 后端 API: http://localhost:8080/wp-json
- WordPress 管理后台: http://localhost:8080/wp-admin

---

## 📁 项目结构

```
cyberpress-platform/
├── frontend/                    # Next.js 前端
│   ├── app/                    # App Router 页面
│   │   ├── blog/              # 博客页面
│   │   ├── portfolio/         # 作品集页面
│   │   ├── about/             # 关于页面
│   │   ├── contact/           # 联系页面
│   │   ├── (admin)/           # 管理后台
│   │   └── api/               # API 路由
│   │
│   ├── components/            # React 组件
│   │   ├── ui/               # 基础 UI 组件 (100+)
│   │   ├── effects/          # 特效组件 (20+)
│   │   ├── blog/             # 博客组件
│   │   ├── portfolio/        # 作品集组件
│   │   ├── auth/             # 认证组件
│   │   ├── admin/            # 管理组件
│   │   └── layout/           # 布局组件
│   │
│   ├── lib/                   # 核心库
│   │   ├── wordpress/        # WordPress API 客户端
│   │   ├── services/         # 业务逻辑服务
│   │   ├── utils/            # 工具函数
│   │   ├── hooks/            # 自定义 Hooks
│   │   ├── constants/        # 常量定义
│   │   └── types/            # TypeScript 类型
│   │
│   └── store/                 # 状态管理
│       ├── authStore.ts      # 认证状态
│       └── themeStore.ts     # 主题状态
│
├── backend/                   # WordPress 后端
│   ├── wp-content/
│   │   ├── themes/          # API 主题
│   │   └── plugins/         # 自定义插件
│   └── docker-compose.yml
│
└── docs/                      # 文档
```

---

## 🎨 页面路由

### 公开页面
| 路由 | 组件 | 功能 |
|------|------|------|
| `/` | `page.tsx` | 首页 |
| `/blog` | `blog/page.tsx` | 博客列表 |
| `/blog/[slug]` | `blog/[slug]/page.tsx` | 博客详情 |
| `/portfolio` | `portfolio/page.tsx` | 作品集 |
| `/portfolio/[slug]` | `portfolio/[slug]/page.tsx` | 项目详情 |
| `/about` | `about/page.tsx` | 关于页面 |
| `/contact` | `contact/page.tsx` | 联系页面 |
| `/search` | `search/page.tsx` | 搜索页面 |

### 管理后台
| 路由 | 组件 | 功能 |
|------|------|------|
| `/admin/dashboard` | `(admin)/dashboard/page.tsx` | 仪表板 |
| `/admin/posts` | `(admin)/posts/page.tsx` | 文章管理 |
| `/admin/media` | `(admin)/media/page.tsx` | 媒体库 |
| `/admin/settings` | `(admin)/settings/page.tsx` | 设置 |

---

## 🔧 核心 Services

### Post Service
```typescript
import { usePosts, useCreatePost } from '@/lib/services/post-service';

// 获取文章列表
const { data: posts, isLoading } = usePosts({
  category: 'technology',
  per_page: 10,
});

// 创建文章
const createPost = useCreatePost();
await createPost.mutateAsync({
  title: 'Hello World',
  content: 'Content here...',
  status: 'publish',
});
```

### Media Service
```typescript
import { useMedia, useUploadMedia } from '@/lib/services/media-service';

// 获取媒体
const { data: media } = useMedia({ per_page: 20 });

// 上传文件
const uploadMedia = useUploadMedia();
await uploadMedia.mutateAsync({
  file: fileObject,
  title: 'Image Title',
  alt_text: 'Description',
});
```

### Category Service
```typescript
import { useCategories, useCategoryTree } from '@/lib/services/category-service';

// 获取分类列表
const { data: categories } = useCategories();

// 获取分类树
const { data: categoryTree } = useCategoryTree();
```

---

## 🎯 常用组件

### UI 组件
```typescript
import { Button, Card, Input, Modal } from '@/components/ui';

// 霓虹按钮
<Button variant="cyber">Click Me</Button>

// 霓虹卡片
<Card className="cyber-card">Content</Card>

// 输入框
<Input placeholder="Enter text..." />

// 模态框
<Modal isOpen={true} onClose={handleClose}>
  Content
</Modal>
```

### 特效组件
```typescript
import { GlitchText, MatrixRain, ParticleBackground } from '@/components/effects';

// 故障文字
<GlitchText text="Hello World" />

// 矩阵雨
<MatrixRain />

// 粒子背景
<ParticleBackground />
```

---

## 🎨 主题颜色

### Tailwind 类名
```css
/* 主色调 */
bg-cyber-dark      /* 深空黑 #0a0a0f */
bg-cyber-primary   /* 霓虹青 #00f0ff */
bg-cyber-secondary /* 赛博紫 #9d00ff */
bg-cyber-accent    /* 激光粉 #ff0080 */
bg-cyber-warning   /* 电压黄 #f0ff00 */

/* 文字颜色 */
text-cyber-cyan
text-cyber-purple
text-cyber-pink
text-cyber-yellow
```

### 使用示例
```jsx
<div className="bg-cyber-dark text-cyber-cyan border border-cyber-primary">
  Neon styled content
</div>
```

---

## 📝 WordPress API 集成

### 基本 API 调用
```typescript
import { WordPressClient } from '@/lib/wordpress/api-client';

const client = new WordPressClient();

// 获取文章
const posts = await client.fetch('/posts', {
  params: { per_page: 10, _embed: true }
});

// 获取单个文章
const post = await client.fetch(`/posts/${id}`);

// 创建文章
const newPost = await client.fetch('/posts', {
  method: 'POST',
  data: { title: 'Title', content: 'Content' }
});
```

### React Query Hooks
```typescript
import { usePosts, usePost } from '@/lib/wordpress';

// 使用 Hook
const { data: posts, isLoading, error } = usePosts({
  per_page: 10,
  category: 'technology'
});

const { data: post } = usePost(postId);
```

---

## 🔐 认证系统

### 登录
```typescript
import { useLogin } from '@/lib/services/auth-service';

const login = useLogin();

await login.mutateAsync({
  email: 'user@example.com',
  password: 'password',
});
```

### 受保护路由
```typescript
import { ProtectedRoute } from '@/components/auth';

<ProtectedRoute>
  <AdminDashboard />
</ProtectedRoute>
```

---

## 🎯 常用工具函数

### 日期格式化
```typescript
import { formatDate, formatRelativeTime } from '@/lib/utils';

formatDate('2026-03-03'); // "2026年3月3日"
formatRelativeTime('2026-03-03'); // "2 days ago"
```

### 文本处理
```typescript
import { truncateText, stripHtml } from '@/lib/utils';

truncateText('Long text...', 100); // 截断文本
stripHtml('<p>Hello</p>'); // "Hello"
```

### 文件大小
```typescript
import { formatFileSize } from '@/lib/utils';

formatFileSize(1024000); // "1.00 MB"
```

---

## 🚀 部署

### 环境变量
```bash
# .env.local
NEXT_PUBLIC_WP_API_URL=http://localhost:8080/wp-json
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 构建
```bash
# 生产构建
npm run build

# 启动生产服务器
npm run start
```

### Docker
```bash
# 构建镜像
docker build -t cyberpress-frontend .

# 运行容器
docker run -p 3000:3000 cyberpress-frontend
```

---

## 📊 性能优化

### ISR 配置
```typescript
// 重新验证时间
export const revalidate = 60; // 秒

// 或使用动态
export const revalidate = 3600; // 1小时
```

### 图片优化
```jsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
  priority // LCP 图片
/>
```

---

## 🐛 调试

### 开发工具
```bash
# 类型检查
npm run type-check

# Lint
npm run lint

# 格式化
npm run format
```

### React Query DevTools
```typescript
// 在开发环境中自动启用
// 访问 http://localhost:3000
```

---

## 📚 更多资源

- [完整文档](./README.md)
- [组件文档](./COMPONENTS.md)
- [API 文档](./API.md)
- [部署指南](./DEPLOYMENT.md)

---

**最后更新**: 2026-03-03
**版本**: 1.0.0
