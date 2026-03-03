# 部署指南

## 目录
- [环境准备](#环境准备)
- [Docker 部署](#docker-部署)
- [手动部署](#手动部署)
- [生产环境配置](#生产环境配置)
- [监控和日志](#监控和日志)
- [故障排查](#故障排查)

---

## 环境准备

### 系统要求

- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **CPU**: 2 核心以上
- **内存**: 4GB 以上（推荐 8GB）
- **磁盘**: 20GB 以上可用空间
- **网络**: 公网 IP 或内网可访问

### 软件依赖

- Docker 20.10+
- Docker Compose 2.0+
- Nginx 1.18+（如使用反向代理）
- PostgreSQL 13+
- Redis 6+

---

## Docker 部署

### 1. 克隆项目

```bash
git clone https://github.com/cyberpress/platform.git
cd cyberpress-platform
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# =====================================================
# 应用配置
# =====================================================
NODE_ENV=production
APP_NAME=CyberPress Platform
APP_URL=https://your-domain.com
API_URL=https://api.your-domain.com

# =====================================================
# 数据库配置
# =====================================================
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=cyberpress
POSTGRES_USER=cyberpress
POSTGRES_PASSWORD=your-strong-password

# =====================================================
# Redis 配置
# =====================================================
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# =====================================================
# WordPress 配置
# =====================================================
WORDPRESS_DB_HOST=postgres
WORDPRESS_DB_NAME=wordpress
WORDPRESS_DB_USER=wordpress
WORDPRESS_DB_PASSWORD=your-wp-password
WORDPRESS_TABLE_PREFIX=wp_

# =====================================================
# JWT 配置
# =====================================================
SECRET_KEY=your-secret-key-at-least-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# =====================================================
# 文件上传
# =====================================================
MAX_UPLOAD_SIZE=10485760
ALLOWED_ORIGINS=https://your-domain.com

# =====================================================
# 邮件配置
# =====================================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@your-domain.com

# =====================================================
# 对象存储（可选）
# =====================================================
S3_BUCKET=your-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
```

### 3. 构建镜像

```bash
docker-compose build
```

### 4. 启动服务

```bash
docker-compose up -d
```

### 5. 初始化数据库

```bash
docker-compose exec backend python -m alembic upgrade head
docker-compose exec backend python -m scripts.init_db
```

### 6. 检查服务状态

```bash
docker-compose ps
docker-compose logs -f
```

### 7. 配置 Nginx（可选）

创建 Nginx 配置文件：

```nginx
# /etc/nginx/sites-available/cyberpress

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # 前端
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WordPress
    location /wp-content {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_pragma $http_authorization;
    }

    # 静态文件缓存
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    location /static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 30d;
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

### 8. 配置 SSL（使用 Let's Encrypt）

```bash
sudo certbot --nginx -d your-domain.com
```

---

## 手动部署

### 后端部署

#### 1. 安装 Python 依赖

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件
```

#### 3. 初始化数据库

```bash
alembic upgrade head
python scripts/init_db.py
```

#### 4. 使用 Gunicorn 运行

```bash
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
```

#### 5. 使用 Systemd 管理服务

创建服务文件 `/etc/systemd/system/cyberpress-api.service`：

```ini
[Unit]
Description=CyberPress API
After=network.target postgresql.service redis.service

[Service]
Type=notify
User=cyberpress
Group=cyberpress
WorkingDirectory=/var/www/cyberpress/backend
Environment="PATH=/var/www/cyberpress/backend/venv/bin"
ExecStart=/var/www/cyberpress/backend/venv/bin/gunicorn -c gunicorn.conf.py app.main:app
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable cyberpress-api
sudo systemctl start cyberpress-api
sudo systemctl status cyberpress-api
```

### 前端部署

#### 1. 安装依赖

```bash
cd frontend
npm install
```

#### 2. 构建生产版本

```bash
npm run build
```

#### 3. 使用 PM2 运行

```bash
npm install -g pm2
pm2 start npm --name "cyberpress-frontend" -- start
pm2 save
pm2 startup
```

#### 4. 使用 Systemd 管理服务

创建服务文件 `/etc/systemd/system/cyberpress-frontend.service`：

```ini
[Unit]
Description=CyberPress Frontend
After=network.target

[Service]
Type=simple
User=cyberpress
Group=cyberpress
WorkingDirectory=/var/www/cyberpress/frontend
Environment="NODE_ENV=production"
Environment="PORT=3000"
ExecStart=/usr/bin/node /var/www/cyberpress/frontend/node_modules/.bin/next start
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable cyberpress-frontend
sudo systemctl start cyberpress-frontend
sudo systemctl status cyberpress-frontend
```

---

## 生产环境配置

### 数据库优化

**PostgreSQL 配置 (`postgresql.conf`)**:

```conf
# 连接设置
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 2621kB
min_wal_size = 1GB
max_wal_size = 4GB

# 查询优化
shared_preload_libraries = 'pg_stat_statements'
```

### Redis 优化

**Redis 配置 (`redis.conf`)**:

```conf
# 内存设置
maxmemory 2gb
maxmemory-policy allkeys-lru

# 持久化
save 900 1
save 300 10
save 60 10000

# 性能优化
tcp-backlog 511
timeout 0
tcp-keepalive 300
```

### 应用优化

**后端 (`gunicorn.conf.py`)**:

```python
import multiprocessing

bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 50
timeout = 30
keepalive = 5
preload_app = True
```

**前端 (`next.config.js`)**:

```javascript
module.exports = {
  // 压缩
  compress: true,
  
  // 生产环境优化
  swcMinify: true,
  
  // 图片优化
  images: {
    domains: ['your-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // 输出配置
  output: 'standalone',
  
  // 实验性功能
  experimental: {
    serverActions: true,
  },
}
```

---

## 监控和日志

### 日志管理

**后端日志**:

```bash
# 查看日志
tail -f /var/log/cyberpress/api.log

# 日志轮转配置 (/etc/logrotate.d/cyberpress)
/var/log/cyberpress/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 cyberpress cyberpress
    sharedscripts
    postrotate
        systemctl reload cyberpress-api
    endscript
}
```

**前端日志**:

```bash
# PM2 日志
pm2 logs cyberpress-frontend

# PM2 日志轮转
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 监控设置

**安装 Prometheus + Grafana**:

```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

**关键指标监控**:
- API 响应时间
- 数据库连接数
- Redis 命中率
- 内存使用率
- CPU 使用率
- 磁盘 I/O

---

## 故障排查

### 常见问题

#### 1. 数据库连接失败

```bash
# 检查 PostgreSQL 状态
sudo systemctl status postgresql

# 检查连接
psql -U postgres -h localhost -p 5432

# 查看日志
tail -f /var/log/postgresql/postgresql-13-main.log
```

#### 2. Redis 连接失败

```bash
# 检查 Redis 状态
sudo systemctl status redis

# 测试连接
redis-cli ping

# 查看日志
tail -f /var/log/redis/redis-server.log
```

#### 3. 前端构建失败

```bash
# 清理缓存
rm -rf .next
rm -rf node_modules
npm install

# 增加内存限制
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### 4. API 响应慢

```bash
# 检查数据库查询
docker-compose exec backend python -m scripts.analyze_queries

# 查看慢查询日志
docker-compose exec postgres psql -U postgres -d cyberpress -c "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"
```

### 性能调优

#### 数据库索引

```sql
-- 创建索引示例
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status) WHERE status = 'published';
CREATE INDEX idx_comments_post_id ON comments(post_id);
```

#### 缓存策略

```python
# Redis 缓存配置
CACHE_TTL = 3600  # 1小时
CACHE_KEY_PREFIX = "cyberpress:"

# 常用数据缓存
- 文章列表: 300秒
- 文章详情: 600秒
- 分类列表: 3600秒
- 标签列表: 3600秒
```

---

## 备份和恢复

### 数据库备份

```bash
# 手动备份
docker-compose exec postgres pg_dump -U cyberpress cyberpress > backup_$(date +%Y%m%d).sql

# 自动备份（crontab）
0 2 * * * docker-compose exec postgres pg_dump -U cyberpress cyberpress > /backups/cyberpress_$(date +\%Y\%m\%d).sql
```

### 文件备份

```bash
# 备份上传文件
rsync -avz /var/www/cyberpress/uploads/ /backups/uploads/

# 备份配置文件
tar -czf config_backup_$(date +%Y%m%d).tar.gz .env docker-compose.yml
```

### 恢复

```bash
# 恢复数据库
docker-compose exec -T postgres psql -U cyberpress cyberpress < backup_20260303.sql

# 恢复文件
rsync -avz /backups/uploads/ /var/www/cyberpress/uploads/
```

---

## 安全检查清单

- [ ] 更新所有依赖到最新版本
- [ ] 配置防火墙规则
- [ ] 启用 SSL/TLS
- [ ] 配置速率限制
- [ ] 设置强密码
- [ ] 启用日志记录
- [ ] 配置自动备份
- [ ] 设置监控告警
- [ ] 定期安全扫描
- [ ] 最小权限原则

---

## 更新升级

```bash
# 拉取最新代码
git pull origin main

# 更新后端
cd backend
git pull
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
sudo systemctl restart cyberpress-api

# 更新前端
cd frontend
git pull
npm install
npm run build
pm2 restart cyberpress-frontend
```

---

## 支持

- 文档: [https://docs.cyberpress.dev](https://docs.cyberpress.dev)
- 问题反馈: [GitHub Issues](https://github.com/cyberpress/platform/issues)
- 邮箱: support@cyberpress.dev

---

*最后更新: 2026-03-03*
