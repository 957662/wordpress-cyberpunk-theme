#!/bin/bash

# 验证新创建的组件 - 2026-03-05
# CyberPress Platform

echo "========================================"
echo "验证新创建的组件文件"
echo "========================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 组件列表
components=(
  "frontend/components/ui/SpeedDial/SpeedDial.tsx"
  "frontend/components/ui/SpeedDial/index.ts"
  "frontend/components/ui/BottomSheet/BottomSheet.tsx"
  "frontend/components/ui/BottomSheet/index.ts"
  "frontend/components/ui/PullToRefresh/PullToRefresh.tsx"
  "frontend/components/ui/PullToRefresh/index.ts"
  "frontend/components/ui/Skeleton/SkeletonCard.tsx"
  "frontend/components/ui/Skeleton/SkeletonList.tsx"
  "frontend/components/ui/Skeleton/index.ts"
  "frontend/components/ui/OTPInput/OTPInput.tsx"
  "frontend/components/ui/OTPInput/index.ts"
  "frontend/components/ui/CommentItem/CommentItem.tsx"
  "frontend/components/ui/CommentItem/index.ts"
  "frontend/components/ui/RadioGroup/RadioGroup.tsx"
  "frontend/components/ui/RadioGroup/index.ts"
  "frontend/components/ui/AudioPlayer/AudioPlayer.tsx"
  "frontend/components/ui/AudioPlayer/index.ts"
  "frontend/components/ui/ProgressBar/ProgressBarNew.tsx"
  "frontend/components/ui/ProgressBar/index-new.ts"
  "frontend/components/effects/MatrixBackground/MatrixBackground.tsx"
  "frontend/components/effects/MatrixBackground/index.ts"
  "frontend/components/effects/CyberGrid/CyberGrid.tsx"
  "frontend/components/effects/CyberGrid/index.ts"
  "frontend/components/blog/NewsletterCard/NewsletterCard.tsx"
  "frontend/components/blog/NewsletterCard/index.ts"
  "frontend/components/index-new-components.ts"
  "frontend/app/showcase/new-components/page.tsx"
  "NEW_COMPONENTS_CREATED_2026-03-05.md"
)

# 计数器
total=0
found=0
missing=0

echo "检查组件文件..."
echo ""

for file in "${components[@]}"; do
  total=$((total + 1))

  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
    found=$((found + 1))
  else
    echo -e "${YELLOW}✗${NC} $file (未找到)"
    missing=$((missing + 1))
  fi
done

echo ""
echo "========================================"
echo -e "${CYAN}统计信息${NC}"
echo "========================================"
echo "总文件数: $total"
echo -e "${GREEN}已创建: $found${NC}"
echo -e "${YELLOW}缺失: $missing${NC}"
echo ""

if [ $missing -eq 0 ]; then
  echo -e "${GREEN}✓ 所有组件文件创建成功！${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠ 有 $missing 个文件未找到${NC}"
  exit 1
fi
