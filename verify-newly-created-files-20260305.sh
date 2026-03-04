#!/bin/bash

# 验证新创建的文件
echo "==================================="
echo "验证新创建的文件 (2026-03-05)"
echo "==================================="

FILES=(
  "frontend/components/features/ThemeSwitcher.tsx"
  "frontend/components/features/CommandPalette.tsx"
  "frontend/components/features/Toast.tsx"
  "frontend/components/features/DataTable.tsx"
  "frontend/components/features/FormWizard.tsx"
  "frontend/components/features/VirtualList.tsx"
  "frontend/components/features/InfiniteScroll.tsx"
  "frontend/components/features/FileUpload.tsx"
  "frontend/services/event-emitter.ts"
  "frontend/lib/error-tracking.ts"
  "frontend/lib/request-manager.ts"
  "frontend/lib/datetime.ts"
  "frontend/lib/state.ts"
)

SUCCESS_COUNT=0
FAIL_COUNT=0

for file in "${FILES[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    SIZE=$(du -h "/root/.openclaw/workspace/cyberpress-platform/$file" | cut -f1)
    LINES=$(wc -l < "/root/.openclaw/workspace/cyberpress-platform/$file")
    echo "✅ $file ($SIZE, $LINES 行)"
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
  else
    echo "❌ $file (未找到)"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
done

echo ""
echo "==================================="
echo "验证结果"
echo "==================================="
echo "成功: $SUCCESS_COUNT 个文件"
echo "失败: $FAIL_COUNT 个文件"
echo "总计: $((SUCCESS_COUNT + FAIL_COUNT)) 个文件"

if [ $FAIL_COUNT -eq 0 ]; then
  echo ""
  echo "🎉 所有文件创建成功！"
  exit 0
else
  echo ""
  echo "⚠️  有文件创建失败"
  exit 1
fi
