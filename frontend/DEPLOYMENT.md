# CyberPress 部署指南

本指南涵盖 CyberPress 平台的完整部署流程。

## 前端部署

### Vercel 部署（推荐）

#### 1. 准备工作

确保你已经：
- 安装了 Vercel CLI
- 拥有 GitHub/GitLab/Bitbucket 账户
- 项目已推送到 Git 仓库

#### 2. 部署步骤

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

#### 3. 环境变量配置

在 Vercel 控制台配置以下环境变量：

```env
NEXT_PUBLIC_WP_API_URL=https://api.cyberpress.dev/wp-json
NEXT_PUBLIC_SITE_URL=https://cyberpress.dev
```

#### 4. 自定义域名

1. 在 Vercel 项目设置中添加自定义域名
2. 更新 DNS 记录：
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Netlify 部署

#### 1. 连接仓库

1. 登录 [Netlify](https://netlify.com)
2. 点击 "New site from Git"
3. 选择你的仓库

#### 2. 构建设置

```
Build command: npm run build
Publish directory: .next
```

#### 3. 环境变量

在 Site settings > Environment variables 中添加：

```env
NEXT_PUBLIC_WP_API_URL=https://api.cyberpress.dev/wp-json
NEXT_PUBLIC_SITE_URL=https://cyberpress.dev
```

### Docker 部署

#### 1. 构建镜像

```bash
cd frontend
docker build -t cyberpress-frontend .
```

#### 2. 运行容器

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_WP_API_URL=https://api.cyberpress.dev/wp-json \
  cyberpress-frontend
```

#### 3. 使用 Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_WP_API_URL=https://api.cyberpress.dev/wp-json
      - NEXT_PUBLIC_SITE_URL=https://cyberpress.dev
```

### 自建服务器部署

#### 1. 准备服务器

推荐配置：
- CPU: 2 核心以上
- 内存: 4GB 以上
- 磁盘: 40GB 以上 SSD
- 系统: Ubuntu 22.04 LTS

#### 2. 安装 Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 3. 安装 PM2

```bash
sudo npm install -g pm2
```

#### 4. 部署应用

```bash
# 克隆代码
git clone https://github.com/your-org/cyberpress-platform.git
cd cyberpress-platform/frontend

# 安装依赖
npm install

# 构建生产版本
npm run build

# 使用 PM2 启动
pm2 start npm --name "cyberpress" -- start

# 保存 PM2 配置
pm2 save
pm2 startup
```

#### 5. 配置 Nginx

创建 `/etc/nginx/sites-available/cyberpress`:

```nginx
server {
    listen 80;
    server_name cyberpress.dev www.cyberpress.dev;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用站点：

```bash
sudo ln -s /etc/nginx/sites-available/cyberpress /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. 配置 SSL

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d cyberpress.dev -d www.cyberpress.dev
```

## 后端部署

### Docker Compose 部署

#### 1. 准备配置文件

复制并编辑 `.env`:

```bash
cp backend/.env.example backend/.env
```

#### 2. 启动服务

```bash
cd backend
docker-compose up -d
```

#### 3. 初始化 WordPress

访问 `http://your-server:8080` 完成初始化。

### Kubernetes 部署

#### 1. 创建命名空间

```bash
kubectl create namespace cyberpress
```

#### 2. 部署 WordPress

```yaml
# wordpress-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress
  namespace: cyberpress
spec:
  replicas: 2
  selector:
    matchLabels:
      app: wordpress
  template:
    metadata:
      labels:
        app: wordpress
    spec:
      containers:
      - name: wordpress
        image: wordpress:6.4-php8.2-fpm
        env:
        - name: WORDPRESS_DB_HOST
          value: mysql-service
        - name: WORDPRESS_DB_NAME
          value: cyberpress
        - name: WORDPRESS_DB_USER
          value: cyberpress
        - name: WORDPRESS_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: password
```

#### 3. 创建服务

```yaml
# wordpress-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: wordpress
  namespace: cyberpress
spec:
  selector:
    app: wordpress
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
```

#### 4. 部署

```bash
kubectl apply -f wordpress-deployment.yaml
kubectl apply -f wordpress-service.yaml
```

### 托管 WordPress 服务

#### WordPress.com VIP

适合高流量企业级站点。

#### WP Engine

专业的 WordPress 托管服务。

#### Kinsta

高性能 WordPress 托管。

## CI/CD

### GitHub Actions

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: Build
      run: npm run build
      env:
        NEXT_PUBLIC_WP_API_URL: ${{ secrets.WP_API_URL }}

    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### GitLab CI

创建 `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  image: node:18
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .next

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache openssh-client
    - ssh $SSH_USER@$SSH_HOST "cd /var/www/cyberpress && git pull && npm install && npm run build && pm2 restart cyberpress"
  only:
    - main
```

## 监控

### 前端监控

#### Vercel Analytics

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

#### Sentry 错误追踪

```typescript
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

### 后端监控

#### WordPress 监控插件

- Query Monitor - 查询分析
- New Relic - 性能监控
- Status Page - 状态监控

## 性能优化

### 前端优化

1. **启用 ISR**

```typescript
export const revalidate = 3600 // 1 hour
```

2. **图片优化**

```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  width={800}
  height={600}
  priority
/>
```

3. **代码分割**

```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loading />,
})
```

### 后端优化

1. **启用对象缓存**

```php
define('WP_REDIS_HOST', 'redis');
define('WP_REDIS_PORT', 6379);
```

2. **数据库优化**

```sql
ALTER TABLE wp_posts ADD INDEX (post_status);
ALTER TABLE wp_posts ADD INDEX (post_type);
```

3. **CDN 配置**

使用 Cloudflare 或 AWS CloudFront。

## 备份

### 数据库备份

```bash
# 手动备份
wp db export backup_$(date +%Y%m%d).sql

# 自动备份（cron）
0 2 * * * wp db export /backups/db_$(date +\%Y\%m\%d).sql
```

### 文件备份

```bash
# 备份上传文件
rsync -avz wp-content/uploads/ /backups/uploads/
```

### 自动化备份

使用 UpdraftPlus 或 BackupBuddy 插件。

## 安全

### 安全最佳实践

1. **更新 WordPress**

```bash
wp core update
wp plugin update --all
wp theme update --all
```

2. **限制登录尝试**

安装 Limit Login Attempts Reloaded 插件。

3. **启用 HTTPS**

确保 SSL 证书有效并强制 HTTPS。

4. **文件权限**

```bash
find /var/www/html -type d -exec chmod 755 {} \;
find /var/www/html -type f -exec chmod 644 {} \;
```

## 故障排除

### 常见问题

1. **构建失败**

检查环境变量配置和依赖版本。

2. **API 请求失败**

验证 CORS 配置和 JWT 认证。

3. **静态资源 404**

检查 `next.config.js` 中的图片域名配置。

### 日志查看

```bash
# PM2 日志
pm2 logs cyberpress

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# WordPress 日志
sudo tail -f /var/www/html/wp-content/debug.log
```

## 支持

遇到问题？联系：

- Email: support@cyberpress.dev
- GitHub Issues: https://github.com/your-org/cyberpress-platform/issues
- 文档: https://docs.cyberpress.dev
