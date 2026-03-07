#!/bin/bash

# 验证新创建的文件
# 验证日期: $(date +%Y-%m-%d)

echo "======================================"
echo "验证新创建的文件"
echo "======================================"
echo ""

# 文件列表
FILES=(
  "frontend/services/blog/wordpress-data-service.ts"
  "frontend/services/blog/blog-data-cache.ts"
  "frontend/hooks/blog/use-blog-data.ts"
  "frontend/types/models/blog.ts"
  "frontend/app/blog/page.tsx"
  "frontend/app/blog/[slug]/page.tsx"
  "frontend/components/blog/BlogHero.tsx"
  "frontend/app/api/blog/route.ts"
  "backend/app/api/analytics/enhanced.py"
)

# 计数器
total=${#FILES[@]}
created=0
missing=0

echo "检查文件..."
echo ""

for file in "${FILES[@]}"; do
  filepath="/root/.openclaw/workspace/cyberpress-platform/$file"
  
  if [ -f "$filepath" ]; then
    size=$(wc -l < "$filepath")
    echo "✅ $file"
    echo "   大小: $size 行"
    ((created++))
  else
    echo "❌ $file - 未找到"
    ((missing++))
  fi
  echo ""
done

echo "======================================"
echo "验证结果"
echo "======================================"
echo "总文件数: $total"
echo "已创建: $created"
echo "缺失: $missing"
echo ""

if [ $created -eq $total ]; then
  echo "🎉 所有文件创建成功！"
  exit 0
else
  echo "⚠️  有 $missing 个文件缺失"
  exit 1
fi
