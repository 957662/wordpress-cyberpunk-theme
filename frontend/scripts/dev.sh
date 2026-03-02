#!/bin/bash

# CyberPress Platform - 开发脚本

set -e

echo "🎮 Starting CyberPress Platform development server..."

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查环境文件
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found, copying from example...${NC}"
    cp .env.local.example .env.local
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
fi

# 启动开发服务器
echo -e "${GREEN}🚀 Starting development server...${NC}"
echo -e "${BLUE}📍 URL: http://localhost:3000${NC}"
echo -e "${BLUE}💡 Press Ctrl+C to stop${NC}"

npm run dev
