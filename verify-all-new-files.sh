#!/bin/bash

echo "========================================="
echo "验证新创建的组件文件"
echo "========================================="
echo ""

# 声明数组存储文件路径
declare -a files=(
  "frontend/components/ui/Tour.tsx"
  "frontend/components/ui/Captcha.tsx"
  "frontend/components/ui/Signature.tsx"
  "frontend/components/ui/Mentions.tsx"
  "frontend/components/ui/AdvancedTimeline.tsx"
  "frontend/components/dashboard/DashboardCard.tsx"
  "frontend/components/charts/ActivityChart.tsx"
  "frontend/components/notifications/NotificationSystem.tsx"
  "frontend/components/theme/ThemeSwitcher.tsx"
  "frontend/hooks/useDebounce.ts"
  "frontend/hooks/useLocalStorage.ts"
  "frontend/hooks/useClickOutside.ts"
  "frontend/hooks/useScrollLock.ts"
  "frontend/hooks/useMediaQuery.ts"
  "frontend/lib/utils-enhanced.ts"
  "frontend/services/api.ts"
  "frontend/components/NEW_COMPONENTS_INDEX.md"
)

# 统计变量
total=${#files[@]}
exists=0
missing=0

# 检查每个文件
for file in "${files[@]}"; do
  filepath="/root/.openclaw/workspace/cyberpress-platform/$file"
  if [ -f "$filepath" ]; then
    echo "✅ $file"
    ((exists++))
  else
    echo "❌ $file (不存在)"
    ((missing++))
  fi
done

echo ""
echo "========================================="
echo "统计结果"
echo "========================================="
echo "总计: $total 个文件"
echo "存在: $exists 个"
echo "缺失: $missing 个"
echo ""

if [ $missing -eq 0 ]; then
  echo "🎉 所有文件创建成功！"
  exit 0
else
  echo "⚠️  有 $missing 个文件缺失"
  exit 1
fi
