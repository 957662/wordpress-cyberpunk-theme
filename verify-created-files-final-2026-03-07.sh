#!/bin/bash

echo "================================"
echo "Verifying Created Files - 2026-03-07"
echo "================================"
echo ""

# Count created files
files_created=0
files_failed=0

# Array of files to check
files=(
  "frontend/lib/utils/date.ts"
  "frontend/lib/utils/validation.ts"
  "frontend/lib/utils/storage.ts"
  "frontend/lib/utils/format.ts"
  "frontend/lib/utils/index.ts"
  "frontend/hooks/api/use-posts.ts"
  "frontend/services/blog-service.ts"
  "frontend/app/blog/page.tsx"
  "frontend/app/blog/[slug]/page.tsx"
  "frontend/types/models/common.ts"
  "frontend/types/models/index.ts"
  "DEVELOPMENT_SUMMARY_2026-03-07-FINAL.md"
)

echo "Checking files..."
echo ""

for file in "${files[@]}"; do
  filepath="/root/.openclaw/workspace/cyberpress-platform/$file"
  if [ -f "$filepath" ]; then
    size=$(wc -l < "$filepath")
    echo "✅ $file ($size lines)"
    ((files_created++))
  else
    echo "❌ $file (NOT FOUND)"
    ((files_failed++))
  fi
done

echo ""
echo "================================"
echo "Summary"
echo "================================"
echo "Files created: $files_created"
echo "Files failed: $files_failed"
echo ""

if [ $files_created -eq ${#files[@]} ]; then
  echo "🎉 All files created successfully!"
  exit 0
else
  echo "⚠️  Some files were not created"
  exit 1
fi
