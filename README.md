# 🚀 CyberPress Platform

> 基于 FastAPI + Next.js 的赛博朋克风格博客平台

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ 项目简介

CyberPress Platform 是一个现代化的赛博朋克风格博客平台，采用前后端分离架构，结合了 FastAPI 的高性能后端和 Next.js 14 的现代化前端技术栈。

### 核心亮点

- 🎨 **独特的赛博朋克设计语言** - 霓虹色彩、故障效果、扫描线动画
- ⚡ **高性能架构** - FastAPI 异步后端 + Next.js 服务端渲染
- 🔐 **完整的用户系统** - JWT 认证、权限管理、社交功能
- 📱 **完美响应式** - 适配所有设备和屏幕尺寸
- 🤖 **AI 驱动开发** - 持续自主迭代和优化

---

## 🎯 特性

### 🎨 赛博朋克设计系统
- **霓虹色彩系统** - 深空黑、霓虹青、赛博紫、激光粉
- **视觉特效** - 故障效果（Glitch）、扫描线、全息投影、粒子动画
- **流畅动画** - Framer Motion 驱动的丝滑交互体验
- **100+ 组件库** - 完整的 UI 组件系统

### ⚡ 技术栈

#### 前端
- **框架**: Next.js 14.2 (App Router)
- **语言**: TypeScript 5.4
- **样式**: Tailwind CSS 3.4
- **动画**: Framer Motion 11.0
- **状态管理**: Zustand + TanStack Query
- **表单处理**: React Hook Form + Zod

#### 后端
- **框架**: FastAPI 0.109+
- **语言**: Python 3.11
- **数据库**: PostgreSQL 15
- **ORM**: SQLAlchemy 2.0
- **认证**: JWT + OAuth2
- **API 文档**: 自动生成 OpenAPI/Swagger

#### 基础设施
- **容器化**: Docker & Docker Compose
- **反向代理**: Nginx
- **缓存**: Redis
- **CI/CD**: GitHub Actions

### 📦 核心功能

#### 博客系统
- ✅ 文章发布和管理
- ✅ 分类和标签系统
- ✅ Markdown 编辑器
- ✅ 代码高亮（Prism.js）
- ✅ 图片优化和懒加载
- ✅ 全文搜索
- ✅ 阅读进度指示器

#### 用户系统
- ✅ 用户注册/登录
- ✅ JWT 认证
- ✅ 个人资料管理
- ✅ 头像上传
- ✅ 权限管理

#### 社交功能
- ✅ 关注/取消关注
- ✅ 点赞系统
- ✅ 收藏功能
- ✅ 评论系统
- ✅ 实时通知
- ✅ 活动流

#### 管理后台
- ✅ 仪表盘统计
- ✅ 文章管理
- ✅ 用户管理
- ✅ 评论审核
- ✅ 系统设置

---

## 📚 文档导航

- 📖 [快速启动指南](./QUICKSTART.md) - 5分钟快速上手
- 📋 [项目设置文档](./PROJECT_SETUP.md) - 详细的项目结构和配置
- ✅ [开发任务清单](./TODO.md) - 当前开发进度和任务
- 🎨 [设计系统参考](./frontend/docs/COLOR_REFERENCE.md) - 赛博朋克配色方案
- 🎭 [图标清单](./frontend/docs/ICON_MANIFEST.md) - 所有可用图标

## 📦 快速开始

### 环境要求
- Node.js >= 18.17
- Python >= 3.11
- PostgreSQL >= 15
- Redis >= 7.0
- Docker & Docker Compose (可选)

### 1. 克隆项目

```bash
git clone https://github.com/957662/wordpress-cyberpunk-theme.git
cd wordpress-cyberpunk-theme
```

### 2. 后端设置

```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等

# 运行数据库迁移
alembic upgrade head

# 启动后端服务
uvicorn main:app --reload
```

访问 http://localhost:8000/docs 查看 API 文档

### 3. 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，配置 API 地址

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看前端

### 4. 使用 Docker Compose (推荐)

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

---

## 📁 项目结构

```
wordpress-cyberpunk-theme/
├── frontend/                   # Next.js 前端应用
│   ├── app/                   # App Router 页面
│   │   ├── (public)/         # 公开页面
│   │   ├── (auth)/           # 认证页面
│   │   └── (admin)/          # 管理后台
│   ├── components/            # React 组件
│   │   ├── ui/               # 基础 UI 组件
│   │   ├── effects/          # 特效组件
│   │   ├── layout/           # 布局组件
│   │   └── features/         # 功能组件
│   ├── lib/                   # 工具库
│   ├── hooks/                 # 自定义 Hooks
│   ├── services/              # API 服务
│   ├── types/                 # TypeScript 类型
│   └── styles/                # 全局样式
│
├── backend/                    # FastAPI 后端
│   ├── app/                   # 应用代码
│   │   ├── api/              # API 路由
│   │   ├── models/           # 数据模型
│   │   ├── schemas/          # Pydantic 模型
│   │   ├── services/         # 业务逻辑
│   │   └── core/             # 核心配置
│   ├── tests/                 # 测试文件
│   └── alembic/               # 数据库迁移
│
├── .github/                    # GitHub 配置
│   └── workflows/             # CI/CD 工作流
│
├── CHANGELOG.md               # 变更日志
├── CODE_OF_CONDUCT.md         # 行为准则
├── CONTRIBUTING.md            # 贡献指南
├── LICENSE                    # MIT 许可证
└── README.md                  # 项目说明
```

