#!/bin/bash

# 新组件验证脚本
echo "🔍 验证新创建的组件..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 文件列表
FILES=(
  "frontend/components/ai/AIFormGenerator.tsx"
  "frontend/components/search/AISmartSearch.tsx"
  "frontend/components/whiteboard/Whiteboard.tsx"
  "frontend/components/whiteboard/index.ts"
  "frontend/services/websocket.ts"
  "NEW_COMPONENTS_GUIDE_2026.md"
  "FILES_CREATION_REPORT_2026_03_03_FINAL.md"
  "SESSION_COMPLETE_2026_03_03_FINAL_SUMMARY.md"
  "QUICK_REFERENCE_NEW_COMPONENTS.md"
)

# 检查文件
TOTAL=0
EXIST=0

for file in "${FILES[@]}"; do
  TOTAL=$((TOTAL + 1))
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    EXIST=$((EXIST + 1))
    SIZE=$(du -h "/root/.openclaw/workspace/cyberpress-platform/$file" | cut -f1)
    echo -e "${GREEN}✅${NC} $file ($SIZE)"
  else
    echo -e "${RED}❌${NC} $file - 不存在"
  fi
done

echo ""
echo "📊 统计:"
echo "   总文件数: $TOTAL"
echo "   已创建: $EXIST"
echo "   成功率: $(( EXIST * 100 / TOTAL ))%"

if [ $EXIST -eq $TOTAL ]; then
  echo ""
  echo -e "${GREEN}🎉 所有文件创建成功！${NC}"
  exit 0
else
  echo ""
  echo -e "${RED}⚠️  有文件缺失${NC}"
  exit 1
fi
