# CyberPress Frontend - 完整项目文件

这是一个基于 Next.js 14 的赛博朋克风格博客平台前端项目。

## 📁 项目结构

```
frontend/
├── app/                      # Next.js App Router 页面
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 首页
│   ├── globals.css          # 全局样式
│   └── (public)/            # 公共页面组
│       ├── blog/            # 博客页面
│       │   ├── page.tsx     # 博客列表
│       │   └── [slug]/      # 博客详情
│       │       └── page.tsx
│       ├── portfolio/       # 作品集页面
│       │   ├── page.tsx
│       │   └── [slug]/
│       │       └── page.tsx
│       ├── about/page.tsx   # 关于页面
│       └── contact/page.tsx # 联系页面
├── components/              # React 组件
│   ├── Header.tsx          # 页头组件
│   ├── Footer.tsx          # 页脚组件
│   └── providers/          # Context Providers
│       ├── ThemeProvider.tsx
│       └── QueryProvider.tsx
├── hooks/                   # 自定义 Hooks
│   ├── usePosts.ts         # 博客相关 hooks
│   ├── usePortfolio.ts     # 作品集相关 hooks
│   ├── useComments.ts      # 评论相关 hooks
│   ├── useSearch.ts        # 搜索相关 hooks
│   └── useAuth.ts          # 认证相关 hooks
├── lib/                     # 工具库
│   ├── utils.ts            # 通用工具函数
│   ├── types.ts            # TypeScript 类型定义
│   └── wordpress/          # WordPress API 客户端
│       └── client.ts
├── styles/                  # 样式文件
│   └── globals.css         # 全局样式
└── public/                  # 静态资源
    ├── logo.svg
    ├── favicon.ico
    └── icons/              # SVG 图标

## 🎨 主要功能

### 1. 首页 (/)
- 赛博朋克风格的 Hero 区域
- 核心特性展示
- 技术栈展示
- CTA（行动号召）区域

### 2. 博客系统 (/blog)
- 文章列表展示
- 分类筛选
- 标签系统
- 搜索功能
- 分页导航
- 文章详情页面
- 评论系统

### 3. 作品集 (/portfolio)
- 项目展示网格
- 分类筛选
- 项目详情页面
- 技术栈展示
- 外部链接（项目/源码）

### 4. 关于页面 (/about)
- 个人介绍
- 技能展示（进度条）
- 工作经历
- 成就统计
- 社交链接

### 5. 联系页面 (/contact)
- 联系方式展示
- 联系表单
- 社交媒体链接

## 🚀 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **状态管理**: Zustand
- **数据获取**: TanStack Query (React Query)
- **HTTP 客户端**: Axios
- **主题**: next-themes
- **通知**: react-hot-toast
- **图标**: lucide-react
- **日期处理**: date-fns

## 🎯 设计特色

### 赛博朋克主题
- 主色调: 霓虹青 (#00f0ff)
- 次色调: 赛博紫 (#9d00ff)
- 强调色: 激光粉 (#ff0080)
- 背景色: 深空黑 (#0a0a0f)

### 视觉效果
- 霓虹发光文字
- 发光边框效果
- 扫描线背景
- 故障效果动画
- 流畅的页面过渡
- 悬停动画效果

## 📦 依赖安装

```bash
cd frontend
npm install
```

## 🔧 环境变量

创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_WP_API_URL=http://localhost:8080/wp-json
```

## 🏃 运行项目

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start
```

## 📝 页面路由

| 路由 | 页面 | 状态 |
|------|------|------|
| `/` | 首页 | ✅ |
| `/blog` | 博客列表 | ✅ |
| `/blog/[slug]` | 博客详情 | ✅ |
| `/portfolio` | 作品集列表 | ✅ |
| `/portfolio/[slug]` | 项目详情 | ✅ |
| `/about` | 关于 | ✅ |
| `/contact` | 联系 | ✅ |

## 🎨 组件库

### 布局组件
- `Header` - 响应式导航栏
- `Footer` - 网站页脚

### UI 组件
- `CyberCard` - 赛博朋克风格卡片
- `CyberButton` - 霓虹按钮
- `CyberLoader` - 加载动画

### 特效组件
- `GlitchText` - 故障文字效果
- `NeonGlow` - 霓虹发光效果
- `Scanlines` - 扫描线效果

## 📡 API 集成

### WordPress REST API
- Posts: `/wp/v2/posts`
- Pages: `/wp/v2/pages`
- Categories: `/wp/v2/categories`
- Tags: `/wp/v2/tags`
- Comments: `/wp/v2/comments`
- Portfolio: `/wp/v2/portfolio`

### 数据缓存
使用 React Query 实现智能数据缓存：
- 博客列表: 5分钟
- 分类/标签: 10分钟
- 搜索结果: 2分钟

## 🎭 动画效果

使用 Framer Motion 实现：
- 页面切换动画
- 列表项交错动画
- 悬停效果
- 滚动触发动画
- 模态框动画

## 🌙 主题切换

支持深色/浅色模式切换（默认深色）

## 📱 响应式设计

完全响应式布局：
- 移动端: < 768px
- 平板: 768px - 1024px
- 桌面: > 1024px

## 🔍 SEO 优化

- 动态元标签
- Open Graph 支持
- 结构化数据
- 语义化 HTML

## 🚀 性能优化

- 自动代码分割
- 图片优化
- 字体优化
- 懒加载
- 预取链接

## 📄 许可证

MIT License
