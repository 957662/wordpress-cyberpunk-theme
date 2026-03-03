#!/bin/bash

echo "🔍 验证新创建的组件..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

success_count=0
fail_count=0

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((success_count++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 (文件不存在)"
        ((fail_count++))
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 (目录)"
        ((success_count++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 (目录不存在)"
        ((fail_count++))
        return 1
    fi
}

echo "=== 组件目录 ==="
check_dir "frontend/components/reading-progress"
check_dir "frontend/components/code-share"
check_dir "frontend/components/article-summary"
check_dir "frontend/components/collaborative"
check_dir "frontend/components/ai"
check_dir "frontend/components/icons"

echo ""
echo "=== 核心组件文件 ==="
check_file "frontend/components/reading-progress/ReadingProgress.tsx"
check_file "frontend/components/reading-progress/ReadingProgressRing.tsx"
check_file "frontend/components/reading-progress/index.ts"
check_file "frontend/components/code-share/CodeShare.tsx"
check_file "frontend/components/code-share/CodeShareModal.tsx"
check_file "frontend/components/code-share/index.ts"
check_file "frontend/components/article-summary/ArticleSummary.tsx"
check_file "frontend/components/article-summary/index.ts"
check_file "frontend/components/collaborative/CollaborativeEditing.tsx"
check_file "frontend/components/collaborative/index.ts"
check_file "frontend/components/ai/AIAssistant.tsx"
check_file "frontend/components/ai/index.ts"
check_file "frontend/components/icons/CyberIcon.tsx"
check_file "frontend/components/icons/IconGallery.tsx"
check_file "frontend/components/icons/index.ts"

echo ""
echo "=== 示例页面 ==="
check_file "frontend/app/examples/reading-progress/page.tsx"
check_file "frontend/app/examples/code-share/page.tsx"
check_file "frontend/app/examples/article-summary/page.tsx"
check_file "frontend/app/examples/collaborative/page.tsx"
check_file "frontend/app/examples/ai-assistant/page.tsx"
check_file "frontend/app/examples/icons/page.tsx"

echo ""
echo "=== 配置文件 ==="
check_file "frontend/components/index.ts"

echo ""
echo "=== 文档文件 ==="
check_file "NEW_COMPONENTS_CREATED_2026_03_03_FINAL.md"
check_file "FILES_CREATED_THIS_SESSION.txt"
check_file "QUICK_REFERENCE_NEW_COMPONENTS.md"
check_file "INSTALLATION_GUIDE.md"

echo ""
echo "========================================="
echo "验证结果:"
echo -e "  ${GREEN}成功:${NC} $success_count"
echo -e "  ${RED}失败:${NC} $fail_count"
echo "========================================="

if [ $fail_count -eq 0 ]; then
    echo -e "${GREEN}🎉 所有组件验证通过！${NC}"
    exit 0
else
    echo -e "${RED}⚠️  部分文件缺失，请检查${NC}"
    exit 1
fi
