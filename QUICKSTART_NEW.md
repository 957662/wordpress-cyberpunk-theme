# 🚀 CyberPress Platform - 快速开始指南

## 📋 前置要求

在开始之前，请确保您的系统已安装以下软件：

- **Node.js** >= 18.17
- **Python** >= 3.11
- **PostgreSQL** >= 15
- **Redis** >= 7.0 (可选，用于缓存)
- **Git**

## 🎯 5分钟快速启动

### 方式一：使用Docker Compose（推荐）

这是最快速的启动方式，所有服务会在容器中运行。

```bash
# 1. 克隆项目
git clone https://github.com/957662/wordpress-cyberpunk-theme.git
cd wordpress-cyberpunk-theme

# 2. 启动所有服务
docker-compose up -d

# 3. 等待服务启动（约1-2分钟）
docker-compose logs -f

# 4. 访问应用
# 前端: http://localhost:3000
# 后端API: http://localhost:8000
# API文档: http://localhost:8000/docs
```

### 方式二：本地开发

如果您想进行深度定制开发，推荐使用本地开发环境。

#### 1. 后端设置

```bash
# 进入后端目录
cd backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 复制环境配置文件
cp .env.example .env

# 编辑 .env 文件，配置数据库连接
# 必须配置项:
# DATABASE_URL=postgresql://user:password@localhost:5432/cyberpress
# SECRET_KEY=your-secret-key-here

# 运行数据库迁移
alembic upgrade head

# 启动后端服务
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 2. 前端设置

```bash
# 打开新终端，进入前端目录
cd frontend

# 安装依赖
npm install

# 复制环境配置文件
cp .env.example .env.local

# 编辑 .env.local 文件
# 必须配置项:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# 启动开发服务器
npm run dev
```

## 🎨 首次访问

### 1. 访问前端应用

打开浏览器访问: http://localhost:3000

您将看到赛博朋克风格的首页，包含：
- 精美的Hero区域
- 精选文章展示
- 最新发布列表
- 分类导航
- 订阅表单

### 2. 探索API文档

访问: http://localhost:8000/docs

这是自动生成的Swagger UI文档，包含：
- 所有API端点
- 请求/响应模型
- 在线测试功能
- 认证说明

### 3. 创建管理员账户

```bash
# 使用后端脚本创建管理员
cd backend
python scripts/create_admin.py --username admin --email admin@example.com --password your_password
```

或在API文档中调用 `/api/v1/auth/register` 端点。

## 📚 核心功能演示

### 1. 创建和发布文章

```bash
# 登录获取Token
curl -X POST "http://localhost:8000/api/v1/auth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=your_password"

# 创建文章
curl -X POST "http://localhost:8000/api/v1/posts" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "我的第一篇文章",
    "content": "这是文章内容...",
    "excerpt": "这是摘要",
    "status": "published",
    "category_id": 1
  }'
```

### 2. 使用AI内容生成器

1. 访问 http://localhost:3000/ai-generator
2. 输入主题，如"赛博朋克设计"
3. 选择生成类型（文章、摘要、标题等）
4. 点击"开始生成"
5. 等待AI生成内容
6. 复制或下载生成的内容

### 3. 查看数据分析

1. 访问 http://localhost:3000/admin/dashboard
2. 查看实时数据指标
3. 分析流量趋势
4. 查看热门内容
5. 导出分析报告

### 4. 实时通知

1. 在浏览器中打开两个标签页
2. 在一个标签页中执行操作（发布文章、评论等）
3. 在另一个标签页中实时接收通知
4. 点击通知查看详情

## 🛠️ 开发工作流

### 1. 修改代码

前端代码位于 `frontend/` 目录，后端代码位于 `backend/` 目录。

```bash
# 前端开发
cd frontend
npm run dev  # 热重载开发服务器

# 后端开发
cd backend
uvicorn app.main:app --reload  # 热重载API服务器
```

### 2. 代码规范

```bash
# 前端代码检查
cd frontend
npm run lint
npm run type-check
npm run format

# 后端代码检查
cd backend
flake8 app/
mypy app/
black app/
```

### 3. 运行测试

```bash
# 前端测试
cd frontend
npm run test

# 后端测试
cd backend
pytest tests/ -v
pytest tests/ --cov=app
```

## 📦 项目结构

```
cyberpress-platform/
├── frontend/                 # Next.js前端应用
│   ├── app/                # 页面路由
│   ├── components/         # React组件
│   ├── lib/               # 工具库
│   ├── hooks/             # 自定义Hooks
│   ├── types/             # TypeScript类型
│   └── styles/            # 样式文件
│
├── backend/                # FastAPI后端
│   ├── app/               # 应用代码
│   │   ├── api/          # API路由
│   │   ├── models/       # 数据模型
│   │   ├── schemas/      # Pydantic模型
│   │   ├── services/     # 业务逻辑
│   │   └── core/         # 核心配置
│   ├── tests/            # 测试文件
│   └── alembic/          # 数据库迁移
│
├── docker/                 # Docker配置
├── docs/                   # 项目文档
└── README.md              # 项目说明
```

## 🔧 常见问题

### Q: 数据库连接失败？
**A:** 检查PostgreSQL是否运行，数据库连接字符串是否正确。

```bash
# 检查PostgreSQL状态
sudo systemctl status postgresql

# 测试连接
psql -U postgres -d cyberpress
```

### Q: 前端无法连接后端？
**A:** 确保 `.env.local` 中的 `NEXT_PUBLIC_API_URL` 正确。

### Q: WebSocket连接失败？
**A:** 检查后端WebSocket服务是否启动，防火墙是否允许连接。

### Q: AI功能不工作？
**A:** 需要配置AI API密钥（OpenAI/Claude）在 `.env` 文件中。

### Q: 如何重置数据库？
**A:** 运行数据库迁移重置命令。

```bash
cd backend
alembic downgrade base
alembic upgrade head
```

## 🎨 自定义配置

### 修改主题颜色

编辑 `frontend/styles/globals.css`:

```css
:root {
  --cyber-cyan: #00f0ff;
  --cyber-purple: #9d00ff;
  --cyber-pink: #ff0080;
  /* 修改为您喜欢的颜色 */
}
```

### 添加新的API端点

1. 在 `backend/app/api/v1/` 创建路由文件
2. 在 `backend/app/api/v1/__init__.py` 中注册路由
3. 重启后端服务

### 创建新页面

1. 在 `frontend/app/` 创建目录和文件
2. Next.js自动路由到新页面
3. 添加到导航菜单

## 📚 下一步

- 📖 阅读完整文档: `PROJECT_SETUP.md`
- 🎯 查看任务清单: `TODO.md`
- 🎨 探索设计系统: `frontend/docs/COLOR_REFERENCE.md`
- 🔌 查看API文档: http://localhost:8000/docs

## 💬 获取帮助

- 📧 Email: 2835879683@qq.com
- 🐛 Issues: https://github.com/957662/wordpress-cyberpunk-theme/issues
- 💬 Discussions: https://github.com/957662/wordpress-cyberpunk-theme/discussions

## 🌟 开始您的赛博朋克之旅！

现在您已经成功启动了CyberPress Platform，开始探索和定制您的博客平台吧！

---

**提示**: 首次启动可能需要几分钟来初始化数据库和构建前端资源。

**更新时间**: 2026-03-08  
**版本**: v1.0.0
