#!/bin/bash

echo "=== 验证新创建的文件 ==="
echo ""

files=(
  "frontend/types/seo.types.ts"
  "frontend/lib/seo/generateMetadata.ts"
  "frontend/lib/seo/structuredData.ts"
  "frontend/lib/performance/imageOptimizer.ts"
  "frontend/lib/performance/monitor.ts"
  "frontend/lib/validation/validators.ts"
  "frontend/components/errors/AsyncBoundary.tsx"
  "frontend/components/errors/ErrorBoundary.tsx"
  "frontend/components/features/DarkModeToggle.tsx"
  "frontend/components/features/CommandPalette.tsx"
)

created=0
total=${#files[@]}

for file in "${files[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    echo "✅ $file"
    ((created++))
  else
    echo "❌ $file (未找到)"
  fi
done

echo ""
echo "=== 统计 ==="
echo "已创建: $created / $total"

if [ $created -eq $total ]; then
  echo "✅ 所有文件创建成功！"
  exit 0
else
  echo "⚠️  部分文件未创建"
  exit 1
fi
