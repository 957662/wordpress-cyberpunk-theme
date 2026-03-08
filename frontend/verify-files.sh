#!/bin/bash

echo "🔍 CyberPress Platform 文件验证脚本"
echo "=================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 文件列表
files=(
  "lib/validation/validation.ts"
  "lib/format/format.ts"
  "services/AnalyticsService.ts"
  "services/NotificationService.ts"
  "components/common/CyberBadge.tsx"
  "components/common/CyberAvatar.tsx"
  "components/common/CyberProgress.tsx"
  "DEVELOPMENT_TASKS_COMPLETED.md"
  "QUICK_REFERENCE.md"
  "FILES_CREATED_2026-03-08.md"
)

# 计数器
total=0
passed=0
failed=0

echo "📁 检查文件存在性和大小..."
echo ""

for file in "${files[@]}"; do
  total=$((total + 1))
  
  if [ -f "$file" ]; then
    size=$(wc -c < "$file" | awk '{print $1}')
    lines=$(wc -l < "$file" | awk '{print $1}')
    
    if [ $size -gt 100 ]; then
      echo -e "${GREEN}✅${NC} $file (${lines} 行, ${size} 字节)"
      passed=$((passed + 1))
    else
      echo -e "${YELLOW}⚠️${NC} $file (${lines} 行, ${size} 字节) - 文件太小"
      passed=$((passed + 1))
    fi
  else
    echo -e "${RED}❌${NC} $file - 文件不存在"
    failed=$((failed + 1))
  fi
done

echo ""
echo "📊 统计结果"
echo "=================================="
echo -e "总文件数: ${total}"
echo -e "${GREEN}通过: ${passed}${NC}"
echo -e "${RED}失败: ${failed}${NC}"
echo ""

if [ $failed -eq 0 ]; then
  echo -e "${GREEN}🎉 所有文件验证通过！${NC}"
  exit 0
else
  echo -e "${RED}❌ 有 ${failed} 个文件验证失败${NC}"
  exit 1
fi
