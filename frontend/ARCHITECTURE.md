# CyberPress Platform Architecture

## 项目概述

CyberPress 是一个基于 WordPress + Next.js 的赛博朋克风格博客平台。

## 技术栈

### 前端
- **Next.js 14** - React 框架，支持 App Router 和 Server Components
- **React 18** - UI 库
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Framer Motion** - 动画库

### 后端
- **WordPress** - 无头 CMS
- **WP REST API** - API 接口

### 状态管理
- **Zustand** - 轻量级状态管理
- **React Query** - 服务器状态管理

## 项目结构

```
frontend/
├── app/                      # Next.js App Router 页面
│   ├── blog/                # 博客相关页面
│   ├── portfolio/           # 作品集页面
│   ├── admin/               # 管理后台
│   └── layout.tsx           # 根布局
├── components/              # React 组件
│   ├── ui/                  # UI 组件
│   ├── effects/             # 特效组件
│   ├── graphics/            # 图形组件
│   ├── layout/              # 布局组件
│   └── blog/                # 博客组件
├── lib/                     # 工具库
│   ├── services/            # 服务层
│   ├── utils/               # 工具函数
│   ├── hooks/               # 自定义 Hooks
│   └── config/              # 配置文件
├── store/                   # 状态管理
├── types/                   # 类型定义
└── public/                  # 静态资源
```

## 核心功能

### 1. 博客系统
- 文章列表
- 文章详情
- 分类和标签
- 搜索功能
- 评论系统

### 2. 作品集
- 项目展示
- 项目筛选
- 项目详情

### 3. 用户系统
- 用户认证
- 用户资料
- 书签功能

### 4. 管理后台
- 文章管理
- 媒体管理
- 评论管理
- 数据统计

## 数据流

```
WordPress REST API
    ↓
API Client
    ↓
React Query
    ↓
Components
```

## 样式系统

### 颜色
```css
--cyber-dark: #0a0a0f
--cyber-cyan: #00f0ff
--cyber-purple: #9d00ff
--cyber-pink: #ff0080
--cyber-green: #00ff88
```

### 特效
- Glitch Effect - 故障效果
- Neon Glow - 霓虹发光
- Scanlines - 扫描线
- Particle Background - 粒子背景

## 性能优化

1. **图片优化**
   - Next.js Image 组件
   - WebP 格式
   - 懒加载

2. **代码分割**
   - 动态导入
   - 路由级别分割

3. **缓存策略**
   - React Query 缓存
   - localStorage 缓存
   - SWR 策略

## PWA 功能

1. **离线支持**
   - Service Worker
   - 离线页面
   - 缓存策略

2. **安装提示**
   - 安装横幅
   - iOS 安装说明

## 安全性

1. **认证**
   - JWT Token
   - Token 刷新
   - 角色权限

2. **数据保护**
   - XSS 防护
   - CSRF 防护
   - Content Security Policy

## 部署

### 开发环境
```bash
npm run dev
```

### 生产构建
```bash
npm run build
npm start
```

### 环境变量
```env
NEXT_PUBLIC_WP_API_URL=http://localhost:8080/wp-json
NEXT_PUBLIC_SITE_URL=https://cyberpress.dev
```

## 扩展性

### 添加新页面
1. 在 `app/` 目录创建新路由
2. 添加必要的组件
3. 配置元数据

### 添加新组件
1. 在 `components/` 相应目录创建组件
2. 导出并使用
3. 添加类型定义

### 添加新服务
1. 在 `lib/services/` 创建服务文件
2. 实现 API 调用
3. 添加错误处理

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
