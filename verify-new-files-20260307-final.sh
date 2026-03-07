#!/bin/bash

echo "🔍 验证新创建的文件 - 2026-03-07"
echo "=================================="

# 定义文件列表
files=(
  "frontend/hooks/useScrollLock.ts"
  "frontend/hooks/useIntersectionObserver.ts"
  "frontend/hooks/useClickOutside.ts"
  "frontend/hooks/useClipboard.ts"
  "frontend/hooks/useKeyDown.ts"
  "frontend/components/ui/LoadingCard.tsx"
  "frontend/components/ui/Badge.tsx"
  "frontend/components/ui/Accordion.tsx"
  "frontend/components/ui/CarouselNew.tsx"
  "frontend/lib/utils/array.utils.ts"
  "frontend/lib/utils/dom.utils.ts"
  "frontend/services/auth.service.ts"
  "frontend/types/models/user.types.ts"
  "frontend/types/models/post.types.ts"
)

count=0
failed=0

for file in "${files[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    count=$((count + 1))
    echo "✅ $file"
  else
    failed=$((failed + 1))
    echo "❌ $file"
  fi
done

echo ""
echo "📊 统计信息:"
echo "------------"
echo "✅ 成功创建: $count 个文件"
if [ $failed -gt 0 ]; then
  echo "❌ 失败: $failed 个文件"
fi
echo "📁 总计: $((count + failed)) 个文件"

if [ $count -eq ${#files[@]} ]; then
  echo ""
  echo "🎉 所有文件创建成功！"
  exit 0
else
  echo ""
  echo "⚠️  部分文件创建失败"
  exit 1
fi
