#!/bin/bash
# CyberPress 自动部署脚本
# 用途：在服务器上解压并部署项目

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 配置
DEPLOY_HOST="43.139.128.127"
DEPLOY_USER="root"
DEPLOY_PASSWORD="wyq20031110?"
PACKAGE_NAME="cyberpress_20260305_045935.tar.gz"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}CyberPress 自动部署工具${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "服务器: ${YELLOW}$DEPLOY_HOST${NC}"
echo -e "用户: ${YELLOW}$DEPLOY_USER${NC}"
echo -e "文件: ${YELLOW}$PACKAGE_NAME${NC}"
echo ""

# 使用 expect 执行远程命令
expect << 'EXPECT_SCRIPT'
set timeout 600

set deploy_host "43.139.128.127"
set deploy_user "root"
set deploy_password "wyq20031110?"

spawn ssh -o StrictHostKeyChecking=no $deploy_user@$deploy_host

expect "password:"
send "$deploy_password\r"

expect "#"
send "cd ~/deploy\r"

expect "#"
send "tar -xzf cyberpress_20260305_045935.tar.gz\r"

expect "#"
send "mkdir -p /var/www/cyberpress\r"

expect "#"
send "cp -r cyberpress/* /var/www/cyberpress/\r"

expect "#"
send "cd /var/www/cyberpress\r"

expect "#"
send "cat > backend/.env << 'EOF'
DATABASE_URL=postgresql://cyberpress:cyberpress123@postgres:5432/cyberpress
SECRET_KEY=cyberpress-secret-key-2026
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=[\"http://localhost:3000\",\"http://43.139.128.127:3000\"]
HOST=0.0.0.0
PORT=8000
DEBUG=false
EOF\r"

expect "#"
send "cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://43.139.128.127:8000
NEXT_PUBLIC_SITE_URL=http://43.139.128.127:3000
EOF\r"

expect "#"
send "docker-compose up -d --build 2>&1 | tail -50\r"

expect {
    "Creating" {
        exp_continue
    }
    "Starting" {
        exp_continue
    }
    "Created" {
        exp_continue
    }
    "Started" {
        exp_continue
    }
    "#" {
        send "docker-compose ps\r"
    }
    timeout {
        puts "\n部署超时"
        exit 1
    }
}

expect "#"
send "echo '\n========================================'\r"

expect "#"
send "echo '部署完成！'\r"

expect "#"
send "echo '========================================'\r"

expect "#"
send "echo '访问地址:'\r"

expect "#"
send "echo '  前端: http://43.139.128.127:3000'\r"

expect "#"
send "echo '  后端: http://43.139.128.127:8000'\r"

expect "#"
send "echo '  API 文档: http://43.139.128.127:8000/docs'\r"

expect "#"
send "exit\r"

expect eof
EXPECT_SCRIPT

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
