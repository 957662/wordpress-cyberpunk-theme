#!/bin/bash

# 验证新创建的组件文件

echo "=========================================="
echo "验证新创建的组件文件 - 2026-03-07"
echo "=========================================="
echo ""

# 项目路径
PROJECT_ROOT="/root/.openclaw/workspace/cyberpress-platform"
FRONTEND="$PROJECT_ROOT/frontend"

# 检查文件是否存在
check_file() {
    local file="$1"
    local name="$2"
    
    if [ -f "$file" ]; then
        local lines=$(wc -l < "$file")
        local size=$(du -h "$file" | cut -f1)
        echo "✅ $name"
        echo "   路径: $file"
        echo "   行数: $lines"
        echo "   大小: $size"
        echo ""
        return 0
    else
        echo "❌ $name - 文件不存在"
        echo "   路径: $file"
        echo ""
        return 1
    fi
}

# 统计
total=0
success=0
failed=0

# 检查组件文件
echo "📦 组件文件"
echo "=========================================="

check_file "$FRONTEND/components/blog/LoadingSpinner.tsx" "LoadingSpinner" && ((success++)) || ((failed++))
check_file "$FRONTEND/components/blog/EmptyState.tsx" "EmptyState" && ((success++)) || ((failed++))
check_file "$FRONTEND/components/blog/CategoryFilter.tsx" "CategoryFilter" && ((success++)) || ((failed++))
check_file "$FRONTEND/components/blog/Pagination.tsx" "Pagination" && ((success++)) || ((failed++))
check_file "$FRONTEND/components/blog/SearchBar.tsx" "SearchBar" && ((success++)) || ((failed++))
((total+=5))

# 检查页面文件
echo ""
echo "📄 页面文件"
echo "=========================================="

check_file "$FRONTEND/app/blog/page-new.tsx" "Blog Page (New)" && ((success++)) || ((failed++))
((total++))

# 检查核心文件
echo ""
echo "🔧 核心文件"
echo "=========================================="

check_file "$FRONTEND/lib/utils/index.ts" "Utils Index" && ((success++)) || ((failed++))
check_file "$FRONTEND/lib/wordpress/client.ts" "WordPress Client" && ((success++)) || ((failed++))
check_file "$FRONTEND/lib/data/adapter.ts" "Data Adapter" && ((success++)) || ((failed++))
((total+=3))

# 统计代码行数
echo ""
echo "📊 代码统计"
echo "=========================================="

if [ -d "$FRONTEND/components/blog" ]; then
    blog_components=$(find "$FRONTEND/components/blog" -name "*.tsx" -type f | wc -l)
    echo "博客组件总数: $blog_components"
fi

if [ -d "$FRONTEND/app/blog" ]; then
    blog_pages=$(find "$FRONTEND/app/blog" -name "*.tsx" -type f | wc -l)
    echo "博客页面总数: $blog_pages"
fi

# 总结
echo ""
echo "=========================================="
echo "验证总结"
echo "=========================================="
echo "总文件数: $total"
echo "成功: $success ✅"
echo "失败: $failed ❌"
echo ""

if [ $failed -eq 0 ]; then
    echo "🎉 所有文件验证通过!"
    exit 0
else
    echo "⚠️  有 $failed 个文件验证失败"
    exit 1
fi
