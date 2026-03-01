# CyberPress 架构文档

## 目录结构

```
frontend/
├── app/                      # Next.js App Router
│   ├── (public)/            # 公开路由组
│   │   ├── page.tsx         # 首页
│   │   ├── blog/            # 博客
│   │   ├── portfolio/       # 作品集
│   │   └── about/           # 关于
│   └── layout.tsx           # 根布局
├── components/              # React 组件
│   ├── blog/               # 博客组件
│   ├── portfolio/          # 作品集组件
│   ├── layout/             # 布局组件
│   ├── ui/                 # UI 组件
│   ├── effects/            # 特效组件
│   └── icons/              # 图标组件
├── lib/                    # 工具库
│   ├── wordpress/          # WordPress API 客户端
│   ├── utils/              # 工具函数
│   └── config/             # 配置文件
├── hooks/                  # 自定义 Hooks
├── store/                  # 状态管理
├── types/                  # TypeScript 类型
├── styles/                 # 样式文件
└── public/                 # 静态资源
```

## 技术栈

### 前端框架
- **Next.js 14**: React 框架（App Router）
- **React 18**: UI 库
- **TypeScript**: 类型安全

### 样式方案
- **Tailwind CSS**: 实用优先的 CSS 框架
- **Framer Motion**: 动画库
- **CSS Modules**: 组件级样式隔离

### 状态管理
- **Zustand**: 轻量级状态管理
- **React Query**: 服务端状态管理

### 数据获取
- **Axios**: HTTP 客户端
- **WordPress REST API**: 内容管理

### 代码质量
- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **TypeScript**: 类型检查

## 数据流

### 客户端数据流
```
用户交互 → 组件 → Zustand Store → UI 更新
```

### 服务端数据流
```
组件 → React Query → WordPress API → 数据缓存 → UI 渲染
```

## 组件设计原则

### 1. 单一职责
每个组件只负责一个功能

### 2. 可复用性
通过 props 控制组件行为

### 3. 类型安全
所有组件都有完整的 TypeScript 类型

### 4. 性能优化
- 使用 React.memo 避免不必要的重渲染
- 使用 useMemo 和 useCallback 优化计算
- 使用动态导入减少初始加载

## 状态管理策略

### 本地状态
使用 useState、useReducer 管理

### 全局状态
使用 Zustand 管理：
- 主题设置
- UI 状态（菜单、搜索等）
- 用户偏好

### 服务端状态
使用 React Query 管理：
- 文章列表
- 文章详情
- 分类标签
- 用户信息

## 性能优化

### 1. 代码分割
- 使用 Next.js 动态导入
- 路由级别代码分割

### 2. 图片优化
- 使用 Next.js Image 组件
- 支持 WebP/AVIF 格式
- 响应式图片加载

### 3. 缓存策略
- React Query 数据缓存
- 静态资源 CDN 缓存
- LocalStorage 用户数据

### 4. 懒加载
- 组件懒加载
- 图片懒加载
- 路由懒加载

## 安全措施

### 1. XSS 防护
- React 自动转义
- DOMPurify 清理 HTML

### 2. CSRF 防护
- 使用 SameSite Cookie
- CSRF Token 验证

### 3. 内容安全策略
- 配置 CSP 头
- 限制脚本来源

## SEO 优化

### 1. 元标签
- 动态生成 title、description
- Open Graph 标签
- Twitter Card 标签

### 2. 结构化数据
- JSON-LD 格式
- Schema.org 标记

### 3. 性能指标
- Core Web Vitals 优化
- Lighthouse 评分

## 部署流程

### 开发环境
```bash
npm run dev
```

### 生产构建
```bash
npm run build
npm run start
```

### 部署平台
- Vercel（推荐）
- Docker 容器
- Node.js 服务器

## 监控与日志

### 1. 错误追踪
- Sentry 集成
- 控制台错误日志

### 2. 性能监控
- Web Vitals 收集
- 自定义性能指标

### 3. 用户分析
- Google Analytics
- 自定义事件追踪
