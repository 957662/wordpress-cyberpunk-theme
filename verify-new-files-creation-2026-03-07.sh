#!/bin/bash

echo "===================================="
echo "验证新创建的文件"
echo "===================================="
echo ""

FILES=(
  "frontend/components/newsletter/NewsletterSubscription.tsx"
  "frontend/components/toast/ToastContainer.tsx"
  "frontend/components/seo/SEOMeta.tsx"
  "frontend/components/code/CodeShare.tsx"
  "frontend/components/charts/AnalyticsChart.tsx"
  "frontend/components/modal/ModalSystem.tsx"
  "frontend/lib/validation/form-validator.ts"
  "frontend/lib/api/api-client.ts"
  "frontend/lib/utils/cyber-utils-enhanced.ts"
  "database/init/01-init-database.sql"
  "frontend/components/new-features/index.ts"
  "NEW_FEATURES_DELIVERY_REPORT_2026-03-07.md"
)

SUCCESS_COUNT=0
FAIL_COUNT=0

for file in "${FILES[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    SIZE=$(wc -l < "/root/.openclaw/workspace/cyberpress-platform/$file")
    echo "✅ $file ($SIZE 行)"
    ((SUCCESS_COUNT++))
  else
    echo "❌ $file - 文件不存在"
    ((FAIL_COUNT++))
  fi
done

echo ""
echo "===================================="
echo "验证结果"
echo "===================================="
echo "成功: $SUCCESS_COUNT 个文件"
echo "失败: $FAIL_COUNT 个文件"
echo "===================================="
