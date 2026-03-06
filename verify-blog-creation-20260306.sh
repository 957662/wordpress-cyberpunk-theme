#!/bin/bash

# 文件创建验证脚本 - 2026-03-06
# 验证所有新创建的文件是否存在

echo "=========================================="
echo "验证文件创建 - 2026-03-06"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total_files=0
existing_files=0
missing_files=0

# 检查文件函数
check_file() {
    local file=$1
    total_files=$((total_files + 1))

    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
        existing_files=$((existing_files + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $file"
        missing_files=$((missing_files + 1))
        return 1
    fi
}

echo "检查 API 服务文件..."
echo "----------------------------------------"
check_file "frontend/services/api/blog-api.service.ts"
check_file "frontend/services/api/auth-api.service.ts"
check_file "frontend/services/api/comment-api.service.ts"
echo ""

echo "检查页面组件..."
echo "----------------------------------------"
check_file "frontend/app/(public)/blog/page-enhanced.tsx"
echo ""

echo "检查工具组件..."
echo "----------------------------------------"
check_file "frontend/components/blog/ArticleMetaDisplay.tsx"
check_file "frontend/components/blog/ArticleTags.tsx"
echo ""

echo "检查工具库..."
echo "----------------------------------------"
check_file "frontend/lib/blog-utils.ts"
check_file "frontend/config/blog.config.ts"
echo ""

echo "检查文档..."
echo "----------------------------------------"
check_file "CREATION_REPORT_2026-03-06.md"
echo ""

echo "=========================================="
echo "统计结果"
echo "=========================================="
echo -e "总文件数: $total_files"
echo -e "${GREEN}已创建: $existing_files${NC}"
echo -e "${RED}缺失: $missing_files${NC}"
echo ""

# 计算代码行数
echo "代码统计..."
echo "----------------------------------------"
if [ $existing_files -gt 0 ]; then
    total_lines=0
    for file in \
        "frontend/services/api/blog-api.service.ts" \
        "frontend/services/api/auth-api.service.ts" \
        "frontend/services/api/comment-api.service.ts" \
        "frontend/app/(public)/blog/page-enhanced.tsx" \
        "frontend/components/blog/ArticleMetaDisplay.tsx" \
        "frontend/components/blog/ArticleTags.tsx" \
        "frontend/lib/blog-utils.ts" \
        "frontend/config/blog.config.ts"
    do
        if [ -f "$file" ]; then
            lines=$(wc -l < "$file")
            total_lines=$((total_lines + lines))
            echo "$file: $lines 行"
        fi
    done
    echo ""
    echo "总代码行数: $total_lines 行"
fi

echo ""
echo "=========================================="
if [ $missing_files -eq 0 ]; then
    echo -e "${GREEN}✓ 所有文件创建成功！${NC}"
    exit 0
else
    echo -e "${RED}✗ 有 $missing_files 个文件缺失${NC}"
    exit 1
fi
