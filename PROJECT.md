# CyberPress Platform - 项目蓝图

## 🎯 项目愿景

打造一个基于 WordPress REST API 的现代化赛博朋克风格博客平台，融合未来科技感与极致用户体验。

## 🏗️ 技术架构

### 后端 (WordPress Headless CMS)
- **核心**: WordPress 6.x + REST API
- **插件**: 
  - Custom Post Types (文章、作品集、项目)
  - Advanced Custom Fields (自定义字段)
  - JWT Authentication (API 认证)
  - CORS 支持

### 前端 (Next.js 14)
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + Framer Motion
- **状态**: Zustand
- **数据**: TanStack Query (React Query)

### 部署架构
- WordPress 后端: Docker 容器
- Next.js 前端: Vercel / Docker
- 数据库: MySQL 8.0
- 缓存: Redis

## 🎨 设计理念

### 赛博朋克美学
- **主色调**: 
  - 深空黑 `#0a0a0f`
  - 霓虹青 `#00f0ff`
  - 赛博紫 `#9d00ff`
  - 激光粉 `#ff0080`
  - 电压黄 `#f0ff00`

### 视觉效果
- 发光边框和文字
- 扫描线效果
- 故障艺术 (Glitch)
- 粒子动画背景
- 全息投影效果

## 📦 项目结构

```
cyberpress-platform/
├── backend/                    # WordPress 后端
│   ├── wp-content/
│   │   ├── themes/
│   │   │   └── cyberpress-api/    # API 主题
│   │   └── plugins/
│   │       ├── cyberpress-core/   # 核心功能
│   │       └── cyberpress-api/    # API 扩展
│   ├── docker-compose.yml
│   └── .env
│
├── frontend/                   # Next.js 前端
│   ├── app/                    # App Router
│   │   ├── (public)/           # 公开页面
│   │   │   ├── page.tsx        # 首页
│   │   │   ├── blog/           # 博客
│   │   │   ├── portfolio/      # 作品集
│   │   │   └── about/          # 关于
│   │   └── (admin)/           # 管理页面
│   ├── components/
│   │   ├── ui/                 # 基础 UI 组件
│   │   ├── layout/             # 布局组件
│   │   └── effects/            # 特效组件
│   ├── lib/
│   │   ├── wordpress/          # WordPress API 客户端
│   │   └── utils/              # 工具函数
│   └── styles/
│
├── docs/                       # 文档
├── scripts/                    # 部署脚本
└── README.md
```

## 🚀 开发阶段

### Phase 1: 后端基础 (预计 50 次迭代)
- [ ] WordPress Docker 环境
- [ ] REST API 配置
- [ ] 自定义文章类型
- [ ] API 端点开发
- [ ] 认证系统

### Phase 2: 前端核心 (预计 80 次迭代)
- [ ] Next.js 项目初始化
- [ ] Tailwind 配置 (赛博朋克主题)
- [ ] 布局系统
- [ ] 首页设计
- [ ] 博客列表/详情页
- [ ] 作品集页面

### Phase 3: 高级功能 (预计 50 次迭代)
- [ ] 动画效果
- [ ] 搜索功能
- [ ] 评论系统
- [ ] 用户认证
- [ ] 管理后台

### Phase 4: 优化部署 (预计 20 次迭代)
- [ ] 性能优化
- [ ] SEO 优化
- [ ] 部署配置
- [ ] 文档完善

## 🎯 核心功能

### 公开功能
1. **博客系统** - 文章发布、分类、标签、搜索
2. **作品集** - 项目展示、技能标签、时间线
3. **关于页面** - 个人介绍、技能展示、社交链接
4. **搜索** - 全文搜索、筛选、排序

### 管理功能
1. **内容管理** - 文章、作品、媒体管理
2. **主题配置** - 颜色、字体、布局设置
3. **SEO 管理** - 元数据、站点地图

## 💡 创意功能 (AI 自主发挥)

1. **全息卡片** - 鼠标悬停时 3D 翻转效果
2. **代码雨背景** - Matrix 风格的动态背景
3. **打字机效果** - 标题逐字显示
4. **粒子跟随** - 鼠标移动时粒子效果
5. **音频可视化** - 背景音乐波形显示
6. **深色/霓虹模式切换**
7. **滚动视差效果**
8. **悬浮导航栏**
9. **加载动画** - 赛博朋克风格加载器
10. **404 页面** - 故障艺术风格

## 📝 开发规范

### 代码规范
- TypeScript strict mode
- ESLint + Prettier
- 组件化开发
- 响应式设计优先

### Git 规范
- feat: 新功能
- fix: 修复
- style: 样式
- refactor: 重构
- docs: 文档

### 提交频率
- 每 30 秒一次迭代
- 有实质性进展时提交
- 推送到 main 分支

---

**开始时间**: 2026-03-01
**预计完成**: 无限迭代，持续进化
**开发模式**: AI 全自主开发
