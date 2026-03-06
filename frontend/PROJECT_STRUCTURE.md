# CyberPress 项目结构说明

## 📁 根目录结构

```
cyberpress-platform/
├── frontend/                 # Next.js 前端应用
│   ├── app/                 # App Router 页面
│   ├── components/          # React 组件
│   ├── lib/                 # 工具库和服务
│   ├── hooks/               # 自定义 Hooks
│   ├── types/               # TypeScript 类型
│   ├── styles/              # 全局样式
│   ├── public/              # 静态资源
│   ├── middleware.ts        # 中间件
│   └── package.json         # 依赖配置
├── backend/                 # FastAPI 后端
├── docs/                    # 文档
└── README.md                # 项目说明
```

## 🎨 frontend/ 详细结构

### app/ - Next.js App Router

```
app/
├── (public)/               # 公开路由组
│   ├── page.tsx           # 首页
│   ├── blog/              # 博客
│   │   ├── page.tsx       # 博客列表
│   │   └── [slug]/        # 博客详情
│   │       └── page.tsx
│   ├── portfolio/         # 作品集
│   └── about/             # 关于
├── (admin)/               # 管理后台路由组
│   ├── page.tsx           # 仪表盘
│   └── settings/          # 设置
├── (auth)/                # 认证路由组
│   ├── login/             # 登录
│   └── register/          # 注册
├── api/                   # API 路由
│   └── ...
├── layout.tsx             # 根布局
├── error.tsx              # 错误页面
├── loading.tsx            # 加载页面
└── not-found.tsx          # 404 页面
```

### components/ - React 组件

```
components/
├── ui/                    # 基础 UI 组件 (100+)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Badge.tsx
│   ├── Avatar.tsx
│   ├── Tooltip.tsx
│   ├── Tabs.tsx
│   ├── Dropdown.tsx
│   ├── Progress.tsx
│   ├── Select.tsx
│   └── ...
├── effects/               # 特效组件 (50+)
│   ├── GlitchText.tsx
│   ├── NeonBorder.tsx
│   ├── ParticleBackground.tsx
│   ├── HologramCard.tsx
│   └── ...
├── layout/                # 布局组件
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── ...
├── blog/                  # 博客组件 (80+)
│   ├── BlogCard.tsx
│   ├── BlogDetail.tsx
│   ├── CommentSystem.tsx
│   ├── TableOfContents.tsx
│   └── ...
├── portfolio/             # 作品集组件
├── icons/                 # 图标组件
└── graphics/              # 图形组件
```

### lib/ - 工具库

```
lib/
├── utils/                 # 工具函数
│   ├── format.ts          # 格式化函数
│   ├── validation.ts      # 验证函数
│   ├── dom.ts             # DOM 操作
│   └── ...
├── services/              # 服务模块
│   ├── auth.ts            # 认证服务
│   ├── post.ts            # 文章服务
│   ├── comment.ts         # 评论服务
│   ├── api.ts             # API 客户端
│   └── ...
├── hooks/                 # 自定义 Hooks
│   ├── useAuth.ts
│   ├── usePosts.ts
│   └── ...
├── config/                # 配置文件
│   ├── site.ts            # 站点配置
│   ├── theme.ts           # 主题配置
│   └── ...
├── constants/             # 常量
│   ├── routes.ts
│   ├── api.ts
│   ├── colors.ts
│   └── ...
├── types/                 # 类型定义
│   └── index.ts
└── utils.ts               # 通用工具
```

### hooks/ - 自定义 Hooks

```
hooks/
├── useLocalStorage.ts
├── useDebounce.ts
├── useThrottle.ts
├── useInfiniteScroll.ts
├── useClickOutside.ts
├── useCopyToClipboard.ts
├── useInView.ts
├── useWindowSize.ts
├── useBreakpoint.ts
├── useAuth.ts
├── usePosts.ts
├── useTheme.ts
└── ... (100+ hooks)
```

### types/ - 类型定义

```
types/
└── index.ts               # 全局类型定义
    ├── User               # 用户类型
    ├── Post               # 文章类型
    ├── Comment            # 评论类型
    ├── Category           # 分类类型
    ├── Tag                # 标签类型
    ├── Pagination         # 分页类型
    ├── ApiResponse        # API 响应类型
    └── ...                # 其他类型
```

### styles/ - 样式文件

```
styles/
├── globals.css            # 全局样式
├── animations.css         # 动画样式
└── effects.css            # 特效样式
```

### public/ - 静态资源

