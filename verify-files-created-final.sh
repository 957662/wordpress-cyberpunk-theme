#!/bin/bash

echo "=== 文件创建验证报告 ==="
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 定义要检查的文件列表
FILES=(
  "backend/app/services/auth_service_enhanced.py"
  "backend/app/services/post_service_enhanced.py"
  "backend/app/services/social_service_enhanced.py"
  "backend/app/api/v1/auth_enhanced.py"
  "backend/app/api/v1/posts_enhanced.py"
  "backend/app/api/v1/social.py"
  "frontend/components/blog/ArticleCardEnhanced.tsx"
  "frontend/components/blog/BlogListEnhanced.tsx"
  "frontend/components/blog/BlogGridEnhanced.tsx"
  "frontend/components/blog/CommentSystemEnhanced.tsx"
  "frontend/components/blog/CommentFormEnhanced.tsx"
  "frontend/components/blog/CommentListEnhanced.tsx"
)

# 统计变量
total=0
success=0
failed=0

echo "检查文件列表:"
echo "----------------------------------------"

for file in "${FILES[@]}"; do
  total=$((total + 1))
  filepath="/root/.openclaw/workspace/cyberpress-platform/$file"
  
  if [ -f "$filepath" ]; then
    size=$(wc -l < "$filepath")
    success=$((success + 1))
    echo "✅ $file ($size 行)"
  else
    failed=$((failed + 1))
    echo "❌ $file (不存在)"
  fi
done

echo ""
echo "----------------------------------------"
echo "统计结果:"
echo "总计: $total"
echo "成功: $success"
echo "失败: $failed"
echo ""

if [ $failed -eq 0 ]; then
  echo "🎉 所有文件创建成功!"
  exit 0
else
  echo "⚠️  有 $failed 个文件创建失败"
  exit 1
fi
