#!/bin/bash

# 验证新创建的文件
# CyberPress Platform - 2026-03-05

echo "🔍 验证新创建的文件..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 文件列表
FILES=(
    "frontend/components/performance/PerformanceMetrics.tsx"
    "frontend/components/notifications/NotificationManager.tsx"
    "frontend/components/form/SmartForm.tsx"
    "frontend/lib/utils/collection-utils.ts"
    "frontend/lib/analytics/user-behavior-tracker.ts"
    "frontend/lib/analytics/ab-testing.ts"
    "backend/app/core/query_builder.py"
    "backend/app/core/cache_manager.py"
    "CREATED_FILES_SUMMARY_2026-03-05_SESSION.md"
)

# 计数器
total=${#FILES[@]}
success=0
failed=0

echo "📋 文件列表: $total 个"
echo ""

# 检查每个文件
for file in "${FILES[@]}"; do
    if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
        size=$(wc -l < "/root/.openclaw/workspace/cyberpress-platform/$file")
        echo -e "${GREEN}✓${NC} $file ($size 行)"
        ((success++))
    else
        echo -e "${RED}✗${NC} $file (不存在)"
        ((failed++))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "统计信息:"
echo -e "  成功: ${GREEN}$success${NC} / $total"
echo -e "  失败: ${RED}$failed${NC} / $total"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $success -eq $total ]; then
    echo -e "\n${GREEN}🎉 所有文件验证成功!${NC}"
    exit 0
else
    echo -e "\n${RED}❌ 部分文件验证失败${NC}"
    exit 1
fi
