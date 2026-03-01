# CyberPress Platform - 快速开始指南

欢迎来到 CyberPress Platform！这是一个基于 Next.js 14 的赛博朋克风格博客/作品集平台。

## 🚀 快速开始

### 前置要求

- Node.js 18.17+
- npm / yarn / pnpm
- MySQL 8.0+ 或 MariaDB 10.6+ (可选)

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/cyberpress-platform.git
cd cyberpress-platform
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 3. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件：

```env
# 数据库配置
DATABASE_URL=mysql://user:password@localhost:3306/cyberpress

# WordPress API (如果使用)
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json

# 站点配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=CyberPress Platform

# 认证密钥
JWT_SECRET=your-secret-key-here

# 分析
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### 4. 初始化数据库（可选）

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE cyberpress CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 导入 schema
mysql -u root -p cyberpress < backend/database/schema.sql
```

### 5. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

## 📦 项目结构

```
cyberpress-platform/
├── frontend/              # Next.js 前端应用
│   ├── app/              # App Router 页面
│   ├── components/       # React 组件
│   │   ├── ui/          # UI 组件库
│   │   ├── effects/     # 特效组件
│   │   ├── widgets/     # Widget 组件
│   │   ├── layout/      # 布局组件
│   │   ├── blog/        # 博客组件
│   │   ├── portfolio/   # 作品集组件
│   │   ├── auth/        # 认证组件
│   │   ├── admin/       # 管理后台
│   │   ├── theme/       # 主题组件
│   │   └── i18n/        # 国际化
│   ├── lib/             # 工具库
│   │   ├── hooks/       # 自定义 Hooks
│   │   ├── utils/       # 工具函数
│   │   ├── services/    # API 服务
│   │   ├── wordpress/   # WordPress 集成
│   │   ├── i18n/        # 国际化配置
│   │   └── rss/         # RSS 生成
│   ├── store/           # 状态管理
│   └── types/           # TypeScript 类型
│
├── backend/             # 后端资源
│   └── database/        # 数据库相关
│       ├── schema.sql   # 完整数据库架构
│       └── migrations/  # 数据库迁移
│
├── docs/                # 文档
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT.md
│   ├── DATABASE-DESIGN.md
│   └── DESIGN-SYSTEM.md
│
└── scripts/             # 脚本工具
```

## 🎨 组件使用

### UI 组件

```tsx
import { Button, Card, Modal, Input } from '@/components/ui';

export default function Example() {
  return (
    <Card>
      <Input placeholder="输入内容..." />
      <Button variant="primary" color="cyan">
        点击我
      </Button>
    </Card>
  );
}
```

### 特效组件

```tsx
import { GlitchText, NeonBorder, ParticleBackground } from '@/components/effects';

export default function Example() {
  return (
    <ParticleBackground>
      <NeonBorder>
        <GlitchText text="CYBERPRESS" />
      </NeonBorder>
    </ParticleBackground>
  );
}
```

### Widget 组件

```tsx
import { RecentPostsWidget, TagCloudWidget } from '@/components/widgets';

export default function Example() {
  return (
    <div>
      <RecentPostsWidget posts={posts} count={5} />
      <TagCloudWidget tags={tags} />
    </div>
  );
}
```

### 自定义 Hooks

```tsx
import { useDebounce, useCopyToClipboard, useForm } from '@/lib/hooks';

export default function Example() {
  const debouncedValue = useDebounce(searchTerm, 500);
  const [copied, copy] = useCopyToClipboard();

  // 表单管理
  const { values, errors, handleChange, handleSubmit } = useForm({
    username: { initialValue: '', validation: { required: true } },
    email: { initialValue: '', validation: { required: true } }
  });

  return <div>...</div>;
}
```

### 工具函数

```tsx
import { isValidEmail, generateUUID, formatDate, truncateText } from '@/lib/utils';

// 验证
if (isValidEmail('user@example.com')) {
  // ...
}

// 生成 ID
const id = generateUUID();

// 格式化日期
const formatted = formatDate(new Date(), 'YYYY-MM-DD');

// 截断文本
const excerpt = truncateText(content, 200);
```

## 🎯 核心功能

### ✅ 已实现功能

- 📝 博客系统
  - 文章列表/详情
  - 分类和标签
  - 评论系统
  - 搜索功能
  - RSS 订阅

- 🎨 作品集系统
  - 项目展示
  - 分类筛选
  - 图片画廊

- 👤 用户系统
  - 用户注册/登录
  - JWT 认证
  - 权限管理
  - 个人资料

- 🎛️ 管理后台
  - 文章管理
  - 评论审核
  - 媒体库
  - 系统设置

- 🎨 主题系统
  - 明暗主题
  - 6 种主题色
  - 快速预设

- 🌍 国际化
  - 5 种语言支持
  - 完整翻译字典

- 🎬 特效组件
  - 故障文字
  - 霓虹边框
  - 粒子背景
  - 更多...

### 🚧 待实现功能

- [ ] 实时通知（WebSocket）
- [ ] 文章版本控制
- [ ] 协作编辑
- [ ] 全文搜索优化（Elasticsearch）
- [ ] 图片优化 CDN
- [ ] 邮件通知
- [ ] 社交分享
- [ ] 更多主题预设

## 🔧 开发命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint

# 类型检查
npm run type-check

# 格式化代码
npm run format

# 运行测试
npm run test
```

## 📚 文档

- [项目总结](PROJECT_SUMMARY.md) - 已创建功能总结
- [新功能总结](NEW_FEATURES_SUMMARY.md) - 最新功能详情
- [开发任务](DEVELOPMENT_TASKS.md) - 最新开发内容
- [组件文档](COMPONENTS.md) - 组件使用指南
- [架构文档](docs/ARCHITECTURE.md) - 系统架构
- [开发指南](docs/DEVELOPMENT.md) - 开发规范
- [数据库设计](docs/DATABASE-DESIGN.md) - 数据库架构
- [设计系统](docs/DESIGN-SYSTEM.md) - UI 设计规范

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

---

**开始你的赛博朋克之旅！** 🚀

有问题？查看 [文档](docs/) 或提交 [Issue](https://github.com/yourusername/cyberpress-platform/issues)
