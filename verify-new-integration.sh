#!/bin/bash

# 验证新创建的集成文件
# Verify newly created integration files

echo "=========================================="
echo "CyberPress Platform - Integration Files Verification"
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
    ((total_files++))

    if [ -f "$file" ]; then
        ((found_files++))
        echo -e "${GREEN}✓${NC} $file"
        return 0
    else
        ((missing_files++))
        echo -e "${RED}✗${NC} $file (not found)"
        return 1
    fi
}

echo "Backend API Files..."
echo "===================="

check_file "backend/app/api/wordpress.py"
check_file "backend/app/api/analytics.py"
check_file "backend/app/api/recommendations.py"

echo ""
echo "Frontend Configuration Files..."
echo "=============================="

check_file "frontend/config/wordpress-integration.config.ts"

echo ""
echo "Frontend Test Files..."
echo "======================"

check_file "frontend/components/__tests__/blog-components.test.tsx"

echo ""
echo "Documentation Files..."
echo "======================"

check_file "INTEGRATION_GUIDE.md"

echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo -e "Total files: ${YELLOW}$total_files${NC}"
echo -e "Found: ${GREEN}$found_files${NC}"
echo -e "Missing: ${RED}$missing_files${NC}"
echo ""

if [ $missing_files -eq 0 ]; then
    echo -e "${GREEN}All integration files created successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review the integration guide: INTEGRATION_GUIDE.md"
    echo "2. Configure your environment variables"
    echo "3. Run tests to verify functionality"
    echo "4. Deploy to production"
    exit 0
else
    echo -e "${RED}Some files are missing. Please check the output above.${NC}"
    exit 1
fi
