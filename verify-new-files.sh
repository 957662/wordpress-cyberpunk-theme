#!/bin/bash

echo "=== 验证新创建的文件 ==="
echo ""

files=(
  "frontend/components/analytics/AnalyticsDashboard.tsx"
  "frontend/components/analytics/ChartComponent.tsx"
  "frontend/components/analytics/index.ts"
  "frontend/components/dashboard/QuickStats.tsx"
  "frontend/components/dashboard/RecentActivity.tsx"
  "frontend/app/analytics/page.tsx"
  "frontend/app/api/posts/[slug]/route.ts"
  "frontend/hooks/use-analytics.ts"
  "frontend/hooks/use-dashboard.ts"
  "frontend/lib/api-client.ts"
  "backend/app/api/v1/analytics.py"
  "backend/app/api/v1/dashboard.py"
  "backend/app/models/analytics.py"
  "backend/app/schemas/analytics.py"
  "backend/app/services/analytics_service.py"
  "backend/database/migrations/003_create_analytics_tables.sql"
)

total=0
success=0

for file in "${files[@]}"; do
  total=$((total + 1))
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    echo "✅ $file"
    success=$((success + 1))
  else
    echo "❌ $file (不存在)"
  fi
done

echo ""
echo "总计: $success/$total 文件创建成功"

if [ $success -eq $total ]; then
  echo "🎉 所有文件创建成功！"
  exit 0
else
  echo "⚠️  部分文件创建失败"
  exit 1
fi
