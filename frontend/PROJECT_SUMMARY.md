# CyberPress Platform - 项目总结

## 项目概述

CyberPress 是一个基于 **WordPress + Next.js 14** 构建的赛博朋克风格博客平台。它融合了现代化的前端技术和无头 CMS 架构，提供极致的用户体验和开发体验。

## 技术栈

### 核心框架
- **Next.js 14** (App Router)
- **React 18** (Server Components + Client Components)
- **TypeScript 5** (完全类型安全)
- **Tailwind CSS** (实用优先的 CSS 框架)

### 状态管理与数据
- **Zustand** (轻量级状态管理)
- **React Query** (服务器状态管理)
- **WordPress REST API** (无头 CMS 后端)

### UI 与动画
- **Framer Motion** (流畅动画)
- **Lucide React** (图标库)
- **React Hot Toast** (通知提示)

### 开发工具
- **ESLint** (代码检查)
- **Prettier** (代码格式化)
- **Vitest** (单元测试)
- **Playwright** (E2E 测试)

## 项目结构

```
cyberpress-platform/frontend/
├── app/                  # App Router 页面
│   ├── blog/            # 博客模块
│   ├── portfolio/       # 作品集模块
│   ├── admin/           # 管理后台
│   └── layout.tsx       # 根布局
├── components/          # React 组件
│   ├── ui/             # UI 组件库
│   ├── effects/        # 特效组件
│   ├── graphics/       # 图形组件
│   ├── layout/         # 布局组件
│   └── icons/          # 图标库
├── lib/                # 工具库
│   ├── services/       # 服务层
│   ├── utils/          # 工具函数
│   ├── hooks/          # 自定义 Hooks
│   └── config/         # 配置文件
├── store/              # 状态管理
├── types/              # TypeScript 类型
└── public/             # 静态资源
```

## 核心功能

### 1. 博客系统
- ✅ 文章列表与分页
- ✅ 文章详情页面
- ✅ 分类和标签浏览
- ✅ 全文搜索功能
- ✅ 评论系统
- ✅ 阅读时间计算
- ✅ 相关文章推荐

### 2. 作品集展示
- ✅ 项目展示网格
- ✅ 项目筛选功能
- ✅ 项目详情页面
- ✅ 技术栈展示
- ✅ 项目链接管理

### 3. 用户系统
- ✅ 用户注册/登录
- ✅ 个人资料管理
- ✅ 书签功能
- ✅ 用户权限控制

### 4. 管理后台
- ✅ 文章管理 (CRUD)
- ✅ 媒体库管理
- ✅ 评论审核
- ✅ 数据统计面板
- ✅ 系统设置

### 5. UI 组件库
- ✅ 按钮组件 (多种变体)
- ✅ 卡片组件
- ✅ 表单组件
- ✅ 导航组件
- ✅ 反馈组件
- ✅ 加载状态

### 6. 特效组件
- ✅ 故障效果 (Glitch)
- ✅ 霓虹发光
- ✅ 扫描线效果
- ✅ 粒子背景
- ✅ 全息卡片
- ✅ 文字故障效果

## 设计系统

### 颜色方案
```css
--cyber-dark: #0a0a0f      /* 主背景色 */
--cyber-cyan: #00f0ff      /* 主色调 */
--cyber-purple: #9d00ff    /* 次要色 */
--cyber-pink: #ff0080      /* 强调色 */
--cyber-green: #00ff88     /* 成功色 */
--cyber-yellow: #f0ff00    /* 警告色 */
```

### 特效样式
- **Neon Glow** - 霓虹发光效果
- **Glitch** - 故障艺术效果
- **Scanlines** - 扫描线覆盖
- **Cyber Grid** - 赛博网格背景

## 最近新增内容

### 新增组件 (2026-03-07)
1. **MetricCard** - 指标卡片组件 (components/ui/MetricCard.tsx)
2. **Kbd** - 键盘按键显示组件 (components/ui/Kbd.tsx)
3. **存储工具** - storage.utils.ts (lib/utils/storage.utils.ts)
4. **架构文档** - ARCHITECTURE.md
5. **UI 组件文档** - components/ui/README.md
6. **Toast 服务** - lib/services/toast-service.ts

### 新增工具函数
- SEO 优化工具集合
- 验证工具集合
- 存储管理工具
- 格式化工具

## 开发指南

### 快速开始
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 环境配置
创建 `.env.local` 文件：
```env
NEXT_PUBLIC_WP_API_URL=http://localhost:8080/wp-json
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 路线图

### 已完成 ✅
- 基础博客功能
- 作品集展示
- 用户认证
- 管理后台
- PWA 支持
- 性能优化

### 计划中 🚧
- 实时协作编辑
- AI 内容生成
- 多语言支持
- 主题切换
- 更多特效组件

## 贡献指南

欢迎贡献代码、报告问题或提出新功能建议！

---

**Made with ❤️ by the CyberPress Team**
