# CyberPress Platform 部署指南

本文档详细说明如何在不同环境中部署 CyberPress Platform。

---

## 目录

- [环境要求](#环境要求)
- [本地开发](#本地开发)
- [生产环境部署](#生产环境部署)
- [Docker 部署](#docker-部署)
- [云平台部署](#云平台部署)
- [性能优化](#性能优化)
- [监控和维护](#监控和维护)

---

## 环境要求

### 最低系统要求

- **CPU**: 2 核心
- **内存**: 4GB RAM
- **存储**: 20GB 可用空间
- **操作系统**: Linux (Ubuntu 20.04+ 推荐)

### 软件要求

- **Node.js**: 18.17.0 或更高
- **npm**: 9.0.0 或更高
- **PostgreSQL**: 15 或更高
- **Python**: 3.11 或更高
- **Docker**: 20.10 或更高（可选）
- **Nginx**: 1.18 或更高（生产环境）

---

## 本地开发

### 1. 克隆仓库

```bash
git clone https://github.com/your-username/cyberpress-platform.git
cd cyberpress-platform
```

### 2. 安装依赖

```bash
# 前端依赖
cd frontend
npm install

# 后端依赖
cd ../backend
pip install -r requirements.txt
```

### 3. 配置环境变量

```bash
# 前端环境变量
cd frontend
cp .env.example .env.local

# 后端环境变量
cd ../backend
cp .env.example .env
```

编辑 `.env.local` 和 `.env` 文件，填入必要的配置。

### 4. 启动数据库

```bash
cd backend
docker-compose up -d postgres
```

### 5. 运行数据库迁移

```bash
# 后端
cd backend
alembic upgrade head

# 或使用初始化脚本
./scripts/db-init.sh
```

### 6. 启动开发服务器

```bash
# 前端（终端 1）
cd frontend
npm run dev

# 后端（终端 2）
cd backend
python main.py
```

访问:
- 前端: http://localhost:3000
- 后端 API: http://localhost:8000
- 数据库管理: http://localhost:8080 (Adminer)

---

## 生产环境部署

### 1. 服务器准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装必要软件
sudo apt install -y nginx postgresql redis-server python3-pip nodejs npm

# 安装 Docker（可选）
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### 2. 配置 PostgreSQL

```bash
# 切换到 postgres 用户
sudo -u postgres psql

# 创建数据库和用户
CREATE DATABASE cyberpress;
CREATE USER cyberpress WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE cyberpress TO cyberpress;
\q
```

### 3. 部署后端

```bash
# 克隆代码
cd /var/www
sudo git clone https://github.com/your-username/cyberpress-platform.git
cd cyberpress-platform/backend

# 安装依赖
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
nano .env  # 编辑配置

# 运行迁移
alembic upgrade head

# 使用 systemd 管理服务
sudo nano /etc/systemd/system/cyberpress.service
```

添加以下内容：

```ini
[Unit]
Description=CyberPress Backend API
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/cyberpress-platform/backend
Environment="PATH=/var/www/cyberpress-platform/backend/venv/bin"
ExecStart=/var/www/cyberpress-platform/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable cyberpress
sudo systemctl start cyberpress
```

### 4. 部署前端

```bash
cd /var/www/cyberpress-platform/frontend

# 安装依赖
npm install

# 构建生产版本
npm run build

# 使用 PM2 管理（推荐）
npm install -g pm2
pm2 start npm --name "cyberpress-frontend" -- start
pm2 save
pm2 startup
```

### 5. 配置 Nginx

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/cyberpress
```

添加以下配置：

```nginx
# 后端 API
upstream backend {
    server 127.0.0.1:8000;
}

# 前端
upstream frontend {
    server 127.0.0.1:3000;
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name cyberpress.dev www.cyberpress.dev;
    return 301 https://$server_name$request_uri;
}

# HTTPS 主配置
server {
    listen 443 ssl http2;
    server_name cyberpress.dev www.cyberpress.dev;

    # SSL 证书（使用 Let's Encrypt）
    ssl_certificate /etc/letsencrypt/live/cyberpress.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cyberpress.dev/privkey.pem;

    # 前端
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态文件
    location /_next/static {
        alias /var/www/cyberpress-platform/frontend/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /static {
        alias /var/www/cyberpress-platform/frontend/public/static;
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/cyberpress /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. 配置 SSL 证书

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d cyberpress.dev -d www.cyberpress.dev

# 自动续期
sudo certbot renew --dry-run
```

---

## Docker 部署

### 使用 Docker Compose

```bash
# 克隆仓库
git clone https://github.com/your-username/cyberpress-platform.git
cd cyberpress-platform

# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 单独部署

#### 前端 Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
```

#### 后端 Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 云平台部署

### Vercel（前端）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
cd frontend
vercel

# 生产环境
vercel --prod
```

### Railway（后端 + 数据库）

1. 连接 GitHub 仓库到 Railway
2. 选择后端目录
3. 添加 PostgreSQL 插件
4. 配置环境变量
5. 部署

### AWS（使用 ECS）

详细步骤请参考 `/docs/deployment/aws.md`。

---

## 性能优化

### 数据库优化

```sql
-- 创建索引
CREATE INDEX idx_posts_status_date ON posts(status, created_at DESC);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_comments_post ON comments(post_id);

-- 配置 PostgreSQL
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
```

### 缓存配置

使用 Redis 缓存：

```python
# 安装依赖
pip install redis

# 配置 Redis
REDIS_URL = "redis://localhost:6379/0"
```

### CDN 配置

将静态文件上传到 CDN：

```bash
# 使用 AWS CloudFront 或 Cloudflare
```

---

## 监控和维护

### 日志管理

```bash
# 查看应用日志
tail -f /var/log/cyberpress/app.log

# 查看 Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 数据库备份

```bash
# 自动备份（已在 scripts/backup.sh 中配置）
crontab -e

# 添加定时任务
0 2 * * * /var/www/cyberpress-platform/scripts/db-backup.sh
```

### 健康检查

```bash
# 检查服务状态
sudo systemctl status cyberpress
sudo systemctl status nginx
sudo systemctl status postgresql

# API 健康检查
curl https://cyberpress.dev/api/health
```

---

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **数据库连接失败**
   ```bash
   sudo systemctl status postgresql
   sudo -u postgres psql
   ```

3. **权限问题**
   ```bash
   sudo chown -R www-data:www-data /var/www/cyberpress-platform
   ```

---

## 支持

如有部署问题，请联系：

- 邮箱: support@cyberpress.dev
- 文档: https://docs.cyberpress.dev
- Issues: https://github.com/cyberpress/platform/issues
