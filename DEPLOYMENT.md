# CyberPress 部署指南

本文档详细说明了如何部署 CyberPress 平台到生产环境。

## 目录

- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [Docker 部署](#docker-部署)
- [手动部署](#手动部署)
- [云平台部署](#云平台部署)
- [性能优化](#性能优化)
- [监控和日志](#监控和日志)
- [故障排除](#故障排除)

## 环境要求

### 最低要求

- Node.js 18.x 或更高版本
- npm 9.x 或 yarn 1.22.x 或 pnpm 8.x
- WordPress 6.x
- MySQL 8.x 或 MariaDB 10.x
- Redis 6.x (可选，用于缓存)
- Nginx 1.20.x (可选，用于反向代理)

### 推荐配置

- CPU: 2 核心或更多
- 内存: 4GB 或更多
- 存储: 20GB SSD
- 带宽: 10 Mbps 或更多

## 快速开始

### 使用 Docker Compose（推荐）

```bash
# 克隆仓库
git clone https://github.com/yourusername/cyberpress-platform.git
cd cyberpress-platform

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

访问:
- 前端: http://localhost:3000
- WordPress: http://localhost:8080
- API: http://localhost:8080/wp-json

## Docker 部署

### 构建镜像

```bash
# 构建前端镜像
cd frontend
docker build -t cyberpress-frontend:latest .

# 构建后端镜像（如需要）
docker build -t cyberpress-backend:latest ./backend
```

### 运行容器

```bash
# 前端
docker run -d \
  --name cyberpress-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_WP_API_URL=http://your-wordpress-url/wp-json \
  cyberpress-frontend:latest

# WordPress
docker run -d \
  --name cyberpress-wordpress \
  -p 8080:80 \
  -e WORDPRESS_DB_HOST=db:3306 \
  -e WORDPRESS_DB_USER=wordpress \
  -e WORDPRESS_DB_PASSWORD=your-password \
  -e WORDPRESS_DB_NAME=cyberpress_db \
  --link your-mysql-container:db \
  wordpress:latest
```

### Docker Compose 生产配置

创建 `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  frontend:
    image: cyberpress-frontend:latest
    restart: always
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_WP_API_URL: https://your-domain.com/wp-json
    ports:
      - "3000:3000"

  wordpress:
    image: wordpress:latest
    restart: always
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: ${DB_USER}
      WORDPRESS_DB_PASSWORD: ${DB_PASSWORD}
      WORDPRESS_DB_NAME: cyberpress_db
    volumes:
      - wordpress_data:/var/www/html

  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: cyberpress_db
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:alpine
    restart: always
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - wordpress

volumes:
  wordpress_data:
  mysql_data:
  redis_data:
```

运行:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 手动部署

### 前端部署

#### 1. 安装依赖

```bash
cd frontend
npm install
# 或
yarn install
# 或
pnpm install
```

#### 2. 配置环境变量

创建 `.env.local`:

```env
# WordPress API
NEXT_PUBLIC_WP_API_URL=https://your-wordpress.com/wp-json

# 站点配置
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_CANONICAL_URL=https://your-domain.com

# 分析（可选）
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_BAIDU_ID=xxxxxxxxxxxx

# 其他配置
NODE_ENV=production
```

#### 3. 构建

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

#### 4. 启动

```bash
npm run start
# 或
yarn start
# 或
pnpm start
```

使用 PM2 管理进程（推荐）:

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "cyberpress" -- start

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

### WordPress 配置

#### 1. 安装 WordPress

下载并安装 WordPress 到你的服务器。

#### 2. 安装必要插件

- WordPress REST API (内置)
- Custom Post Type UI (可选)
- Advanced Custom Fields (可选)
- Redis Object Cache (可选)

#### 3. 配置 Permalinks

设置 -> 固定链接 -> 选择"文章名"

#### 4. 配置 CORS

在主题的 `functions.php` 中添加:

```php
add_action('rest_api_init', function() {
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
});
```

## 云平台部署

### Vercel (前端)

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

环境变量配置在 Vercel 控制台:
- `NEXT_PUBLIC_WP_API_URL`
- `NEXT_PUBLIC_SITE_URL`
- 等等

### Netlify (前端)

创建 `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[environment]
  NEXT_PUBLIC_WP_API_URL = "https://your-wordpress.com/wp-json"
```

### AWS

#### 使用 AWS Amplify

```bash
# 安装 Amplify CLI
npm install -g @aws-amplify/cli

# 初始化
amplify init

# 添加托管
amplify add hosting

# 发布
amplify publish
```

#### 使用 EC2

1. 启动 EC2 实例
2. 安装 Docker 和 Docker Compose
3. 克隆代码仓库
4. 运行 `docker-compose up -d`

### Google Cloud Platform

```bash
# 启动 Cloud Run
gcloud run deploy cyberpress-frontend \
  --source ./frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 性能优化

### 前端优化

1. **启用 ISR (增量静态再生成)**

在 `next.config.js` 中:

```javascript
module.exports = {
  experimental: {
    isrMemoryCacheSize: 50, // 默认 50MB
  },
}
```

2. **图片优化**

```javascript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

3. **启用缓存**

配置 Redis 缓存:

```javascript
// lib/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function get(key: string) {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function set(key: string, value: any, ttl = 3600) {
  await redis.setex(key, ttl, JSON.stringify(value));
}
```

### WordPress 优化

1. **安装缓存插件**

- W3 Total Cache
- WP Super Cache
- Redis Object Cache

2. **数据库优化**

```sql
-- 添加索引
ALTER TABLE wp_posts ADD INDEX idx_post_date (post_date);
ALTER TABLE wp_postmeta ADD INDEX idx_meta_key (meta_key);
```

3. **CDN 配置**

使用 CloudFlare 或 AWS CloudFront 分发静态资源。

## 监控和日志

### 前端监控

使用 Sentry:

```javascript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### 日志收集

使用 Winston:

```javascript
// lib/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### 性能监控

使用 Vercel Analytics:

```bash
npm install @vercel/analytics
```

在 `_app.tsx` 中:

```typescript
import { Analytics } from '@vercel/analytics/react';

function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

## 故障排除

### 常见问题

#### 1. 构建失败

```bash
# 清除缓存并重新安装
rm -rf node_modules .next
npm install
npm run build
```

#### 2. API 请求失败

检查:
- WordPress REST API 是否启用
- CORS 配置是否正确
- 防火墙规则
- 环境变量配置

#### 3. 样式不正确

```bash
# 重新生成 Tailwind CSS
npm run build:css
```

#### 4. 内存不足

增加 Node.js 内存限制:

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### 调试模式

启用调试日志:

```env
DEBUG=* npm run dev
```

查看 Docker 日志:

```bash
docker-compose logs -f frontend
docker-compose logs -f wordpress
```

## 安全最佳实践

1. **使用环境变量存储敏感信息**
2. **启用 HTTPS**
3. **定期更新依赖**
4. **配置防火墙**
5. **启用 CSP (Content Security Policy)**
6. **定期备份**

## 备份策略

### 数据库备份

```bash
# MySQL 备份
docker exec cyberpress-mysql mysqldump -u root -p cyberpress_db > backup.sql

# 定期备份
0 2 * * * docker exec cyberpress-mysql mysqldump -u root -p cyberpress_db > /backup/cyberpress_$(date +\%Y\%m\%d).sql
```

### WordPress 文件备份

```bash
docker cp cyberpress-wordpress:/var/www/html ./backup/wp-content-$(date +%Y%m%d)
```

## 更新部署

```bash
# 拉取最新代码
git pull origin main

# 更新依赖
npm install

# 重新构建
npm run build

# 重启服务
pm2 restart cyberpress
```

## 获取帮助

- GitHub Issues: https://github.com/yourusername/cyberpress-platform/issues
- 文档: https://docs.cyberpress.dev
- 邮件: support@cyberpress.dev
