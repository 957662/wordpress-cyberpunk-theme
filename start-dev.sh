#!/bin/bash

# CyberPress Platform - 开发环境启动脚本
# 自动启动所有服务

set -e

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

print_message $BLUE "🚀 CyberPress Platform - 开发环境启动"
echo ""

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    print_message $RED "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_message $RED "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 停止并删除旧容器
print_message $YELLOW "🧹 清理旧容器..."
docker-compose down 2>/dev/null || true

# 创建必要的目录
print_message $YELLOW "📁 创建必要的目录..."
mkdir -p backend/uploads
mkdir -p backend/logs
mkdir -p postgres_data

# 复制环境变量文件（如果不存在）
if [ ! -f backend/.env ]; then
    print_message $YELLOW "📝 创建后端环境变量文件..."
    cp backend/.env.example backend/.env 2>/dev/null || echo "DATABASE_URL=postgresql://cyberpress:cyberpress123@postgres:5432/cyberpress" > backend/.env
    echo "REDIS_URL=redis://redis:6379/0" >> backend/.env
    echo "SECRET_KEY=dev-secret-key-change-in-production" >> backend/.env
    echo "DEBUG=True" >> backend/.env
fi

if [ ! -f frontend/.env.local ]; then
    print_message $YELLOW "📝 创建前端环境变量文件..."
    cp frontend/.env.example frontend/.env.local 2>/dev/null || cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
EOF
fi

# 启动数据库和Redis
print_message $GREEN "🐘 启动 PostgreSQL 和 Redis..."
docker-compose up -d postgres redis

# 等待数据库启动
print_message $YELLOW "⏳ 等待数据库启动..."
sleep 10

# 检查数据库连接
print_message $YELLOW "🔍 检查数据库连接..."
until docker-compose exec -T postgres pg_isready -U cyberpress &> /dev/null; do
    echo "等待 PostgreSQL 启动..."
    sleep 2
done
print_message $GREEN "✅ 数据库已就绪"

# 启动后端
print_message $GREEN "🔧 启动后端服务..."
cd backend
if [ ! -d "venv" ]; then
    print_message $YELLOW "📦 创建 Python 虚拟环境..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt
print_message $GREEN "✅ 后端依赖已安装"

# 运行数据库迁移
if [ -f "alembic.ini" ]; then
    print_message $YELLOW "🔄 运行数据库迁移..."
    alembic upgrade head || alembic revision --autogenerate -m "Initial migration" && alembic upgrade head
fi

# 启动后端服务器（后台运行）
print_message $GREEN "🚀 启动 FastAPI 服务器..."
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > ../backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../backend.pid
cd ..

# 等待后端启动
print_message $YELLOW "⏳ 等待后端服务启动..."
sleep 5

# 检查后端健康状态
if curl -s http://localhost:8000/health > /dev/null; then
    print_message $GREEN "✅ 后端服务已启动 (http://localhost:8000)"
    print_message $BLUE "📖 API 文档: http://localhost:8000/docs"
else
    print_message $RED "❌ 后端服务启动失败，请检查日志: tail -f backend.log"
fi

# 启动前端
print_message $GREEN "🎨 启动前端服务..."
cd frontend

if [ ! -d "node_modules" ]; then
    print_message $YELLOW "📦 安装前端依赖..."
    npm install
fi

# 启动前端服务器（后台运行）
print_message $GREEN "🚀 启动 Next.js 开发服务器..."
nohup npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../frontend.pid
cd ..

# 等待前端启动
print_message $YELLOW "⏳ 等待前端服务启动..."
sleep 10

# 检查前端健康状态
if curl -s http://localhost:3000 > /dev/null; then
    print_message $GREEN "✅ 前端服务已启动 (http://localhost:3000)"
else
    print_message $YELLOW "⏳ 前端服务正在启动，请稍候..."
fi

# 打印服务信息
echo ""
print_message $BLUE "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_message $GREEN "🎉 CyberPress Platform 开发环境已启动！"
print_message $BLUE "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_message $BLUE "📊 服务状态:"
echo "  🐘 PostgreSQL:  localhost:5432"
echo "  🔴 Redis:       localhost:6379"
echo "  🔧 后端 API:    http://localhost:8000"
echo "  📖 API 文档:    http://localhost:8000/docs"
echo "  🎨 前端界面:    http://localhost:3000"
echo ""
print_message $BLUE "📝 日志文件:"
echo "  后端日志: tail -f backend.log"
echo "  前端日志: tail -f frontend.log"
echo ""
print_message $YELLOW "⏹️  停止服务:"
echo "  ./stop-dev.sh"
echo ""
print_message $YELLOW "🔧 重启服务:"
echo "  ./restart-dev.sh"
echo ""

# 保存PID到文件
echo $BACKEND_PID > backend.pid
echo $FRONTEND_PID > frontend.pid

print_message $GREEN "✅ 所有服务已启动！"
print_message $BLUE "💡 提示: 使用 'tail -f backend.log' 或 'tail -f frontend.log' 查看日志"
