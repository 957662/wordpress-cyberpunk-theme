#!/bin/bash

# 验证脚本 - 检查 2026-03-07 创建的文件
# 创建时间: 2026-03-07

echo "========================================="
echo "验证 CyberPress Platform 文件创建"
echo "日期: 2026-03-07"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total_files=0
success_files=0
failed_files=0

# 检查文件函数
check_file() {
    local file=$1
    total_files=$((total_files + 1))

    if [ -f "$file" ]; then
        local size=$(wc -c < "$file" | tr -d ' ')
        local lines=$(wc -l < "$file" | tr -d ' ')
        echo -e "${GREEN}✓${NC} $file"
        echo "    大小: $size 字节 | 行数: $lines"
        success_files=$((success_files + 1))
    else
        echo -e "${RED}✗${NC} $file (文件不存在)"
        failed_files=$((failed_files + 1))
    fi
    echo ""
}

# 文件列表
echo "========================================="
echo "1. 博客系统文件"
echo "========================================="
echo ""

check_file "frontend/app/blog/[slug]/page-ssr.tsx"
check_file "frontend/components/blog/BlogPostWithReadingProgress.tsx"
check_file "frontend/components/blog/BlogSearchAdvanced.tsx"

echo "========================================="
echo "2. 页面文件"
echo "========================================="
echo ""

check_file "frontend/app/tags/[slug]/page.tsx"
check_file "frontend/app/categories/[slug]/page.tsx"

echo "========================================="
echo "3. UI 组件"
echo "========================================="
echo ""

check_file "frontend/components/blog/CodeHighlightEnhanced.tsx"

echo "========================================="
echo "4. 文档文件"
echo "========================================="
echo ""

check_file "FILES_CREATED_2026-03-07-FINAL.md"

# 总结
echo "========================================="
echo "验证总结"
echo "========================================="
echo ""
echo -e "总文件数: $total_files"
echo -e "${GREEN}成功: $success_files${NC}"
echo -e "${RED}失败: $failed_files${NC}"
echo ""

# 成功率
if [ $total_files -gt 0 ]; then
    success_rate=$((success_files * 100 / total_files))
    echo "成功率: ${success_rate}%"
    echo ""
fi

# 最终结果
if [ $failed_files -eq 0 ]; then
    echo -e "${GREEN}========================================="
    echo "✓ 所有文件验证通过！"
    echo "=========================================${NC}"
    exit 0
else
    echo -e "${RED}========================================="
    echo "✗ 部分文件验证失败！"
    echo "=========================================${NC}"
    exit 1
fi
