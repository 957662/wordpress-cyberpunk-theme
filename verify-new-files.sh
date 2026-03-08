#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}  验证新创建的文件${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""

# 文件列表
declare -a files=(
    "backend/docs/database-design.md"
    "backend/app/models/comment.py"
    "backend/app/models/reaction.py"
    "frontend/components/notifications/NotificationCenter.tsx"
    "frontend/components/theme/ThemeToggle.tsx"
    "frontend/components/search/SearchEnhanced.tsx"
    "frontend/components/loading/Skeleton.tsx"
    "frontend/hooks/useInfiniteScroll.ts"
    "frontend/lib/utils-enhanced.ts"
    "NEW_FILES_CREATED_REPORT.md"
    "QUICKREF_NEW_FILES.md"
)

# 统计变量
total=0
success=0
failed=0

# 检查文件
for file in "${files[@]}"; do
    total=$((total + 1))
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
        success=$((success + 1))
    else
        echo -e "${RED}✗${NC} $file (未找到)"
        failed=$((failed + 1))
    fi
done

echo ""
echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}  统计信息${NC}"
echo -e "${BLUE}=================================${NC}"
echo -e "总文件数: $total"
echo -e "${GREEN}成功: $success${NC}"
echo -e "${RED}失败: $failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✓ 所有文件都已成功创建！${NC}"
    exit 0
else
    echo -e "${RED}✗ 有 $failed 个文件未能创建${NC}"
    exit 1
fi
