# 🚀 快速开始指南 - CyberPress Platform

## 📋 前置要求

- Node.js >= 18.17
- Python >= 3.11
- PostgreSQL >= 15
- WordPress >= 6.0

## 🎯 5 分钟快速启动

### 步骤 1: 克隆项目

```bash
git clone https://github.com/957662/wordpress-cyberpunk-theme.git
cd wordpress-cyberpunk-theme
```

### 步骤 2: 后端设置

```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置数据库连接

# 运行迁移
alembic upgrade head

# 启动后端
uvicorn main:app --reload
```

后端将运行在: `http://localhost:8000`

### 步骤 3: 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，设置 API 端点:
# NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8000/api
# 或使用 WordPress:
# NEXT_PUBLIC_WORDPRESS_API_URL=https://your-site.com/wp-json

# 启动开发服务器
npm run dev
```

前端将运行在: `http://localhost:3000`

### 步骤 4: 访问应用

打开浏览器访问: `http://localhost:3000`

## 🎨 使用 WordPress 后端

### 选项 1: 使用现有 WordPress 站点

如果你的 WordPress 站点已经运行：

1. 确保已安装 REST API 插件
2. 在 `.env.local` 中设置:
   ```env
   NEXT_PUBLIC_WORDPRESS_API_URL=https://your-site.com/wp-json
   ```

### 选项 2: 使用内置 FastAPI 后端

使用项目自带的 FastAPI 后端：

1. 确保 PostgreSQL 运行中
2. 在 `.env.local` 中设置:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

## 📚 核心功能

### 博客系统

```tsx
// 获取文章列表
import { usePosts } from '@/lib/wordpress/hooks';

function BlogPage() {
  const { data: posts, isLoading } = usePosts();
  
  if (isLoading) return <LoadingState />;
  
  return <BlogGrid posts={posts} />;
}
```

### 组件使用

```tsx
import { BlogCard, BlogList, BlogGrid } from '@/components/blog';

<BlogCard post={post} />
<BlogList posts={posts} onPageChange={handlePageChange} />
<BlogGrid posts={posts} columns={3} />
```

### 样式系统

```tsx
// 赛博朋克颜色
className="text-cyber-cyan bg-cyber-dark"

// 霓虹发光效果
className="neon-glow"

// 故障效果
<GlitchText text="Hello World" />
```

## 🔧 常用命令

### 前端

```bash
npm run dev          # 开发服务器
npm run build        # 生产构建
npm run test         # 运行测试
npm run lint         # ESLint 检查
npm run type-check   # TypeScript 检查
```

### 后端

```bash
uvicorn main:app --reload      # 开发服务器
pytest tests/ -v               # 运行测试
alembic upgrade head           # 运行迁移
alembic revision --autogenerate -m "msg"  # 创建迁移
```

## 📖 文档

- [完整文档](./README.md)
- [WordPress 集成指南](./WORDPRESS_INTEGRATION_GUIDE.md)
- [组件文档](./frontend/docs/COMPONENT_INDEX.md)
- [设计系统](./frontend/docs/COLOR_REFERENCE.md)

## 🐛 遇到问题？

### 常见问题

1. **端口冲突**
   ```bash
   # 修改端口
   npm run dev -- -p 3001
   ```

2. **API 连接失败**
   - 检查 `.env.local` 配置
   - 确认后端服务运行中
   - 检查 CORS 设置

3. **构建失败**
   ```bash
   # 清除缓存
   rm -rf .next node_modules
   npm install
   ```

## 🎉 下一步

1. ✅ 自定义样式
2. ✅ 添加内容
3. ✅ 配置认证
4. ✅ 部署上线

---

**需要帮助？** 查看 [完整文档](./README.md) 或提交 [Issue](https://github.com/957662/wordpress-cyberpunk-theme/issues)
