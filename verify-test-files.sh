#!/bin/bash

###############################################################################
# 验证测试文件创建脚本
# ============================================================================

echo "========================================"
echo "  验证测试文件创建"
echo "========================================"
echo ""

# 计数器
total_files=0
missing_files=0

# 检查文件函数
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1"
        ((total_files++))
    else
        echo "❌ $1 (缺失)"
        ((missing_files++))
    fi
}

echo "前端单元测试"
echo "---"
check_file "frontend/__tests__/unit/components/Alert.test.tsx"
check_file "frontend/__tests__/unit/components/Input.test.tsx"
check_file "frontend/__tests__/unit/components/Modal.test.tsx"
check_file "frontend/__tests__/unit/effects/GlitchEffect.test.tsx"
check_file "frontend/__tests__/unit/hooks/useDebounce.test.ts"
check_file "frontend/__tests__/unit/lib/validators.test.ts"
echo ""

echo "前端集成测试"
echo "---"
check_file "frontend/__tests__/integration/blog-flow.integration.test.ts"
check_file "frontend/__tests__/integration/auth-flow.integration.test.ts"
echo ""

echo "后端测试"
echo "---"
check_file "backend/tests/test_auth_system.py"
echo ""

echo "E2E 测试"
echo "---"
check_file "frontend/playwright/blog.spec.ts"
check_file "playwright.config.ts"
check_file "frontend/playwright/global-setup.ts"
check_file "frontend/playwright/global-teardown.ts"
check_file "frontend/playwright/.auth/user.json"
echo ""

echo "测试脚本和文档"
echo "---"
check_file "run-tests.sh"
check_file "TESTING_GUIDE_COMPREHENSIVE.md"
check_file "TESTING_SUMMARY_2026-03-05.md"
echo ""

echo "========================================"
echo "  验证结果"
echo "========================================"
echo "成功创建文件: $total_files"
echo "缺失文件: $missing_files"
echo ""

if [ $missing_files -eq 0 ]; then
    echo "✅ 所有测试文件创建成功！"
    exit 0
else
    echo "⚠️  有 $missing_files 个文件缺失"
    exit 1
fi
