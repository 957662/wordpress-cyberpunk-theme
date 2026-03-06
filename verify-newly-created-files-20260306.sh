#!/bin/bash

# 验证新创建的文件
# 创建日期: 2026-03-06

echo "🔍 验证新创建的文件..."
echo ""

# 文件列表
FILES=(
  "frontend/lib/hooks/useReadingProgress.ts"
  "frontend/lib/hooks/useInfiniteScroll.ts"
  "frontend/lib/hooks/useKeyboardShortcuts.ts"
  "frontend/lib/utils/performance-optimizer.ts"
  "frontend/lib/validators/advanced-validators.ts"
  "frontend/lib/formatters/data-formatter.ts"
  "frontend/lib/seo/seo-utils.ts"
  "frontend/lib/config/site-config.ts"
  "frontend/lib/storage/local-storage-manager.ts"
  "frontend/components/ui/LoadingDots.tsx"
  "frontend/components/ui/Toast.tsx"
)

SUCCESS=0
FAILED=0

for file in "${FILES[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    SIZE=$(wc -l < "/root/.openclaw/workspace/cyberpress-platform/$file")
    echo "✅ $file (${SIZE} 行)"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "❌ $file - 文件不存在"
    FAILED=$((FAILED + 1))
  fi
done

echo ""
echo "📊 统计:"
echo "  成功: $SUCCESS"
echo "  失败: $FAILED"
echo "  总计: $((SUCCESS + FAILED))"

if [ $FAILED -eq 0 ]; then
  echo ""
  echo "🎉 所有文件验证成功！"
  exit 0
else
  echo ""
  echo "⚠️  有 $FAILED 个文件验证失败"
  exit 1
fi