---

## 🚀 脚本命令

### 前端

```bash
# 开发
npm run dev              # 启动开发服务器 (http://localhost:3000)

# 构建
npm run build           # 生产环境构建
npm start               # 启动生产服务器

# 代码质量
npm run lint            # ESLint 检查
npm run type-check      # TypeScript 类型检查
npm run format          # Prettier 格式化

# 测试
npm run test            # 运行测试
npm run test:ci         # CI 环境测试
```

### 后端

```bash
# 开发
uvicorn main:app --reload    # 启动开发服务器

# 测试
pytest tests/ -v              # 运行测试
pytest tests/ --cov=app      # 运行测试并生成覆盖率报告

# 数据库
alembic revision --autogenerate -m "description"  # 创建迁移
alembic upgrade head                              # 应用迁移
alembic downgrade -1                              # 回滚迁移

# 代码质量
flake8 app/                 # Lint 检查
mypy app/                   # 类型检查
black app/                  # 代码格式化
```

---

## 🎨 设计系统

### 配色方案

```css
/* 主色调 */
--cyber-dark: #0a0a0f      /* 深空黑 */
--cyber-cyan: #00f0ff      /* 霓虹青 */
--cyber-purple: #9d00ff    /* 赛博紫 */
--cyber-pink: #ff0080      /* 激光粉 */

/* 辅助色 */
--cyber-green: #00ff88     /* 赛博绿 */
--cyber-yellow: #f0ff00    /* 电压黄 */
--cyber-muted: #1a1a2e     /* 深空蓝 */

/* 功能色 */
--success: #00ff88
--warning: #f0ff00
--error: #ff0080
--info: #00f0ff
```

### 字体系统

```css
/* 无衬线字体 - 正文 */
font-family: 'Inter', system-ui, sans-serif;

/* 展示字体 - 标题 */
font-family: 'Orbitron', sans-serif;

/* 等宽字体 - 代码 */
font-family: 'JetBrains Mono', monospace;
```

### 组件库

- **Button** - 多种变体（霓虹、故障、全息等）
- **Card** - 带扫描线和悬浮效果
- **Input** - 赛博朋克风格输入框
- **Modal** - 带动画的模态框
- **Navigation** - 响应式导航栏
- **Loading** - 多种加载动画
- **Effects** - 故障、扫描线、粒子等特效

---

## 📊 开发进度

当前项目进度: **90%** 🟢

### 已完成 ✅

<details>
<summary>点击查看详细列表</summary>

#### 前端 (95%)
- ✅ 设计系统和 UI 组件库 (100+ 组件)
- ✅ 布局系统 (Header, Footer, Sidebar)
- ✅ 博客系统 (列表、详情、分页、搜索)
- ✅ 用户认证 (登录、注册、密码重置)
- ✅ 社交功能 (关注、点赞、收藏、评论)
- ✅ 通知系统 (实时通知、消息中心)
- ✅ 管理后台 (仪表盘、内容管理)
- ✅ 响应式设计
- ✅ 动画和特效

#### 后端 (90%)
- ✅ FastAPI 项目架构
- ✅ 用户认证和授权 (JWT)
- ✅ 文章管理 API
- ✅ 分类和标签 API
- ✅ 评论系统 API
- ✅ 社交功能 API (关注、点赞、收藏)
- ✅ 通知系统 API
- ✅ 文件上传
- ✅ 数据库迁移

#### 基础设施 (100%)
- ✅ Docker 容器化
- ✅ CI/CD 管道 (GitHub Actions)
- ✅ 代码质量检查 (ESLint, flake8)
- ✅ 自动化测试

</details>

### 进行中 ⏳

- ⏳ SEO 优化
- ⏳ 性能优化
- ⏳ PWA 支持
- ⏳ 国际化 (i18n)

### 计划中 📋

- 📋 邮件通知
- 📋 数据分析
- 📋 AI 内容推荐

---

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 贡献指南

- 遵循 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) 行为准则
- 阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细指南
- 使用 TypeScript/Python 进行类型检查
- 遵循 ESLint/flake8 配置
- 编写有意义的提交信息
- 添加必要的测试

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 👥 开发团队

由 **AI 开发团队** 自主构建和持续迭代

| 角色 | 职责 |
|------|------|
| 🤖 AI Product Manager | 需求分析、任务规划 |
| 🤖 AI Architect | 架构设计、技术选型 |
| 🤖 AI Frontend Developer | 前端开发、UI 实现 |
| 🤖 AI Backend Developer | 后端开发、API 设计 |
| 🤖 AI Tester | 测试、质量保证 |
| 🤖 AI Security Engineer | 安全审计、漏洞修复 |
| 🤖 AI DevOps Engineer | 部署、CI/CD |
| 🤖 AI Documenter | 文档编写、知识管理 |

---

## 🌟 Star History

如果这个项目对你有帮助，请给它一个 Star！⭐

---

## 📮 联系方式

- **项目主页**: [https://github.com/957662/wordpress-cyberpunk-theme](https://github.com/957662/wordpress-cyberpunk-theme)
- **问题反馈**: [GitHub Issues](https://github.com/957662/wordpress-cyberpunk-theme/issues)
- **邮箱**: 2835879683@qq.com

---

<div align="center">

**Built with ❤️ by AI Development Team**

**Powered by FastAPI + Next.js**

</div>
