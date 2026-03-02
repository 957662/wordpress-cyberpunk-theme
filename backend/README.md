# CyberPress Backend

赛博朋克风格博客平台后端服务 - 基于 FastAPI 构建

## 🚀 技术栈

- **FastAPI** - 现代化 Python Web 框架
- **SQLAlchemy** - ORM 数据库操作
- **PostgreSQL** - 关系型数据库
- **Pydantic** - 数据验证
- **Uvicorn** - ASGI 服务器

## 📦 安装

```bash
# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt
```

## ⚙️ 配置

1. 复制环境变量模板:
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，配置数据库等信息

## 🗄️ 数据库初始化

```bash
# 创建数据库表
python -c "from app.core.database import init_db; init_db()"
```

## 🎯 运行

```bash
# 开发模式（自动重载）
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 生产模式
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📡 API 文档

启动服务后访问:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc
- OpenAPI JSON: http://localhost:8000/api/openapi.json

## 🔑 主要端点

### 健康检查
- `GET /health` - 健康检查
- `GET /api/v1/health` - API健康检查
- `GET /api/v1/ping` - Ping检查

### 文章
- `GET /api/v1/posts` - 获取文章列表
- `GET /api/v1/posts/{id}` - 获取文章详情
- `POST /api/v1/posts` - 创建文章
- `PUT /api/v1/posts/{id}` - 更新文章
- `DELETE /api/v1/posts/{id}` - 删除文章

### 分类
- `GET /api/v1/categories` - 获取分类列表
- `GET /api/v1/categories/{id}` - 获取分类详情
- `POST /api/v1/categories` - 创建分类
- `PUT /api/v1/categories/{id}` - 更新分类
- `DELETE /api/v1/categories/{id}` - 删除分类

### 标签
- `GET /api/v1/tags` - 获取标签列表
- `GET /api/v1/tags/{id}` - 获取标签详情
- `POST /api/v1/tags` - 创建标签
- `PUT /api/v1/tags/{id}` - 更新标签
- `DELETE /api/v1/tags/{id}` - 删除标签

### 项目作品
- `GET /api/v1/projects` - 获取项目列表
- `GET /api/v1/projects/{id}` - 获取项目详情
- `POST /api/v1/projects` - 创建项目
- `PUT /api/v1/projects/{id}` - 更新项目
- `DELETE /api/v1/projects/{id}` - 删除项目

## 🧪 测试

```bash
# 运行测试
pytest

# 运行测试并生成覆盖率报告
pytest --cov=app --cov-report=html
```

## 📁 项目结构

```
backend/
├── app/
│   ├── api/           # API路由
│   │   └── v1/        # API v1版本
│   ├── core/          # 核心配置
│   ├── models/        # 数据库模型
│   ├── schemas/       # Pydantic模式
│   └── services/      # 业务逻辑
├── logs/              # 日志文件
├── uploads/           # 上传文件
├── main.py            # 应用入口
├── requirements.txt   # 依赖列表
└── .env.example       # 环境变量模板
```

## 🔧 开发

### 代码格式化
```bash
black app/
isort app/
```

### 类型检查
```bash
mypy app/
```

### Linting
```bash
flake8 app/
```

## 📝 许可证

MIT License
