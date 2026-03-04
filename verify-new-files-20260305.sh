#!/bin/bash

# 验证新创建的文件
# CyberPress Platform - 2026-03-05

echo "=================================="
echo "📁 验证新创建的文件"
echo "=================================="
echo ""

# 文件列表
files=(
  "frontend/services/email-service.ts"
  "frontend/services/recommendation-engine.ts"
  "frontend/lib/pwa/service-worker-registration.ts"
  "frontend/lib/seo/seo-optimizer.ts"
  "frontend/components/analytics/RealTimeChart.tsx"
  "frontend/components/analytics/DataVisualizationCard.tsx"
  "frontend/components/analytics/AnalyticsGrid.tsx"
  "frontend/hooks/useAnalytics.ts"
  "frontend/hooks/useRecommendations.ts"
  "frontend/components/ui/InstallPrompt.tsx"
  "frontend/components/ui/NetworkStatus.tsx"
  "frontend/components/features/ReadingProgress.tsx"
  "frontend/app/app/page.tsx"
  "frontend/app/api/notifications/route.ts"
  "frontend/public/sw.js"
  "frontend/public/manifest.json"
  "frontend/__tests__/services/email-service.test.ts"
  "frontend/__tests__/hooks/useAnalytics.test.ts"
)

success_count=0
fail_count=0

for file in "${files[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    echo "✅ $file"
    ((success_count++))
  else
    echo "❌ $file - 未找到"
    ((fail_count++))
  fi
done

echo ""
echo "=================================="
echo "📊 统计信息"
echo "=================================="
echo "成功: $success_count"
echo "失败: $fail_count"
echo "总计: $((success_count + fail_count))"
echo ""

if [ $fail_count -eq 0 ]; then
  echo "✅ 所有文件验证通过！"
  exit 0
else
  echo "❌ 有 $fail_count 个文件未找到"
  exit 1
fi
