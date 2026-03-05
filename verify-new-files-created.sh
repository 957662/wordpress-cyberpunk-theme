#!/bin/bash

# 验证新创建的文件
echo "🔍 验证新创建的文件..."
echo ""

files=(
  "frontend/lib/cache/advanced-cache-manager.ts"
  "frontend/lib/utils/error-handler-enhanced.ts"
  "frontend/lib/api/request-interceptor.ts"
  "frontend/lib/utils/id-generator.ts"
  "frontend/components/ui/skeleton/SkeletonCard.tsx"
  "frontend/hooks/useLocalStorage-new.ts"
  "frontend/__tests__/unit/lib/cache.test.ts"
  "NEW_CREATION_REPORT_2026-03-05.md"
)

success=0
failed=0

for file in "${files[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    size=$(wc -l < "/root/.openclaw/workspace/cyberpress-platform/$file")
    echo "✅ $file ($size 行)"
    ((success++))
  else
    echo "❌ $file - 未找到"
    ((failed++))
  fi
done

echo ""
echo "📊 统计:"
echo "✅ 成功: $success"
echo "❌ 失败: $failed"

if [ $failed -eq 0 ]; then
  echo ""
  echo "🎉 所有文件创建成功!"
  exit 0
else
  echo ""
  echo "⚠️  有 $failed 个文件创建失败"
  exit 1
fi
