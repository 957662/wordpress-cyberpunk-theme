#!/bin/bash

# 验证博客组件创建脚本
# 检查所有新创建的文件是否存在

set -e

echo "========================================="
echo "验证博客组件创建"
echo "========================================="
echo ""

# 项目根目录
PROJECT_ROOT="/root/.openclaw/workspace/cyberpress-platform"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 统计变量
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

echo "1. 检查 WordPress API 集成文件..."
echo "-------------------------------------------"
check_file "$FRONTEND_DIR/lib/wordpress/client.ts"
check_file "$FRONTEND_DIR/lib/wordpress/adapters.ts"
check_file "$FRONTEND_DIR/lib/wordpress/types.ts"
check_file "$FRONTEND_DIR/lib/wordpress/hooks.ts"
echo ""

echo "2. 检查增强版博客组件..."
echo "-------------------------------------------"
check_file "$FRONTEND_DIR/components/blog/BlogListEnhancedNew.tsx"
check_file "$FRONTEND_DIR/components/blog/BlogGridEnhancedNew.tsx"
check_file "$FRONTEND_DIR/components/blog/BlogPaginationEnhanced.tsx"
check_file "$FRONTEND_DIR/components/blog/BlogSearchBarEnhanced.tsx"
check_file "$FRONTEND_DIR/components/blog/BlogSidebarEnhanced.tsx"
echo ""

echo "3. 检查示例页面..."
echo "-------------------------------------------"
check_file "$FRONTEND_DIR/app/blog/page-enhanced.tsx"
echo ""

echo "4. 检查工具文件..."
echo "-------------------------------------------"
check_file "$FRONTEND_DIR/lib/blog-helpers.ts"
echo ""

echo "5. 检查导出文件..."
echo "-------------------------------------------"
check_file "$FRONTEND_DIR/components/blog/index.ts"
check_file "$FRONTEND_DIR/CREATED_FILES_REPORT.md"
echo ""

echo "========================================="
echo "验证统计"
echo "========================================="
echo -e "总文件数: $total_files"
echo -e "${GREEN}已创建: $existing_files${NC}"
echo -e "${RED}缺失: $missing_files${NC}"
echo ""

if [ $missing_files -eq 0 ]; then
    echo -e "${GREEN}✓ 所有文件都已成功创建！${NC}"
    exit 0
else
    echo -e "${RED}✗ 有 $missing_files 个文件缺失${NC}"
    exit 1
fi
