#!/bin/bash

# 文件验证脚本 - 2026-03-06
echo "========================================"
echo "验证创建的文件 - 2026-03-06"
echo "========================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 文件列表
files=(
  "frontend/app/blog/enhanced/page.tsx"
  "frontend/app/blog/[slug]/page.tsx"
  "frontend/lib/hooks/use-wordpress.ts"
  "frontend/lib/utils/exports.ts"
  "frontend/lib/services/wordpress-service.ts"
)

# 检查文件
created=0
missing=0

for file in "${files[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
    ((created++))
  else
    echo -e "${RED}✗${NC} $file (缺失)"
    ((missing++))
  fi
done

echo ""
echo "========================================"
echo "统计信息"
echo "========================================"
echo -e "创建的文件: ${GREEN}$created${NC}"
echo -e "缺失的文件: ${RED}$missing${NC}"
echo ""

if [ $missing -eq 0 ]; then
  echo -e "${GREEN}✓ 所有文件都已成功创建！${NC}"
  exit 0
else
  echo -e "${RED}✗ 部分文件缺失，请检查！${NC}"
  exit 1
fi
