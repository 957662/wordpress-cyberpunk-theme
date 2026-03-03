#!/bin/bash

echo "=========================================="
echo "CyberPress Platform - 文件验证脚本"
echo "=========================================="
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

# 检查文件函数
check_file() {
    local file=$1
    total=$((total + 1))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
        success=$((success + 1))
        return 0
    else
        echo -e "${RED}❌${NC} $file"
        failed=$((failed + 1))
        return 1
    fi
}

echo "检查组件文件..."
echo "──────────────────────────────────────────"
check_file "frontend/components/comments/CommentSystemAdvanced.tsx"
check_file "frontend/components/auth/AuthProvider.tsx"
check_file "frontend/components/auth/LoginForm.tsx"
check_file "frontend/components/admin/PostEditor.tsx"
check_file "frontend/components/pwa/PWAInstaller.tsx"
check_file "frontend/components/pwa/PWAUpdater.tsx"
echo ""

echo "检查页面文件..."
echo "──────────────────────────────────────────"
check_file "frontend/app/admin/dashboard/page.tsx"
echo ""

echo "检查 API 路由..."
echo "──────────────────────────────────────────"
check_file "frontend/app/api/comments/route.ts"
check_file "frontend/app/api/auth/login/route.ts"
check_file "frontend/app/api/auth/register/route.ts"
check_file "frontend/app/api/admin/dashboard/route.ts"
echo ""

echo "检查工具库..."
echo "──────────────────────────────────────────"
check_file "frontend/lib/seo/SeoHead.tsx"
echo ""

echo "检查配置文件..."
echo "──────────────────────────────────────────"
check_file "frontend/public/manifest.json"
echo ""

echo "检查文档..."
echo "──────────────────────────────────────────"
check_file "CREATED_FILES_SUMMARY_2026_03_03.md"
check_file "FILES_LIST_2026_03_03.txt"
echo ""

echo "=========================================="
echo "验证结果"
echo "=========================================="
echo -e "总计文件: ${YELLOW}$total${NC}"
echo -e "成功: ${GREEN}$success${NC}"
echo -e "失败: ${RED}$failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 所有文件验证通过！${NC}"
    exit 0
else
    echo -e "${RED}⚠️  有 $failed 个文件未找到${NC}"
    exit 1
fi
