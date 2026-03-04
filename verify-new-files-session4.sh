#!/bin/bash

# 验证新创建的文件 - 2026-03-05 第四次会话

echo "🔍 验证新创建的文件..."
echo ""

# 统计函数
count_files() {
    find $1 -type f -name "*.tsx" -o -name "*.ts" -o -name "*.md" 2>/dev/null | wc -l
}

# UI 组件
echo "📦 检查 UI 组件..."
components=(
    "frontend/components/ui/Rating.tsx"
    "frontend/components/ui/Timeline.tsx"
    "frontend/components/ui/CodeBlock.tsx"
    "frontend/components/ui/EmptyState.tsx"
    "frontend/components/ui/Tooltip.tsx"
    "frontend/components/ui/DropZone.tsx"
    "frontend/components/ui/Wizard.tsx"
)

for comp in "${components[@]}"; do
    if [ -f "$comp" ]; then
        lines=$(wc -l < "$comp")
        echo "  ✅ $comp ($lines 行)"
    else
        echo "  ❌ $comp - 未找到"
    fi
done

# Hooks
echo ""
echo "⚓ 检查自定义 Hooks..."
hooks=(
    "frontend/lib/hooks/useClipboard.ts"
    "frontend/lib/hooks/useClickOutside.ts"
    "frontend/lib/hooks/useKeyboard.ts"
    "frontend/lib/hooks/useMediaQuery.ts"
    "frontend/lib/hooks/useNetwork.ts"
    "frontend/lib/hooks/useAsync.ts"
)

for hook in "${hooks[@]}"; do
    if [ -f "$hook" ]; then
        lines=$(wc -l < "$hook")
        echo "  ✅ $hook ($lines 行)"
    else
        echo "  ❌ $hook - 未找到"
    fi
done

# 页面
echo ""
echo "📄 检查页面..."
pages=(
    "frontend/app/components-showcase/page.tsx"
    "frontend/app/examples/ui-components/page.tsx"
    "frontend/app/examples/hooks/page.tsx"
)

for page in "${pages[@]}"; do
    if [ -f "$page" ]; then
        lines=$(wc -l < "$page")
        echo "  ✅ $page ($lines 行)"
    else
        echo "  ❌ $page - 未找到"
    fi
done

# 文档
echo ""
echo "📚 检查文档..."
docs=(
    "frontend/app/docs/components/badge.md"
    "frontend/app/docs/components/card.md"
    "frontend/app/docs/hooks/useDebounce.md"
    "frontend/app/docs/hooks/useLocalStorage.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        lines=$(wc -l < "$doc")
        echo "  ✅ $doc ($lines 行)"
    else
        echo "  ❌ $doc - 未找到"
    fi
done

# 导出文件
echo ""
echo "🔧 检查导出文件..."
exports=(
    "frontend/components/index-new-components.ts"
    "frontend/lib/hooks/index-new-hooks.ts"
)

for export_file in "${exports[@]}"; do
    if [ -f "$export_file" ]; then
        lines=$(wc -l < "$export_file")
        echo "  ✅ $export_file ($lines 行)"
    else
        echo "  ❌ $export_file - 未找到"
    fi
done

# 统计
echo ""
echo "📊 统计信息："
echo "  UI 组件总数: $(find frontend/components/ui -type f -name "*.tsx" 2>/dev/null | wc -l)"
echo "  Hooks 总数: $(find frontend/lib/hooks -type f -name "*.ts" 2>/dev/null | wc -l)"
echo "  所有组件文件: $(find frontend/components -type f -name "*.tsx" 2>/dev/null | wc -l)"
echo ""

echo "✅ 验证完成！"
