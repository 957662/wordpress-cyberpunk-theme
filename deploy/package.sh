#!/bin/bash
# CyberPress 部署打包脚本
# 用途：打包项目文件用于部署

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="/root/.openclaw/workspace/cyberpress-platform"
DEPLOY_DIR="$PROJECT_ROOT/deploy"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PACKAGE_NAME="cyberpress_${TIMESTAMP}.tar.gz"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}CyberPress 部署打包工具${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 切换到项目根目录
cd "$PROJECT_ROOT"

# 清理旧的打包文件
echo -e "${YELLOW}清理旧的打包文件...${NC}"
rm -f deploy/cyberpress_*.tar.gz

# 创建临时目录
TEMP_DIR=$(mktemp -d)
PACKAGE_DIR="$TEMP_DIR/cyberpress"
mkdir -p "$PACKAGE_DIR"

echo -e "${YELLOW}复制项目文件...${NC}"

# 复制必要文件
# 后端
echo "  - 复制后端文件..."
cp -r backend "$PACKAGE_DIR/"
find "$PACKAGE_DIR/backend" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find "$PACKAGE_DIR/backend" -type d -name "venv" -exec rm -rf {} + 2>/dev/null || true
find "$PACKAGE_DIR/backend" -type d -name ".venv" -exec rm -rf {} + 2>/dev/null || true
find "$PACKAGE_DIR/backend" -type d -name "env" -exec rm -rf {} + 2>/dev/null || true
rm -f "$PACKAGE_DIR/backend/.env" 2>/dev/null || true

# 前端
echo "  - 复制前端文件..."
cp -r frontend "$PACKAGE_DIR/"
find "$PACKAGE_DIR/frontend" -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
find "$PACKAGE_DIR/frontend" -type d -name ".next" -exec rm -rf {} + 2>/dev/null || true
rm -f "$PACKAGE_DIR/frontend/.env.local" 2>/dev/null || true

# 配置文件
echo "  - 复制配置文件..."
cp -r .github "$PACKAGE_DIR/" 2>/dev/null || true
cp docker-compose.yml "$PACKAGE_DIR/" 2>/dev/null || true
cp docker-compose.production.yml "$PACKAGE_DIR/" 2>/dev/null || true
cp Dockerfile "$PACKAGE_DIR/" 2>/dev/null || true
cp .dockerignore "$PACKAGE_DIR/" 2>/dev/null || true

# 文档
echo "  - 复制文档..."
cp README.md "$PACKAGE_DIR/" 2>/dev/null || true
cp CHANGELOG.md "$PACKAGE_DIR/" 2>/dev/null || true
cp LICENSE "$PACKAGE_DIR/" 2>/dev/null || true

# 部署脚本
echo "  - 复制部署脚本..."
cp -r deploy "$PACKAGE_DIR/" 2>/dev/null || true

# 创建部署说明
cat > "$PACKAGE_DIR/DEPLOY.md" << 'DEPLOY_EOF'
# CyberPress 部署说明

## 快速部署

1. 解压文件
```bash
tar -xzf cyberpress_*.tar.gz
cd cyberpress
```

2. 配置环境变量
```bash
# 后端
cp backend/.env.example backend/.env
# 编辑 backend/.env 配置数据库等

# 前端
cp frontend/.env.example frontend/.env.local
# 编辑 frontend/.env.local 配置 API 地址
```

3. 启动服务
```bash
# 使用 Docker Compose
docker-compose up -d

# 或手动启动
# 后端
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000

# 前端
cd frontend
npm install
npm run build
npm start
```

4. 访问应用
- 前端: http://YOUR_IP:3000
- 后端 API: http://YOUR_IP:8000
- API 文档: http://YOUR_IP:8000/docs

## 端口说明

- 3000: 前端服务
- 8000: 后端 API
- 5432: PostgreSQL (如果使用 Docker)
- 6379: Redis (如果使用 Docker)

## 注意事项

- 确保防火墙开放相应端口
- 生产环境请修改默认密码
- 建议使用 HTTPS (需要配置 SSL 证书)
DEPLOY_EOF

# 打包
echo -e "${YELLOW}创建压缩包...${NC}"
cd "$TEMP_DIR"
tar -czf "$DEPLOY_DIR/$PACKAGE_NAME" cyberpress/

# 清理临时目录
rm -rf "$TEMP_DIR"

# 计算文件大小
SIZE=$(du -h "$DEPLOY_DIR/$PACKAGE_NAME" | cut -f1)

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}打包完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "文件名: ${YELLOW}$PACKAGE_NAME${NC}"
echo -e "大小: ${YELLOW}$SIZE${NC}"
echo -e "路径: ${YELLOW}$DEPLOY_DIR/$PACKAGE_NAME${NC}"
echo ""
echo -e "下一步："
echo -e "  1. 上传: ${YELLOW}bash deploy/upload.sh${NC}"
echo -e "  2. 部署: ${YELLOW}bash deploy/deploy.sh${NC}"
echo ""
