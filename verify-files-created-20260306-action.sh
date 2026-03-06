#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "================================"
echo "验证新创建的文件"
echo "================================"
echo ""

# 文件列表
files=(
  "frontend/lib/wordpress/client.ts"
  "frontend/hooks/api/use-posts.ts"
  "frontend/lib/utils/index.ts"
  "frontend/types/index.ts"
  "frontend/app/blog/[slug]/page.tsx"
  "frontend/app/blog/page-new.tsx"
  "frontend/jest.config.ts"
  "frontend/jest.setup.ts"
  "frontend/__tests__/components/blog/BlogCard.test.tsx"
  "frontend/__tests__/lib/utils.test.ts"
  "frontend/.env.example"
  "frontend/.env.local.example"
  "QUICKSTART_SESSION_2026-03-06-ACTION.md"
)

created=0
total=${#files[@]}

for file in "${files[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
    ((created++))
  else
    echo -e "${RED}✗${NC} $file (未找到)"
  fi
done

echo ""
echo "================================"
echo -e "创建进度: ${GREEN}$created${NC}/$total"
echo "================================"

if [ $created -eq $total ]; then
  echo -e "${GREEN}所有文件创建成功！${NC}"
  exit 0
else
  echo -e "${RED}有 $((total - created)) 个文件未创建${NC}"
  exit 1
fi
