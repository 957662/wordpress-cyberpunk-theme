#!/bin/bash

# WordPress 集成文件验证脚本

echo "========================================="
echo "WordPress 集成文件验证"
echo "========================================="
echo ""

# 项目根目录
PROJECT_ROOT="/root/.openclaw/workspace/cyberpress-platform"
FRONTEND_ROOT="$PROJECT_ROOT/frontend"

# 统计计数
total_files=0
existing_files=0
new_files=0

# 检查文件并记录
check_file() {
  local file="$1"
  local description="$2"

  total_files=$((total_files + 1))

  if [ -f "$file" ]; then
    echo "✅ $description"
    echo "   路径: $file"
    existing_files=$((existing_files + 1))
  else
    echo "❌ $description"
    echo "   路径: $file"
    echo "   状态: 文件不存在"
    new_files=$((new_files + 1))
  fi
  echo ""
}

echo "检查 WordPress 集成文件..."
echo ""

# WordPress 客户端和 Hooks
check_file "$FRONTEND_ROOT/lib/wordpress/client.ts" "WordPress REST API 客户端"
check_file "$FRONTEND_ROOT/lib/wordpress/hooks.ts" "React Query Hooks"
check_file "$FRONTEND_ROOT/lib/wordpress/helpers.ts" "数据适配器和辅助函数"
check_file "$FRONTEND_ROOT/lib/wordpress/index.ts" "统一导出文件"

# 类型定义
check_file "$FRONTEND_ROOT/types/api.ts" "WordPress API 类型定义"

# 示例页面
check_file "$FRONTEND_ROOT/app/blog-demo/wordpress-integration/page.tsx" "WordPress 基础集成示例页面"
check_file "$FRONTEND_ROOT/app/examples/wordpress-integration-advanced/page.tsx" "WordPress 高级集成示例页面"

# 配置文件
check_file "$PROJECT_ROOT/.env.wordpress.example" "WordPress 环境变量示例"
check_file "$PROJECT_ROOT/WORDPRESS_INTEGRATION_GUIDE.md" "WordPress 集成指南"

echo "========================================="
echo "验证摘要"
echo "========================================="
echo ""
echo "总文件数: $total_files"
echo "已存在: $existing_files"
echo "新建: $new_files"
echo ""

if [ $new_files -eq 0 ]; then
  echo "🎉 所有 WordPress 集成文件都已存在！"
  echo ""
  echo "下一步："
  echo "1. 配置环境变量："
  echo "   cp .env.wordpress.example .env.local"
  echo "   然后编辑 .env.local 填入你的 WordPress 配置"
  echo ""
  echo "2. 访问示例页面："
  echo "   http://localhost:3000/blog-demo/wordpress-integration"
  echo "   http://localhost:3000/examples/wordpress-integration-advanced"
  echo ""
  echo "3. 阅读集成指南："
  echo "   cat WORDPRESS_INTEGRATION_GUIDE.md"
  exit 0
else
  echo "⚠️  有 $new_files 个文件缺失"
  echo ""
  echo "请检查以下内容："
  echo "1. 确保项目目录结构正确"
  echo "2. 检查文件权限"
  echo "3. 查看错误日志"
  exit 1
fi
