#!/bin/bash

echo "========================================="
echo "🔍 验证最新创建的文件"
echo "========================================="
echo ""

FILES=(
  "frontend/components/cyber/CyberEditor.tsx"
  "frontend/components/cyber/CyberSearch.tsx"
  "frontend/components/cyber/CyberAnalytics.tsx"
  "frontend/lib/wordpress-api-enhanced.ts"
  "frontend/hooks/useWordPress.ts"
  "frontend/app/analytics/page.tsx"
  "frontend/app/editor/page.tsx"
)

TOTAL=${#FILES[@]}
EXIST=0

for file in "${FILES[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    SIZE=$(wc -c < "/root/.openclaw/workspace/cyberpress-platform/$file")
    echo "✅ $file ($SIZE bytes)"
    EXIST=$((EXIST + 1))
  else
    echo "❌ $file - 缺失"
  fi
done

echo ""
echo "========================================="
echo "📊 统计结果"
echo "========================================="
echo "总计: $TOTAL 个文件"
echo "存在: $EXIST 个 ✅"
echo "缺失: $((TOTAL - EXIST)) 个 ❌"
echo ""

if [ $EXIST -eq $TOTAL ]; then
  echo "🎉 所有文件验证通过！"
  exit 0
else
  echo "⚠️  有文件缺失，请检查！"
  exit 1
fi
