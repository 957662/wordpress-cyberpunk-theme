#!/bin/bash

# CyberPress Platform - 重启开发环境脚本

# 颜色定义
BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${BLUE}🔄 CyberPress Platform - 重启开发环境${NC}"
echo ""

# 先停止
./stop-dev.sh

echo ""
echo -e "${GREEN}等待3秒后重启...${NC}"
sleep 3

# 再启动
./start-dev.sh
