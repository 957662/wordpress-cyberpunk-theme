#!/bin/bash

echo "========================================="
echo "验证新创建的文件"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 文件列表
FILES=(
    "frontend/hooks/useInfiniteScroll.ts"
    "frontend/hooks/useDebounce.ts"
    "frontend/hooks/useLocalStorage.ts"
    "frontend/components/dashboard/ReadingProgressTracker.tsx"
    "frontend/components/dashboard/ReadingStatsCard.tsx"
    "frontend/components/blog/BlogSearch.tsx"
    "frontend/services/api/readingProgress.ts"
    "frontend/services/api/client.ts"
    "backend/app/api/reading_progress.py"
    "backend/app/models/reading_progress.py"
    "backend/app/schemas/reading_progress.py"
    "backend/database/migrations/versions/001_add_reading_progress.py"
)

# 检查文件
success_count=0
fail_count=0

for file in "${FILES[@]}"; do
    if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
        ((success_count++))
    else
        echo -e "${RED}✗${NC} $file (未找到)"
        ((fail_count++))
    fi
done

echo ""
echo "========================================="
echo -e "统计: ${GREEN}$success_count${NC} 个文件创建成功"
if [ $fail_count -gt 0 ]; then
    echo -e "统计: ${RED}$fail_count${NC} 个文件未找到"
fi
echo "========================================="

# 显示文件内容预览
echo ""
echo "========================================="
echo "文件内容预览"
echo "========================================="
echo ""

echo "--- frontend/hooks/useInfiniteScroll.ts (前10行) ---"
head -10 /root/.openclaw/workspace/cyberpress-platform/frontend/hooks/useInfiniteScroll.ts
echo ""

echo "--- backend/app/api/reading_progress.py (前15行) ---"
head -15 /root/.openclaw/workspace/cyberpress-platform/backend/app/api/reading_progress.py
echo ""

exit 0
