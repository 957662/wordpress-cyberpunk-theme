#!/bin/bash

echo "═══════════════════════════════════════════════════════════════"
echo "               验证新创建的文件                                "
echo "═══════════════════════════════════════════════════════════════"
echo ""

# 定义要检查的文件
files=(
  "frontend/components/blog/ArticleContent.tsx"
  "frontend/components/blog/CommentItem.tsx"
  "frontend/components/search/SearchInput.tsx"
  "frontend/components/social/ShareButton.tsx"
  "frontend/components/ui/avatar.tsx"
  "frontend/components/ui/textarea.tsx"
  "frontend/components/ui/toast.tsx"
  "frontend/lib/services/api-client.ts"
  "frontend/lib/services/blog-service.ts"
  "frontend/lib/services/auth-service.ts"
  "frontend/lib/services/social-service.ts"
  "frontend/lib/services/index.ts"
  "frontend/app/(public)/analytics/page.tsx"
)

# 检查文件是否存在
exists=0
not_exists=0

for file in "${files[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    echo "✅ $file"
    ((exists++))
  else
    echo "❌ $file (不存在)"
    ((not_exists++))
  fi
done

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "统计信息："
echo "  已创建: $exists 个文件"
echo "  未找到: $not_exists 个文件"
echo "═══════════════════════════════════════════════════════════════"
echo ""

if [ $exists -eq ${#files[@]} ]; then
  echo "🎉 所有文件创建成功！"
  exit 0
else
  echo "⚠️  部分文件未创建成功"
  exit 1
fi
