#!/usr/bin/expect -f
# CyberPress 自动部署脚本
# 用途：在服务器上解压并部署项目

set timeout 300

# 配置信息
set deploy_host "43.139.128.127"
set deploy_user "root"
set deploy_password "wyq20031110?"

# 查找最新的打包文件
set package [exec bash -c "ls -t /root/.openclaw/workspace/cyberpress-platform/deploy/cyberpress_*.tar.gz 2>/dev/null | head -1"]
set package_name [file tail $package]

puts "\033\[0;32m========================================\033\[0m"
puts "\033\[0;32mCyberPress 自动部署工具\033\[0m"
puts "\033\[0;32m========================================\033\[0m"
puts ""
puts "\033\[1;33m服务器: $deploy_host\033\[0m"
puts "\033\[1;33m用户: $deploy_user\033\[0m"
puts "\033\[1;33m文件: $package_name\033\[0m"
puts ""

# 部署脚本
set deploy_script {
    #!/bin/bash
    set -e
    
    PACKAGE_NAME="__PACKAGE_NAME__"
    DEPLOY_PATH="/var/www/cyberpress"
    
    echo -e "\033[1;33m开始部署...\033[0m"
    
    # 停止旧服务
    echo -e "\033[1;33m停止旧服务...\033[0m"
    cd "$DEPLOY_PATH" 2>/dev/null || true
    docker-compose down 2>/dev/null || true
    
    # 备份旧版本
    if [ -d "$DEPLOY_PATH" ]; then
        BACKUP_NAME="cyberpress_backup_$(date +%Y%m%d_%H%M%S).tar.gz"
        echo -e "\033[1;33m备份旧版本到: /tmp/$BACKUP_NAME\033[0m"
        tar -czf "/tmp/$BACKUP_NAME" -C "$(dirname $DEPLOY_PATH)" "$(basename $DEPLOY_PATH)" 2>/dev/null || true
    fi
    
    # 解压新版本
    echo -e "\033[1;33m解压新版本...\033[0m"
    cd ~/deploy
    tar -xzf "$PACKAGE_NAME"
    
    # 创建部署目录
    mkdir -p "$DEPLOY_PATH"
    
    # 复制文件
    echo -e "\033[1;33m复制文件到部署目录...\033[0m"
    cp -r cyberpress/* "$DEPLOY_PATH/"
    
    # 配置环境变量
    cd "$DEPLOY_PATH"
    
    # 后端环境变量
    if [ ! -f "backend/.env" ]; then
        echo -e "\033[1;33m配置后端环境变量...\033[0m"
        cat > backend/.env << 'EOF'
# Database
DATABASE_URL=postgresql://cyberpress:cyberpress123@postgres:5432/cyberpress

# JWT
SECRET_KEY=cyberpress-secret-key-change-in-production-2026
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=["http://localhost:3000","http://43.139.128.127:3000"]

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=false
EOF
    fi
    
    # 前端环境变量
    if [ ! -f "frontend/.env.local" ]; then
        echo -e "\033[1;33m配置前端环境变量...\033[0m"
        cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://43.139.128.127:8000
NEXT_PUBLIC_SITE_URL=http://43.139.128.127:3000
EOF
    fi
    
    # 检查 Docker 是否安装
    if ! command -v docker &> /dev/null; then
        echo -e "\033[0;31m错误: Docker 未安装\033[0m"
        echo "请先安装 Docker: curl -fsSL https://get.docker.com | sh"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "\033[0;31m错误: Docker Compose 未安装\033[0m"
        echo "请先安装 Docker Compose"
        exit 1
    fi
    
    # 启动 Docker 服务
    echo -e "\033[1;33m启动 Docker 服务...\033[0m"
    docker-compose up -d --build
    
    # 等待服务启动
    echo -e "\033[1;33m等待服务启动...\033[0m"
    sleep 15
    
    # 检查服务状态
    echo -e "\033[1;33m检查服务状态...\033[0m"
    docker-compose ps
    
    echo ""
    echo -e "\033[0;32m========================================\033[0m"
    echo -e "\033[0;32m部署完成！\033[0m"
    echo -e "\033[0;32m========================================\033[0m"
    echo ""
    echo -e "访问地址:"
    echo -e "  前端: \033[1;33mhttp://43.139.128.127:3000\033[0m"
    echo -e "  后端: \033[1;33mhttp://43.139.128.127:8000\033[0m"
    echo -e "  API 文档: \033[1;33mhttp://43.139.128.127:8000/docs\033[0m"
    echo ""
    echo -e "查看日志:"
    echo -e "  \033[1;33mcd $DEPLOY_PATH && docker-compose logs -f\033[0m"
    echo ""
}

# 替换变量
set deploy_script [string map [list "__PACKAGE_NAME__" $package_name] $deploy_script]

puts "\033\[1;33m执行远程部署...\033\[0m"
puts ""

spawn ssh -o StrictHostKeyChecking=no $deploy_user@$deploy_host "bash -s"
expect "password:"
send "$deploy_password\r"

expect {
    "Password:" {
        send "$deploy_password\r"
        exp_continue
    }
    "*#" {
        send "$deploy_script\r"
        expect eof
    }
    eof
}

puts ""
puts "\033\[0;32m========================================\033\[0m"
puts "\033\[0;32m部署完成！\033\[0m"
puts "\033\[0;32m========================================\033\[0m"
puts ""
