#!/bin/bash

# 验证点赞和收藏功能前端集成文件创建情况

echo "========================================="
echo "验证点赞和收藏功能前端集成"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="/root/.openclaw/workspace/cyberpress-platform"
cd "$PROJECT_ROOT" || exit 1

# 计数器
total_files=0
created_files=0

# 检查文件的函数
check_file() {
    total_files=$((total_files + 1))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        created_files=$((created_files + 1))
        # 显示文件大小
        size=$(wc -l < "$1" 2>/dev/null || echo "N/A")
        echo "  ($size 行)"
    else
        echo -e "${RED}✗${NC} $1 (未找到)"
    fi
}

echo "1. 类型定义文件"
echo "-----------------------------------------"
check_file "frontend/types/bookmark.types.ts"
check_file "frontend/types/like.types.ts"
echo ""

echo "2. 服务层文件"
echo "-----------------------------------------"
check_file "frontend/lib/services/like-service.ts"
check_file "frontend/lib/services/bookmark-service-new.ts"
echo ""

echo "3. React Hooks"
echo "-----------------------------------------"
check_file "frontend/lib/hooks/useLike.ts"
check_file "frontend/lib/hooks/useBookmark.ts"
echo ""

echo "4. UI组件"
echo "-----------------------------------------"
check_file "frontend/components/blog/LikeButtonEnhanced.tsx"
check_file "frontend/components/blog/BookmarkButtonEnhanced.tsx"
echo ""

echo "5. 示例和文档"
echo "-----------------------------------------"
check_file "frontend/app/(public)/blog/examples/likes-and-bookmarks/page.tsx"
check_file "frontend/docs/LIKES_AND_BOOKMARKS_GUIDE.md"
check_file "FRONTEND_LIKES_BOOKMARKS_CREATION_REPORT.md"
echo ""

echo "========================================="
echo "统计信息"
echo "========================================="
echo -e "总文件数: $total_files"
echo -e "${GREEN}已创建: $created_files${NC}"
echo -e "${RED}缺失: $((total_files - created_files))${NC}"
echo ""

if [ $created_files -eq $total_files ]; then
    echo -e "${GREEN}✓ 所有文件创建成功！${NC}"
    echo ""
    echo "文件详情："
    echo "----------------------------------------"
    
    # 显示每个文件的行数
    for file in \
        "frontend/types/bookmark.types.ts" \
        "frontend/types/like.types.ts" \
        "frontend/lib/services/like-service.ts" \
        "frontend/lib/services/bookmark-service-new.ts" \
        "frontend/lib/hooks/useLike.ts" \
        "frontend/lib/hooks/useBookmark.ts" \
        "frontend/components/blog/LikeButtonEnhanced.tsx" \
        "frontend/components/blog/BookmarkButtonEnhanced.tsx" \
        "frontend/app/(public)/blog/examples/likes-and-bookmarks/page.tsx" \
        "frontend/docs/LIKES_AND_BOOKMARKS_GUIDE.md" \
        "FRONTEND_LIKES_BOOKMARKS_CREATION_REPORT.md"
    do
        if [ -f "$file" ]; then
            lines=$(wc -l < "$file")
            size=$(du -h "$file" | cut -f1)
            echo -e "${GREEN}✓${NC} $file - $lines 行 - $size"
        fi
    done
    
    exit 0
else
    echo -e "${RED}✗ 部分文件缺失${NC}"
    exit 1
fi
