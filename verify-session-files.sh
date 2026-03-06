#!/bin/bash

# 验证本次会话创建的文件

echo "================================"
echo "🔍 验证本次会话创建的文件"
echo "================================"
echo ""

FRONTEND_DIR="/root/.openclaw/workspace/cyberpress-platform/frontend"
BACKEND_DIR="/root/.openclaw/workspace/cyberpress-platform/backend"

# 计数器
total_files=0
existing_files=0
missing_files=0

# 检查文件函数
check_file() {
    local file=$1
    total_files=$((total_files + 1))

    if [ -f "$file" ]; then
        size=$(wc -c < "$file")
        echo "✅ $file ($size bytes)"
        existing_files=$((existing_files + 1))
        return 0
    else
        echo "❌ $file (缺失)"
        missing_files=$((missing_files + 1))
        return 1
    fi
}

echo "📁 前端文件"
echo "----------------------------------------"

# WordPress 集成
check_file "$FRONTEND_DIR/lib/wordpress/hooks-complete.ts"
check_file "$FRONTEND_DIR/lib/wordpress/client-complete.ts"
check_file "$FRONTEND_DIR/lib/wordpress/blog-adapter.ts"

# API 服务
check_file "$FRONTEND_DIR/lib/api/blog-api.ts"

# API 路由
check_file "$FRONTEND_DIR/app/api/blog/route.ts"
check_file "$FRONTEND_DIR/app/api/blog/[slug]/route.ts"

# 组件
check_file "$FRONTEND_DIR/components/blog/BlogListFixed.tsx"
check_file "$FRONTEND_DIR/components/blog/BlogGridFixed.tsx"

# 脚本
check_file "$FRONTEND_DIR/scripts/fix-imports.ts"

echo ""
echo "📁 后端文件"
echo "----------------------------------------"

# API 路由
check_file "$BACKEND_DIR/app/api/blog/router.py"

# 服务层
check_file "$BACKEND_DIR/app/services/blog/blog.py"

echo ""
echo "================================"
echo "📊 统计信息"
echo "================================"
echo "总文件数: $total_files"
echo "已创建: $existing_files"
echo "缺失: $missing_files"
echo ""

if [ $missing_files -eq 0 ]; then
    echo "✅ 所有文件创建成功！"
    exit 0
else
    echo "⚠️  有 $missing_files 个文件未创建"
    exit 1
fi
