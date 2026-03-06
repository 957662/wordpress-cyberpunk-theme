#!/bin/bash

echo "🔍 验证新创建的博客组件..."
echo ""

# 定义要检查的文件
files=(
  "frontend/components/blog/filters/BlogFilterBar.tsx"
  "frontend/components/blog/filters/BlogViewToggle.tsx"
  "frontend/components/blog/filters/CategoryFilter.tsx"
  "frontend/components/blog/filters/TagCloud.tsx"
  "frontend/components/blog/BlogSearch.tsx"
  "frontend/components/blog/BlogStatsCard.tsx"
  "frontend/components/blog/LoadingState.tsx"
)

total=${#files[@]}
created=0

echo "📁 检查文件存在性..."
echo ""

for file in "${files[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    size=$(wc -l < "/root/.openclaw/workspace/cyberpress-platform/$file")
    echo "✅ $file ($size 行)"
    ((created++))
  else
    echo "❌ $file - 不存在"
  fi
done

echo ""
echo "📊 统计信息:"
echo "   总文件数: $total"
echo "   已创建: $created"
echo "   成功率: $(( created * 100 / total ))%"
echo ""

if [ $created -eq $total ]; then
  echo "🎉 所有文件创建成功！"
  exit 0
else
  echo "⚠️  部分文件创建失败"
  exit 1
fi
