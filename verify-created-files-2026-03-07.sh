#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}🔍 验证创建的文件${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# 文件列表
files=(
  "frontend/lib/adapters/blog-adapter-unified.ts"
  "frontend/hooks/use-blog-data.ts"
  "frontend/components/blog/LoadingState.tsx"
  "frontend/components/blog/EmptyState.tsx"
  "frontend/components/blog/BlogStats.tsx"
  "DEVELOPMENT_FILES_SUMMARY_2026-03-07.md"
)

total=${#files[@]}
success=0
failed=0

for file in "${files[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
    ((success++))
  else
    echo -e "${RED}✗${NC} $file (未找到)"
    ((failed++))
  fi
done

echo ""
echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}📊 统计信息${NC}"
echo -e "${BLUE}======================================${NC}"
echo -e "总文件数: ${BLUE}$total${NC}"
echo -e "${GREEN}成功: $success${NC}"
echo -e "${RED}失败: $failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
  echo -e "${GREEN}🎉 所有文件验证通过！${NC}"
  exit 0
else
  echo -e "${RED}❌ 部分文件验证失败！${NC}"
  exit 1
fi
