#!/bin/bash

# 博客系统文件验证脚本
# 创建时间: 2026-03-06

echo "======================================"
echo "  博客系统文件验证"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 计数器
total_files=0
created_files=0
existing_files=0

echo "检查文件..."
echo ""

# 文件列表
files=(
  "frontend/components/blog/BlogHome.tsx"
  "frontend/components/blog/BlogDetailEnhanced.tsx"
  "frontend/components/blog/ArticleCardEnhancedNew.tsx"
  "frontend/components/blog/BlogSearchBar.tsx"
  "frontend/components/blog/CategoryFilter.tsx"
  "frontend/components/blog/ArticleStats.tsx"
  "frontend/lib/hooks/useBlogArticles.ts"
  "frontend/app/(public)/blog-new/page.tsx"
  "BLOG_SYSTEM_REPORT.md"
  "FILES_CREATED_BLOG_SYSTEM.md"
)

for file in "${files[@]}"; do
  total_files=$((total_files + 1))

  if [ -f "$file" ]; then
    # 获取文件大小
    size=$(du -h "$file" | cut -f1)

    # 检查是否为新创建的文件（通过修改时间判断）
    if stat -c %Y "$file" >/dev/null 2>&1; then
      # Linux
      mod_time=$(stat -c %Y "$file")
    else
      # macOS
      mod_time=$(stat -f %m "$file")
    fi

    current_time=$(date +%s)
    time_diff=$((current_time - mod_time))

    # 如果文件是在最近10分钟内创建的，认为是新创建的
    if [ $time_diff -lt 600 ]; then
      echo -e "${GREEN}✓ 新创建${NC} $file ($size)"
      created_files=$((created_files + 1))
    else
      echo -e "${BLUE}○ 已存在${NC} $file ($size)"
      existing_files=$((existing_files + 1))
    fi
  else
    echo -e "${RED}✗ 缺失${NC} $file"
  fi
done

echo ""
echo "======================================"
echo "  验证结果"
echo "======================================"
echo ""
echo "总文件数: $total_files"
echo -e "${GREEN}新创建: $created_files${NC}"
echo -e "${BLUE}已存在: $existing_files${NC}"
echo ""

if [ $created_files -gt 0 ]; then
  echo -e "${GREEN}✓ 博客系统创建成功！${NC}"
  echo ""
  echo "下一步操作："
  echo "1. 访问页面: http://localhost:3000/blog-new"
  echo "2. 查看文档: cat BLOG_SYSTEM_REPORT.md"
  echo "3. 测试功能: npm run dev"
else
  echo -e "${RED}✗ 没有创建新文件${NC}"
fi

echo ""
