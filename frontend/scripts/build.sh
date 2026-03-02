#!/bin/bash

# CyberPress 构建脚本

set -e

echo "🔨 开始构建 CyberPress..."

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 清理旧的构建
echo -e "${BLUE}🧹 清理旧的构建...${NC}"
rm -rf .next
rm -rf out
rm -rf dist

# 类型检查
echo -e "${BLUE}🔍 运行类型检查...${NC}"
npm run type-check

# Lint 检查
echo -e "${BLUE}🔍 运行 Lint 检查...${NC}"
npm run lint

# 构建项目
echo -e "${BLUE}🔨 构建项目...${NC}"
NODE_ENV=production npm run build

# 检查构建结果
if [ -d ".next" ]; then
  echo -e "${GREEN}✅ 构建成功！${NC}"
  echo -e "${BLUE}📊 构建统计：${NC}"
  du -sh .next
  echo -e "${BLUE}📦 输出目录：${NC} .next"
else
  echo -e "${RED}❌ 构建失败！${NC}"
  exit 1
fi

echo -e "${GREEN}✨ 构建完成！${NC}"
echo -e "${BLUE}🚀 运行 ${GREEN}npm run start${NC} 启动生产服务器"
