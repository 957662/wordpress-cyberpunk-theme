#!/bin/bash

echo "========================================="
echo "🔍 最终文件验证"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 文件列表
declare -A FILES=(
    ["前端 Hooks"]="frontend/hooks/useInfiniteScroll.ts|frontend/hooks/useDebounce.ts|frontend/hooks/useLocalStorage.ts"
    ["前端组件"]="frontend/components/dashboard/ReadingProgressTracker.tsx|frontend/components/dashboard/ReadingStatsCard.tsx|frontend/components/blog/BlogSearch.tsx"
    ["前端服务"]="frontend/services/api/readingProgress.ts|frontend/services/api/client.ts"
    ["前端工具库"]="frontend/lib/utils.ts|frontend/lib/constants.ts"
    ["后端 API"]="backend/app/api/reading_progress.py"
    ["后端模型"]="backend/app/models/reading_progress.py"
    ["后端 Schema"]="backend/app/schemas/reading_progress.py"
    ["数据库迁移"]="backend/database/migrations/versions/001_add_reading_progress.py"
    ["后端验证器"]="backend/app/core/validators.py"
)

total_files=0
success_files=0

for category in "${!FILES[@]}"; do
    IFS='|' read -ra FILES_ARRAY <<< "${FILES[$category]}"
    
    echo -e "${BLUE}📁 $category${NC}"
    
    for file in "${FILES_ARRAY[@]}"; do
        ((total_files++))
        
        if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
            lines=$(wc -l < "/root/.openclaw/workspace/cyberpress-platform/$file")
            echo -e "  ${GREEN}✓${NC} $file (${lines} 行)"
            ((success_files++))
        else
            echo -e "  ${YELLOW}✗${NC} $file (未找到)"
        fi
    done
    
    echo ""
done

echo "========================================="
echo -e "${GREEN}✓ 成功: $success_files / $total_files 个文件${NC}"
echo "========================================="
echo ""

# 统计代码行数
echo "📊 代码统计"
echo "========================================="

total_lines=0
for category in "${!FILES[@]}"; do
    IFS='|' read -ra FILES_ARRAY <<< "${FILES[$category]}"
    
    category_lines=0
    for file in "${FILES_ARRAY[@]}"; do
        if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
            lines=$(wc -l < "/root/.openclaw/workspace/cyberpress-platform/$file")
            category_lines=$((category_lines + lines))
        fi
    done
    
    echo "$category: $category_lines 行"
    total_lines=$((total_lines + category_lines))
done

echo ""
echo "总代码行数: $total_lines 行"
echo ""

# 显示文件大小
echo "💾 文件大小"
echo "========================================="

for category in "${!FILES[@]}"; do
    IFS='|' read -ra FILES_ARRAY <<< "${FILES[$category]}"
    
    for file in "${FILES_ARRAY[@]}"; do
        if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
            size=$(du -h "/root/.openclaw/workspace/cyberpress-platform/$file" | cut -f1)
            echo "  $size  $file"
        fi
    done
done

echo ""
echo "========================================="
echo -e "${GREEN}🎉 验证完成！${NC}"
echo "========================================="

exit 0
