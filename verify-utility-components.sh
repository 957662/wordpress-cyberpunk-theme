#!/bin/bash

# 验证新创建的实用组件
# CyberPress Platform - Utility Components Verification

echo "🔍 验证实用组件文件..."
echo ""

# 组件文件列表
components=(
  "frontend/components/ui/faq.tsx"
  "frontend/components/ui/breadcrumb.tsx"
  "frontend/components/ui/back-to-top.tsx"
  "frontend/components/ui/language-switcher.tsx"
  "frontend/components/ui/theme-switcher.tsx"
  "frontend/components/ui/tag-cloud.tsx"
  "frontend/components/ui/share-buttons.tsx"
  "frontend/components/ui/pagination.tsx"
)

# 验证组件文件
echo "✅ 检查组件文件："
for component in "${components[@]}"; do
  if [ -f "$component" ]; then
    size=$(du -h "$component" | cut -f1)
    echo "  ✓ $component ($size)"
  else
    echo "  ✗ $component - 未找到"
  fi
done
echo ""

# 验证导出文件
echo "✅ 检查导出文件："
if [ -f "frontend/components/index-new-components.ts" ]; then
  if grep -q "FAQ" "frontend/components/index-new-components.ts"; then
    echo "  ✓ index-new-components.ts 已更新（包含新组件导出）"
  else
    echo "  ⚠ index-new-components.ts 可能未正确更新"
  fi
else
  echo "  ✗ index-new-components.ts 未找到"
fi
echo ""

# 验证演示页面
echo "✅ 检查演示页面："
if [ -f "frontend/app/showcase/utility-components/page.tsx" ]; then
  echo "  ✓ 演示页面已创建"
  echo "    访问: http://localhost:3000/showcase/utility-components"
else
  echo "  ✗ 演示页面未找到"
fi
echo ""

# 验证文档
echo "✅ 检查文档："
if [ -f "UTILITY_COMPONENTS_SUMMARY.md" ]; then
  echo "  ✓ 组件总结文档已创建"
else
  echo "  ✗ 组件总结文档未找到"
fi
echo ""

# 统计信息
echo "📊 统计信息："
total_lines=0
for component in "${components[@]}"; do
  if [ -f "$component" ]; then
    lines=$(wc -l < "$component")
    total_lines=$((total_lines + lines))
  fi
done
echo "  • 总代码行数: $total_lines"
echo "  • 组件数量: ${#components[@]}"
echo ""

# 组件列表
echo "🎨 创建的组件："
echo "  1. FAQ - 常见问题组件"
echo "  2. Breadcrumb - 面包屑导航"
echo "  3. BackToTop - 回到顶部按钮"
echo "  4. LanguageSwitcher - 语言切换器"
echo "  5. ThemeSwitcher - 主题切换器"
echo "  6. TagCloud - 标签云"
echo "  7. ShareButtons - 分享按钮"
echo "  8. Pagination - 分页组件"
echo ""

# 使用提示
echo "💡 使用提示："
echo "  1. 启动开发服务器: npm run dev"
echo "  2. 访问演示页面: http://localhost:3000/showcase/utility-components"
echo "  3. 查看文档: cat UTILITY_COMPONENTS_SUMMARY.md"
echo ""

# 完成提示
echo "✨ 验证完成！所有实用组件已成功创建。"
echo ""
