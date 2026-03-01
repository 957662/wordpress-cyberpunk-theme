# 🚀 快速开始指南

欢迎来到 CyberPress Platform！本指南将帮助你在 5 分钟内启动项目。

---

## 📋 前置要求

在开始之前，请确保你的开发环境满足以下要求：

### 必需
- **Node.js** >= 18.17.0 ([下载](https://nodejs.org/))
- **npm** >= 9.0.0 (随 Node.js 安装)
- **Git** ([下载](https://git-scm.com/))

### 可选 (用于后端)
- **Docker** >= 20.10 ([下载](https://www.docker.com/))
- **Docker Compose** >= 2.0

### 检查版本

```bash
node --version   # 应该显示 v18.17.0 或更高
npm --version    # 应该显示 9.0.0 或更高
git --version    # 应该显示 git 版本
docker --version # 应该显示 docker 版本
```

---

## 🎯 快速启动 (仅前端)

如果你只想快速预览前端界面：

### 1. 进入前端目录

```bash
cd frontend
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 访问应用

打开浏览器访问: http://localhost:3000

> **注意**: 没有 WordPress 后端时，数据将使用模拟数据。

---

## 🐳 完整启动 (前端 + 后端)

### 步骤 1: 启动 WordPress 后端

```bash
# 在项目根目录
cd backend
docker-compose up -d
```

等待 Docker 容器启动（约 1-2 分钟）

验证后端:
- WordPress: http://localhost:8080
- API 端点: http://localhost:8080/wp-json

### 步骤 2: 配置前端环境变量

```bash
cd frontend

# 复制环境变量模板
cp .env.example .env.local
```

编辑 `.env.local` 文件（如果需要）:

```env
NEXT_PUBLIC_WP_API_URL=http://localhost:8080/wp-json
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 步骤 3: 安装并启动前端

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 步骤 4: 访问应用

- 前端: http://localhost:3000
- 后台: http://localhost:8080/wp-admin

默认 WordPress 管理员账号:
- 用户名: `admin`
- 密码: `password`

---

## 🛠️ 常用命令

### 前端开发

```bash
# 开发模式 (热重载)
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 自动修复代码问题
npm run lint:fix

# 类型检查
npm run type-check

# 格式化代码
npm run format
```

### 后端管理

```bash
cd backend

# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f

# 进入 WordPress 容器
docker-compose exec wordpress bash

# 备份数据库
docker-compose exec db mysqldump -uwordpress -pwordpress wordpress > backup.sql
```

---

## 🎨 自定义配置

### 修改端口

#### 前端端口
编辑 `frontend/package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p 3001"  // 改为 3001 端口
  }
}
```

#### 后端端口
编辑 `backend/docker-compose.yml`:

```yaml
services:
  wordpress:
    ports:
      - "8081:80"  // 改为 8081 端口
```

### 修改主题颜色

编辑 `frontend/styles/globals.css`:

```css
:root {
  --cyber-cyan: #00f0ff;      /* 修改为你喜欢的颜色 */
  --cyber-purple: #9d00ff;
  /* ... */
}
```

---

## 🐛 常见问题

### Q1: `npm install` 失败

**解决方案**:
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 和 lock 文件
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### Q2: Docker 容器无法启动

**解决方案**:
```bash
# 检查 Docker 是否运行
docker ps

# 查看容器日志
docker-compose logs

# 重启 Docker
# Windows/Mac: 重启 Docker Desktop
# Linux: sudo systemctl restart docker
```

### Q3: 端口已被占用

**解决方案**:
```bash
# 查找占用端口的进程
# Linux/Mac:
lsof -i :3000

# Windows:
netstat -ano | findstr :3000

# 终止进程或更改端口
```

### Q4: 无法连接到 WordPress API

**解决方案**:
1. 检查 WordPress 是否运行: `docker-compose ps`
2. 检查 API URL 配置: `cat .env.local`
3. 测试 API 端点: `curl http://localhost:8080/wp-json`

### Q5: 页面样式错乱

**解决方案**:
```bash
# 清除 .next 缓存
rm -rf .next

# 重启开发服务器
npm run dev
```

---

## 📚 下一步

现在你已经成功启动了项目，接下来可以:

1. 📖 阅读 [项目规划](./PROJECT.md)
2. 📊 查看 [开发进度](./DEVELOPMENT_PROGRESS.md)
3. 🎨 探索 [UI 组件](./frontend/docs/)
4. 🔌 学习 [WordPress API 集成](./docs/API.md)
5. 🚀 开始 [自定义开发](./docs/CUSTOMIZATION.md)

---

## 💡 开发技巧

### 1. 使用 TypeScript

项目使用 TypeScript strict mode，充分利用类型检查:

```typescript
// ✅ 好的做法
interface Post {
  id: number;
  title: string;
  content: string;
}

const post: Post = {
  id: 1,
  title: 'Hello',
  content: 'World'
};
```

### 2. 使用 Tailwind CSS

利用 Tailwind 的工具类快速构建样式:

```tsx
// ✅ 使用 Tailwind 类
<div className="flex items-center gap-4 p-6 bg-cyber-card rounded-lg">
  <h2 className="text-xl font-bold text-cyber-cyan">标题</h2>
</div>
```

### 3. 使用 Framer Motion

添加流畅的动画效果:

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  内容
</motion.div>
```

### 4. 使用 React Query

管理服务器状态:

```tsx
import { usePosts } from '@/lib/hooks/useWordPress';

function BlogList() {
  const { data, isLoading, error } = usePosts();

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return <div>{/* 渲染数据 */}</div>;
}
```

---

## 🆘 获取帮助

如果遇到问题:

1. 查看 [常见问题](#-常见问题)
2. 搜索 [GitHub Issues](https://github.com/your-username/cyberpress-platform/issues)
3. 提交新的 [Issue](https://github.com/your-username/cyberpress-platform/issues/new)
4. 发送邮件至: support@cyberpress.dev

---

<div align="center">

**祝开发愉快！ 🎉**

</div>
