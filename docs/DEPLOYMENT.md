# 🚀 CyberPress Platform 部署指南

## 📋 目录

- [环境要求](#环境要求)
- [部署方式](#部署方式)
- [Docker 部署](#docker-部署)
- [云服务部署](#云服务部署)
- [环境变量配置](#环境变量配置)
- [数据库设置](#数据库设置)
- [Nginx 配置](#nginx-配置)
- [SSL 证书](#ssl-证书)
- [监控与日志](#监控与日志)
- [故障排查](#故障排查)

---

## 环境要求

### 最低配置

- **CPU**: 2 核心
- **内存**: 4 GB RAM
- **磁盘**: 20 GB SSD
- **操作系统**: Ubuntu 22.04 LTS / Debian 11+

### 推荐配置

- **CPU**: 4 核心
- **内存**: 8 GB RAM
- **磁盘**: 50 GB SSD
- **操作系统**: Ubuntu 22.04 LTS

### 软件依赖

```bash
# 基础软件
- Docker 24.0+
- Docker Compose 2.20+
- Nginx 1.24+
- Node.js 18.17+
- PostgreSQL 15+
- Python 3.11+
```

---

## 部署方式

### 选项 1: Docker Compose（推荐）

适合小型到中型项目，简单快捷。

### 选项 2: Kubernetes

适合大规模部署，高可用性要求。

### 选项 3: 云服务

- Vercel (前端)
- Railway / Render (后端)
- AWS / Google Cloud / Azure

---

## Docker 部署

### 1. 克隆项目

```bash
git clone https://github.com/your-username/cyberpress-platform.git
cd cyberpress-platform
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
nano .env
```

### 3. 启动服务

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 检查服务状态
docker-compose ps
```

### 4. 初始化数据库

```bash
# 进入 PostgreSQL 容器
docker-compose exec postgres psql -U cyberpress -d cyberpress

# 执行初始化脚本
\i /docker-entrypoint-initdb.d/001_init_schema.sql
\i /docker-entrypoint-initdb.d/002_seed_data.sql
\i /docker-entrypoint-initdb.d/003_create_indexes.sql
```

### 5. 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:8000
- WordPress: http://localhost:8080

---

## 云服务部署

### Vercel 部署（前端）

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
cd frontend
vercel

# 生产部署
vercel --prod
```

### Railway 部署（后端）

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 初始化项目
railway init

# 部署
railway up
```

### AWS EC2 部署

#### 1. 启动 EC2 实例

```bash
# 选择 AMI: Ubuntu 22.04 LTS
# 实例类型: t3.medium (2 vCPU, 4 GB RAM)
# 存储 gp3: 50 GB
```

#### 2. 配置安全组

```bash
开放端口:
- 80 (HTTP)
- 443 (HTTPS)
- 22 (SSH)
- 3000 (前端开发)
- 8000 (后端 API)
```

#### 3. 连接到实例

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### 4. 安装 Docker

```bash
# 更新包管理器
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

#### 5. 部署应用

```bash
# 克隆项目
git clone https://github.com/your-username/cyberpress-platform.git
cd cyberpress-platform

# 配置环境变量
cp .env.example .env
nano .env

# 启动服务
docker-compose up -d
```

---

## 环境变量配置

### 前端环境变量

```env
# frontend/.env.production

# API 配置
NEXT_PUBLIC_API_URL=https://api.cyberpress.dev
NEXT_PUBLIC_WS_URL=wss://api.cyberpress.dev
NEXT_PUBLIC_SITE_URL=https://cyberpress.dev

# 分析
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=

# 功能开关
NEXT_PUBLIC_ENABLE_COMMENTS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PWA=true
```

### 后端环境变量

```env
# backend/.env

# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/cyberpress
POSTGRES_USER=cyberpress
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=cyberpress

# JWT 配置
JWT_SECRET=your-jwt-secret-key-here
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
CORS_ORIGINS=["https://cyberpress.dev","https://www.cyberpress.dev"]

# SMTP 邮件
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@cyberpress.dev

# Redis 缓存
REDIS_URL=redis://localhost:6379/0

# 对象存储
S3_BUCKET=cyberpress-uploads
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# 日志
LOG_LEVEL=info
SENTRY_DSN=
```

---

## 数据库设置

### PostgreSQL 生产配置

```ini
# /etc/postgresql/15/main/postgresql.conf

# 连接设置
max_connections = 200
shared_buffers = 2GB
effective_cache_size = 6GB
maintenance_work_mem = 512MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100

# 查询优化
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 32MB
min_wal_size = 1GB
max_wal_size = 4GB

# 日志
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_statement = 'mod'
log_duration = on
```

### 数据库备份

```bash
# 创建备份脚本
cat > /usr/local/bin/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/cyberpress_$DATE.sql.gz"

mkdir -p $BACKUP_DIR

docker-compose exec -T postgres pg_dump -U cyberpress cyberpress | gzip > $BACKUP_FILE

# 保留最近 7 天的备份
find $BACKUP_DIR -name "cyberpress_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
EOF

chmod +x /usr/local/bin/backup-db.sh

# 添加到 crontab（每天凌晨 2 点）
crontab -e
0 2 * * * /usr/local/bin/backup-db.sh
```

---

## Nginx 配置

### 前端配置

```nginx
# /etc/nginx/sites-available/cyberpress-frontend

server {
    listen 80;
    listen [::]:80;
    server_name cyberpress.dev www.cyberpress.dev;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name cyberpress.dev www.cyberpress.dev;

    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/cyberpress.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cyberpress.dev/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 日志
    access_log /var/log/nginx/cyberpress-access.log;
    error_log /var/log/nginx/cyberpress-error.log;

    # 前端静态文件
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源缓存
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    # 图片优化
    location /_next/image {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 7d;
        add_header Cache-Control "public";
    }
}
```

### 后端 API 配置

```nginx
# /etc/nginx/sites-available/cyberpress-api

upstream backend {
    server localhost:8000;
}

server {
    listen 80;
    listen [::]:80;
    server_name api.cyberpress.dev;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.cyberpress.dev;

    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/api.cyberpress.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.cyberpress.dev/privkey.pem;

    # API 端点
    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 文件上传
    location /api/upload {
        proxy_pass http://backend;
        client_max_body_size 50M;
        proxy_request_buffering off;
    }

    # WebSocket
    location /ws {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}
```

---

## SSL 证书

### 使用 Let's Encrypt

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书（自动配置 Nginx）
sudo certbot --nginx -d cyberpress.dev -d www.cyberpress.dev

# 获取 API 证书
sudo certbot --nginx -d api.cyberpress.dev

# 自动续期
sudo certbot renew --dry-run
```

### 自动续期配置

```bash
# 添加到 crontab
0 0 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

---

## 监控与日志

### 日志管理

```bash
# 查看容器日志
docker-compose logs -f --tail=100 frontend
docker-compose logs -f --tail=100 backend
docker-compose logs -f --tail=100 postgres

# 查看系统日志
sudo journalctl -u nginx -f
sudo journalctl -u docker -f
```

### 性能监控

```bash
# 安装监控工具
sudo apt install htop iotop nethogs -y

# 查看资源使用
htop
iotop
nethogs
```

### 错误追踪

推荐集成 Sentry:

```bash
# 安装 Sentry CLI
npm install -g @sentry/cli

# 配置 Sentry
sentry-cli init
```

---

## 故障排查

### 常见问题

#### 1. 容器无法启动

```bash
# 检查日志
docker-compose logs <service-name>

# 重新构建
docker-compose up -d --build

# 清理并重启
docker-compose down -v
docker-compose up -d
```

#### 2. 数据库连接失败

```bash
# 检查 PostgreSQL 状态
docker-compose ps postgres

# 查看数据库日志
docker-compose logs postgres

# 测试连接
docker-compose exec postgres psql -U cyberpress -d cyberpress
```

#### 3. Nginx 502 错误

```bash
# 检查后端服务
docker-compose ps backend

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/cyberpress-error.log

# 重启 Nginx
sudo systemctl restart nginx
```

#### 4. 磁盘空间不足

```bash
# 清理 Docker 资源
docker system prune -a

# 清理日志
sudo journalctl --vacuum-time=7d

# 查找大文件
sudo du -ah / | sort -rh | head -20
```

### 调试模式

```bash
# 启用详细日志
LOG_LEVEL=debug docker-compose up

# 检查网络
docker network ls
docker network inspect cyberpress-platform_default
```

---

## 更新部署

### 滚动更新

```bash
# 拉取最新代码
git pull origin main

# 更新镜像
docker-compose pull

# 重启服务
docker-compose up -d

# 清理旧镜像
docker image prune -f
```

### 零停机更新

```bash
# 使用多容器部署
docker-compose -f docker-compose.prod.yml up -d --scale backend=2
```

---

## 安全建议

1. **定期更新系统**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **配置防火墙**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

3. **使用强密码**
   ```bash
   # 生成随机密码
   openssl rand -base64 32
   ```

4. **定期备份**
   - 每日自动备份数据库
   - 保留 7 天的备份

5. **监控日志**
   - 设置异常告警
   - 定期审查访问日志

---

## 支持

如有问题，请：
1. 查看 [故障排查](#故障排查)
2. 提交 [Issue](https://github.com/your-username/cyberpress-platform/issues)
3. 联系支持: support@cyberpress.dev

---

**最后更新**: 2026-03-03
**维护者**: CyberPress Team
