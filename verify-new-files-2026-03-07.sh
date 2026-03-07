#!/bin/bash

# 验证新创建的文件 - 2026-03-07

echo "🔍 验证新创建的文件..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 文件列表
files=(
  "frontend/components/error/BlogErrorBoundary.tsx"
  "frontend/components/blog/SkeletonLoader.tsx"
  "frontend/components/blog/ImageOptimizer.tsx"
  "frontend/hooks/useScrollUtils.ts"
  "frontend/hooks/blog/useBlogList.ts"
  "frontend/lib/utils/optimization.ts"
  "frontend/services/blog/blog-service.ts"
  "frontend/app/blog/[slug]/page-enhanced.tsx"
  "frontend/components/blog/BlogDetailNew.tsx"
)

# 计数器
total=${#files[@]}
created=0
missing=0

echo "📋 文件清单:"
echo ""

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    size=$(wc -l < "$file")
    echo -e "${GREEN}✅${NC} $file (${size} 行)"
    ((created++))
  else
    echo -e "${RED}❌${NC} $file (缺失)"
    ((missing++))
  fi
done

echo ""
echo "📊 统计结果:"
echo "----------------"
echo -e "总文件数: ${YELLOW}$total${NC}"
echo -e "已创建: ${GREEN}$created${NC}"
echo -e "缺失: ${RED}$missing${NC}"
echo ""

if [ $missing -eq 0 ]; then
  echo -e "${GREEN}🎉 所有文件都已成功创建！${NC}"
  exit 0
else
  echo -e "${RED}⚠️  有 $missing 个文件缺失${NC}"
  exit 1
fi
