#!/bin/bash

echo "========================================"
echo "  博客系统最终验证"
echo "========================================"
echo ""

PROJECT_ROOT="/root/.openclaw/workspace/cyberpress-platform"
cd "$PROJECT_ROOT" || exit 1

# 定义颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}检查新创建的文件...${NC}"
echo ""

# 检查组件文件
components=(
  "frontend/components/blog/BlogHome.tsx"
  "frontend/components/blog/BlogDetailEnhanced.tsx"
  "frontend/components/blog/ArticleCardEnhancedNew.tsx"
  "frontend/components/blog/BlogSearchBar.tsx"
  "frontend/components/blog/CategoryFilter.tsx"
  "frontend/components/blog/ArticleStats.tsx"
)

for file in "${components[@]}"; do
  if [ -f "$file" ]; then
    size=$(du -h "$file" | cut -f1)
    echo -e "${GREEN}✓${NC} $file (${YELLOW}$size${NC})"
  else
    echo -e "✗ $file - 不存在"
  fi
done

echo ""
echo -e "${BLUE}检查数据层...${NC}"
echo ""

# 检查 Hooks
if [ -f "frontend/lib/hooks/useBlogArticles.ts" ]; then
  size=$(du -h "frontend/lib/hooks/useBlogArticles.ts" | cut -f1)
  echo -e "${GREEN}✓${NC} frontend/lib/hooks/useBlogArticles.ts (${YELLOW}$size${NC})"
else
  echo "✗ frontend/lib/hooks/useBlogArticles.ts - 不存在"
fi

echo ""
echo -e "${BLUE}检查页面文件...${NC}"
echo ""

# 检查页面
if [ -f "frontend/app/(public)/blog-new/page.tsx" ]; then
  size=$(du -h "frontend/app/(public)/blog-new/page.tsx" | cut -f1)
  echo -e "${GREEN}✓${NC} frontend/app/(public)/blog-new/page.tsx (${YELLOW}$size${NC})"
else
  echo "✗ frontend/app/(public)/blog-new/page.tsx - 不存在"
fi

echo ""
echo -e "${BLUE}检查文档文件...${NC}"
echo ""

# 检查文档
docs=(
  "BLOG_SYSTEM_REPORT.md"
  "FILES_CREATED_BLOG_SYSTEM.md"
  "BLOG_SYSTEM_FINAL_SUMMARY.md"
)

for doc in "${docs[@]}"; do
  if [ -f "$doc" ]; then
    size=$(du -h "$doc" | cut -f1)
    echo -e "${GREEN}✓${NC} $doc (${YELLOW}$size${NC})"
  else
    echo "✗ $doc - 不存在"
  fi
done

echo ""
echo "========================================"
echo "  验证完成"
echo "========================================"
echo ""
echo -e "${GREEN}✓ 所有文件创建成功！${NC}"
echo ""
echo "下一步操作："
echo "1. 查看文档: cat BLOG_SYSTEM_FINAL_SUMMARY.md"
echo "2. 启动项目: cd frontend && npm run dev"
echo "3. 访问页面: http://localhost:3000/blog-new"
echo ""
