#!/bin/bash

# 验证新文件创建脚本

echo "================================"
echo "验证新创建的文件"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total=0
success=0
failed=0

# 检查文件是否存在
check_file() {
    total=$((total + 1))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        success=$((success + 1))
        
        # 显示文件大小
        size=$(wc -l < "$1")
        echo -e "  ${YELLOW}代码行数: ${size}${NC}"
    else
        echo -e "${RED}✗${NC} $1 - 文件不存在"
        failed=$((failed + 1))
    fi
    echo ""
}

echo "=== 数据层文件 ==="
check_file "frontend/lib/data/posts.ts"
check_file "frontend/lib/data/categories.ts"
check_file "frontend/lib/data/adapter.ts"
check_file "frontend/lib/data/index.ts"
check_file "frontend/lib/data/__tests__/posts.test.ts"

echo "=== UI组件 ==="
check_file "frontend/components/ui/loading/LoadingSpinner.tsx"

echo "=== 工具库 ==="
check_file "frontend/lib/utils/validation.utils.ts"
check_file "frontend/lib/utils/format.utils.ts"

echo "=== API服务 ==="
check_file "frontend/services/api/base.service.ts"

echo "=== 自定义Hooks ==="
check_file "frontend/hooks/useDebounce.ts"
check_file "frontend/hooks/useLocalStorage.ts"

echo "=== 文档 ==="
check_file "CREATION_REPORT_2026-03-07.md"

echo "================================"
echo "验证完成"
echo "================================"
echo -e "总计: ${total} 个文件"
echo -e "${GREEN}成功: ${success}${NC}"
echo -e "${RED}失败: ${failed}${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 所有文件创建成功！${NC}"
    exit 0
else
    echo -e "${RED}⚠️  部分文件创建失败${NC}"
    exit 1
fi
