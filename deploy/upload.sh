#!/bin/bash
# CyberPress 部署上传脚本
# 用途：上传部署包到服务器

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 加载配置
PROJECT_ROOT="/root/.openclaw/workspace/cyberpress-platform"
DEPLOY_DIR="$PROJECT_ROOT/deploy"
source "$PROJECT_ROOT/.deploy-env"

# 查找最新的打包文件
PACKAGE=$(ls -t "$DEPLOY_DIR"/cyberpress_*.tar.gz 2>/dev/null | head -1)

if [ -z "$PACKAGE" ]; then
    echo -e "${RED}错误: 未找到打包文件${NC}"
    echo "请先运行: bash deploy/package.sh"
    exit 1
fi

PACKAGE_NAME=$(basename "$PACKAGE")

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}CyberPress 上传工具${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "服务器: ${YELLOW}$DEPLOY_HOST${NC}"
echo -e "用户: ${YELLOW}$DEPLOY_USER${NC}"
echo -e "文件: ${YELLOW}$PACKAGE_NAME${NC}"
echo -e "大小: ${YELLOW}$(du -h "$PACKAGE" | cut -f1)${NC}"
echo ""

# 检查 sshpass 是否安装
if ! command -v sshpass &> /dev/null; then
    echo -e "${YELLOW}安装 sshpass...${NC}"
    apt-get update -qq && apt-get install -y -qq sshpass
fi

# 创建远程目录
echo -e "${YELLOW}创建远程目录...${NC}"
sshpass -p "$DEPLOY_PASSWORD" ssh -o StrictHostKeyChecking=no "$DEPLOY_USER@$DEPLOY_HOST" "mkdir -p ~/deploy"

# 上传文件
echo -e "${YELLOW}上传文件...${NC}"
sshpass -p "$DEPLOY_PASSWORD" scp -o StrictHostKeyChecking=no "$PACKAGE" "$DEPLOY_USER@$DEPLOY_HOST:~/deploy/"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}上传完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "文件已上传到: ${YELLOW}~/deploy/$PACKAGE_NAME${NC}"
echo ""
echo -e "下一步："
echo -e "  部署: ${YELLOW}bash deploy/deploy.sh${NC}"
echo ""
