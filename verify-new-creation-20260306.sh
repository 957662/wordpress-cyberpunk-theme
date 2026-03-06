#!/bin/bash

# 验证新创建的文件 - 2026年3月6日

echo "========================================"
echo "  验证新创建的组件和工具文件"
echo "========================================"
echo ""

# 统计变量
total_files=0
total_lines=0

# 检查 UI 组件
echo "📦 检查 UI 组件..."
ui_components=(
  "frontend/components/ui/EmptyState.tsx"
  "frontend/components/ui/FileUploader.tsx"
  "frontend/components/ui/VirtualList.tsx"
  "frontend/components/ui/StatCard.tsx"
  "frontend/components/ui/ProgressRing.tsx"
  "frontend/components/ui/Confetti.tsx"
  "frontend/components/ui/KonamiCode.tsx"
)

for component in "${ui_components[@]}"; do
  if [ -f "$component" ]; then
    lines=$(wc -l < "$component")
    echo "  ✅ $component ($lines 行)"
    ((total_files++))
    ((total_lines+=lines))
  else
    echo "  ❌ $component - 文件不存在"
  fi
done

echo ""

# 检查工具函数
echo "🔧 检查工具函数..."
utils=(
  "frontend/lib/utils/format-enhanced.ts"
  "frontend/lib/utils/dom-enhanced.ts"
)

for util in "${utils[@]}"; do
  if [ -f "$util" ]; then
    lines=$(wc -l < "$util")
    echo "  ✅ $util ($lines 行)"
    ((total_files++))
    ((total_lines+=lines))
  else
    echo "  ❌ $util - 文件不存在"
  fi
done

echo ""

# 检查示例页面
echo "📄 检查示例页面..."
examples=(
  "frontend/app/examples/new-components-2026/page.tsx"
)

for example in "${examples[@]}"; do
  if [ -f "$example" ]; then
    lines=$(wc -l < "$example")
    echo "  ✅ $example ($lines 行)"
    ((total_files++))
    ((total_lines+=lines))
  else
    echo "  ❌ $example - 文件不存在"
  fi
done

echo ""

# 检查文档
echo "📚 检查文档..."
docs=(
  "NEW_COMPONENTS_2026-03-06.md"
  "CREATION_SUMMARY_2026-03-06.md"
)

for doc in "${docs[@]}"; do
  if [ -f "$doc" ]; then
    lines=$(wc -l < "$doc")
    echo "  ✅ $doc ($lines 行)"
    ((total_files++))
    ((total_lines+=lines))
  else
    echo "  ❌ $doc - 文件不存在"
  fi
done

echo ""
echo "========================================"
echo "  验证结果"
echo "========================================"
echo "✅ 成功创建文件: $total_files 个"
echo "📝 总代码行数: $total_lines 行"
echo ""

if [ $total_files -eq 12 ]; then
  echo "🎉 所有文件都已成功创建!"
  echo ""
  echo "🚀 下一步:"
  echo "   1. 查看示例页面: /examples/new-components-2026"
  echo "   2. 阅读文档: NEW_COMPONENTS_2026-03-06.md"
  echo "   3. 开始使用组件!"
  exit 0
else
  echo "⚠️  部分文件创建失败,请检查"
  exit 1
fi
