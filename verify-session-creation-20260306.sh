#!/bin/bash

echo "========================================="
echo "文件创建验证脚本"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total_files=0
created_files=0
failed_files=0

# 检查文件函数
check_file() {
    local file=$1
    total_files=$((total_files + 1))

    if [ -f "$file" ]; then
        size=$(wc -l < "$file")
        echo -e "${GREEN}✓${NC} $file ($size lines)"
        created_files=$((created_files + 1))
    else
        echo -e "${RED}✗${NC} $file (未找到)"
        failed_files=$((failed_files + 1))
    fi
}

echo "=== 性能优化组件 ==="
check_file "frontend/components/performance/ImageOptimizer.tsx"
echo ""

echo "=== 性能监控 Hooks ==="
check_file "frontend/hooks/usePerformance.ts"
echo ""

echo "=== WordPress 集成 ==="
check_file "frontend/lib/wordpress/importer.ts"
check_file "frontend/components/wordpress/WordPressImporter.tsx"
echo ""

echo "=== API 服务层 ==="
check_file "frontend/lib/services/blog.service.ts"
echo ""

echo "=== 测试文件 ==="
check_file "frontend/components/blog/__tests__/CommentSection.test.tsx"
check_file "frontend/components/blog/__tests__/LikeButton.test.tsx"
check_file "frontend/lib/utils/__tests__/article.test.ts"
echo ""

echo "=== 总结文档 ==="
check_file "FILES_CREATED_2026-03-06-SESSION.md"
echo ""

echo "========================================="
echo "统计信息"
echo "========================================="
echo "总文件数: $total_files"
echo -e "创建成功: ${GREEN}$created_files${NC}"
echo -e "创建失败: ${RED}$failed_files${NC}"
echo ""

if [ $created_files -eq $total_files ]; then
    echo -e "${GREEN}🎉 所有文件创建成功！${NC}"
    exit 0
else
    echo -e "${RED}⚠️  有 $failed_files 个文件创建失败${NC}"
    exit 1
fi
