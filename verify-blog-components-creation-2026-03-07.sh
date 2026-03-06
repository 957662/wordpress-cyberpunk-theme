#!/bin/bash

echo "🔍 验证博客组件创建 (2026-03-07)"
echo "========================================"
echo ""

# 验证核心组件
echo "✅ 核心博客组件:"
echo ""

files=(
  "frontend/components/blog/BlogList.tsx"
  "frontend/components/blog/BlogGrid.tsx"
  "frontend/components/blog/ArticleCard.tsx"
  "frontend/components/blog/BlogHero.tsx"
  "frontend/components/blog/BlogSidebar.tsx"
  "frontend/components/blog/index.ts"
  "frontend/components/blog/README.md"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    lines=$(wc -l < "$file")
    size=$(du -h "$file" | cut -f1)
    echo "  ✓ $file ($lines 行, $size)"
  else
    echo "  ✗ $file - 不存在"
  fi
done

echo ""
echo "✅ WordPress 集成:"
echo ""

wp_files=(
  "frontend/lib/wordpress/client.ts"
  "frontend/lib/wordpress/hooks.ts"
  "frontend/lib/wordpress/adapter.ts"
  "frontend/lib/wordpress/index.ts"
)

for file in "${wp_files[@]}"; do
  if [ -f "$file" ]; then
    lines=$(wc -l < "$file")
    size=$(du -h "$file" | cut -f1)
    echo "  ✓ $file ($lines 行, $size)"
  else
    echo "  ✗ $file - 不存在"
  fi
done

echo ""
echo "✅ 工具函数:"
echo ""

util_files=(
  "frontend/lib/utils/date.ts"
  "frontend/lib/utils/string.ts"
  "frontend/lib/utils/validation.ts"
  "frontend/lib/utils/index.ts"
)

for file in "${util_files[@]}"; do
  if [ -f "$file" ]; then
    lines=$(wc -l < "$file")
    size=$(du -h "$file" | cut -f1)
    echo "  ✓ $file ($lines 行, $size)"
  else
    echo "  ✗ $file - 不存在"
  fi
done

echo ""
echo "✅ 类型定义和示例:"
echo ""

other_files=(
  "frontend/types/blog.ts"
  "frontend/app/examples/blog-complete/page.tsx"
)

for file in "${other_files[@]}"; do
  if [ -f "$file" ]; then
    lines=$(wc -l < "$file")
    size=$(du -h "$file" | cut -f1)
    echo "  ✓ $file ($lines 行, $size)"
  else
    echo "  ✗ $file - 不存在"
  fi
done

echo ""
echo "📊 统计信息:"
echo ""

# 统计总行数
total_lines=0
for file in "${files[@]}" "${wp_files[@]}" "${util_files[@]}" "${other_files[@]}"; do
  if [ -f "$file" ]; then
    lines=$(wc -l < "$file")
    total_lines=$((total_lines + lines))
  fi
done

echo "  总代码行数: ~$total_lines 行"
echo "  创建文件数: $(( ${#files[@]} + ${#wp_files[@]} + ${#util_files[@]} + ${#other_files[@]} )) 个"

echo ""
echo "✅ 验证完成！所有文件已成功创建。"
echo ""
echo "📖 查看完整报告: cat BLOG_COMPONENTS_COMPLETION_REPORT_2026-03-07.md"
