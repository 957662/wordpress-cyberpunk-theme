#!/bin/bash

echo "=========================================="
echo "验证新创建的组件文件"
echo "验证时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="
echo ""

SUCCESS_COUNT=0
FAIL_COUNT=0

# 检查函数
check_file() {
    if [ -f "$1" ]; then
        SIZE=$(du -h "$1" | cut -f1)
        echo "✅ $1"
        echo "   大小: $SIZE"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo "❌ $1 - 文件不存在"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
}

echo "📁 检查新创建的组件文件..."
echo ""

# 1. 图片库组件
echo "1. 图片库组件 (Image Gallery)"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/image-gallery/LightboxGallery.tsx"
echo ""

# 2. 评分组件
echo "2. 评分组件 (Rating)"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/rating/StarRating.tsx"
echo ""

# 3. 时间线组件
echo "3. 时间线组件 (Timeline)"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/timeline/Timeline.tsx"
echo ""

# 4. 统计卡片组件
echo "4. 统计卡片组件 (Dashboard Stats)"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/dashboard-stats/StatCards.tsx"
echo ""

# 5. 待办事项组件
echo "5. 待办事项组件 (Todo List)"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/tasks/TodoList.tsx"
echo ""

# 6. 高级搜索组件
echo "6. 高级搜索组件 (Advanced Search)"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/search-advanced/AdvancedSearch.tsx"
echo ""

# 导出文件
echo "7. 导出文件"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/NEW_COMPONENTS_INDEX.ts"
echo ""

# 报告文件
echo "8. 文档报告"
check_file "/root/.openclaw/workspace/cyberpress-platform/NEW_COMPONENTS_REPORT.md"
echo ""

echo "=========================================="
echo "验证完成"
echo "✅ 成功: $SUCCESS_COUNT 个文件"
echo "❌ 失败: $FAIL_COUNT 个文件"
echo "=========================================="
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo "🎉 所有文件创建成功！"
    exit 0
else
    echo "⚠️  有 $FAIL_COUNT 个文件创建失败"
    exit 1
fi
