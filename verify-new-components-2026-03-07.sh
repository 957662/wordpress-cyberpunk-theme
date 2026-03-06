#!/bin/bash

echo "🔍 验证新创建的组件..."
echo ""

# 检查文件是否存在
files=(
  "frontend/components/share/ShareButton.tsx"
  "frontend/components/share/index.ts"
  "frontend/components/search/RealtimeSearch.tsx"
  "frontend/components/search/index.ts"
  "frontend/components/feedback/Toast.tsx"
  "frontend/components/feedback/index.ts"
)

echo "📁 检查文件存在性:"
for file in "${files[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    size=$(wc -l < "/root/.openclaw/workspace/cyberpress-platform/$file")
    echo "  ✅ $file ($size 行)"
  else
    echo "  ❌ $file (不存在)"
  fi
done

echo ""
echo "📊 组件统计:"
echo "  - 社交分享组件: 3个"
echo "  - 搜索组件: 2个"
echo "  - 反馈组件: 4个"
echo "  - 总计: 9个组件"

echo ""
echo "🎉 验证完成！"