```
public/
├── images/                # 图片
├── icons/                 # SVG 图标
├── patterns/              # 背景图案
├── backgrounds/           # 背景图
└── logo.svg               # Logo
```

## 🔧 配置文件

```
frontend/
├── next.config.js         # Next.js 配置
├── tailwind.config.ts     # Tailwind 配置
├── tsconfig.json          # TypeScript 配置
├── .env.local             # 环境变量
├── .eslintrc.json         # ESLint 配置
├── .prettierrc.json       # Prettier 配置
└── package.json           # 依赖和脚本
```

## 📝 页面路由

### 公开页面

- `/` - 首页
- `/blog` - 博客列表
- `/blog/[slug]` - 博客详情
- `/portfolio` - 作品集
- `/portfolio/[slug]` - 作品详情
- `/about` - 关于页面
- `/contact` - 联系页面

### 认证页面

- `/login` - 登录
- `/register` - 注册
- `/forgot-password` - 忘记密码
- `/reset-password` - 重置密码

### 用户页面

- `/profile` - 个人资料
- `/settings` - 设置
- `/bookmarks` - 书签

### 管理后台

- `/admin` - 仪表盘
- `/admin/posts` - 文章管理
- `/admin/comments` - 评论管理
- `/admin/media` - 媒体管理
- `/admin/settings` - 系统设置

## 🎯 核心功能模块

### 认证模块
- 用户登录/注册
- JWT 令牌管理
- 权限控制
- 密码重置

### 博客模块
- 文章列表
- 文章详情
- 分类和标签
- 评论系统
- 搜索功能

### 社交模块
- 关注/粉丝
- 点赞/收藏
- 通知系统
- 活动流

### 管理模块
- 文章管理
- 用户管理
- 评论审核
- 数据统计

## 🚀 开发工作流

### 1. 创建新组件

```bash
# 创建 UI 组件
touch components/ui/NewComponent.tsx

# 创建特效组件
touch components/effects/NewEffect.tsx

# 创建博客组件
touch components/blog/NewBlogComponent.tsx
```

### 2. 创建新页面

```bash
# 创建公开页面
mkdir -p app/(public)/new-page
touch app/(public)/new-page/page.tsx

# 创建管理页面
mkdir -p app/(admin)/new-page
touch app/(admin)/new-page/page.tsx
```

### 3. 创建自定义 Hook

```bash
# 创建 Hook
touch hooks/useNewHook.ts
```

### 4. 添加工具函数

```bash
# 添加工具函数
touch lib/utils/new-util.ts
```

### 5. 创建服务模块

```bash
# 创建服务
touch lib/services/new-service.ts
```

## 📦 依赖说明

### 核心依赖
```json
{
  "next": "14.2.0",
  "react": "^18.2.0",
  "typescript": "^5.4.0",
  "tailwindcss": "^3.4.0"
}
```

### UI 库
```json
{
  "framer-motion": "^11.0.0",
  "lucide-react": "^0.363.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0"
}
```

### 状态管理
```json
{
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.28.0"
}
```

### 表单处理
```json
{
  "@hookform/resolvers": "^3.3.0",
  "react-hook-form": "^7.0.0"
}
```

### 工具库
```json
{
  "axios": "^1.6.0",
  "date-fns": "^3.6.0",
  "react-hot-toast": "^2.4.0"
}
```

## 🎨 样式系统

### 颜色变量
```css
--cyber-dark: #0a0a0f      /* 深空黑 */
--cyber-cyan: #00f0ff      /* 霓虹青 */
--cyber-purple: #9d00ff    /* 赛博紫 */
--cyber-pink: #ff0080      /* 激光粉 */
--cyber-yellow: #f0ff00    /* 电压黄 */
--cyber-green: #00ff88     /* 赛博绿 */
```

### 霓虹发光类
```css
.shadow-neon-cyan { /* 霓虹青发光 */ }
.shadow-neon-purple { /* 霓虹紫发光 */ }
.shadow-neon-pink { /* 霓虹粉发光 */ }
```

## 🔐 环境变量

```env
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 认证配置
NEXT_PUBLIC_JWT_SECRET=your-secret-key

# 第三方服务
NEXT_PUBLIC_GA_ID=your-ga-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## 📊 性能优化

### 图片优化
- 使用 Next.js Image 组件
- WebP 格式支持
- 懒加载
- 响应式图片

### 代码分割
- 动态导入
- 路由级别分割
- 组件级别分割

### 缓存策略
- React Query 缓存
- LocalStorage 缓存
- Service Worker 缓存

---

**更新时间**: 2026-03-06
**版本**: 1.0.0
