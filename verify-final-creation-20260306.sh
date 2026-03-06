#!/bin/bash

echo "=========================================="
echo "验证已创建文件 - 2026-03-06 最终版"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total_files=0
created_files=0

# 检查文件是否存在
check_file() {
    total_files=$((total_files + 1))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        created_files=$((created_files + 1))
        # 显示文件大小
        size=$(du -h "$1" | cut -f1)
        echo -e "  大小: ${size}"
        # 显示行数
        lines=$(wc -l < "$1")
        echo -e "  行数: ${lines}"
    else
        echo -e "${RED}✗${NC} $1 (未找到)"
    fi
    echo ""
}

echo "1. WordPress 集成层"
echo "-------------------"
check_file "frontend/lib/wordpress/client-new.ts"
check_file "frontend/lib/wordpress/adapter.ts"
check_file "frontend/lib/wordpress/hooks-new.ts"
check_file "frontend/lib/wordpress/index.ts"

echo "2. 博客组件"
echo "-------------------"
check_file "frontend/components/blog/BlogListFinal.tsx"
check_file "frontend/components/blog/BlogGridFinal.tsx"
check_file "frontend/components/blog/ArticleCardFinal.tsx"
check_file "frontend/components/blog/index-final.ts"

echo "3. 服务层"
echo "-------------------"
check_file "frontend/services/blog.service.ts"
check_file "frontend/services/api.service.ts"
check_file "frontend/services/index.ts"

echo "4. 演示页面"
echo "-------------------"
check_file "frontend/app/blog-demo/page.tsx"

echo "5. 文档"
echo "-------------------"
check_file "CREATED_FILES_2026-03-06-FINAL.txt"

echo "=========================================="
echo "统计信息"
echo "=========================================="
echo -e "总文件数: ${total_files}"
echo -e "${GREEN}已创建: ${created_files}${NC}"
echo -e "${RED}未创建: $((total_files - created_files))${NC}"
echo ""

if [ $created_files -eq $total_files ]; then
    echo -e "${GREEN}✓ 所有文件创建成功！${NC}"
    exit 0
else
    echo -e "${RED}✗ 部分文件创建失败${NC}"
    exit 1
fi
