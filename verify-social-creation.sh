#!/bin/bash

# 验证社交功能文件创建脚本

echo "🔍 验证社交功能文件创建..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success_count=0
fail_count=0

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((success_count++))
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        ((fail_count++))
        return 1
    fi
}

echo "📁 Services (服务层)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/services/bookmark-service.ts"
check_file "frontend/services/notification-service.ts"
echo ""

echo "📁 Hooks (自定义钩子)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/hooks/useSocialFeed.ts"
check_file "frontend/hooks/useBookmarks.ts"
check_file "frontend/hooks/useNotifications.ts"
echo ""

echo "📁 API Routes (API 路由)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/app/api/bookmarks/route.ts"
check_file "frontend/app/api/bookmarks/folders/route.ts"
echo ""

echo "📁 Components (组件)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/components/SocialCard.tsx"
check_file "frontend/components/social/FeedFilters.tsx"
echo ""

echo "📁 Utils (工具函数)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/lib/social-utils.ts"
check_file "frontend/lib/social-exports.ts"
echo ""

echo "📁 Constants (常量)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/constants/social.ts"
echo ""

echo "📁 Documentation (文档)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "SOCIAL_FEATURES_FILES_SUMMARY.md"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "📊 统计信息:"
echo -e "   ${GREEN}成功:${NC} $success_count 个文件"
echo -e "   ${RED}失败:${NC} $fail_count 个文件"
echo ""

total=$((success_count + fail_count))
if [ $fail_count -eq 0 ]; then
    echo -e "${GREEN}🎉 所有文件创建成功！($total/$total)${NC}"
    exit 0
else
    percentage=$((success_count * 100 / total))
    echo -e "${YELLOW}⚠️  部分文件创建失败: $success_count/$total ($percentage%)${NC}"
    exit 1
fi
