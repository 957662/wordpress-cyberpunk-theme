#!/bin/bash

echo "=========================================="
echo "🔍 验证本次会话创建的文件"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 文件列表
FILES=(
  "frontend/services/websocket-service-v2.ts"
  "frontend/components/search-advanced/AdvancedSearch.tsx"
  "frontend/components/performance/VirtualList.tsx"
  "backend/app/services/auth_service_complete.py"
  "frontend/jest.config.complete.js"
  "frontend/jest.setup.complete.js"
  "frontend/__tests__/unit/components/Button.test.tsx"
  "docs/API_DOCUMENTATION.md"
  "docs/DEPLOYMENT_GUIDE.md"
  "FILES_CREATED_SESSION_20260303_FINAL_INDEX.md"
)

# 计数器
total=${#FILES[@]}
found=0
missing=0

echo "📋 检查 $total 个文件..."
echo ""

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    size=$(wc -l < "$file")
    echo -e "${GREEN}✓${NC} $file ($size lines)"
    ((found++))
  else
    echo -e "${RED}✗${NC} $file (未找到)"
    ((missing++))
  fi
done

echo ""
echo "=========================================="
echo "📊 统计信息"
echo "=========================================="
echo -e "${GREEN}已找到: $found${NC}"
echo -e "${RED}缺失: $missing${NC}"
echo -e "总计: $total"
echo ""

if [ $missing -eq 0 ]; then
  echo -e "${GREEN}🎉 所有文件验证通过！${NC}"
  exit 0
else
  echo -e "${RED}⚠️  有 $missing 个文件缺失${NC}"
  exit 1
fi
