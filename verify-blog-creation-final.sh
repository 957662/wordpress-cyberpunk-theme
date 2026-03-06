#!/bin/bash

# Blog Components Creation Verification Script
# Generated: 2026-03-06

echo "======================================"
echo "📋 Blog Components Verification"
echo "======================================"
echo ""

# Array of expected files
declare -a files=(
    "frontend/components/blog/code-highlighter.tsx"
    "frontend/components/blog/table-of-contents.tsx"
    "frontend/components/blog/comment-system.tsx"
    "frontend/components/blog/related-posts.tsx"
    "frontend/components/blog/reading-progress.tsx"
    "frontend/components/blog/blog-post-layout.tsx"
    "frontend/components/blog/search-bar.tsx"
    "frontend/components/blog/like-button.tsx"
    "frontend/components/blog/blog-card.tsx"
    "frontend/components/blog/blog-list.tsx"
    "frontend/components/blog/blog-index.ts"
    "frontend/components/blog/types.ts"
    "frontend/lib/blog-utils.ts"
    "BLOG_FEATURES_GUIDE.md"
    "CREATED_FILES_REPORT_2025-03-06.md"
)

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
total=${#files[@]}
found=0
missing=0

echo "Checking $total files..."
echo ""

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
        ((found++))
    else
        echo -e "${RED}❌${NC} $file (MISSING)"
        ((missing++))
    fi
done

echo ""
echo "======================================"
echo "📊 Results"
echo "======================================"
echo -e "${GREEN}Found:${NC} $found/$total files"
if [ $missing -gt 0 ]; then
    echo -e "${RED}Missing:${NC} $missing/$total files"
fi
echo ""

if [ $found -eq $total ]; then
    echo -e "${GREEN}🎉 All files created successfully!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some files are missing${NC}"
    exit 1
fi
