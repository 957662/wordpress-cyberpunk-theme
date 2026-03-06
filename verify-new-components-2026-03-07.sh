#!/bin/bash

echo "🔍 验证新创建的组件和文件..."
echo "========================================"

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
    total=$((total + 1))
    
    if [ -f "$file" ]; then
        local size=$(du -h "$file" | cut -f1)
        local lines=$(wc -l < "$file")
        echo -e "${GREEN}✅${NC} $file ($size, $lines 行)"
        success=$((success + 1))
    else
        echo -e "${RED}❌${NC} $file (文件不存在)"
        failed=$((failed + 1))
    fi
}

echo ""
echo "📦 检查组件文件..."
echo "----------------------------------------"

check_file "frontend/components/quickstart/QuickStartGuide.tsx"
check_file "frontend/components/ai-assistant/AIChatAssistant.tsx"
check_file "frontend/components/code-editor/CodeEditor.tsx"
check_file "frontend/components/dashboard/DashboardStats.tsx"

echo ""
echo "🛠️  检查工具函数..."
echo "----------------------------------------"

check_file "frontend/lib/utils/date.ts"
check_file "frontend/lib/utils/string.ts"
check_file "frontend/lib/utils/validation.ts"

echo ""
echo "📄 检查页面和文档..."
echo "----------------------------------------"

check_file "frontend/app/examples/showcase/page.tsx"
check_file "NEW_COMPONENTS_GUIDE.md"
check_file "CREATION_SUMMARY_2026-03-07.md"

echo ""
echo "📊 统计结果"
echo "========================================"
echo -e "总计: $total 个文件"
echo -e "${GREEN}成功: $success${NC} 个"
echo -e "${RED}失败: $failed${NC} 个"

if [ $failed -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 所有文件创建成功!${NC}"
    echo ""
    echo "📝 下一步操作:"
    echo "1. 查看使用指南: cat NEW_COMPONENTS_GUIDE.md"
    echo "2. 启动开发服务器: cd frontend && npm run dev"
    echo "3. 访问展示页面: http://localhost:3000/examples/showcase"
    exit 0
else
    echo ""
    echo -e "${RED}⚠️  有 $failed 个文件创建失败${NC}"
    exit 1
fi
