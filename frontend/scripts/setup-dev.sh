#!/bin/bash

#
# CyberPress Platform - 开发环境快速设置脚本
#

set -e

echo "🚀 CyberPress Platform - 开发环境设置"
echo "======================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    echo "请从 https://nodejs.org/ 下载安装 Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js 版本: $NODE_VERSION"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm 版本: $NPM_VERSION"

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安装"
    echo "请从 https://www.python.org/ 下载安装 Python 3.11+"
    exit 1
fi

PYTHON_VERSION=$(python3 --version)
echo "✅ Python 版本: $PYTHON_VERSION"

# 检查 Git
if ! command -v git &> /dev/null; then
    echo "❌ Git 未安装"
    echo "请从 https://git-scm.com/ 下载安装 Git"
    exit 1
fi

GIT_VERSION=$(git --version)
echo "✅ Git 版本: $GIT_VERSION"

echo ""
echo "📦 安装前端依赖..."
cd frontend
npm install

echo ""
echo "🔧 配置环境变量..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ 已创建 .env.local 文件"
    echo "⚠️  请编辑 .env.local 配置你的环境变量"
else
    echo "ℹ️  .env.local 文件已存在"
fi

echo ""
echo "📦 安装后端依赖..."
cd ../backend

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo "创建 Python 虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
echo "安装 Python 依赖..."
pip install -r requirements.txt

echo ""
echo "🔧 配置后端环境变量..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ 已创建 .env 文件"
    echo "⚠️  请编辑 .env 配置你的环境变量"
else
    echo "ℹ️  .env 文件已存在"
fi

echo ""
echo "🗄️  设置数据库..."
read -p "是否需要初始化数据库? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # 检查 PostgreSQL
    if command -v psql &> /dev/null; then
        echo "✅ 检测到 PostgreSQL"
    else
        echo "⚠️  未检测到 PostgreSQL"
        echo "请确保 PostgreSQL 已安装并运行"
        echo "或使用 Docker: docker-compose up -d postgres"
    fi

    # 运行迁移
    echo "运行数据库迁移..."
    alembic upgrade head
fi

echo ""
echo "🎉 开发环境设置完成！"
echo ""
echo "📝 下一步:"
echo "1. 编辑 frontend/.env.local 和 backend/.env 配置环境变量"
echo "2. 启动后端: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "3. 启动前端: cd frontend && npm run dev"
echo "4. 访问 http://localhost:3000"
echo ""
echo "📚 更多信息请查看 README.md"
echo ""
