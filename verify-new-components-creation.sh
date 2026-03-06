#!/bin/bash

# 新组件创建验证脚本
# 验证所有新创建的文件是否存在

echo "========================================="
echo "CyberPress Platform - 新组件创建验证"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total=0
success=0
failed=0

# 检查文件函数
check_file() {
    local file=$1
    local description=$2
    
    total=$((total + 1))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description"
        echo "  路径: $file"
        success=$((success + 1))
    else
        echo -e "${RED}✗${NC} $description"
        echo "  路径: $file"
        failed=$((failed + 1))
    fi
    echo ""
}

# 检查目录函数
check_dir() {
    local dir=$1
    local description=$2
    
    total=$((total + 1))
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $description"
        echo "  路径: $dir"
        success=$((success + 1))
    else
        echo -e "${RED}✗${NC} $description"
        echo "  路径: $dir"
        failed=$((failed + 1))
    fi
    echo ""
}

echo "检查 UI 组件..."
check_file "frontend/components/ui/OptimizedImage.tsx" "OptimizedImage 组件"
check_file "frontend/components/ui/EnhancedToast.tsx" "EnhancedToast 组件"

echo "检查错误处理..."
check_file "frontend/components/ErrorBoundary.tsx" "ErrorBoundary 组件"

echo "检查 SEO 组件..."
check_file "frontend/components/seo/MetaTags.tsx" "MetaTags 组件"

echo "检查仪表板组件..."
check_file "frontend/components/dashboard/StatsCard.tsx" "StatsCard 组件"

echo "检查示例页面..."
check_file "frontend/app/examples/new-components/page.tsx" "新组件示例页面"

echo "检查文档..."
check_file "frontend/components/NEW_COMPONENTS_EXPORT.md" "组件导出文档"
check_file "NEW_COMPONENTS_SUMMARY.md" "组件汇总文档"

echo "检查目录..."
check_dir "frontend/components/seo" "SEO 组件目录"
check_dir "frontend/components/dashboard" "仪表板组件目录"
check_dir "frontend/app/examples/new-components" "示例页面目录"

echo "========================================="
echo "验证结果汇总"
echo "========================================="
echo -e "总计: ${YELLOW}$total${NC}"
echo -e "成功: ${GREEN}$success${NC}"
echo -e "失败: ${RED}$failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 所有文件创建成功！${NC}"
    echo ""
    echo "下一步操作："
    echo "1. 查看组件文档: cat frontend/components/NEW_COMPONENTS_EXPORT.md"
    echo "2. 查看汇总文档: cat NEW_COMPONENTS_SUMMARY.md"
    echo "3. 访问示例页面: http://localhost:3000/examples/new-components"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  部分文件创建失败${NC}"
    echo "请检查上述错误信息"
    echo ""
    exit 1
fi
