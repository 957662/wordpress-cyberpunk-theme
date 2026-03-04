#!/bin/bash

# 新创建的文件验证脚本 - 2026-03-05 第二轮

echo "🔍 验证新创建的文件..."
echo ""

# 前端 SEO 文件
echo "📄 SEO 优化文件:"
files=(
  "frontend/lib/seo/metadata.ts"
  "frontend/lib/seo/sitemap.ts"
  "frontend/app/sitemap.ts"
  "frontend/app/robots.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file - 未找到"
  fi
done

echo ""

# 性能优化文件
echo "⚡ 性能优化文件:"
files=(
  "frontend/lib/performance/image-optimizer.ts"
  "frontend/lib/performance/code-splitting.ts"
  "frontend/lib/performance/performance-monitor.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file - 未找到"
  fi
done

echo ""

# 国际化文件
echo "🌍 国际化文件:"
files=(
  "frontend/lib/i18n/config.ts"
  "frontend/lib/i18n/index.ts"
  "frontend/lib/i18n/locales/zh-CN.ts"
  "frontend/lib/i18n/locales/en-US.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file - 未找到"
  fi
done

echo ""

# 后端文档和配置
echo "🔧 后端文件:"
files=(
  "backend/docs/API_DOCUMENTATION.md"
  "backend/app/core/openapi.py"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file - 未找到"
  fi
done

echo ""

# 测试文件
echo "🧪 测试文件:"
files=(
  "frontend/__tests__/unit/components/Card.test.tsx"
  "frontend/__tests__/unit/lib/seo.test.ts"
  "frontend/__tests__/unit/lib/i18n.test.ts"
  "frontend/__tests__/unit/lib/performance.test.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file - 未找到"
  fi
done

echo ""
echo "✨ 验证完成!"
