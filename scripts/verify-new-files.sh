#!/bin/bash

echo "🔍 验证新创建的文件..."
echo ""

files=(
  "frontend/lib/performance/monitor.ts"
  "frontend/components/performance/LazyLoad.tsx"
  "frontend/components/pwa/InstallPrompt.tsx"
  "frontend/components/pwa/OfflineBanner.tsx"
  "frontend/lib/seo/open-graph.ts"
  "frontend/lib/utils/image-utils.ts"
  "frontend/lib/formatters/number-formatter.ts"
  "frontend/lib/formatters/date-formatter.ts"
  "frontend/components/performance/index.ts"
  "frontend/components/pwa/index.ts"
  "frontend/lib/performance/index.ts"
  "frontend/lib/formatters/index.ts"
  "frontend/lib/seo/index.ts"
)

success=0
failed=0

for file in "${files[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    echo "✅ $file"
    ((success++))
  else
    echo "❌ $file (不存在)"
    ((failed++))
  fi
done

echo ""
echo "📊 统计:"
echo "  成功: $success 个文件"
echo "  失败: $failed 个文件"
echo ""

if [ $failed -eq 0 ]; then
  echo "🎉 所有文件创建成功！"
  exit 0
else
  echo "⚠️  有 $failed 个文件未找到"
  exit 1
fi
