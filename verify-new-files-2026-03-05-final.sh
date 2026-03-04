#!/bin/bash

# 验证新创建的文件
echo "🔍 验证新创建的文件..."
echo "================================"

# 创建的文件列表
files=(
  "frontend/components/graphics/CyberButton.tsx"
  "frontend/components/graphics/CyberCard.tsx"
  "frontend/components/graphics/CyberInput.tsx"
  "frontend/components/graphics/CyberAvatar.tsx"
  "frontend/components/graphics/CyberProgressBar.tsx"
  "frontend/components/graphics/CyberModal.tsx"
  "frontend/components/graphics/CyberTooltip.tsx"
  "frontend/components/graphics/CyberTabs.tsx"
  "frontend/lib/utils/date-fns.ts"
  "frontend/lib/utils/number-utils.ts"
  "frontend/lib/utils/array-utils.ts"
  "frontend/lib/utils/object-utils.ts"
  "frontend/types/utils.types.ts"
  "frontend/types/component.types.ts"
  "frontend/services/api/content-api.ts"
  "frontend/services/api/media-api.ts"
  "NEW_FILES_CREATED_2026_03_05.md"
)

# 统计变量
total=${#files[@]}
exist=0
missing=0

echo ""
echo "📋 文件清单:"
echo ""

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    size=$(wc -c < "$file")
    lines=$(wc -l < "$file")
    echo "✅ $file"
    echo "   └─ $size bytes, $lines lines"
    ((exist++))
  else
    echo "❌ $file (缺失)"
    ((missing++))
  fi
done

echo ""
echo "================================"
echo "📊 统计信息:"
echo "   总计: $total"
echo "   存在: $exist ✅"
echo "   缺失: $missing ❌"
echo "================================"

if [ $exist -eq $total ]; then
  echo ""
  echo "🎉 所有文件都已成功创建！"
  exit 0
else
  echo ""
  echo "⚠️  部分文件缺失，请检查！"
  exit 1
fi
