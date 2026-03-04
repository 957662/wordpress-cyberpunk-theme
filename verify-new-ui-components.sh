#!/bin/bash

echo "🔍 验证新创建的 UI 组件和 Hooks..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total_files=0
created_files=0

# 检查文件函数
check_file() {
    local file=$1
    total_files=$((total_files + 1))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
        created_files=$((created_files + 1))
    else
        echo -e "${RED}✗${NC} $file"
    fi
}

echo "📦 UI 组件"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/components/ui/toast/CyberToast.tsx"
check_file "frontend/components/ui/toast/index.ts"
check_file "frontend/components/ui/tooltip/CyberTooltip.tsx"
check_file "frontend/components/ui/tooltip/index.ts"
check_file "frontend/components/ui/progress/CyberProgress.tsx"
check_file "frontend/components/ui/progress/index.ts"
check_file "frontend/components/ui/skeleton/CyberSkeleton.tsx"
check_file "frontend/components/ui/skeleton/index.ts"
check_file "frontend/components/ui/avatar/CyberAvatar.tsx"
check_file "frontend/components/ui/avatar/index.ts"
check_file "frontend/components/ui/badge/CyberBadge.tsx"
check_file "frontend/components/ui/badge/index.ts"
check_file "frontend/components/ui/tabs/CyberTabs.tsx"
check_file "frontend/components/ui/tabs/index.ts"
check_file "frontend/components/ui/accordion/CyberAccordion.tsx"
check_file "frontend/components/ui/accordion/index.ts"
check_file "frontend/components/ui/carousel/CyberCarousel.tsx"
check_file "frontend/components/ui/carousel/index.ts"
check_file "frontend/components/ui/rating/CyberRating.tsx"
check_file "frontend/components/ui/rating/index.ts"
echo ""

echo "🎣 自定义 Hooks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/lib/hooks/useToast.ts"
check_file "frontend/lib/hooks/useDebounce.ts"
check_file "frontend/lib/hooks/useLocalStorage.ts"
check_file "frontend/lib/hooks/useClickOutside.ts"
check_file "frontend/lib/hooks/useMediaQuery.ts"
check_file "frontend/lib/hooks/useIntersectionObserver.ts"
check_file "frontend/lib/hooks/useClipboard.ts"
check_file "frontend/lib/hooks/useWindowSize.ts"
check_file "frontend/lib/hooks/useAsync.ts"
check_file "frontend/lib/hooks/useToggle.ts"
check_file "frontend/lib/hooks/usePrevious.ts"
check_file "frontend/lib/hooks/useInterval.ts"
check_file "frontend/lib/hooks/useCounter.ts"
check_file "frontend/lib/hooks/useArray.ts"
check_file "frontend/lib/hooks/useKeyboard.ts"
check_file "frontend/lib/hooks/useFetch.ts"
check_file "frontend/lib/hooks/useForm.ts"
echo ""

echo "📄 演示页面和文档"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/app/examples/ui-showcase/page.tsx"
check_file "NEW_COMPONENTS_CREATED_SUMMARY.md"
echo ""

# 总结
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 验证结果:"
echo "   总文件数: $total_files"
echo -e "   已创建: ${GREEN}$created_files${NC}"
echo -e "   缺失: ${RED}$((total_files - created_files))${NC}"
echo ""

if [ $created_files -eq $total_files ]; then
    echo -e "${GREEN}✅ 所有文件都已成功创建！${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  部分文件未创建${NC}"
    exit 1
fi
