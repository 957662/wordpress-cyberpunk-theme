#!/bin/bash

# 验证新创建的文件

echo "================================"
echo "验证新创建的文件 (2026-03-05)"
echo "================================"
echo ""

# UI 组件
echo "📦 UI 组件:"
files=(
  "frontend/components/ui/Knob.tsx"
  "frontend/components/ui/Slider.tsx"
  "frontend/components/ui/Divider.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    size=$(wc -l < "$file")
    echo "✅ $file ($size 行)"
  else
    echo "❌ $file (不存在)"
  fi
done
echo ""

# Hooks
echo "🪝 Hooks:"
hooks=(
  "frontend/hooks/useLocalStorage.ts"
  "frontend/hooks/useDebounce.ts"
  "frontend/hooks/useIntersectionObserver.ts"
  "frontend/hooks/useMediaQuery.ts"
)

for hook in "${hooks[@]}"; do
  if [ -f "$hook" ]; then
    size=$(wc -l < "$hook")
    echo "✅ $hook ($size 行)"
  else
    echo "❌ $hook (不存在)"
  fi
done
echo ""

# 服务层
echo "🔧 服务层:"
services=(
  "frontend/services/api/httpClient.ts"
  "frontend/services/api/authService.ts"
)

for service in "${services[@]}"; do
  if [ -f "$service" ]; then
    size=$(wc -l < "$service")
    echo "✅ $service ($size 行)"
  else
    echo "❌ $service (不存在)"
  fi
done
echo ""

# 工具函数
echo "🛠️  工具函数:"
utils=(
  "frontend/lib/validators.ts"
  "frontend/lib/formatters.ts"
  "frontend/lib/constants/index.ts"
  "frontend/lib/performance/lazyLoad.ts"
)

for util in "${utils[@]}"; do
  if [ -f "$util" ]; then
    size=$(wc -l < "$util")
    echo "✅ $util ($size 行)"
  else
    echo "❌ $util (不存在)"
  fi
done
echo ""

# 类型定义
echo "📝 类型定义:"
types=(
  "frontend/types/common.ts"
  "frontend/types/index.ts"
)

for type in "${types[@]}"; do
  if [ -f "$type" ]; then
    size=$(wc -l < "$type")
    echo "✅ $type ($size 行)"
  else
    echo "❌ $type (不存在)"
  fi
done
echo ""

# 实用组件
echo "🎨 实用组件:"
components=(
  "frontend/components/utility/EmptyState.tsx"
  "frontend/components/utility/BackToTop.tsx"
  "frontend/components/utility/ScrollIndicator.tsx"
  "frontend/components/utility/CodeBlock.tsx"
)

for component in "${components[@]}"; do
  if [ -f "$component" ]; then
    size=$(wc -l < "$component")
    echo "✅ $component ($size 行)"
  else
    echo "❌ $component (不存在)"
  fi
done
echo ""

echo "================================"
echo "✨ 验证完成！"
echo "================================"
