#!/bin/bash

# Phase 3 文件验证脚本

echo "=========================================="
echo "  Phase 3 社交功能 - 文件验证"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total_files=0
existing_files=0

# 检查函数
check_file() {
    total_files=$((total_files + 1))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        existing_files=$((existing_files + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $1 (缺失)"
        return 1
    fi
}

echo "=== 1. 类型定义文件 ==="
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/types/follow.types.ts"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/types/notification.types.ts"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/types/like.types.ts"
echo ""

echo "=== 2. 服务层文件 ==="
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/services/follow/follow-service.ts"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/services/notification/notification-service.ts"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/services/like/like-service.ts"
echo ""

echo "=== 3. React Hooks 文件 ==="
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/hooks/api/useFollow.ts"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/hooks/api/useNotification.ts"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/hooks/api/useLike.ts"
echo ""

echo "=== 4. API 路由文件 ==="
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/app/api/follow/route.ts"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/app/api/notifications/route.ts"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/app/api/likes/route.ts"
echo ""

echo "=== 5. 页面组件文件 ==="
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/app/notifications/page.tsx"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/app/feed/page.tsx"
echo ""

echo "=== 6. 文档文件 ==="
check_file "/root/.openclaw/workspace/cyberpress-platform/FILES_CREATED_PHASE_3.txt"
check_file "/root/.openclaw/workspace/cyberpress-platform/PHASE_3_IMPLEMENTATION_REPORT.md"
echo ""

echo "=========================================="
echo "  验证结果"
echo "=========================================="
echo -e "总文件数: ${YELLOW}$total_files${NC}"
echo -e "已创建: ${GREEN}$existing_files${NC}"
echo -e "缺失: ${RED}$((total_files - existing_files))${NC}"
echo ""

if [ $existing_files -eq $total_files ]; then
    echo -e "${GREEN}✓ 所有文件创建成功!${NC}"
    exit 0
else
    echo -e "${RED}✗ 部分文件缺失${NC}"
    exit 1
fi
