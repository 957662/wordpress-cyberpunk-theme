#!/bin/bash

# 博客系统集成验证脚本
# 2026-03-07

echo "================================"
echo "博客系统集成验证"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total=0
passed=0
failed=0

# 检查文件函数
check_file() {
    local file=$1
    total=$((total + 1))

    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
        passed=$((passed + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $file"
        failed=$((failed + 1))
        return 1
    fi
}

# 检查目录函数
check_dir() {
    local dir=$1
    total=$((total + 1))

    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $dir (目录)"
        passed=$((passed + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $dir (目录)"
        failed=$((failed + 1))
        return 1
    fi
}

echo "1. WordPress 集成文件"
echo "--------------------------------"
check_file "frontend/lib/wordpress/config.ts"
check_file "frontend/lib/wordpress/hooks.ts"
check_file "frontend/lib/wordpress/index.ts"
echo ""

echo "2. 博客组件文件"
echo "--------------------------------"
check_file "frontend/app/blog/components/BlogPageClient.tsx"
check_file "frontend/components/blog/utils/blogDataAdapter.ts"
check_file "frontend/components/blog/utils/index.ts"
echo ""

echo "3. 工具函数文件"
echo "--------------------------------"
check_file "frontend/lib/utils/classnames.ts"
check_file "frontend/lib/utils/cn.ts"
check_file "frontend/lib/utils/index.ts"
echo ""

echo "4. 文档文件"
echo "--------------------------------"
check_file "DEVELOPMENT_COMPLETION_REPORT_2026-03-07-ACTUAL.md"
check_file "FILES_CREATED_SUMMARY_2026-03-07-ACTUAL.txt"
check_file "QUICKSTART_BLOG_INTEGRATION_2026-03-07.md"
echo ""

echo "5. 现有博客组件 (验证存在)"
echo "--------------------------------"
check_file "frontend/components/blog/BlogGrid.tsx"
check_file "frontend/components/blog/BlogList.tsx"
check_file "frontend/components/blog/ArticleCard.tsx"
check_file "frontend/components/blog/Pagination.tsx"
check_file "frontend/components/blog/CategoryFilter.tsx"
check_file "frontend/components/blog/BlogSearch.tsx"
check_file "frontend/components/blog/LoadingSpinner.tsx"
check_file "frontend/components/blog/EmptyState.tsx"
check_file "frontend/components/blog/BlogHero.tsx"
echo ""

echo "6. Hooks 验证"
echo "--------------------------------"
check_file "frontend/hooks/use-posts.ts"
check_file "frontend/hooks/usePosts.ts"
echo ""

echo "================================"
echo "验证结果"
echo "================================"
echo -e "总计: ${total}"
echo -e "${GREEN}通过: ${passed}${NC}"
echo -e "${RED}失败: ${failed}${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✓ 所有文件验证通过！${NC}"
    echo ""
    echo "下一步："
    echo "1. 运行 'cd frontend && npm install' 安装依赖"
    echo "2. 配置 .env.local 文件"
    echo "3. 运行 'npm run dev' 启动开发服务器"
    echo "4. 访问 http://localhost:3000/blog 查看博客"
    exit 0
else
    echo -e "${RED}✗ 部分文件验证失败${NC}"
    echo "请检查上述失败的项目"
    exit 1
fi
