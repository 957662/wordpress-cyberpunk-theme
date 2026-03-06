#!/bin/bash

echo "========================================="
echo "Verifying Files Created on 2026-03-07"
echo "========================================="
echo ""

FILES=(
  "backend/app/api/v1/system.py"
  "backend/app/api/v1/metrics.py"
  "backend/app/services/batch_operations.py"
  "backend/app/services/data_validator.py"
  "backend/app/core/prometheus.py"
  "database/migrations/20260307_create_system_monitoring_tables.sql"
  "backend/app/tests/test_system_monitoring.py"
  "frontend/components/system-metrics/SystemMonitor.tsx"
  "frontend/components/batch/BatchOperationPanel.tsx"
  "frontend/components/analytics/AnalyticsChart.tsx"
  "frontend/components/filter-panels/FilterPanel.tsx"
  "NEW_FEATURES_REPORT_2026-03-07.md"
  "QUICKSTART_GUIDE_2026-03-07.md"
)

TOTAL=0
FOUND=0
MISSING=0

for file in "${FILES[@]}"; do
  TOTAL=$((TOTAL + 1))
  if [ -f "$file" ]; then
    echo "✓ $file"
    FOUND=$((FOUND + 1))
  else
    echo "✗ $file"
    MISSING=$((MISSING + 1))
  fi
done

echo ""
echo "========================================="
echo "Summary:"
echo "  Total files: $TOTAL"
echo "  Found: $FOUND"
echo "  Missing: $MISSING"
echo "=========================================""

if [ $MISSING -eq 0 ]; then
  echo "✓ All files created successfully!"
  exit 0
else
  echo "✗ Some files are missing!"
  exit 1
fi
