# CyberPress Platform - 快速设置指南

## 🚀 5分钟快速启动

### 方法一: 使用启动脚本（推荐）

这是最简单的方式，适合本地开发：

```bash
# 1. 进入项目目录
cd cyberpress-platform

# 2. 运行启动脚本
./start-dev.sh
```

脚本会自动：
- ✅ 启动 PostgreSQL 和 Redis（Docker）
- ✅ 安装 Python 依赖
- ✅ 安装 Node.js 依赖
- ✅ 运行数据库迁移
- ✅ 启动后端服务（端口 8000）
- ✅ 启动前端服务（端口 3000）

**访问:**
- 前端: http://localhost:3000
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs

**停止服务:**
```bash
./stop-dev.sh
```

**重启服务:**
```bash
./restart-dev.sh
```

---

### 方法二: 手动启动

如果你想更细致地控制每个步骤：

#### 1️⃣ 启动数据库服务

```bash
# 使用 Docker 启动 PostgreSQL 和 Redis
docker-compose up -d postgres redis

# 等待数据库启动（约10秒）
sleep 10
```

#### 2️⃣ 配置后端

```bash
cd backend

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置数据库连接等

# 运行数据库迁移
alembic upgrade head

# 启动后端服务
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 3️⃣ 配置前端（新终端）

```bash
cd frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，设置 API 地址

# 启动开发服务器
npm run dev
```

---

### 方法三: 使用 Docker Compose（生产环境）

```bash
# 启动所有服务（包括 Nginx）
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止所有服务
docker-compose down
```

---

## 🧪 测试 API

使用我们提供的测试脚本：

```bash
# 确保后端服务正在运行
python scripts/api-test.py

# 测试其他环境的 API
python scripts/api-test.py http://your-api-url.com/api/v1
```

测试脚本会自动测试：
- ✅ 健康检查
- ✅ 用户注册
- ✅ 用户登录
- ✅ 获取文章列表
- ✅ 创建文章
- ✅ 获取分类
- ✅ 获取标签
- ✅ 搜索功能

---

## 📋 默认账号

系统会自动创建一个管理员账号：

```
用户名: admin
密码: admin123
邮箱: admin@cyberpress.com
```

⚠️ **重要**: 在生产环境中请立即修改默认密码！

---

## 🔧 环境变量配置

### 后端 (backend/.env)

```bash
# 数据库连接
DATABASE_URL=postgresql://cyberpress:cyberpress123@localhost:5432/cyberpress

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT 密钥（生产环境请使用强随机密钥）
SECRET_KEY=your-secret-key-here

# 调试模式
DEBUG=True
```

### 前端 (frontend/.env.local)

```bash
# API 地址
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# 站点 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🗄️ 数据库初始化

如果需要重新初始化数据库：

```bash
cd backend

# 方式1: 使用 Alembic
alembic downgrade base
alembic upgrade head

# 方式2: 使用 SQL 脚本
psql -U cyberpress -d cyberpress -f database/init/01-init-database.sql
```

---

## 📚 常用命令

### 后端

```bash
cd backend

# 运行开发服务器
uvicorn app.main:app --reload

# 运行测试
pytest tests/ -v

# 代码格式化
black app/
isort app/

# 类型检查
mypy app/

# Lint 检查
flake8 app/
```

### 前端

```bash
cd frontend

# 开发服务器
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
npm run type-check

# 代码格式化
npm run format

# 运行测试
npm run test
```

---

## 🐛 故障排查

### 后端无法启动

1. **检查数据库连接**
   ```bash
   docker-compose ps  # 查看容器状态
   docker-compose logs postgres  # 查看数据库日志
   ```

2. **检查端口占用**
   ```bash
   lsof -i :8000  # 检查8000端口
   ```

3. **查看后端日志**
   ```bash
   tail -f backend.log
   ```

### 前端无法启动

1. **检查 Node.js 版本**
   ```bash
   node --version  # 应该 >= 18.17
   ```

2. **清理缓存**
   ```bash
   rm -rf .next node_modules
   npm install
   ```

3. **查看前端日志**
   ```bash
   tail -f frontend.log
   ```

### 数据库连接失败

1. **确认数据库正在运行**
   ```bash
   docker-compose ps
   ```

2. **测试数据库连接**
   ```bash
   PGPASSWORD=cyberpress123 psql -h localhost -U cyberpress -d cyberpress
   ```

3. **检查环境变量**
   ```bash
   cat backend/.env | grep DATABASE_URL
   ```

---

## 📖 下一步

- 📖 阅读 [完整文档](./README.md)
- 🎨 了解 [设计系统](./frontend/docs/COLOR_REFERENCE.md)
- 🔌 查看 [API文档](http://localhost:8000/docs)
- 💡 探索 [组件库](./COMPONENTS.md)

---

## 🆘 获取帮助

遇到问题？

1. 查看 [故障排查](#🐛-故障排查)
2. 检查 [日志文件](#📝-日志文件)
3. 提交 [Issue](https://github.com/957662/wordpress-cyberpunk-theme/issues)

---

## 📝 日志文件

开发模式下，日志文件位于：

- 后端日志: `backend.log`
- 前端日志: `frontend.log`
- Docker 日志: `docker-compose logs -f`

实时查看日志：
```bash
tail -f backend.log   # 后端
tail -f frontend.log  # 前端
docker-compose logs -f  # Docker
```

---

**祝您使用愉快！** 🎉
