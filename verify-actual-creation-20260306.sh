#!/bin/bash

echo "========================================"
echo "验证实际创建的文件 - 2026-03-06"
echo "========================================"
echo ""

files=(
  "frontend/components/features/blog/CommentSystem.tsx"
  "frontend/components/features/blog/CodeHighlight.tsx"
  "frontend/components/features/blog/TableOfContents.tsx"
  "frontend/components/features/search/RealTimeSearch.tsx"
  "frontend/components/features/user/ProfilePage.tsx"
  "frontend/components/features/social/LikeButton.tsx"
  "frontend/components/features/social/FollowButton.tsx"
  "frontend/components/features/social/BookmarkButton.tsx"
  "frontend/components/features/social/ShareButton.tsx"
  "frontend/components/features/performance/OptimizedImage.tsx"
  "frontend/lib/performance.ts"
  "frontend/services/api.service.ts"
  "frontend/hooks/use-performance.ts"
  "frontend/hooks/use-api.ts"
  "frontend/app/(public)/search/page.tsx"
)

created=0
total=${#files[@]}

for file in "${files[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    lines=$(wc -l < "/root/.openclaw/workspace/cyberpress-platform/$file")
    size=$(du -h "/root/.openclaw/workspace/cyberpress-platform/$file" | cut -f1)
    echo "✅ $file - $lines lines - $size"
    ((created++))
  else
    echo "❌ $file - NOT FOUND"
  fi
done

echo ""
echo "========================================"
echo "Summary: $created/$total files created"
echo "========================================"

if [ $created -eq $total ]; then
  echo "✅ All files created successfully!"
  exit 0
else
  echo "❌ Some files are missing"
  exit 1
fi
