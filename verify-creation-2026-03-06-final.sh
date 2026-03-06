#!/bin/bash

# CyberPress Platform - 文件创建验证脚本
# 日期: 2026-03-06

echo "========================================="
echo "🔍 CyberPress Platform 文件创建验证"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total_files=0
success_files=0
failed_files=0

# 检查文件函数
check_file() {
    local file=$1
    total_files=$((total_files + 1))

    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
        success_files=$((success_files + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $file (未找到)"
        failed_files=$((failed_files + 1))
        return 1
    fi
}

echo "📦 检查组件文件..."
echo ""

# API 密钥管理
check_file "frontend/components/api-key/ApiKeyManager.tsx"
check_file "frontend/components/api-key/index.ts"

# 文章导入导出
check_file "frontend/components/article-import/ArticleImportExport.tsx"
check_file "frontend/components/article-import/index.ts"

# 高级阅读进度
check_file "frontend/components/reading-progress-advanced/AdvancedReadingProgress.tsx"
check_file "frontend/components/reading-progress-advanced/index.ts"

# 数据统计仪表盘
check_file "frontend/components/dashboard-stats/AnalyticsDashboard.tsx"
check_file "frontend/components/dashboard-stats/index.ts"

# 内容排期
check_file "frontend/components/content-scheduler/ContentScheduler.tsx"
check_file "frontend/components/content-scheduler/index.ts"

# 数据备份
check_file "frontend/components/backup/BackupManager.tsx"
check_file "frontend/components/backup/index.ts"

# 邮件营销
check_file "frontend/components/email-marketing/EmailCampaignManager.tsx"
check_file "frontend/components/email-marketing/index.ts"

echo ""
echo "📄 检查页面文件..."
echo ""

# 页面文件
check_file "frontend/app/tools/page.tsx"

echo ""
echo "📝 检查文档文件..."
echo ""

# 文档文件
check_file "CREATION_SUMMARY_2026-03-06_SESSION.md"

echo ""
echo "========================================="
echo "📊 验证结果统计"
echo "========================================="
echo ""
echo -e "总文件数: ${YELLOW}$total_files${NC}"
echo -e "成功: ${GREEN}$success_files${NC}"
echo -e "失败: ${RED}$failed_files${NC}"
echo ""

if [ $failed_files -eq 0 ]; then
    echo -e "${GREEN}🎉 所有文件创建成功！${NC}"
    echo ""
    echo "📦 已创建的组件："
    echo "  • API 密钥管理器"
    echo "  • 文章导入导出工具"
    echo "  • 高级阅读进度组件"
    echo "  • 数据统计仪表盘"
    echo "  • 内容排期系统"
    echo "  • 数据备份管理"
    echo "  • 邮件营销管理"
    echo "  • 工具页面"
    echo ""
    echo "🚀 您现在可以在项目中使用这些组件了！"
    exit 0
else
    echo -e "${RED}⚠️  部分文件创建失败${NC}"
    echo "请检查错误并重新创建失败的文件。"
    exit 1
fi
