#!/bin/bash

# CyberPress 项目设置脚本

set -e

echo "🚀 开始设置 CyberPress 项目..."

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 Node.js 版本
echo -e "${BLUE}📦 检查 Node.js 版本...${NC}"
NODE_VERSION=$(node -v)
echo "当前 Node.js 版本: $NODE_VERSION"

# 安装依赖
echo -e "${BLUE}📥 安装依赖...${NC}"
npm install

# 复制环境变量文件
echo -e "${BLUE}⚙️  设置环境变量...${NC}"
if [ ! -f .env.local ]; then
  cp .env.local.example .env.local
  echo -e "${GREEN}✅ 已创建 .env.local 文件${NC}"
  echo -e "${YELLOW}⚠️  请编辑 .env.local 文件并填入你的配置${NC}"
else
  echo -e "${YELLOW}⚠️  .env.local 文件已存在，跳过${NC}"
fi

# 创建必要的目录
echo -e "${BLUE}📁 创建必要的目录...${NC}"
mkdir -p public/images
mkdir -p public/uploads
mkdir -p logs
echo -e "${GREEN}✅ 目录创建完成${NC}"

# 运行类型检查
echo -e "${BLUE}🔍 运行类型检查...${NC}"
npm run type-check || echo -e "${YELLOW}⚠️  类型检查发现问题，请检查${NC}"

# 运行 Lint 检查
echo -e "${BLUE}🔍 运行 Lint 检查...${NC}"
npm run lint || echo -e "${YELLOW}⚠️  Lint 检查发现问题，请检查${NC}"

# 构建项目
echo -e "${BLUE}🔨 构建项目...${NC}"
npm run build

echo -e "${GREEN}✨ 设置完成！${NC}"
echo -e "${BLUE}📝 下一步：${NC}"
echo -e "  1. 编辑 .env.local 文件配置环境变量"
echo -e "  2. 运行 ${GREEN}npm run dev${NC} 启动开发服务器"
echo -e "  3. 访问 ${GREEN}http://localhost:3000${NC} 查看网站"
echo -e "  4. 运行 ${GREEN}npm run build${NC} 构建生产版本"
echo -e "  5. 运行 ${GREEN}npm run start${NC} 启动生产服务器"
