#!/bin/bash

# 验证新创建的文件 - 2026-03-05

echo "🔍 验证新创建的文件..."
echo ""

# 统计变量
total_files=0
missing_files=0

# 检查组件文件
echo "📦 检查 Utility 组件..."
components=(
  "frontend/components/utility/countdown-timer.tsx"
  "frontend/components/utility/id-generator.tsx"
  "frontend/components/utility/json-viewer.tsx"
  "frontend/components/utility/qr-code.tsx"
  "frontend/components/utility/gradient-text.tsx"
  "frontend/components/utility/rating.tsx"
  "frontend/components/utility/file-upload.tsx"
  "frontend/components/utility/progress-bar.tsx"
  "frontend/components/utility/timeline.tsx"
  "frontend/components/utility/tooltip.tsx"
)

for file in "${components[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    echo "  ✅ $file"
    ((total_files++))
  else
    echo "  ❌ $file (缺失)"
    ((missing_files++))
  fi
done

echo ""
echo "🪝 检查 Hooks..."
hooks=(
  "frontend/hooks/use-debounce.ts"
  "frontend/hooks/use-throttle.ts"
  "frontend/hooks/use-local-storage.ts"
  "frontend/hooks/use-media-query.ts"
  "frontend/hooks/use-clipboard.ts"
  "frontend/hooks/use-keyboard.ts"
  "frontend/hooks/use-click-outside.ts"
  "frontend/hooks/use-intersection.ts"
  "frontend/hooks/use-scroll-lock.ts"
  "frontend/hooks/use-async.ts"
  "frontend/hooks/use-form.ts"
)

for file in "${hooks[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    echo "  ✅ $file"
    ((total_files++))
  else
    echo "  ❌ $file (缺失)"
    ((missing_files++))
  fi
done

echo ""
echo "📚 检查工具函数..."
utils=(
  "frontend/lib/utils/color.ts"
  "frontend/lib/utils/string.ts"
  "frontend/lib/utils/number.ts"
  "frontend/lib/utils/array.ts"
  "frontend/lib/utils/date.ts"
  "frontend/lib/utils/validation.ts"
  "frontend/lib/utils/storage.ts"
  "frontend/lib/utils/index.ts"
)

for file in "${utils[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    echo "  ✅ $file"
    ((total_files++))
  else
    echo "  ❌ $file (缺失)"
    ((missing_files++))
  fi
done

echo ""
echo "📄 检查文档文件..."
docs=(
  "frontend/NEW_FILES_CREATED_SUMMARY.md"
)

for file in "${docs[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    echo "  ✅ $file"
    ((total_files++))
  else
    echo "  ❌ $file (缺失)"
    ((missing_files++))
  fi
done

echo ""
echo "📊 验证统计:"
echo "  总文件数: $total_files"
echo "  缺失文件: $missing_files"
echo "  成功率: $(( (total_files * 100) / (total_files + missing_files) ))%"
echo ""

if [ $missing_files -eq 0 ]; then
  echo "🎉 所有文件创建成功！"
else
  echo "⚠️  有 $missing_files 个文件缺失"
fi

echo ""
echo "✨ 验证完成！"
