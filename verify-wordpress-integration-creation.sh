#!/bin/bash

echo "================================"
echo "WordPress 集成文件创建验证"
echo "================================"
echo ""

files=(
  "frontend/lib/wordpress/wordpress-api.ts"
  "frontend/lib/wordpress/react-hooks.ts"
  "frontend/lib/wordpress/wp-config.ts"
  "frontend/lib/wordpress/data-adapter.ts"
  "frontend/lib/wordpress/main-export.ts"
  "frontend/services/wordpress-service.ts"
  "frontend/components/wordpress/WordPressIntegrationExample.tsx"
  "frontend/app/blog/page-integrated.tsx"
  "frontend/app/blog/[slug]/page-integrated.tsx"
  "WORDPRESS_INTEGRATION_COMPLETE_GUIDE.md"
)

total=${#files[@]}
created=0
missing=0

for file in "${files[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    echo "✅ $file"
    ((created++))
  else
    echo "❌ $file"
    ((missing++))
  fi
done

echo ""
echo "================================"
echo "验证结果"
echo "================================"
echo "总文件数: $total"
echo "已创建: $created"
echo "缺失: $missing"
echo ""

if [ $missing -eq 0 ]; then
  echo "🎉 所有文件创建成功！"
  exit 0
else
  echo "⚠️  有 $missing 个文件未创建"
  exit 1
fi
