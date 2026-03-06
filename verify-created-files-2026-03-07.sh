#!/bin/bash

echo "=========================================="
echo "验证创建的文件 - 2026-03-07"
echo "=========================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

total=0
success=0
failed=0

check_file() {
    local file=$1
    total=$((total + 1))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
        success=$((success + 1))
    else
        echo -e "${RED}✗${NC} $file"
        failed=$((failed + 1))
    fi
}

echo "📝 博客组件"
echo "---------------------------"
check_file "frontend/components/blog/EmptyState.tsx"
check_file "frontend/components/blog/LoadingState.tsx"
check_file "frontend/components/blog/BlogStatsCard.tsx"
echo ""

echo "🔌 WordPress 集成"
echo "---------------------------"
check_file "frontend/lib/wordpress/client.ts"
check_file "frontend/lib/wordpress/hooks.ts"
check_file "frontend/lib/wordpress/index.ts"
check_file "frontend/lib/wordpress/initializer.ts"
echo ""

echo "📄 应用页面"
echo "---------------------------"
check_file "frontend/app/blog/page.tsx"
check_file "frontend/app/blog/[slug]/page.tsx"
echo ""

echo "⚙️  配置文件"
echo "---------------------------"
check_file "frontend/config/wordpress.ts"
check_file "frontend/tailwind.config.ts"
echo ""

echo "🛠️  工具函数"
echo "---------------------------"
check_file "frontend/lib/utils/index.ts"
echo ""

echo "📦 类型定义"
echo "---------------------------"
check_file "frontend/types/models/blog.ts"
echo ""

echo "🔧 Provider"
echo "---------------------------"
check_file "frontend/providers/wordpress-provider.tsx"
echo ""

echo "📚 文档"
echo "---------------------------"
check_file "WORDPRESS_INTEGRATION_GUIDE.md"
check_file "CREATED_FILES_SUMMARY.md"
check_file "QUICKSTART_2026-03-07.md"
echo ""

echo "=========================================="
echo "验证总结"
echo "=========================================="
echo -e "总计: $total 个文件"
echo -e "${GREEN}成功: $success${NC}"
echo -e "${RED}失败: $failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✅ 所有文件创建成功！${NC}"
    exit 0
else
    echo -e "${RED}❌ 有 $failed 个文件创建失败${NC}"
    exit 1
fi
