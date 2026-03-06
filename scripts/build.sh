#!/bin/bash

# CyberPress Platform - 构建脚本
# 构建生产环境版本

set -e

echo "🏗️  CyberPress Platform 生产构建"
echo "================================"

# 清理旧的构建
echo ""
echo "🧹 清理旧的构建文件..."
rm -rf frontend/.next
rm -rf frontend/out
rm -rf backend/dist

# 构建前端
echo ""
echo "⚛️  构建前端..."
cd frontend

echo "安装依赖..."
npm ci

echo "运行类型检查..."
npm run type-check

echo "运行 Lint..."
npm run lint

echo "构建..."
npm run build

echo "✅ 前端构建完成"
cd ..

# 构建后端
echo ""
echo "🐍 构建后端..."
cd backend

echo "激活虚拟环境..."
source venv/bin/activate

echo "运行测试..."
pytest tests/

echo "构建 Python 包..."
# 如果有需要打包的代码，在这里添加

echo "✅ 后端构建完成"
deactivate
cd ..

# 构建Docker镜像
echo ""
echo "🐳 构建Docker镜像..."
if command -v docker &> /dev/null; then
    docker-compose build
    echo "✅ Docker镜像构建完成"
else
    echo "⚠️  Docker未安装，跳过镜像构建"
fi

# 完成
echo ""
echo "✅ 构建完成！"
echo ""
echo "📦 构建产物:"
echo "  前端: frontend/.next"
echo "  后端: backend/ (Python包)"
echo "  Docker: Docker镜像"
echo ""
echo "🚀 部署说明:"
echo "  1. 更新 .env 文件中的生产环境配置"
echo "  2. 运行: docker-compose -f docker-compose.production.yml up -d"
echo "     或使用你的部署工具"
