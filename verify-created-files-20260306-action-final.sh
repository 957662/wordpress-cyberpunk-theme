#!/bin/bash

# 验证文件创建脚本
# CyberPress Platform - 2026-03-06

echo "=================================="
echo "验证创建的文件"
echo "=================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 文件列表
files=(
  "frontend/lib/adapters/blog-adapter.ts"
  "frontend/lib/adapters/index.ts"
  "frontend/services/api/blog.service.ts"
  "frontend/hooks/api/useBlogPosts.ts"
  "frontend/hooks/api/index.ts"
  "frontend/components/blog/BlogListEnhanced.tsx"
  "frontend/components/blog/PaginationEnhanced.tsx"
  "frontend/components/blog/BlogSearchBar.tsx"
  "frontend/config/api.config.ts"
  "frontend/lib/constants/blog.constants.ts"
  "frontend/app/blog/page-enhanced.tsx"
  "DEVELOPMENT_REPORT_2026-03-06-ACTION.md"
)

# 计数器
total=${#files[@]}
exists=0
missing=0

echo "检查 $total 个文件..."
echo ""

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
    ((exists++))
  else
    echo -e "${RED}✗${NC} $file"
    ((missing++))
  fi
done

echo ""
echo "=================================="
echo "统计信息"
echo "=================================="
echo -e "总计文件: $total"
echo -e "${GREEN}存在: $exists${NC}"
echo -e "${RED}缺失: $missing${NC}"
echo ""

if [ $missing -eq 0 ]; then
  echo -e "${GREEN}所有文件都已成功创建！${NC}"
  exit 0
else
  echo -e "${RED}有 $missing 个文件缺失${NC}"
  exit 1
fi
