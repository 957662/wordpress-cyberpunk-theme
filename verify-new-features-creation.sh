#!/bin/bash

# 验证新功能组件创建脚本
# 创建时间: 2026-03-06

echo "======================================"
echo "验证新功能组件创建"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 统计变量
total_files=0
success_files=0
failed_files=0
total_size=0

# 检查文件函数
check_file() {
    local file=$1
    local expected_size=$2
    
    total_files=$((total_files + 1))
    
    if [ -f "$file" ]; then
        size=$(wc -c < "$file" 2>/dev/null || echo 0)
        total_size=$((total_size + size))
        
        if [ $size -gt 100 ]; then
            echo -e "${GREEN}✓${NC} $file (${size} bytes)"
            success_files=$((success_files + 1))
        else
            echo -e "${YELLOW}⚠${NC} $file (文件太小: ${size} bytes)"
            failed_files=$((failed_files + 1))
        fi
    else
        echo -e "${RED}✗${NC} $file (文件不存在)"
        failed_files=$((failed_files + 1))
    fi
}

echo "检查分页组件..."
check_file "frontend/components/pagination/Pagination.tsx"
check_file "frontend/components/pagination/index.ts"
echo ""

echo "检查筛选组件..."
check_file "frontend/components/filtering/AdvancedFilter.tsx"
check_file "frontend/components/filtering/index.ts"
echo ""

echo "检查错误处理组件..."
check_file "frontend/components/error-handling/ErrorBoundary.tsx"
check_file "frontend/components/error-handling/index.ts"
echo ""

echo "检查示例页面..."
check_file "frontend/app/examples/blog-with-filters/page.tsx"
echo ""

echo "检查文档..."
check_file "NEW_FEATURES_COMPLETION_REPORT_2026-03-06.md"
echo ""

echo "======================================"
echo "验证结果汇总"
echo "======================================"
echo -e "总文件数: $total_files"
echo -e "${GREEN}成功: $success_files${NC}"
echo -e "${RED}失败: $failed_files${NC}"
echo -e "总大小: $(echo "scale=2; $total_size/1024" | bc) KB"
echo ""

if [ $failed_files -eq 0 ]; then
    echo -e "${GREEN}✓ 所有文件创建成功！${NC}"
    exit 0
else
    echo -e "${RED}✗ 有 $failed_files 个文件创建失败${NC}"
    exit 1
fi
