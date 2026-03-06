#!/bin/bash

# CyberPress Platform - 开发环境快速设置脚本
# 这个脚本会自动设置所有必要的依赖和配置

set -e  # 遇到错误立即退出

echo "🚀 CyberPress Platform 开发环境设置"
echo "=================================="

# 检查是否安装了必要的工具
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 未安装，请先安装 $1"
        exit 1
    else
        echo "✅ $1 已安装"
    fi
}

echo "📋 检查必要的工具..."
check_command node
check_command npm
check_command python3
check_command git

# 设置后端
echo ""
echo "🐍 设置后端 (Python/FastAPI)..."
cd backend

if [ ! -d "venv" ]; then
    echo "创建 Python 虚拟环境..."
    python3 -m venv venv
fi

echo "激活虚拟环境..."
source venv/bin/activate

echo "安装 Python 依赖..."
pip install --upgrade pip
pip install -r requirements.txt

echo "创建 .env 文件..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
# Database
DATABASE_URL=postgresql://cyberpress:cyberpress123@localhost:5432/cyberpress

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT Secret
JWT_SECRET_KEY=$(openssl rand -hex 32)

# Debug
DEBUG=True

# CORS
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
EOF
    echo "✅ .env 文件已创建"
fi

echo "运行数据库迁移..."
alembic upgrade head || echo "⚠️  数据库迁移失败，请确保数据库已启动"

cd ..

# 设置前端
echo ""
echo "⚛️  设置前端 (Next.js)..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "安装 Node.js 依赖..."
    npm install
fi

echo "创建 .env.local 文件..."
if [ ! -f ".env.local" ]; then
    cat > .env.local << EOF
# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
    echo "✅ .env.local 文件已创建"
fi

cd ..

# 设置 Docker
echo ""
echo "🐳 设置 Docker 服务..."
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "启动 PostgreSQL 和 Redis 容器..."
    docker-compose up -d postgres redis
    echo "✅ Docker 服务已启动"
else
    echo "⚠️  Docker 未安装，跳过 Docker 服务设置"
    echo "   你需要手动安装 PostgreSQL 和 Redis"
fi

# 等待数据库启动
echo ""
echo "⏳ 等待数据库启动..."
sleep 5

# 创建初始数据
echo ""
echo "📝 创建初始数据..."
cd backend
source venv/bin/activate
python scripts/create_initial_data.py || echo "⚠️  创建初始数据失败"
cd ..

# 完成
echo ""
echo "✅ 设置完成！"
echo ""
echo "📖 快速开始:"
echo ""
echo "  启动后端:"
echo "    cd backend"
echo "    source venv/bin/activate"
echo "    uvicorn app.main:app --reload"
echo ""
echo "  启动前端:"
echo "    cd frontend"
echo "    npm run dev"
echo ""
echo "  或者使用 Docker Compose:"
echo "    docker-compose up"
echo ""
echo "🎉 开始开发吧！"
