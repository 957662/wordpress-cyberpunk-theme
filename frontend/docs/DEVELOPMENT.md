# CyberPress 开发指南

## 开发环境设置

### 前置要求
- Node.js 18+
- npm 或 yarn
- Git

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/cyberpress/platform.git
cd platform/frontend

# 安装依赖
npm install

# 复制环境变量
cp .env.example .env.local

# 启动开发服务器
npm run dev
```

## 开发规范

### 代码风格

#### TypeScript
```typescript
// 使用接口定义对象类型
interface UserProps {
  name: string;
  email: string;
  age?: number; // 可选属性
}

// 使用类型别名定义联合类型
type Theme = 'light' | 'dark' | 'auto';

// 组件 Props 类型
export function Button({ onClick, children }: ButtonProps) {
  // ...
}
```

#### 组件命名
```typescript
// ✅ 好的命名
export function UserAvatar() { }
export function BlogCard() { }
export function SearchBar() { }

// ❌ 不好的命名
export function avatar() { }
export function Card() { }
export function Component1() { }
```

#### 文件组织
```
components/
├── ui/                    # 基础 UI 组件
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
├── blog/                  # 功能组件
│   ├── BlogCard.tsx
│   ├── BlogList.tsx
│   └── BlogDetail.tsx
└── layout/                # 布局组件
    ├── Header.tsx
    └── Footer.tsx
```

### Git 提交规范

#### Commit Message 格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type 类型
- **feat**: 新功能
- **fix**: 修复 bug
- **style**: 代码格式（不影响代码运行的变动）
- **refactor**: 重构（既不是新增功能，也不是修改 bug）
- **docs**: 文档更新
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动

#### 示例
```bash
feat(blog): 添加文章搜索功能

实现了基于关键词的文章搜索功能
- 添加 SearchBar 组件
- 集成 WordPress API 搜索
- 添加搜索结果高亮

Closes #123
```

## 组件开发指南

### 1. 创建新组件

```typescript
// components/ui/MyComponent.tsx
'use client'; // 如果使用客户端功能

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface MyComponentProps {
  title: string;
  variant?: 'default' | 'primary';
  className?: string;
  onClick?: () => void;
}

export function MyComponent({
  title,
  variant = 'default',
  className,
  onClick,
}: MyComponentProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        'base-styles',
        variant === 'primary' && 'primary-styles',
        className
      )}
      onClick={onClick}
    >
      {title}
    </motion.div>
  );
}
```

### 2. 使用组件

```typescript
import { MyComponent } from '@/components/ui/MyComponent';

export default function Page() {
  return (
    <MyComponent
      title="Hello World"
      variant="primary"
      onClick={() => console.log('clicked')}
    />
  );
}
```

## API 集成

### 使用 WordPress API

```typescript
import { useQuery } from '@tanstack/react-query';
import { wpClient, wpKeys } from '@/lib/wordpress/client';

// 获取文章列表
export function usePosts(page = 1) {
  return useQuery({
    queryKey: wpKeys.posts(),
    queryFn: () => wpClient.getPosts({ page }),
  });
}

// 获取文章详情
export function usePost(id: number) {
  return useQuery({
    queryKey: wpKeys.post(id),
    queryFn: () => wpClient.getPost(id),
  });
}
```

### 在组件中使用

```typescript
import { usePosts } from '@/hooks/usePosts';

export default function BlogPage() {
  const { data, isLoading, error } = usePosts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div>
      {data?.data.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

## 样式指南

### Tailwind CSS 使用

```tsx
// 基础样式
<div className="flex items-center gap-4 p-4 bg-cyber-card rounded">

// 响应式设计
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// 状态样式
<button className="hover:bg-cyber-cyan active:scale-95 transition-all">

// 自定义类
<div className="cyber-card cyber-button neon-glow">
```

### 自定义动画

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  Content
</motion.div>
```

## 测试

### 单元测试
```bash
npm run test
```

### E2E 测试
```bash
npm run test:e2e
```

## 调试

### React DevTools
安装浏览器扩展：React Developer Tools

### 性能分析
```typescript
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric);
  });
  return null;
}
```

## 常见问题

### Q: 组件报 "use client" 错误？
A: 在使用 hooks、事件处理器等客户端功能时，需要在文件顶部添加 `'use client';`

### Q: 样式不生效？
A: 检查 Tailwind 配置，确保类名在 content 路径范围内

### Q: API 请求失败？
A: 检查 .env.local 中的 API_URL 配置，确保 WordPress 后端正在运行

## 资源链接

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
