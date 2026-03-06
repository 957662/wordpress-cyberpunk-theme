#!/bin/bash

# Quick verification for session 2026-03-06

echo "🔍 Verifying session files..."
echo ""

# Check new files
files=(
  "frontend/components/newsletter/NewsletterForm.tsx"
  "frontend/components/integrations/GitHubIntegration.tsx"
  "frontend/components/integrations/TwitterTimeline.tsx"
  "frontend/lib/utils/date/formatDate.ts"
  "frontend/lib/utils/string/slugify.ts"
)

found=0
total=${#files[@]}

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ $file"
    ((found++))
  else
    echo "✗ $file"
  fi
done

echo ""
echo "Summary: $found/$total files found"

if [ $found -eq $total ]; then
  echo "✅ All files created successfully!"
  exit 0
else
  echo "⚠️  Some files are missing"
  exit 1
fi
