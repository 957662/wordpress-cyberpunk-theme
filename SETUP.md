# CyberPress 项目设置指南

## 项目概述

CyberPress 是一个基于 Next.js 14 和 WordPress 的赛博朋克风格博客平台。

## 技术栈

### 前端
- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Framer Motion** - 动画效果
- **React Query** - 数据获取和缓存
- **Zustand** - 状态管理

### 后端
- **WordPress** - 内容管理
- **WP REST API** - API 接口

## 安装步骤

### 1. 克隆项目

```bash
git clone <repository-url>
cd cyberpress-platform
```

### 2. 安装前端依赖

```bash
cd frontend
npm install
```

### 3. 配置环境变量

复制 `.env.local.example` 到 `.env.local` 并配置：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件：

```env
# WordPress API 配置
NEXT_PUBLIC_WP_API_URL=http://localhost:8080/wp-json
WORDPRESS_API_USERNAME=your_username
WORDPRESS_API_PASSWORD=your_application_password

# 站点配置
NEXT_PUBLIC_SITE_NAME=CyberPress
NEXT_PUBLIC_SITE_DESCRIPTION=赛博朋克风格博客平台
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. 设置 WordPress

#### 使用 Docker（推荐）

```bash
cd backend
docker-compose up -d
```

#### 手动安装

1. 安装 WordPress
2. 安装必要的插件：
   - JWT Authentication
   - Custom Post Type UI
   - Advanced Custom Fields (ACF)
3. 配置 REST API
4. 创建应用密码（用于认证）

### 5. 启动开发服务器

```bash
# 前端
cd frontend
npm run dev

# 后端（如果使用 Docker）
cd backend
docker-compose up
```

访问：
- 前端：http://localhost:3000
- 后台：http://localhost:8080/wp-admin

## 项目结构

```
cyberpress-platform/
├── frontend/                 # Next.js 前端应用
│   ├── app/                 # App Router 页面
│   │   ├── layout.tsx      # 根布局
│   │   ├── page.tsx        # 首页
│   │   ├── blog/           # 博客页面
│   │   ├── portfolio/      # 作品集页面
│   │   └── about/          # 关于页面
│   ├── components/         # React 组件
│   │   ├── ui/            # UI 组件
│   │   ├── layout/        # 布局组件
│   │   ├── blog/          # 博客组件
│   │   └── effects/       # 特效组件
│   ├── lib/               # 工具库
│   │   ├── wordpress/     # WordPress API 客户端
│   │   ├── hooks/         # 自定义 Hooks
│   │   ├── utils/         # 工具函数
│   │   └── constants/     # 常量定义
│   ├── hooks/             # React Hooks
│   ├── styles/            # 样式文件
│   └── public/            # 静态资源
└── backend/               # WordPress 后端
    ├── wp-content/        # WordPress 内容
    │   ├── plugins/      # 自定义插件
    │   └── themes/       # 自定义主题
    └── docker-compose.yml # Docker 配置
```

## 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 运行测试
npm run test

# 测试覆盖率
npm run test:coverage

# 代码格式化
npm run format
```

## 核心功能

### 已实现功能

- ✅ 响应式导航栏
- ✅ 首页展示
- ✅ 博客列表页
- ✅ 博客详情页
- ✅ 作品集页面
- ✅ 关于页面
- ✅ 搜索功能
- ✅ 分类和标签过滤
- ✅ 阅读时间计算
- ✅ SEO 优化
- ✅ PWA 支持
- ✅ 赛博朋克主题

### 待开发功能

- ⏳ 用户认证
- ⏳ 评论系统
- ⏳ 文章点赞/收藏
- ⏳ RSS 订阅
- ⏳ 邮件订阅
- ⏳ 后台管理面板
- ⏳ 数据分析

## 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### 自定义服务器

```bash
# 构建
npm run build

# 启动
npm run start
```

## 环境变量说明

| 变量名 | 说明 | 必需 |
|--------|------|------|
| NEXT_PUBLIC_WP_API_URL | WordPress API 地址 | 是 |
| WORDPRESS_API_USERNAME | API 用户名 | 是 |
| WORDPRESS_API_PASSWORD | API 密码 | 是 |
| NEXT_PUBLIC_SITE_NAME | 站点名称 | 否 |
| NEXT_PUBLIC_SITE_URL | 站点 URL | 否 |
| NEXT_PUBLIC_GA_ID | Google Analytics ID | 否 |

## 常见问题

### 1. WordPress API 连接失败

- 检查 API URL 是否正确
- 确认 WordPress 已安装并运行
- 验证用户名和密码
- 检查 JWT 插件是否已启用

### 2. 样式不正确

- 清除 `.next` 缓存目录
- 重新构建项目
- 检查 Tailwind 配置

### 3. 构建失败

- 运行 `npm run type-check` 检查类型错误
- 运行 `npm run lint` 检查代码规范
- 确保所有依赖已安装

## 开发指南

### 添加新页面

1. 在 `app/` 目录下创建新文件夹
2. 添加 `page.tsx` 文件
3. 导出默认组件

### 添加新组件

1. 在 `components/` 对应目录下创建文件
2. 使用 TypeScript 定义 Props
3. 导出组件

### 使用 WordPress API

```typescript
import { wpClient } from '@/lib/wordpress/client';
import { usePosts } from '@/hooks/useWordPress';

// 在组件中使用
function MyComponent() {
  const { data, isLoading, error } = usePosts({ page: 1, perPage: 10 });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div>
      {data.items.map(post => (
        <div key={post.id}>{post.title.rendered}</div>
      ))}
    </div>
  );
}
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License

## 联系方式

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: contact@cyberpress.com
