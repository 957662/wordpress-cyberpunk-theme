# 🚀 CyberPress Platform - 部署指南

> CyberPress Platform 生产环境部署完整指南

## 📋 目录

- [系统要求](#系统要求)
- [环境准备](#环境准备)
- [配置说明](#配置说明)
- [部署步骤](#部署步骤)
- [SSL 证书配置](#ssl-证书配置)
- [监控和日志](#监控和日志)
- [备份和恢复](#备份和恢复)
- [故障排除](#故障排除)

---

## 系统要求

### 最低配置

- **CPU**: 2 核心
- **内存**: 4 GB RAM
- **存储**: 20 GB 可用空间
- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+

### 推荐配置

- **CPU**: 4+ 核心
- **内存**: 8+ GB RAM
- **存储**: 50+ GB SSD
- **网络**: 100 Mbps+ 带宽

### 软件要求

- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Git**: 2.30+
- **Nginx**: 1.20+ (如果使用外部 Nginx)

---

## 环境准备

### 1. 安装 Docker 和 Docker Compose

#### Ubuntu/Debian

```bash
# 更新系统
sudo apt-get update && sudo apt-get upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

#### CentOS/RHEL

```bash
# 安装 Docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. 克隆项目

```bash
# 克隆代码库
git clone https://github.com/957662/wordpress-cyberpunk-theme.git cyberpress-platform
cd cyberpress-platform

# 切换到生产分支
git checkout production
```

### 3. 创建必要的目录

```bash
# 创建数据目录
mkdir -p backend/uploads
mkdir -p backend/logs
mkdir -p docker/ssl
mkdir -p docker/prometheus
mkdir -p docker/grafana/provisioning

# 设置权限
chmod -R 755 backend/uploads
chmod -R 755 backend/logs
```

---

## 配置说明

### 1. 后端配置

```bash
# 复制配置模板
cd backend
cp .env.production.template .env.production

# 编辑配置文件
nano .env.production
```

**重要配置项**:

```env
# 数据库密码（必须修改）
POSTGRES_PASSWORD=your_very_secure_password

# Redis 密码（必须修改）
REDIS_PASSWORD=your_very_secure_password

# 应用密钥（必须修改）
SECRET_KEY=your_very_long_and_secure_secret_key

# JWT 密钥（必须修改）
JWT_SECRET_KEY=your_jwt_secret_key

# 允许的域名
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 2. 前端配置

```bash
# 复制配置模板
cd ../frontend
cp .env.production.template .env.production

# 编辑配置文件
nano .env.production
```

**重要配置项**:

```env
# 后端 API 地址
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com

# WebSocket 地址
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com/ws

# 应用 URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. 生成安全密钥

```bash
# 生成随机密钥
openssl rand -hex 32

# 或者使用 Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

---

## 部署步骤

### 快速部署

```bash
# 1. 配置环境变量
cd backend && cp .env.production.template .env.production
cd ../frontend && cp .env.production.template .env.production

# 2. 编辑配置文件，设置正确的值
# nano backend/.env.production
# nano frontend/.env.production

# 3. 运行部署脚本
cd ..
chmod +x deploy/deploy.sh
./deploy/deploy.sh full
```

### 手动部署

#### 1. 构建镜像

```bash
# 构建所有镜像
docker-compose -f docker-compose.production.yml build

# 或者单独构建
docker-compose -f docker-compose.production.yml build backend
docker-compose -f docker-compose.production.yml build frontend
```

#### 2. 启动服务

```bash
# 启动所有服务
docker-compose -f docker-compose.production.yml up -d

# 查看服务状态
docker-compose -f docker-compose.production.yml ps

# 查看日志
docker-compose -f docker-compose.production.yml logs -f
```

#### 3. 运行数据库迁移

```bash
# 进入后端容器
docker-compose -f docker-compose.production.yml exec backend bash

# 运行迁移
alembic upgrade head

# 退出容器
exit
```

#### 4. 创建管理员用户

```bash
# 进入后端容器
docker-compose -f docker-compose.production.yml exec backend bash

# 运行创建脚本
python scripts/create_admin.py

# 或者使用 Python shell
python
```

```python
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.core.security import get_password_hash
from app.core.config import settings

async def create_admin():
    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        admin = User(
            username="admin",
            email="admin@yourdomain.com",
            hashed_password=get_password_hash("your_admin_password"),
            is_superuser=True,
            is_active=True
        )
        session.add(admin)
        await session.commit()
        print("管理员用户创建成功")

asyncio.run(create_admin())
exit()
```

---

## SSL 证书配置

### 使用 Let's Encrypt（推荐）

#### 1. 安装 Certbot

```bash
sudo apt-get install certbot python3-certbot-nginx
```

#### 2. 获取证书

```bash
# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 证书将自动安装到 Nginx
```

#### 3. 自动续期

```bash
# Certbot 会自动设置续期任务
# 测试续期
sudo certbot renew --dry-run
```

### 使用自签名证书（开发环境）

```bash
# 生成自签名证书
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout docker/ssl/key.pem \
  -out docker/ssl/cert.pem \
  -subj "/CN=yourdomain.com"

# 设置权限
chmod 600 docker/ssl/key.pem
chmod 644 docker/ssl/cert.pem
```

---

## 监控和日志

### 查看服务状态

```bash
# 查看所有服务
docker-compose -f docker-compose.production.yml ps

# 查看资源使用
docker stats
```

### 查看日志

```bash
# 查看所有服务日志
docker-compose -f docker-compose.production.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose.production.yml logs -f backend
docker-compose -f docker-compose.production.yml logs -f frontend

# 查看最近 100 行日志
docker-compose -f docker-compose.production.yml logs --tail=100
```

### 访问监控工具

- **Prometheus**: http://your-domain:9090
- **Grafana**: http://your-domain:3001 (默认密码: admin)

---

## 备份和恢复

### 数据库备份

```bash
# 创建备份
docker-compose -f docker-compose.production.yml exec postgres pg_dump -U cyberpress cyberpress > backup_$(date +%Y%m%d_%H%M%S).sql

# 恢复备份
docker-compose -f docker-compose.production.yml exec -T postgres psql -U cyberpress cyberpress < backup_20240301_120000.sql
```

### 文件备份

```bash
# 备份上传文件
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz backend/uploads/

# 恢复上传文件
tar -xzf uploads_backup_20240301.tar.gz -C backend/
```

### 自动备份脚本

创建 `scripts/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/cyberpress"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 数据库备份
docker-compose -f docker-compose.production.yml exec postgres pg_dump -U cyberpress cyberpress > $BACKUP_DIR/db_$DATE.sql

# 文件备份
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz backend/uploads/

# 删除 7 天前的备份
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

添加到 crontab:

```bash
# 每天凌晨 2 点备份
0 2 * * * /path/to/scripts/backup.sh
```

---

## 故障排除

### 服务无法启动

```bash
# 查看详细日志
docker-compose -f docker-compose.production.yml logs

# 检查端口占用
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :8000

# 检查磁盘空间
df -h
```

### 数据库连接失败

```bash
# 检查数据库服务
docker-compose -f docker-compose.production.yml ps postgres

# 查看数据库日志
docker-compose -f docker-compose.production.yml logs postgres

# 进入数据库容器
docker-compose -f docker-compose.production.yml exec postgres psql -U cyberpress cyberpress
```

### Nginx 配置错误

```bash
# 测试 Nginx 配置
docker-compose -f docker-compose.production.yml exec nginx nginx -t

# 重载 Nginx
docker-compose -f docker-compose.production.yml exec nginx nginx -s reload
```

### 清理和重启

```bash
# 停止所有服务
docker-compose -f docker-compose.production.yml down

# 删除所有容器和卷（谨慎使用）
docker-compose -f docker-compose.production.yml down -v

# 重新启动
docker-compose -f docker-compose.production.yml up -d
```

---

## 性能优化

### 1. 启用缓存

```bash
# 编辑前端配置
nano frontend/.env.production

# 添加
NEXT_PUBLIC_CACHE_ENABLED=true
NEXT_PUBLIC_CACHE_TIME=300000
```

### 2. 调整数据库连接池

```bash
# 编辑后端配置
nano backend/.env.production

# 添加
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=0
```

### 3. 启用 CDN

```bash
# 编辑前端配置
nano frontend/.env.production

# 添加
NEXT_PUBLIC_CDN_URL=https://cdn.yourdomain.com
```

---

## 安全建议

1. **定期更新**:
   ```bash
   # 更新系统
   sudo apt-get update && sudo apt-get upgrade -y

   # 更新 Docker 镜像
   docker-compose -f docker-compose.production.yml pull
   docker-compose -f docker-compose.production.yml up -d
   ```

2. **配置防火墙**:
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

3. **定期备份**:
   - 设置自动备份任务
   - 测试备份恢复流程

4. **监控日志**:
   - 定期检查错误日志
   - 设置异常告警

---

## 支持

如有问题，请联系:

- **Email**: 2835879683@qq.com
- **GitHub Issues**: https://github.com/957662/wordpress-cyberpunk-theme/issues
- **文档**: https://github.com/957662/wordpress-cyberpunk-theme/wiki

---

**最后更新**: 2026-03-05
**版本**: 1.0.0
