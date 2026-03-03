#!/bin/bash

echo "🔍 验证社交功能文件创建..."
echo ""

check_file() {
  if [ -f "$1" ]; then
    echo "✅ $1"
    return 0
  else
    echo "❌ $1 (未找到)"
    return 1
  fi
}

echo "📁 工具函数:"
check_file "frontend/lib/utils/social-helpers.ts"

echo ""
echo "📁 社交组件:"
check_file "frontend/components/social/share/SocialShareButtons.tsx"
check_file "frontend/components/social/UserCard.tsx"

echo ""
echo "📁 页面组件:"
check_file "frontend/app/feed/page.tsx"
check_file "frontend/app/discover/page.tsx"

echo ""
echo "📁 索引文件:"
check_file "frontend/components/social/index.ts"
check_file "frontend/hooks/index.ts"

echo ""
echo "📁 文档:"
check_file "SOCIAL_FEATURES_IMPLEMENTATION.md"
check_file "FILES_CREATED_THIS_SESSION_FINAL.md"

echo ""
echo "📊 统计文件行数:"
echo "social-helpers.ts: $(wc -l < frontend/lib/utils/social-helpers.ts) 行"
echo "SocialShareButtons.tsx: $(wc -l < frontend/components/social/share/SocialShareButtons.tsx) 行"
echo "UserCard.tsx: $(wc -l < frontend/components/social/UserCard.tsx) 行"

echo ""
echo "✅ 验证完成!"
