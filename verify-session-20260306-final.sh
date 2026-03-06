#!/bin/bash

# 验证脚本 - 检查2026年3月6日创建的文件

echo "🔍 验证2026年3月6日创建的文件..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success_count=0
fail_count=0

# 检查文件函数
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((success_count++))
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        ((fail_count++))
        return 1
    fi
}

echo "📦 后端服务文件"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "backend/app/services/tag_service.py"
check_file "backend/app/services/category_service.py"
echo ""

echo "🎨 前端组件文件"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/components/code/SnippetShare.tsx"
check_file "frontend/components/integrations/GitHubRepoCard.tsx"
echo ""

echo "🛠️ 工具函数文件"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/lib/utils/http.ts"
echo ""

echo "📡 前端服务文件"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/services/tagService.ts"
echo ""

echo "📄 文档文件"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "FILE_CREATION_SUMMARY_SESSION_2026_03_06.md"
echo ""

# 检查文件大小
echo "📊 文件大小统计"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
for file in \
    "backend/app/services/tag_service.py" \
    "backend/app/services/category_service.py" \
    "frontend/components/code/SnippetShare.tsx" \
    "frontend/components/integrations/GitHubRepoCard.tsx" \
    "frontend/lib/utils/http.ts" \
    "frontend/services/tagService.ts"
do
    if [ -f "$file" ]; then
        size=$(wc -l < "$file")
        echo -e "${GREEN}✓${NC} $file - ${size} 行"
    fi
done
echo ""

# 检查文件内容
echo "🔍 内容验证"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查 tag_service.py
if grep -q "class TagService" backend/app/services/tag_service.py 2>/dev/null; then
    echo -e "${GREEN}✓${NC} tag_service.py 包含 TagService 类"
else
    echo -e "${RED}✗${NC} tag_service.py 缺少 TagService 类"
fi

# 检查 category_service.py
if grep -q "class CategoryService" backend/app/services/category_service.py 2>/dev/null; then
    echo -e "${GREEN}✓${NC} category_service.py 包含 CategoryService 类"
else
    echo -e "${RED}✗${NC} category_service.py 缺少 CategoryService 类"
fi

# 检查 SnippetShare.tsx
if grep -q "SnippetShare" frontend/components/code/SnippetShare.tsx 2>/dev/null; then
    echo -e "${GREEN}✓${NC} SnippetShare.tsx 包含 SnippetShare 组件"
else
    echo -e "${RED}✗${NC} SnippetShare.tsx 缺少 SnippetShare 组件"
fi

# 检查 GitHubRepoCard.tsx
if grep -q "GitHubRepoCard" frontend/components/integrations/GitHubRepoCard.tsx 2>/dev/null; then
    echo -e "${GREEN}✓${NC} GitHubRepoCard.tsx 包含 GitHubRepoCard 组件"
else
    echo -e "${RED}✗${NC} GitHubRepoCard.tsx 缺少 GitHubRepoCard 组件"
fi

# 检查 http.ts
if grep -q "class HTTPClient" frontend/lib/utils/http.ts 2>/dev/null; then
    echo -e "${GREEN}✓${NC} http.ts 包含 HTTPClient 类"
else
    echo -e "${RED}✗${NC} http.ts 缺少 HTTPClient 类"
fi

# 检查 tagService.ts
if grep -q "class TagService" frontend/services/tagService.ts 2>/dev/null; then
    echo -e "${GREEN}✓${NC} tagService.ts 包含 TagService 类"
else
    echo -e "${RED}✗${NC} tagService.ts 缺少 TagService 类"
fi
echo ""

# 总结
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "📊 验证结果:"
echo -e "   ${GREEN}成功${NC}: $success_count 个文件"
echo -e "   ${RED}失败${NC}: $fail_count 个文件"
echo ""

if [ $fail_count -eq 0 ]; then
    echo -e "${GREEN}🎉 所有文件验证通过！${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  部分文件验证失败${NC}"
    exit 1
fi
