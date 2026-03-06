#!/bin/bash

# 验证本次会话创建的文件

echo "========================================"
echo "验证 2026-03-06 开发会话文件"
echo "========================================"
echo ""

FILES=(
  "frontend/lib/api/blog.ts"
  "frontend/lib/api/user.ts"
  "frontend/lib/api/types.ts"
  "frontend/hooks/use-form-new.ts"
  "backend/app/api/posts.py"
  "backend/app/api/comments.py"
)

TOTAL=0
SUCCESS=0
FAILED=0

for file in "${FILES[@]}"; do
  TOTAL=$((TOTAL + 1))
  FILE_PATH="/root/.openclaw/workspace/cyberpress-platform/$file"

  if [ -f "$FILE_PATH" ]; then
    LINES=$(wc -l < "$FILE_PATH")
    SIZE=$(du -h "$FILE_PATH" | cut -f1)
    echo "✅ $file"
    echo "   行数: $LINES | 大小: $SIZE"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "❌ $file - 文件不存在"
    FAILED=$((FAILED + 1))
  fi
  echo ""
done

echo "========================================"
echo "验证结果"
echo "========================================"
echo "总计: $TOTAL 个文件"
echo "成功: $SUCCESS 个"
echo "失败: $FAILED 个"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "🎉 所有文件创建成功！"
  exit 0
else
  echo "⚠️  有 $FAILED 个文件创建失败"
  exit 1
fi
