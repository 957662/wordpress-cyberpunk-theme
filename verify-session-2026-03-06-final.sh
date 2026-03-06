#!/bin/bash

# CyberPress Platform - 文件创建验证脚本
# 日期: 2026-03-06
# 会话: 组件增强

echo "=================================="
echo "CyberPress Platform - 文件验证"
echo "日期: 2026-03-06"
echo "=================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total_files=0
existing_files=0
missing_files=0

# 检查文件函数
check_file() {
    local file=$1
    total_files=$((total_files + 1))

    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
        existing_files=$((existing_files + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $file"
        missing_files=$((missing_files + 1))
        return 1
    fi
}

echo "📧 邮件组件 (components/email/)"
echo "-----------------------------------"
check_file "frontend/components/email/EmailTemplate.tsx"
check_file "frontend/components/email/WelcomeEmail.tsx"
check_file "frontend/components/email/NotificationEmail.tsx"
check_file "frontend/components/email/DigestEmail.tsx"
check_file "frontend/components/email/index.ts"
echo ""

echo "🔌 集成组件 (components/integrations/)"
echo "-----------------------------------"
check_file "frontend/components/integrations/GoogleAnalytics.tsx"
check_file "frontend/components/integrations/DisqusComments.tsx"
check_file "frontend/components/integrations/GiscusComments.tsx"
check_file "frontend/components/integrations/UmamiAnalytics.tsx"
check_file "frontend/components/integrations/PlausibleAnalytics.tsx"
# 检查 index.ts 是否已更新
if grep -q "GoogleAnalytics" "frontend/components/integrations/index.ts" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} frontend/components/integrations/index.ts (已更新)"
    existing_files=$((existing_files + 1))
    total_files=$((total_files + 1))
else
    echo -e "${YELLOW}!${NC} frontend/components/integrations/index.ts (需要更新)"
    total_files=$((total_files + 1))
fi
echo ""

echo "⚙️ 设置组件 (components/settings/)"
echo "-----------------------------------"
check_file "frontend/components/settings/AccountSettings.tsx"
check_file "frontend/components/settings/ThemeSettings.tsx"
check_file "frontend/components/settings/PrivacySettings.tsx"
echo ""

echo "🔧 服务文件 (services/)"
echo "-----------------------------------"
check_file "frontend/services/analytics.ts"
check_file "frontend/services/notification.ts"
echo ""

echo "📄 文档文件"
echo "-----------------------------------"
check_file "CREATION_SUMMARY_2026-03-06_SESSION.md"
echo ""

echo "=================================="
echo "📊 统计信息"
echo "=================================="
echo -e "总文件数: ${YELLOW}$total_files${NC}"
echo -e "已创建: ${GREEN}$existing_files${NC}"
echo -e "缺失: ${RED}$missing_files${NC}"
echo ""

if [ $missing_files -eq 0 ]; then
    echo -e "${GREEN}✓ 所有文件创建成功！${NC}"
    exit 0
else
    echo -e "${RED}✗ 有 $missing_files 个文件缺失${NC}"
    exit 1
fi
