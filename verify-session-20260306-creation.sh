#!/bin/bash

# 验证 2026-03-06 开发会话创建的文件

echo "=========================================="
echo "验证 2026-03-06 开发会话创建的文件"
echo "=========================================="
echo ""

# 定义文件列表
FILES=(
  "frontend/lib/wordpress/react-query-hooks.ts"
  "frontend/lib/wordpress/enhanced-client.ts"
  "frontend/components/providers/WordPressProvider.tsx"
  "frontend/components/blog/LoadingState.tsx"
  "DEVELOPMENT_SESSION_2026-03-06.md"
)

# 计数器
total=0
exists=0
missing=0

# 检查每个文件
for file in "${FILES[@]}"; do
  total=$((total + 1))
  
  if [ -f "$file" ]; then
    exists=$((exists + 1))
    size=$(du -h "$file" | cut -f1)
    lines=$(wc -l < "$file")
    echo "✅ $file"
    echo "   大小: $size | 行数: $lines"
  else
    missing=$((missing + 1))
    echo "❌ $file (缺失)"
  fi
  echo ""
done

# 检查更新的文件
echo "=========================================="
echo "检查更新的文件"
echo "=========================================="
echo ""

if grep -q "cn" frontend/lib/utils/index.ts 2>/dev/null; then
  echo "✅ frontend/lib/utils/index.ts (已更新 - 导出 cn 函数)"
else
  echo "⚠️  frontend/lib/utils/index.ts (未更新)"
fi
echo ""

# 总结
echo "=========================================="
echo "验证总结"
echo "=========================================="
echo "总文件数: $total"
echo "已创建: $exists"
echo "缺失: $missing"
echo ""

if [ $missing -eq 0 ]; then
  echo "🎉 所有文件创建成功！"
  exit 0
else
  echo "⚠️  有 $missing 个文件缺失"
  exit 1
fi
