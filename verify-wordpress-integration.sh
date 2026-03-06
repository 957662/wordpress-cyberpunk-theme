#!/bin/bash

# WordPress 集成文件验证脚本
# 创建日期: 2026-03-07

echo "=========================================="
echo "WordPress 集成文件验证"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 文件列表
FILES=(
  "frontend/lib/wordpress/wordpress-integration.ts"
  "frontend/lib/wordpress/server-client.ts"
  "frontend/lib/wordpress/data-adapters.ts"
  "frontend/lib/wordpress/utils.ts"
  "frontend/lib/wordpress/examples.ts"
  "frontend/app/blog-wp/page.tsx"
  "frontend/app/blog-wp/[slug]/page.tsx"
  "WORDPRESS_INTEGRATION_GUIDE.md"
  "WORDPRESS_INTEGRATION_COMPLETION_REPORT.md"
)

# 检查文件
missing_count=0
existing_count=0

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
    ((existing_count++))
  else
    echo -e "${RED}✗${NC} $file (不存在)"
    ((missing_count++))
  fi
done

echo ""
echo "=========================================="
echo "统计信息"
echo "=========================================="
echo -e "已创建文件: ${GREEN}$existing_count${NC} / ${#FILES[@]}"
echo -e "缺失文件: ${RED}$missing_count${NC} / ${#FILES[@]}"
echo ""

if [ $missing_count -eq 0 ]; then
  echo -e "${GREEN}✓ 所有文件都已成功创建！${NC}"
  exit 0
else
  echo -e "${RED}✗ 有 $missing_count 个文件未创建${NC}"
  exit 1
fi
