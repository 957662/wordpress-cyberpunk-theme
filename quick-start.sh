#!/bin/bash

# CyberPress Platform - Quick Start Script
# 快速启动脚本

set -e

echo "🚀 CyberPress Platform - Quick Start"
echo "=================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ $1 is installed${NC}"
    fi
}

echo "📋 Checking prerequisites..."
check_command node
check_command python
check_command docker
check_command docker-compose
echo ""

# 获取选项
echo "请选择启动方式:"
echo "1. Docker Compose (推荐)"
echo "2. 手动启动"
echo "3. 仅启动前端"
echo "4. 仅启动后端"
read -p "请输入选项 (1-4): " choice

case $choice in
    1)
        echo -e "${BLUE}🐳 Starting with Docker Compose...${NC}"
        echo ""

        # 检查环境变量文件
        if [ ! -f backend/.env ]; then
            echo -e "${YELLOW}⚠️  backend/.env not found, creating from example...${NC}"
            cp backend/.env.example backend/.env
            echo -e "${GREEN}✅ Created backend/.env${NC}"
        fi

        if [ ! -f frontend/.env.local ]; then
            echo -e "${YELLOW}⚠️  frontend/.env.local not found, creating from example...${NC}"
            cp frontend/.env.local.example frontend/.env.local
            echo -e "${GREEN}✅ Created frontend/.env.local${NC}"
        fi

        # 启动服务
        echo -e "${BLUE}🔧 Building and starting services...${NC}"
        docker-compose up -d

        echo ""
        echo -e "${GREEN}✅ Services started successfully!${NC}"
        echo ""
        echo "📍 Access URLs:"
        echo "  🌐 Frontend: http://localhost:3000"
        echo "  🔧 Backend:  http://localhost:8000"
        echo "  📚 API Docs: http://localhost:8000/docs"
        echo "  🐘 PostgreSQL: localhost:5432"
        echo "  🔴 Redis: localhost:6379"
        echo ""
        echo "📋 Useful commands:"
        echo "  View logs: docker-compose logs -f"
        echo "  Stop services: docker-compose down"
        echo "  Restart: docker-compose restart"
        ;;

    2)
        echo -e "${BLUE}🔧 Starting manually...${NC}"
        echo ""

        # 启动数据库
        echo -e "${BLUE}🐘 Starting PostgreSQL...${NC}"
        docker-compose up -d postgres redis

        # 等待数据库启动
        sleep 5

        # 初始化数据库
        echo -e "${BLUE}📊 Initializing database...${NC}"
        if [ -f backend/database/postgres-schema.sql ]; then
            docker-compose exec -T postgres psql -U cyberpress -d cyberpress < backend/database/postgres-schema.sql
            echo -e "${GREEN}✅ Database schema created${NC}"
        fi

        # 启动后端
        echo -e "${BLUE}🔧 Starting backend...${NC}"
        cd backend
        if [ ! -d venv ]; then
            python -m venv venv
        fi
        source venv/bin/activate
        pip install -r requirements.txt -q
        uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
        BACKEND_PID=$!
        cd ..

        # 启动前端
        echo -e "${BLUE}🎨 Starting frontend...${NC}"
        cd frontend
        if [ ! -d node_modules ]; then
            npm install
        fi
        npm run dev &
        FRONTEND_PID=$!
        cd ..

        echo ""
        echo -e "${GREEN}✅ Services started successfully!${NC}"
        echo ""
        echo "📍 Access URLs:"
        echo "  🌐 Frontend: http://localhost:3000"
        echo "  🔧 Backend:  http://localhost:8000"
        echo "  📚 API Docs: http://localhost:8000/docs"
        echo ""
        echo "Press Ctrl+C to stop all services"

        # 等待用户中断
        trap "kill $BACKEND_PID $FRONTEND_PID; docker-compose down; exit" INT
        wait
        ;;

    3)
        echo -e "${BLUE}🎨 Starting frontend only...${NC}"
        cd frontend
        if [ ! -d node_modules ]; then
            echo -e "${BLUE}📦 Installing dependencies...${NC}"
            npm install
        fi
        echo -e "${BLUE}🚀 Starting development server...${NC}"
        npm run dev
        ;;

    4)
        echo -e "${BLUE}🔧 Starting backend only...${NC}"
        cd backend

        # 检查虚拟环境
        if [ ! -d venv ]; then
            echo -e "${BLUE}📦 Creating virtual environment...${NC}"
            python -m venv venv
        fi

        # 激活虚拟环境
        source venv/bin/activate

        # 安装依赖
        echo -e "${BLUE}📦 Installing dependencies...${NC}"
        pip install -r requirements.txt -q

        # 启动服务
        echo -e "${BLUE}🚀 Starting FastAPI server...${NC}"
        uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
        ;;

    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✨ Done!${NC}"
echo -e "${BLUE}📖 For more information, see README.md${NC}"
