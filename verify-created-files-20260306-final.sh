#!/bin/bash

echo "========================================"
echo "Verifying Created Files - 2026-03-06"
echo "========================================"
echo ""

FILES=(
  "frontend/components/ui/enhanced/CodeHighlightEnhanced.tsx"
  "frontend/components/ui/enhanced/TableOfContentsEnhanced.tsx"
  "frontend/components/ui/enhanced/RealTimeSearch.tsx"
  "frontend/components/ui/enhanced/LikeButton.tsx"
  "frontend/components/ui/enhanced/ShareButton.tsx"
  "frontend/components/ui/enhanced/BookmarkButtonEnhanced.tsx"
  "frontend/components/ui/enhanced/OptimizedImage.tsx"
  "frontend/app/profile/page.tsx"
  "frontend/hooks/useInfiniteScrollEnhanced.ts"
  "frontend/lib/utils/performance-enhanced.ts"
  "frontend/lib/services/searchService.ts"
)

TOTAL=${#FILES[@]}
CREATED=0

for FILE in "${FILES[@]}"; do
  if [ -f "$FILE" ]; then
    SIZE=$(du -h "$FILE" | cut -f1)
    LINES=$(wc -l < "$FILE")
    echo "✅ $FILE"
    echo "   Size: $SIZE | Lines: $LINES"
    ((CREATED++))
  else
    echo "❌ $FILE - NOT FOUND"
  fi
  echo ""
done

echo "========================================"
echo "Summary: $CREATED/$TOTAL files created"
echo "========================================"

if [ $CREATED -eq $TOTAL ]; then
  echo "✅ All files created successfully!"
  exit 0
else
  echo "❌ Some files are missing"
  exit 1
fi
