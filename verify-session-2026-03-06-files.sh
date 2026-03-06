#!/bin/bash

# 验证 2026-03-06 Session 创建的文件

echo "=========================================="
echo "验证文件创建 - 2026-03-06 Session"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total_files=0
found_files=0
missing_files=0

# 检查文件函数
check_file() {
    local file=$1
    total_files=$((total_files + 1))

    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
        found_files=$((found_files + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $file (未找到)"
        missing_files=$((missing_files + 1))
        return 1
    fi
}

echo "1. 搜索组件"
echo "----------------------------------------"
check_file "frontend/components/search/SearchModal.tsx"
check_file "frontend/components/search/SearchTrigger.tsx"
check_file "frontend/components/search/index.ts"
echo ""

echo "2. 认证组件"
echo "----------------------------------------"
check_file "frontend/components/auth/AuthGuard.tsx"
check_file "frontend/components/auth/LoginForm.tsx"
check_file "frontend/components/auth/RegisterForm.tsx"
check_file "frontend/components/auth/index.ts"
echo ""

echo "3. UI 组件"
echo "----------------------------------------"
check_file "frontend/components/ui/LazyImage.tsx"
check_file "frontend/components/ui/ScrollToTop.tsx"
check_file "frontend/components/ui/LoadingScreen.tsx"
echo ""

echo "4. Hooks"
echo "----------------------------------------"
check_file "frontend/hooks/useAuth.ts"
check_file "frontend/hooks/useIntersectionObserver.ts"
echo ""

echo "5. 工具函数"
echo "----------------------------------------"
check_file "frontend/lib/utils/performance-helpers.ts"
echo ""

echo "6. 文档"
echo "----------------------------------------"
check_file "SESSION_2026-03-06_FILE_CREATION.md"
echo ""

echo "=========================================="
echo "统计信息"
echo "=========================================="
echo -e "总文件数: $total_files"
echo -e "${GREEN}已创建: $found_files${NC}"
echo -e "${RED}缺失: $missing_files${NC}"
echo ""

if [ $missing_files -eq 0 ]; then
    echo -e "${GREEN}✓ 所有文件创建成功！${NC}"
    exit 0
else
    echo -e "${RED}✗ 有 $missing_files 个文件未创建${NC}"
    exit 1
fi
