# 🚀 CyberPress Platform

> 基于 WordPress + Next.js 的赛博朋克风格博客平台

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ 特性

### 🎨 赛博朋克设计
- **霓虹色彩系统** - 深空黑、霓虹青、赛博紫、激光粉
- **视觉特效** - 故障效果、扫描线、全息投影、粒子动画
- **流畅动画** - Framer Motion 驱动的丝滑交互

### ⚡ 现代化技术栈
- **Next.js 14** - App Router、服务端渲染、静态生成
- **TypeScript** - 类型安全的开发体验
- **Tailwind CSS** - 原子化 CSS 框架
- **WordPress REST API** - 强大的 Headless CMS

### 📦 核心功能
- ✅ 博客系统 - 文章列表、详情页、分类、标签
- ✅ 响应式设计 - 完美适配桌面、平板、手机
- ✅ 搜索功能 - 全文搜索和实时筛选
- ✅ 代码高亮 - Prism.js 语法高亮
- ✅ 图片优化 - Next.js Image 组件优化

---

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 14.2 (App Router)
- **语言**: TypeScript 5.4
- **样式**: Tailwind CSS 3.4
- **动画**: Framer Motion 11.0
- **状态**: Zustand + TanStack Query
- **表单**: React Hook Form + Zod

### 后端
- **CMS**: WordPress 6.x
- **数据库**: MySQL 8.0
- **Web 服务器**: Nginx
- **容器化**: Docker & Docker Compose

### 开发工具
- **包管理**: npm
- **代码规范**: ESLint + Prettier
- **Git**: 版本控制

---

## 📦 安装

### 环境要求
- Node.js >= 18.17
- npm >= 9.0
- Docker & Docker Compose (用于后端)

### 1. 克隆项目

```bash
git clone https://github.com/your-username/cyberpress-platform.git
cd cyberpress-platform
```

### 2. 启动后端 (WordPress)

```bash
cd backend
docker-compose up -d
```

访问 http://localhost:8080 查看WordPress后台

### 3. 启动前端

```bash
cd frontend

# 安装依赖
npm install

# 复制环境变量
cp .env.example .env.local

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看前端

---

## 📁 项目结构

```
cyberpress-platform/
├── frontend/                   # Next.js 前端应用
│   ├── app/                   # App Router 页面
│   ├── components/            # React 组件
│   ├── lib/                   # 工具库和配置
│   ├── public/                # 静态资源
│   └── styles/                # 全局样式
│
├── backend/                    # WordPress 后端
│   ├── docker-compose.yml     # Docker 配置
│   └── wp-content/            # WordPress 内容
│
├── docs/                       # 项目文档
│   ├── PROJECT.md             # 项目规划
│   ├── DEVELOPMENT_PROGRESS.md # 开发进度
│   └── API.md                 # API 文档
│
└── README.md                   # 项目说明
```

---

## 🚀 脚本命令

### 前端

```bash
# 开发
npm run dev              # 启动开发服务器

# 构建
npm run build           # 生产环境构建
npm start               # 启动生产服务器

# 代码检查
npm run lint            # ESLint 检查
npm run type-check      # TypeScript 类型检查

# 格式化
npm run format          # Prettier 格式化
```

### 后端

```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart
```

---

## 🎨 设计规范

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

---

## 📚 文档

- [项目规划](./PROJECT.md) - 完整的项目开发规划
- [开发进度](./DEVELOPMENT_PROGRESS.md) - 详细的开发进度报告
- [组件文档](./frontend/docs/) - UI 组件使用说明
- [API 文档](./docs/API.md) - WordPress REST API 说明

---

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 和 Prettier 配置
- 编写有意义的提交信息
- 添加必要的注释和文档

---

## 📝 开发进度

当前项目进度: **85%** 🟢

查看 [DEVELOPMENT_PROGRESS.md](./DEVELOPMENT_PROGRESS.md) 了解详细的开发进度和功能清单。

### 已完成
- ✅ 设计系统和 UI 组件库
- ✅ 布局组件 (Header, Footer)
- ✅ 博客系统 (列表、详情、分页)
- ✅ WordPress API 集成
- ✅ 响应式设计
- ✅ 动画效果

### 待开发
- ⏳ 评论系统
- ⏳ 用户认证
- ⏳ 管理后台
- ⏳ SEO 优化
- ⏳ PWA 支持

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 👥 团队

由 **AI 开发团队** 自主构建和持续迭代

- 🤖 AI Frontend Developer - 前端开发
- 🤖 AI Backend Developer - 后端开发
- 🤖 AI UI/UX Designer - 设计系统
- 🤖 AI DevOps Engineer - 部署运维

---

## 🌟 Star History

如果这个项目对你有帮助，请给它一个 Star！

---

## 📮 联系方式

- 项目主页: [https://github.com/your-username/cyberpress-platform](https://github.com/your-username/cyberpress-platform)
- 问题反馈: [Issues](https://github.com/your-username/cyberpress-platform/issues)
- 邮箱: contact@cyberpress.dev

---

<div align="center">

**Built with ❤️ by AI Development Team**

</div>
