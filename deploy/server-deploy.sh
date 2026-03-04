#!/bin/bash
# CyberPress 服务器端部署脚本 (使用阿里云镜像)
# 此脚本将在服务器上执行

set -e

DEPLOY_PATH="/var/www/cyberpress"

echo "========================================"
echo "CyberPress 服务器部署"
echo "========================================"
echo ""

# 检查并安装 Docker (使用阿里云镜像)
if ! command -v docker &> /dev/null; then
    echo "安装 Docker (使用阿里云镜像)..."
    
    # 使用阿里云 Docker 安装脚本
    curl -fsSL https://get.docker.com | sh -s -- --mirror Aliyun
    
    # 或者使用 DaoCloud 镜像
    # curl -sSL https://get.daocloud.io/docker | sh
    
    # 启动 Docker
    systemctl start docker
    systemctl enable docker
    echo "✓ Docker 安装完成"
fi

# 检查 Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "安装 Docker Compose..."
    # 使用国内镜像加速
    curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose || \
    curl -L "https://get.daocloud.io/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    
    chmod +x /usr/local/bin/docker-compose
    echo "✓ Docker Compose 安装完成"
fi

# 配置 Docker 镜像加速
echo "配置 Docker 镜像加速..."
mkdir -p /etc/docker
cat > /etc/docker/daemon.json << 'JSONEOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
JSONEOF
systemctl restart docker
echo "✓ Docker 镜像加速配置完成"

# 显示 Docker 版本
echo ""
echo "Docker 版本:"
docker --version
docker-compose --version
echo ""

# 解压文件
echo "解压项目文件..."
cd ~/deploy
if [ -f cyberpress_*.tar.gz ]; then
    tar -xzf cyberpress_*.tar.gz
    echo "✓ 文件解压完成"
else
    echo "✗ 错误: 未找到压缩包"
    exit 1
fi

# 创建部署目录
echo "创建部署目录..."
mkdir -p $DEPLOY_PATH
cp -r cyberpress/* $DEPLOY_PATH/
cd $DEPLOY_PATH
echo "✓ 文件复制完成"

# 配置后端环境变量
echo "配置后端环境变量..."
cat > backend/.env << 'ENVEOF'
DATABASE_URL=postgresql://cyberpress:cyberpress123@postgres:5432/cyberpress
SECRET_KEY=cyberpress-secret-key-2026-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost:3000","http://43.139.128.127:3000"]
HOST=0.0.0.0
PORT=8000
DEBUG=false
ENVEOF
echo "✓ 后端配置完成"

# 配置前端环境变量
echo "配置前端环境变量..."
cat > frontend/.env.local << 'ENVEOF'
NEXT_PUBLIC_API_URL=http://43.139.128.127:8000
NEXT_PUBLIC_SITE_URL=http://43.139.128.127:3000
ENVEOF
echo "✓ 前端配置完成"

# 开放防火墙端口
echo "配置防火墙..."
if command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-port=3000/tcp 2>/dev/null || true
    firewall-cmd --permanent --add-port=8000/tcp 2>/dev/null || true
    firewall-cmd --reload 2>/dev/null || true
    echo "✓ 防火墙端口已开放: 3000, 8000"
fi

# 启动服务
echo ""
echo "启动 Docker 服务（这可能需要几分钟）..."
docker-compose up -d --build

# 等待启动
echo "等待服务启动..."
sleep 30

# 检查状态
echo ""
echo "服务状态:"
docker-compose ps

echo ""
echo "========================================"
echo "✓ 部署完成！"
echo "========================================"
echo ""
echo "访问地址:"
echo "  前端: http://43.139.128.127:3000"
echo "  后端: http://43.139.128.127:8000"
echo "  API 文档: http://43.139.128.127:8000/docs"
echo ""
echo "查看日志:"
echo "  cd $DEPLOY_PATH && docker-compose logs -f"
echo ""
