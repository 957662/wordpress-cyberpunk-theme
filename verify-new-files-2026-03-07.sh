#!/bin/bash

# 验证新创建的文件

echo "================================"
echo "验证新创建的文件 - 2026-03-07"
echo "================================"
echo ""

# 文件列表
FILES=(
  "frontend/lib/utils/performance.utils.ts"
  "frontend/lib/utils/seo.utils.ts"
  "frontend/lib/utils/image.utils.ts"
  "frontend/components/ui/form/FormGroup.tsx"
  "frontend/components/ui/virtual/VirtualList.tsx"
)

# 计数器
total=0
success=0
failed=0

# 验证每个文件
for file in "${FILES[@]}"; do
  total=$((total + 1))
  
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    # 获取文件大小
    size=$(wc -l < "/root/.openclaw/workspace/cyberpress-platform/$file" 2>/dev/null || echo "0")
    echo "✅ $file ($size lines)"
    success=$((success + 1))
  else
    echo "❌ $file - 文件不存在"
    failed=$((failed + 1))
  fi
done

echo ""
echo "================================"
echo "验证结果"
echo "================================"
echo "总文件数: $total"
echo "成功: $success"
echo "失败: $failed"
echo ""

if [ $failed -eq 0 ]; then
  echo "🎉 所有文件验证成功！"
  exit 0
else
  echo "⚠️  有 $failed 个文件验证失败"
  exit 1
fi
