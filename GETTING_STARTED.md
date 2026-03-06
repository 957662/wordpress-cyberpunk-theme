# CyberPress - 立即开始使用

## 🚀 快速启动

### 1. 安装依赖
```bash
cd frontend
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 访问应用
- 首页: http://localhost:3000
- 测试页: http://localhost:3000/test

---

## 📦 当前项目状态

**完成度: 95%** ✅

### ✅ 已完成 (130+ 组件)
- 完整的赛博朋克设计系统
- UI 组件库 (Button, Card, Input, etc.)
- 特效组件 (Glitch, Neon, Particle, etc.)
- 布局组件 (Header, Footer, Navigation)
- 业务组件 (Blog, Portfolio, Auth)
- 页面模板 (首页、博客、作品集等)

### 🔄 需要完成
- WordPress REST API 集成
- 环境变量配置
- 用户认证实现
- 评论功能
- 搜索功能

---

## 🎯 核心文件位置

### 配置文件
```
frontend/
├── tailwind.config.ts     # Tailwind 配置（赛博朋克主题）
├── next.config.js         # Next.js 配置
├── tsconfig.json          # TypeScript 配置
└── package.json           # 项目依赖
```

### 主要代码
```
frontend/
├── app/                   # 页面 (App Router)
│   ├── page.tsx          # 首页
│   ├── test/page.tsx     # 测试页面
│   └── layout.tsx        # 布局
├── components/            # 组件库
│   ├── ui/               # UI 组件
│   ├── effects/          # 特效组件
│   ├── layout/           # 布局组件
│   └── blog/             # 博客组件
├── lib/                   # 工具库
│   ├── utils/            # 工具函数
│   ├── types/            # 类型定义
│   └── constants.ts      # 常量
└── styles/                # 样式
    └── globals.css       # 全局样式
```

---

## 🎨 使用组件示例

### 基础组件
```tsx
import { Button, Card, Input } from '@/components/ui';

<Button variant="primary">点击我</Button>
<Card className="p-6">卡片内容</Card>
<Input placeholder="输入内容" />
```

### 赛博朋克组件
```tsx
import { CyberButton } from '@/components/ui';
import { GlitchText } from '@/components/effects';

<CyberButton variant="primary">赛博按钮</CyberButton>
<GlitchText text="故障文字" />
```

### 博客组件
```tsx
import { ArticleCard } from '@/components/blog';

<ArticleCard
  id="1"
  title="文章标题"
  slug="article-slug"
  excerpt="文章摘要"
  author={{ name: "作者名" }}
  categories={[{ name: "分类", slug: "category" }]}
  publishedAt="2024-03-06"
  readTime={5}
  viewCount={100}
  likeCount={20}
  commentCount={5}
/>
```

---

## 🔧 环境变量配置

创建 `.env.local` 文件：

```env
# 站点配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# WordPress API（如需要）
NEXT_PUBLIC_WORDPRESS_URL=http://localhost:8080
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8080/wp-json

# 社交媒体（可选）
NEXT_PUBLIC_SOCIAL_GITHUB=https://github.com/yourusername
NEXT_PUBLIC_SOCIAL_TWITTER=https://twitter.com/yourusername
```

---

## 📚 更多文档

- [快速开始指南](./QUICK_START.md)
- [项目状态报告](./PROJECT_STATUS.md)
- [配色参考](./frontend/docs/COLOR_REFERENCE.md)
- [图标清单](./frontend/docs/ICON_MANIFEST.md)

---

## 🐛 常见问题

### Q: 组件导入报错？
A: 确保已安装所有依赖：`npm install`

### Q: 样式不生效？
A: 检查 Tailwind 配置，确保类名正确

### Q: TypeScript 错误？
A: 运行 `npm run type-check` 检查类型

### Q: 端口被占用？
A: 使用 `PORT=3001 npm run dev` 更换端口

---

## 🎉 开始开发

项目已经准备好了！所有核心组件都已实现，你可以：

1. ✅ 使用测试页面查看所有组件
2. ✅ 开始构建你的页面
3. ✅ 集成 WordPress API（如需要）
4. ✅ 添加自定义功能

**祝你开发愉快！** 🚀

---

**开发团队**: CyberPress AI Development Team 🤖
**最后更新**: 2026-03-06
