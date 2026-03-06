#!/bin/bash

# 验证已创建的文件
# 创建日期: 2026-03-06

echo "=========================================="
echo "  CyberPress - 文件创建验证脚本"
echo "  日期: 2026-03-06"
echo "=========================================="
echo ""

# 定义项目路径
PROJECT_DIR="/root/.openclaw/workspace/cyberpress-platform/frontend"
ERRORS=0
SUCCESS=0

# 定义要验证的文件
declare -a FILES=(
  "$PROJECT_DIR/components/ui/card/Card.tsx"
  "$PROJECT_DIR/components/ui/button/Button.tsx"
  "$PROJECT_DIR/components/ui/input/Input.tsx"
  "$PROJECT_DIR/components/ui/modal/Modal.tsx"
  "$PROJECT_DIR/components/ui/loading/LoadingSpinner.tsx"
  "$PROJECT_DIR/components/ui/toast/Toast.tsx"
  "$PROJECT_DIR/components/forms/CommentForm.tsx"
  "$PROJECT_DIR/components/blog/BlogPost.tsx"
  "$PROJECT_DIR/services/api/blog.ts"
  "$PROJECT_DIR/services/api/comment.ts"
  "$PROJECT_DIR/hooks/useBlog.ts"
  "$PROJECT_DIR/store/blogStore.ts"
)

echo "正在验证文件..."
echo ""

# 检查每个文件
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    size=$(wc -c < "$file")
    echo "✅ $(basename $file) - ${size} bytes"
    ((SUCCESS++))
  else
    echo "❌ $(basename $file) - 未找到"
    ((ERRORS++))
  fi
done

echo ""
echo "=========================================="
echo "  验证结果"
echo "=========================================="
echo "✅ 成功: $SUCCESS 个文件"
echo "❌ 失败: $ERRORS 个文件"
echo ""

if [ $ERRORS -eq 0 ]; then
  echo "🎉 所有文件验证通过!"
  exit 0
else
  echo "⚠️  部分文件未找到,请检查"
  exit 1
fi
