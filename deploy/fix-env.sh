#!/bin/bash
echo "修复前端环境配置..."

# 创建正确的.env.local 配置（Docker 内部使用服务名）
cat > frontend/.env.local << 'ENVFILE'
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
ENVFILE

echo "✅ .env.local 已修复"
echo "Next.js 开发服务器会用 localhost，Docker 容器中 nginx 代理会处理"

# 重新构建和部署到服务器
sshpass -p "wyq20031110?" ssh -o StrictHostKeyChecking=no root@43.139.128.127 "
cd /var/www/cyberpress
docker compose down
sleep 2
docker compose up -d
sleep 5
docker compose ps
"
