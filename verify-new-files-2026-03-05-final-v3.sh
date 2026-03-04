#!/bin/bash

echo "========================================"
echo "🔍 验证新创建的文件 - 2026-03-05"
echo "========================================"
echo ""

# 创建的文件列表
FILES=(
  "frontend/components/clipboard/ClipboardManager.tsx"
  "frontend/components/clipboard/index.ts"
  "frontend/components/ui/ColorPicker-new.tsx"
  "frontend/components/ui/Rating-new.tsx"
  "frontend/components/ui/ProgressBar-new.tsx"
  "frontend/components/ui/Toast-new.tsx"
  "frontend/components/ui/Skeleton-new.tsx"
  "frontend/hooks/useOnClickOutside-new.ts"
  "frontend/hooks/useBreakpoint-new.ts"
  "frontend/hooks/useWindowSize-new.ts"
  "frontend/hooks/useLocalStorage-new.ts"
  "frontend/hooks/useSessionStorage.ts"
  "frontend/hooks/useMediaQuery-new.ts"
  "frontend/hooks/useToggle-new.ts"
  "frontend/services/api/user-api-service-new.ts"
  "frontend/services/api/notification-api.service.ts"
  "frontend/lib/utils/time-utils.ts"
  "frontend/lib/utils/color-utils-new.ts"
  "frontend/lib/utils/validation-utils-new.ts"
  "FILES_CREATED_SESSION_2026_03_05_NEW.md"
)

echo "📁 文件验证结果:"
echo ""

SUCCESS_COUNT=0
FAIL_COUNT=0

for file in "${FILES[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    SIZE=$(du -h "/root/.openclaw/workspace/cyberpress-platform/$file" | cut -f1)
    LINES=$(wc -l < "/root/.openclaw/workspace/cyberpress-platform/$file" 2>/dev/null || echo "0")
    echo "✅ $file ($SIZE, $LINES lines)"
    ((SUCCESS_COUNT++))
  else
    echo "❌ $file (未找到)"
    ((FAIL_COUNT++))
  fi
done

echo ""
echo "========================================"
echo "📊 统计结果"
echo "========================================"
echo "✅ 成功: $SUCCESS_COUNT 个文件"
echo "❌ 失败: $FAIL_COUNT 个文件"
echo "📁 总计: $((${SUCCESS_COUNT} + ${FAIL_COUNT})) 个文件"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
  echo "🎉 所有文件验证成功！"
  exit 0
else
  echo "⚠️  部分文件验证失败"
  exit 1
fi
