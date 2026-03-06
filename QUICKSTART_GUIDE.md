# CyberPress Platform - 快速启动指南

**版本**: 1.0.0
**更新**: 2026-03-06

---

## 🚀 5 分钟快速启动

### 前置要求

确保你的系统已安装以下工具：

- Node.js 18+
- npm 或 yarn 或 pnpm
- Git
- Docker (可选)

---

## 📦 安装步骤

### 1. 克隆项目

```bash
git clone https://github.com/your-org/cyberpress-platform.git
cd cyberpress-platform
```

### 2. 安装依赖

```bash
# 进入前端目录
cd frontend

# 安装依赖 (选择一个)
npm install
# 或
yarn install
# 或
pnpm install
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑环境变量
nano .env.local
```

必需的环境变量：

```env
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 认证配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# 数据库配置 (如需要)
DATABASE_URL=postgresql://user:password@localhost:5432/cyberpress
```

### 4. 启动开发服务器

```bash
# 启动 Next.js 开发服务器
npm run dev

# 或使用其他包管理器
yarn dev
pnpm dev
```

### 5. 访问应用

打开浏览器访问：
- 应用地址: http://localhost:3000
- API 文档: http://localhost:8000/docs

---

## 🐳 使用 Docker

### 快速启动 (推荐)

```bash
# 使用 docker-compose 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 单独启动前端

```bash
# 构建前端镜像
docker build -t cyberpress-frontend ./frontend

# 运行容器
docker run -p 3000:3000 cyberpress-frontend
```

---

## 📚 项目结构

```
cyberpress-platform/
├── frontend/                 # 前端应用
│   ├── app/                 # Next.js 页面
│   │   ├── (public)/       # 公共页面组
│   │   ├── (admin)/        # 管理页面组
│   │   ├── api/            # API 路由
│   │   └── blog/           # 博客页面
│   ├── components/         # React 组件
│   │   ├── ui/            # UI 基础组件
│   │   ├── blog/          # 博客组件
│   │   ├── social/        # 社交组件
│   │   └── effects/       # 特效组件
│   ├── hooks/             # 自定义 Hooks
│   ├── lib/               # 工具库
│   ├── types/             # TypeScript 类型
│   └── public/            # 静态资源
├── backend/               # 后端服务
├── docker/                # Docker 配置
└── docs/                  # 文档
```

---

## 🎨 核心功能

### 博客功能

```typescript
// 使用文章列表 Hook
import { usePosts } from '@/hooks/api/use-posts';

function BlogPage() {
  const { data, isLoading, error } = usePosts();

  if (isLoading) return <Loader />;
  if (error) return <Error />;

  return (
    <div>
      {data?.map(post => (
        <ArticleCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### 搜索功能

```typescript
// 使用实时搜索组件
import { RealTimeSearch } from '@/components/search/RealTimeSearch';

<RealTimeSearch
  placeholder="搜索文章..."
  maxResults={8}
  showSearchHistory
/>
```

### 评论系统

```typescript
// 使用评论组件
import { CommentSystem } from '@/components/comments/CommentSystem';

<CommentSystem
  postId="post-123"
  allowNested={true}
  maxDepth={3}
/>
```

---

## 🧪 运行测试

### 单元测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test CodeHighlight.test.tsx

# 监听模式
npm test:watch

# 覆盖率报告
npm test:coverage
```

### E2E 测试

```bash
# 安装 Playwright 浏览器
npx playwright install

# 运行 E2E 测试
npm run test:e2e

# 查看 E2E 报告
npm run test:e2e:report
```

---

## 🔧 常用命令

### 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 代码格式化
npm run format

# 类型检查
npm run type-check
```

### 数据库命令

```bash
# 运行数据库迁移
npm run db:migrate

# 回滚迁移
npm run db:rollback

# 重置数据库
npm run db:reset

# 填充测试数据
npm run db:seed
```

---

## 🎯 开发工作流

### 1. 创建新功能分支

```bash
git checkout -b feature/your-feature-name
```

### 2. 开发并提交

```bash
# 添加更改
git add .

# 提交代码
git commit -m "feat: 添加新功能描述"

# 推送到远程
git push origin feature/your-feature-name
```

### 3. 创建 Pull Request

- 在 GitHub 上创建 Pull Request
- 等待代码审查
- 合并到主分支

---

## 🐛 常见问题

### 端口被占用

```bash
# 修改端口
# 在 .env.local 中设置
PORT=3001
```

### 依赖安装失败

```bash
# 清除缓存并重新安装
rm -rf node_modules package-lock.json
npm install
```

### TypeScript 错误

```bash
# 重新生成类型
npm run type-check
```

### 样式不生效

```bash
# 重新构建 Tailwind CSS
npm run build:css
```

---

## 📖 学习资源

### 官方文档
- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

### 项目文档
- [开发指南](./DEVELOPMENT_GUIDE.md)
- [API 文档](./API_DOCUMENTATION.md)
- [部署指南](./DEPLOYMENT_GUIDE.md)
- [测试指南](./TESTING_GUIDE.md)

---

## 🆘 获取帮助

### 社区支持
- GitHub Issues: https://github.com/your-org/cyberpress-platform/issues
- Discussions: https://github.com/your-org/cyberpress-platform/discussions

### 联系方式
- Email: support@cyberpress.dev
- Discord: https://discord.gg/cyberpress

---

## 📝 下一步

1. ✅ 完成快速启动
2. 📖 阅读开发指南
3. 🎨 自定义主题
4. 🚀 部署到生产环境
5. 🎉 开始创作内容！

---

**祝你使用愉快！** 🎉

如有任何问题，请随时联系我们。
