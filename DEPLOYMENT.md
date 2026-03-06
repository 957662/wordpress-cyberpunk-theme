# 🚀 CyberPress Platform 部署指南

本文档详细说明如何将 CyberPress Platform 部署到生产环境。

## 📋 部署前检查清单

在部署之前，请确保完成以下检查：

- [ ] 所有环境变量已正确配置
- [ ] 数据库迁移已执行
- [ ] 前端已成功构建
- [ ] 后端测试通过
- [ ] SSL 证书已准备
- [ ] 域名已配置
- [ ] 监控和日志系统已设置

## 🐳 Docker 部署 (推荐)

### 前置要求

- Docker >= 20.10
- Docker Compose >= 2.0
- 服务器至少 2GB RAM
- 至少 10GB 可用磁盘空间

### 部署步骤

#### 1. 准备服务器

```bash
# 更新系统
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

#### 2. 配置环境变量

```bash
# 复制环境变量文件
cp .env.example .env.production

# 编辑生产环境变量
nano .env.production
```

重要配置项：

```env
# 数据库配置
POSTGRES_USER=your_secure_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=cyberpress_prod

# Redis 配置
REDIS_PASSWORD=your_redis_password

# 后端配置
SECRET_KEY=your_super_secret_key_here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# 前端配置
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

#### 3. 构建和启动

```bash
# 构建镜像
docker-compose -f docker-compose.prod.yml build

# 启动服务
docker-compose -f docker-compose.prod.yml up -d

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f
```

#### 4. 配置 Nginx 反向代理

```nginx
# /etc/nginx/sites-available/cyberpress
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

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

    # 后端 API
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态文件
    location /static/ {
        alias /path/to/backend/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 媒体文件
    location /media/ {
        alias /path/to/backend/media/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

启用站点配置：

```bash
sudo ln -s /etc/nginx/sites-available/cyberpress /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. 配置 SSL 证书

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取 SSL 证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

## ☁️ 云平台部署

### Vercel (前端)

#### 1. 连接 GitHub 仓库

1. 登录 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 选择 `frontend` 目录作为根目录

#### 2. 配置环境变量

在 Vercel 项目设置中添加：

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

#### 3. 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
cd frontend
vercel --prod
```

### Railway (后端)

#### 1. 创建项目

1. 登录 [Railway](https://railway.app)
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择你的仓库

#### 2. 配置服务

Railway 会自动检测并提供以下服务：
- PostgreSQL 数据库
- Redis 缓存
- 后端应用

#### 3. 设置环境变量

在 Railway 项目设置中添加所有必需的环境变量。

#### 4. 部署

Railway 会自动部署，每次推送到主分支都会触发重新部署。

### AWS 部署

#### 使用 AWS ECS

```bash
# 安装 AWS CLI
pip install awscli

# 配置 AWS 凭证
aws configure

# 创建 ECR 仓库
aws ecr create-repository --repository-name cyberpress-backend
aws ecr create-repository --repository-name cyberpress-frontend

# 构建和推送镜像
# 后端
docker build -t cyberpress-backend ./backend
docker tag cyberpress-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/cyberpress-backend
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/cyberpress-backend

# 前端
docker build -t cyberpress-frontend ./frontend
docker tag cyberpress-frontend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/cyberpress-frontend
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/cyberpress-frontend
```

#### 使用 AWS RDS

```bash
# 创建 PostgreSQL 数据库
aws rds create-db-instance \
  --db-instance-identifier cyberpress-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password yourpassword \
  --allocated-storage 20
```

## 🔧 监控和维护

### 日志管理

```bash
# 查看容器日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend

# 日志轮转配置
# /etc/logrotate.d/docker-containers
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    missingok
    delaycompress
    copytruncate
}
```

### 数据库备份

```bash
# 创建备份脚本
cat > /usr/local/bin/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/cyberpress_$DATE.sql.gz"

mkdir -p $BACKUP_DIR

docker-compose exec -T postgres pg_dump -U postgres cyberpress | gzip > $BACKUP_FILE

# 保留最近7天的备份
find $BACKUP_DIR -name "cyberpress_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-db.sh

# 添加到 crontab (每天凌晨2点备份)
crontab -e
0 2 * * * /usr/local/bin/backup-db.sh
```

### 健康检查

```bash
# 创建健康检查脚本
cat > /usr/local/bin/health-check.sh << 'EOF'
#!/bin/bash
echo "Checking services..."

# 检查前端
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is down"
    # 发送告警
fi

# 检查后端
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is down"
    # 发送告警
fi

# 检查数据库
if docker-compose exec postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ Database is healthy"
else
    echo "❌ Database is down"
    # 发送告警
fi
EOF

chmod +x /usr/local/bin/health-check.sh

# 添加到 crontab (每5分钟检查)
crontab -e
*/5 * * * * /usr/local/bin/health-check.sh
```

### 性能监控

推荐使用以下工具：

- **Prometheus + Grafana** - 指标收集和可视化
- **Sentry** - 错误追踪
- **LogRocket** - 用户会话回放
- **Uptime Robot** - 网站可用性监控

## 🔐 安全配置

### 防火墙配置

```bash
# 配置 UFW 防火墙
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### fail2ban 配置

```bash
# 安装 fail2ban
sudo apt install fail2ban -y

# 创建配置文件
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
```

```bash
sudo systemctl restart fail2ban
```

## 📊 性能优化

### 数据库优化

```sql
-- 创建索引
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);

-- 配置连接池
-- 在 backend/.env 中
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=10
DB_POOL_TIMEOUT=30
```

### 缓存策略

```python
# Redis 缓存配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=yourpassword
REDIS_DB=0
CACHE_TTL=3600
```

### CDN 配置

推荐使用 CloudFlare CDN：
1. 注册 CloudFlare 账户
2. 添加你的域名
3. 更新域名服务器
4. 配置缓存规则
5. 启用 HTTPS

## 🔄 CI/CD 流程

### GitHub Actions

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/cyberpress
            git pull origin main
            docker-compose -f docker-compose.prod.yml build
            docker-compose -f docker-compose.prod.yml up -d
```

## 📝 部署后检查清单

部署完成后，请进行以下检查：

- [ ] 网站可以正常访问
- [ ] HTTPS 证书有效
- [ ] API 响应正常
- [ ] 数据库连接正常
- [ ] 文件上传功能正常
- [ ] 用户注册/登录正常
- [ ] 邮件发送正常
- [ ] 日志正常记录
- [ ] 监控告警已配置
- [ ] 备份任务已设置

## 🆘 故障排除

### 常见问题

**问题: 容器无法启动**
```bash
# 查看详细日志
docker-compose logs backend

# 重启服务
docker-compose restart backend

# 重新构建
docker-compose build backend
```

**问题: 数据库连接失败**
```bash
# 检查数据库状态
docker-compose exec postgres pg_isready

# 查看数据库日志
docker-compose logs postgres
```

**问题: 前端构建失败**
```bash
# 清除缓存
rm -rf .next node_modules
npm install
npm run build
```

## 📞 获取帮助

如果遇到问题：

1. 查看 [项目文档](./README.md)
2. 搜索 [GitHub Issues](https://github.com/your-username/cyberpress-platform/issues)
3. 创建新的 Issue
4. 联系技术支持: support@cyberpress.dev

---

**祝你部署顺利！** 🚀
