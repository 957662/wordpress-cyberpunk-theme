#!/bin/bash

# 最终验证脚本 - 2026-03-05

echo "🔍 验证 2026-03-05 新创建的文件..."
echo ""

total=0
success=0

check_file() {
  ((total++))
  if [ -f "$1" ]; then
    echo "  ✅ $1"
    ((success++))
  else
    echo "  ❌ $1 - 未找到"
  fi
}

# 前端 SEO 文件
echo "📄 SEO 优化 (4 个文件):"
check_file "frontend/lib/seo/metadata.ts"
check_file "frontend/lib/seo/sitemap.ts"
check_file "frontend/app/sitemap.ts"
check_file "frontend/app/robots.ts"
echo ""

# 性能优化文件
echo "⚡ 性能优化 (3 个文件):"
check_file "frontend/lib/performance/image-optimizer.ts"
check_file "frontend/lib/performance/code-splitting.ts"
check_file "frontend/lib/performance/performance-monitor.ts"
echo ""

# 国际化文件
echo "🌍 国际化 (4 个文件):"
check_file "frontend/lib/i18n/config.ts"
check_file "frontend/lib/i18n/index.ts"
check_file "frontend/lib/i18n/locales/zh-CN.ts"
check_file "frontend/lib/i18n/locales/en-US.ts"
echo ""

# 后端文档和配置
echo "🔧 后端 API 文档 (2 个文件):"
check_file "backend/docs/API_DOCUMENTATION.md"
check_file "backend/app/core/openapi.py"
echo ""

# 测试文件
echo "🧪 单元测试 (4 个文件):"
check_file "frontend/__tests__/unit/components/Card.test.tsx"
check_file "frontend/__tests__/unit/lib/seo.test.ts"
check_file "frontend/__tests__/unit/lib/i18n.test.ts"
check_file "frontend/__tests__/unit/lib/performance.test.ts"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 统计: $success / $total 个文件创建成功"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $success -eq $total ]; then
  echo "✨ 所有文件创建成功！"
  exit 0
else
  echo "⚠️  有 $((total - success)) 个文件未找到"
  exit 1
fi
