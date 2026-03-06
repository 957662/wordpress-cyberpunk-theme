#!/bin/bash

#
# CyberPress Platform - 生产环境构建脚本
#

set -e

echo "🚀 CyberPress Platform - 生产环境构建"
echo "======================================"
echo ""

# 检查环境变量
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV=production
fi

echo "📋 构建配置:"
echo "  - 环境: $NODE_ENV"
echo "  - Node.js: $(node -v)"
echo "  - npm: $(npm -v)"
echo ""

# 清理旧构建
echo "🧹 清理旧构建..."
rm -rf .next
rm -rf out
rm -rf dist

# 安装依赖
echo "📦 安装依赖..."
npm ci

# 运行类型检查
echo "🔍 TypeScript 类型检查..."
npm run type-check

# 运行 Lint
echo "🔍 ESLint 检查..."
npm run lint

# 运行测试
echo "🧪 运行测试..."
npm run test:ci

# 构建前端
echo "🏗️  构建前端应用..."
npm run build

# 检查构建结果
if [ ! -d ".next" ]; then
    echo "❌ 构建失败：.next 目录不存在"
    exit 1
fi

echo ""
echo "✅ 构建完成！"
echo ""
echo "📊 构建统计:"
du -sh .next
du -sh node_modules
echo ""

# 可选：启动生产服务器
read -p "是否启动生产服务器? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 启动生产服务器..."
    npm start
fi
