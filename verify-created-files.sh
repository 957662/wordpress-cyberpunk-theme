#!/bin/bash

echo "🔍 验证本次会话创建的文件"
echo "================================"

files=(
  "frontend/lib/api/comment.ts"
  "frontend/lib/api/notification.ts"
  "frontend/lib/hooks/useNotification.ts"
  "frontend/lib/hooks/useReadingProgress.ts"
  "frontend/lib/services/logger.ts"
  "frontend/lib/config/constants.ts"
  "backend/app/api/v1/bookmarks_new.py"
  "backend/app/api/v1/notifications_new.py"
  "scripts/setup-dev.sh"
  "scripts/test-all.sh"
  "scripts/build.sh"
  ".vscode/extensions.json"
  ".vscode/settings.json"
  "docs/API_USAGE.md"
  "FILES_CREATED_THIS_SESSION.md"
)

count=0
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
    ((count++))
  else
    echo "❌ $file"
  fi
done

echo ""
echo "总计: $count/${#files[@]} 文件已创建"

if [ $count -eq ${#files[@]} ]; then
  echo "🎉 所有文件创建成功！"
  exit 0
else
  echo "⚠️  有些文件未创建"
  exit 1
fi
