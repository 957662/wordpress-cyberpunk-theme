#!/bin/bash

# CyberPress Frontend - 核心文件创建脚本
# 此脚本用于创建项目缺失的核心文件

set -e

echo "🚀 CyberPress Frontend - 核心文件创建脚本"
echo "=========================================="

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${BLUE}📁 项目根目录: ${PROJECT_ROOT}${NC}"
echo ""

# 创建必要的目录
echo -e "${GREEN}📂 创建目录结构...${NC}"

mkdir -p lib/wordpress
mkdir -p hooks
mkdir -p components/providers
mkdir -p app/\(public\)/blog/\[slug\]
mkdir -p app/\(public\)/portfolio/\[slug\]
mkdir -p app/\(public\)/about
mkdir -p app/\(public\)/contact

echo -e "${GREEN}✅ 目录结构创建完成${NC}"
echo ""

# 检查文件是否存在，如果不存在则创建模板
check_and_create_template() {
    local file=$1
    local description=$2

    if [ ! -f "$file" ]; then
        echo -e "${BLUE}📝 需要创建: ${file}${NC}"
        echo "   用途: ${description}"
        echo "   文件: ${file}"
        return 0
    else
        echo -e "${GREEN}✅ 已存在: ${file}${NC}"
        return 1
    fi
}

echo -e "${BLUE}🔍 检查缺失的文件...${NC}"
echo ""

MISSING_COUNT=0

# 检查核心文件
check_and_create_template "lib/utils.ts" "工具函数库" && ((MISSING_COUNT++))
check_and_create_template "lib/types.ts" "TypeScript 类型定义" && ((MISSING_COUNT++))
check_and_create_template "lib/wordpress/client.ts" "WordPress API 客户端" && ((MISSING_COUNT++))
check_and_create_template "hooks/usePosts.ts" "博客相关 hooks" && ((MISSING_COUNT++))
check_and_create_template "hooks/usePortfolio.ts" "作品集相关 hooks" && ((MISSING_COUNT++))
check_and_create_template "hooks/useComments.ts" "评论相关 hooks" && ((MISSING_COUNT++))
check_and_create_template "hooks/useSearch.ts" "搜索相关 hooks" && ((MISSING_COUNT++))
check_and_create_template "hooks/useAuth.ts" "认证相关 hooks" && ((MISSING_COUNT++))
check_and_create_template "components/providers/ThemeProvider.tsx" "主题提供者" && ((MISSING_COUNT++))
check_and_create_template "components/providers/QueryProvider.tsx" "React Query 提供者" && ((MISSING_COUNT++))
check_and_create_template "app/layout.tsx" "根布局" && ((MISSING_COUNT++))
check_and_create_template "app/page.tsx" "首页" && ((MISSING_COUNT++))
check_and_create_template "app/(public)/blog/page.tsx" "博客列表页" && ((MISSING_COUNT++))
check_and_create_template "app/(public)/blog/[slug]/page.tsx" "博客详情页" && ((MISSING_COUNT++))
check_and_create_template "app/(public)/portfolio/page.tsx" "作品集列表页" && ((MISSING_COUNT++))
check_and_create_template "app/(public)/portfolio/[slug]/page.tsx" "作品集详情页" && ((MISSING_COUNT++))
check_and_create_template "app/(public)/about/page.tsx" "关于页面" && ((MISSING_COUNT++))
check_and_create_template "app/(public)/contact/page.tsx" "联系页面" && ((MISSING_COUNT++))

echo ""
echo -e "${BLUE}📊 统计: ${MISSING_COUNT} 个文件需要创建${NC}"
echo ""

# 提供下一步操作建议
if [ $MISSING_COUNT -gt 0 ]; then
    echo -e "${GREEN}📋 下一步操作:${NC}"
    echo ""
    echo "1. 查看 PROJECT_STATUS.md 获取详细代码示例"
    echo "2. 手动创建上述缺失的文件"
    echo "3. 或者运行以下命令启动开发服务器，根据错误提示逐步创建:"
    echo ""
    echo "   npm run dev"
    echo ""
    echo "4. 参考以下资源:"
    echo "   - README.md: 项目概述"
    echo "   - SETUP_GUIDE.md: 设置指南"
    echo "   - PROJECT_STATUS.md: 详细状态和代码示例"
    echo "   - .ai-context: AI 开发指南"
else
    echo -e "${GREEN}🎉 所有核心文件都已存在！${NC}"
    echo ""
    echo "运行以下命令启动开发服务器:"
    echo ""
    echo "   npm run dev"
fi

echo ""
echo -e "${BLUE}💡 提示:${NC}"
echo "所有文件代码都在 PROJECT_STATUS.md 中提供"
echo "你可以复制这些代码来创建缺失的文件"
echo ""
echo -e "${GREEN}✨ 脚本执行完成！${NC}"
