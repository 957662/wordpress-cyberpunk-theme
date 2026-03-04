#!/bin/bash

# 验证新增文件脚本
# 日期: 2026-03-05

echo "================================"
echo "验证新增文件"
echo "================================"
echo ""

# 文件列表
files=(
  "frontend/public/manifest.json"
  "frontend/public/sw.js"
  "frontend/components/pwa/PWAInstaller.tsx"
  "frontend/components/pwa/OfflineIndicator.tsx"
  "frontend/components/pwa/ServiceWorkerRegister.tsx"
  "frontend/components/pwa/index.ts"
  "frontend/components/seo/OpenGraphTags.tsx"
  "frontend/components/seo/JsonLd.tsx"
  "frontend/components/performance/PerformanceMonitor.tsx"
  "frontend/components/common/Breadcrumb.tsx"
  "frontend/components/common/PageTransition.tsx"
  "frontend/components/common/LoadingScreen.tsx"
  "frontend/components/common/ErrorBoundary.tsx"
  "frontend/lib/utils/cn.ts"
  "frontend/lib/utils/date.ts"
  "frontend/lib/utils/storage.ts"
  "frontend/lib/utils/validators.ts"
  "frontend/lib/utils/error-handler.ts"
  "frontend/lib/utils/performance.ts"
  "frontend/__tests__/components/Breadcrumb.test.tsx"
)

# 计数器
total=0
exists=0
missing=0

# 检查每个文件
for file in "${files[@]}"; do
  total=$((total + 1))
  if [ -f "$file" ]; then
    exists=$((exists + 1))
    echo "✅ $file"
  else
    missing=$((missing + 1))
    echo "❌ $file (缺失)"
  fi
done

echo ""
echo "================================"
echo "验证结果"
echo "================================"
echo "总文件数: $total"
echo "已创建: $exists"
echo "缺失: $missing"
echo ""

if [ $missing -eq 0 ]; then
  echo "🎉 所有文件已成功创建！"
  exit 0
else
  echo "⚠️  有 $missing 个文件缺失"
  exit 1
fi
