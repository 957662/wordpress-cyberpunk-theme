#!/bin/bash

# 验证统一博客组件创建脚本
# 创建日期: 2026-03-06

echo "========================================="
echo "🔍 验证统一博客组件创建"
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
        local size=$(wc -c < "$file" 2>/dev/null || echo "0")
        local lines=$(wc -l < "$file" 2>/dev/null || echo "0")
        echo -e "${GREEN}✅${NC} $file"
        echo "   大小: $(echo "scale=1; $size/1024" | bc)KB, 行数: $lines"
        created_files=$((created_files + 1))
        return 0
    else
        echo -e "${RED}❌${NC} $file (未找到)"
        failed_files=$((failed_files + 1))
        return 1
    fi
}

echo "📦 检查核心文件..."
echo ""

# 数据适配器
check_file "frontend/lib/utils/adapters.ts"
echo ""

# 组件文件
echo "📝 检查组件文件..."
check_file "frontend/components/blog/ArticleCardUnified.tsx"
check_file "frontend/components/blog/BlogListUnified.tsx"
check_file "frontend/components/blog/BlogGridUnified.tsx"
echo ""

# 页面文件
echo "📄 检查页面文件..."
check_file "frontend/app/(public)/blog-unified/page.tsx"
echo ""

# 文档文件
echo "📚 检查文档文件..."
check_file "BLOG_UNIFIED_GUIDE.md"
check_file "CREATED_FILES_UNIFIED_BLOG.md"
echo ""

# 检查组件导出
echo "🔍 检查组件导出..."
if grep -q "ArticleCardUnified" frontend/components/blog/index.ts 2>/dev/null; then
    echo -e "${GREEN}✅${NC} 组件导出已更新"
else
    echo -e "${YELLOW}⚠️${NC} 组件导出可能未更新"
fi
echo ""

# 统计信息
echo "========================================="
echo "📊 统计信息"
echo "========================================="
echo -e "总文件数: ${YELLOW}$total_files${NC}"
echo -e "已创建: ${GREEN}$created_files${NC}"
echo -e "失败: ${RED}$failed_files${NC}"
echo ""

# 成功率
if [ $total_files -gt 0 ]; then
    success_rate=$((created_files * 100 / total_files))
    echo -e "成功率: ${GREEN}${success_rate}%${NC}"
fi
echo ""

# 最终状态
if [ $failed_files -eq 0 ]; then
    echo -e "${GREEN}🎉 所有文件创建成功！${NC}"
    echo ""
    echo "📦 下一步："
    echo "1. 访问示例页面: http://localhost:3000/blog-unified"
    echo "2. 查看使用指南: BLOG_UNIFIED_GUIDE.md"
    echo "3. 在你的页面中使用新组件"
    exit 0
else
    echo -e "${RED}⚠️ 部分文件创建失败${NC}"
    exit 1
fi
