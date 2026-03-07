#!/bin/bash

# 验证新创建的赛博朋克组件文件

echo "🔍 验证新创建的赛博朋克组件文件..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 文件列表
declare -a FILES=(
    "frontend/components/blog/CyberArticleCard.tsx"
    "frontend/components/blog/CyberBlogGrid.tsx"
    "frontend/components/ui/cyber-button.tsx"
    "frontend/components/ui/cyber-input.tsx"
    "frontend/components/ui/cyber-card.tsx"
    "frontend/components/ui/cyber-modal.tsx"
    "frontend/components/ui/cyber-index.tsx"
    "frontend/config/cyber-theme.ts"
    "NEW_FILES_SUMMARY.md"
)

# 检查文件是否存在
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (不存在)"
        return 1
    fi
}

# 统计
total=${#FILES[@]}
exist=0
missing=0

echo "📁 检查文件列表:"
echo ""

for file in "${FILES[@]}"; do
    if check_file "$file"; then
        ((exist++))
    else
        ((missing++))
    fi
done

echo ""
echo "📊 统计结果:"
echo "  总文件数: $total"
echo -e "  ${GREEN}已创建: $exist${NC}"
if [ $missing -gt 0 ]; then
    echo -e "  ${RED}缺失: $missing${NC}"
fi

# 检查文件内容
echo ""
echo "📄 检查文件内容:"

check_content() {
    local file=$1
    local keyword=$2

    if [ -f "$file" ]; then
        if grep -q "$keyword" "$file" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} $file 包含 '$keyword'"
            return 0
        else
            echo -e "${YELLOW}⚠${NC} $file 可能不包含 '$keyword'"
            return 1
        fi
    fi
}

echo ""
echo "检查关键组件导入:"

check_content "frontend/components/ui/cyber-index.tsx" "CyberButton"
check_content "frontend/components/ui/cyber-index.tsx" "CyberCard"
check_content "frontend/components/ui/cyber-index.tsx" "CyberModal"

echo ""
echo "检查主题配置:"

check_content "frontend/config/cyber-theme.ts" "cyberColors"
check_content "frontend/config/cyber-theme.ts" "#00f0ff"

echo ""
echo "检查博客组件:"

check_content "frontend/components/blog/CyberArticleCard.tsx" "export"
check_content "frontend/components/blog/CyberBlogGrid.tsx" "CyberArticleCard"

# 统计代码行数
echo ""
echo "📏 代码统计:"

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        lines=$(wc -l < "$file" 2>/dev/null || echo "0")
        size=$(du -h "$file" 2>/dev/null | cut -f1)
        echo "  $file: $lines 行, $size"
    fi
done

echo ""
if [ $exist -eq $total ]; then
    echo -e "${GREEN}🎉 所有文件都已成功创建！${NC}"
    exit 0
else
    echo -e "${RED}❌ 部分文件缺失${NC}"
    exit 1
fi
