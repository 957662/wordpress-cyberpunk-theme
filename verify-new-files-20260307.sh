#!/bin/bash

# 验证新创建的文件

echo "🔍 验证新创建的文件..."
echo ""

# 文件列表
files=(
  "frontend/public/sw.js"
  "frontend/lib/pwa/pwa-register.ts"
  "frontend/components/seo/TwitterCard.tsx"
  "frontend/lib/performance/PerformanceMonitor.ts"
  "frontend/components/performance/PerformanceReport.tsx"
  "frontend/services/analytics/AnalyticsService.ts"
  "frontend/services/search/SearchService.ts"
  "frontend/README-FEATURES.md"
)

# 计数器
total=0
exists=0

for file in "${files[@]}"; do
  total=$((total + 1))
  if [ -f "$file" ]; then
    exists=$((exists + 1))
    size=$(wc -l < "$file")
    echo "✅ $file ($size 行)"
  else
    echo "❌ $file (不存在)"
  fi
done

echo ""
echo "📊 统计："
echo "   总计：$total 个文件"
echo "   存在：$exists 个文件"
echo "   缺失：$((total - exists)) 个文件"

if [ $exists -eq $total ]; then
  echo ""
  echo "🎉 所有文件创建成功！"
  exit 0
else
  echo ""
  echo "⚠️  部分文件缺失"
  exit 1
fi
