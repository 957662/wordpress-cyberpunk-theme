#!/bin/bash

# 验证新创建的测试文件

set -e

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 基础路径
BASE_DIR="/root/.openclaw/workspace/cyberpress-platform"

# 新创建的文件列表
NEW_FILES=(
    # 前端单元测试 - 组件
    "$BASE_DIR/frontend/__tests__/unit/components/Badge.test.tsx"
    "$BASE_DIR/frontend/__tests__/unit/components/Avatar.test.tsx"
    "$BASE_DIR/frontend/__tests__/unit/components/Progress.test.tsx"
    "$BASE_DIR/frontend/__tests__/unit/components/Tooltip.test.tsx"
    "$BASE_DIR/frontend/__tests__/unit/components/Select.test.tsx"
    "$BASE_DIR/frontend/__tests__/unit/components/Switch.test.tsx"

    # 前端单元测试 - Hooks
    "$BASE_DIR/frontend/__tests__/unit/hooks/useThrottle.test.ts"
    "$BASE_DIR/frontend/__tests__/unit/hooks/useLocalStorage.test.ts"
    "$BASE_DIR/frontend/__tests__/unit/hooks/useClickOutside.test.ts"
    "$BASE_DIR/frontend/__tests__/unit/hooks/useIntersection.test.ts"
    "$BASE_DIR/frontend/__tests__/unit/hooks/useMediaQuery.test.ts"

    # 前端单元测试 - 特效
    "$BASE_DIR/frontend/__tests__/unit/effects/NeonBorder.test.tsx"
    "$BASE_DIR/frontend/__tests__/unit/effects/ParticleBackground.test.tsx"
    "$BASE_DIR/frontend/__tests__/unit/effects/TextScramble.test.tsx"
    "$BASE_DIR/frontend/__tests__/unit/effects/HolographicCard.test.tsx"
    "$BASE_DIR/frontend/__tests__/unit/effects/Scanlines.test.tsx"

    # 前端集成测试
    "$BASE_DIR/frontend/__tests__/integration/social-flow.integration.test.ts"
    "$BASE_DIR/frontend/__tests__/integration/search-flow.integration.test.ts"

    # 前端 E2E 测试
    "$BASE_DIR/frontend/e2e/social.e2e.ts"
    "$BASE_DIR/frontend/e2e/admin.e2e.ts"

    # 后端测试
    "$BASE_DIR/backend/tests/test_comments.py"
    "$BASE_DIR/backend/tests/test_posts.py"

    # 测试工具
    "$BASE_DIR/frontend/__tests__/utils/test-utils.tsx"
    "$BASE_DIR/frontend/__tests__/utils/test-helpers.ts"
    "$BASE_DIR/frontend/__tests__/setup.ts"

    # 测试配置和文档
    "$BASE_DIR/frontend/__tests__/README.md"
    "$BASE_DIR/frontend/run-tests.sh"
    "$BASE_DIR/TESTING_FILES_CREATED_REPORT.md"
)

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}验证新创建的测试文件${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

total=0
exists=0
missing=0

for file in "${NEW_FILES[@]}"; do
    total=$((total + 1))

    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} ${file#$BASE_DIR/}"
        exists=$((exists + 1))
    else
        echo -e "${RED}❌${NC} ${file#$BASE_DIR/}"
        missing=$((missing + 1))
    fi
done

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}统计结果${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "总文件数: ${total}"
echo -e "${GREEN}已创建: ${exists}${NC}"
echo -e "${RED}缺失: ${missing}${NC}"
echo ""

if [ $total -gt 0 ]; then
    percentage=$((exists * 100 / total))
    echo -e "完成度: ${percentage}%"
    echo ""

    if [ $percentage -eq 100 ]; then
        echo -e "${GREEN}🎉 所有新测试文件都已成功创建！${NC}"
        echo ""
        echo -e "${YELLOW}📋 下一步操作:${NC}"
        echo ""
        echo "1. 查看测试报告:"
        echo "   cat TESTING_FILES_CREATED_REPORT.md"
        echo ""
        echo "2. 运行测试:"
        echo "   cd frontend"
        echo "   ./run-tests.sh"
        echo ""
        echo "3. 查看测试文档:"
        echo "   cat frontend/__tests__/README.md"
        echo ""
        exit 0
    else
        echo -e "${RED}⚠️  有 ${missing} 个文件创建失败${NC}"
        exit 1
    fi
fi
