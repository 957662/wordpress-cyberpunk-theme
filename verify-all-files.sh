#!/bin/bash

echo "=========================================="
echo "最终文件验证 - 2026-03-06"
echo "=========================================="
echo ""

# 核心文件
echo "📁 核心文件:"
core_files=(
  "frontend/app/blog/enhanced/page.tsx"
  "frontend/app/blog/[slug]/page.tsx"
  "frontend/lib/hooks/use-wordpress.ts"
  "frontend/lib/utils/exports.ts"
  "frontend/lib/services/wordpress-service.ts"
)

for file in "${core_files[@]}"; do
  if [ -f "$file" ]; then
    lines=$(wc -l < "$file")
    echo "  ✓ $file ($lines 行)"
  else
    echo "  ✗ $file (缺失)"
  fi
done

echo ""
echo "📚 文档文件:"
doc_files=(
  "FILES_CREATED_SESSION_2026_03_06.md"
  "QUICKSTART_CREATED_FILES.md"
  "COMPONENT_USAGE_GUIDE.md"
  "FINAL_REPORT_2026_03_06.md"
)

for file in "${doc_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (缺失)"
  fi
done

echo ""
echo "🔧 脚本文件:"
script_files=(
  "verify-files-created-20260306.sh"
  "verify-all-files.sh"
)

for file in "${script_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (缺失)"
  fi
done

echo ""
echo "=========================================="
echo "✓ 验证完成！"
echo "=========================================="
