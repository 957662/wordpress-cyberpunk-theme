#!/bin/bash
# CyberPress 自动部署脚本
# 用途：在服务器上解压并部署项目

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 加载配置
PROJECT_ROOT="/root/.openclaw/workspace/cyberpress-platform"
source "$PROJECT_ROOT/.deploy-env"

# 查找最新的打包文件
PACKAGE=$(ls -t "$PROJECT_ROOT/deploy"/cyberpress_*.tar.gz 2>/dev/null | head -1)
PACKAGE_NAME=$(basename "$PACKAGE")

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}CyberPress 自动部署工具${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "服务器: ${YELLOW}$DEPLOY_HOST${NC}"
echo -e "用户: ${YELLOW}$DEPLOY_USER${NC}"
echo -e "文件: ${YELLOW}$PACKAGE_NAME${NC}"
echo ""

# 检查 sshpass 是否安装
if ! command -v sshpass &> /dev/null; then
    echo -e "${YELLOW}安装 sshpass...${NC}"
    apt-get update -qq && apt-get install -y -qq sshpass
fi

# 部署脚本
DEPLOY_SCRIPT=$(cat << 'REMOTE_SCRIPT'
#!/bin/bash
set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PACKAGE_NAME="__PACKAGE_NAME__"
DEPLOY_PATH="/var/www/cyberpress"

echo -e "${GREEN}开始部署...${NC}"

# 停止旧服务
echo -e "${YELLOW}停止旧服务...${NC}"
cd "$DEPLOY_PATH" 2>/dev/null || true
docker-compose down 2>/dev/null || true

# 备份旧版本
if [ -d "$DEPLOY_PATH" ]; then
    BACKUP_NAME="cyberpress_backup_$(date +%Y%m%d_%H%M%S).tar.gz"
    echo -e "${YELLOW}备份旧版本到: $BACKUP_NAME${NC}"
    tar -czf "/tmp/$BACKUP_NAME" -C "$(dirname $DEPLOY_PATH)" "$(basename $DEPLOY_PATH)" 2>/dev/null || true
fi

# 解压新版本
echo -e "${YELLOW}解压新版本...${NC}"
cd ~/deploy
tar -xzf "$PACKAGE_NAME"

# 创建部署目录
sudo mkdir -p "$DEPLOY_PATH"
sudo chown -R $USER:$USER "$DEPLOY_PATH"

# 复制文件
echo -e "${YELLOW}复制文件到部署目录...${NC}"
cp -r cyberpress/* "$DEPLOY_PATH/"

# 配置环境变量
cd "$DEPLOY_PATH"

# 后端环境变量
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}配置后端环境变量...${NC}"
    cat > backend/.env << 'EOF'
# Database
DATABASE_URL=postgresql://cyberpress:cyberpress123@localhost:5432/cyberpress

# JWT
SECRET_KEY=your-secret-key-change-in-production-please
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
    echo -e "${YELLOW}配置前端环境变量...${NC}"
    cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://43.139.128.127:8000
NEXT_PUBLIC_SITE_URL=http://43.139.128.127:3000
EOF
fi

# 启动 Docker 服务
echo -e "${YELLOW}启动 Docker 服务...${NC}"
docker-compose up -d --build

# 等待服务启动
echo -e "${YELLOW}等待服务启动...${NC}"
sleep 10

# 检查服务状态
echo -e "${YELLOW}检查服务状态...${NC}"
docker-compose ps

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "访问地址:"
echo -e "  前端: ${YELLOW}http://43.139.128.127:3000${NC}"
echo -e "  后端: ${YELLOW}http://43.139.128.127:8000${NC}"
echo -e "  API 文档: ${YELLOW}http://43.139.128.127:8000/docs${NC}"
echo ""
echo -e "查看日志:"
echo -e "  ${YELLOW}cd $DEPLOY_PATH && docker-compose logs -f${NC}"
echo ""
REMOTE_SCRIPT
)

# 替换变量
DEPLOY_SCRIPT="${DEPLOY_SCRIPT/__PACKAGE_NAME__/$PACKAGE_NAME}"

# 执行部署
echo -e "${YELLOW}执行远程部署...${NC}"
echo ""
sshpass -p "$DEPLOY_PASSWORD" ssh -o StrictHostKeyChecking=no "$DEPLOY_USER@$DEPLOY_HOST" "$DEPLOY_SCRIPT"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}部署成功！${NC}"
echo -e "${GREEN}========================================${NC}"
