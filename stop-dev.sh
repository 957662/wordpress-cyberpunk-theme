#!/bin/bash

# CyberPress Platform - 停止开发环境脚本

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

print_message $BLUE "🛑 CyberPress Platform - 停止开发环境"
echo ""

# 停止后端服务
if [ -f "backend.pid" ]; then
    BACKEND_PID=$(cat backend.pid)
    if ps -p $BACKEND_PID > /dev/null; then
        print_message $YELLOW "⏹️  停止后端服务 (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
        print_message $GREEN "✅ 后端服务已停止"
    fi
    rm backend.pid
fi

# 停止前端服务
if [ -f "frontend.pid" ]; then
    FRONTEND_PID=$(cat frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null; then
        print_message $YELLOW "⏹️  停止前端服务 (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
        print_message $GREEN "✅ 前端服务已停止"
    fi
    rm frontend.pid
fi

# 停止Docker容器
print_message $YELLOW "🐳 停止 Docker 容器..."
docker-compose down

print_message $GREEN "✅ 所有服务已停止"
echo ""
print_message $BLUE "💡 提示: 使用 './start-dev.sh' 重新启动服务"
