#!/bin/bash

# Verification Script for Newly Created Files
# Created: 2026-03-03

echo "=========================================="
echo "Verifying Newly Created Files"
echo "=========================================="
echo ""

# Counters
total_files=0
total_lines=0

# Array of files to verify
files=(
    "frontend/app/(public)/home/page.tsx"
    "frontend/components/cyber/CyberButton.tsx"
    "frontend/components/cyber/CyberCard.tsx"
    "frontend/components/cyber/CyberInput.tsx"
    "frontend/components/cyber/CyberBadge.tsx"
    "frontend/components/cyber/CyberLoading.tsx"
    "frontend/components/cyber/index.ts"
    "frontend/lib/hooks/useLocalStorage.ts"
    "frontend/lib/hooks/useDebounce.ts"
    "frontend/lib/hooks/useThrottle.ts"
    "frontend/types/api.types.ts"
    "frontend/app/api/search/route.ts"
    "frontend/app/api/newsletter/route.ts"
    "frontend/.env.example"
    "frontend/config/site.config.ts"
    "backend/database/schema/complete-schema.sql"
)

echo "Checking files..."
echo ""

for file in "${files[@]}"; do
    filepath="/root/.openclaw/workspace/cyberpress-platform/$file"
    
    if [ -f "$filepath" ]; then
        lines=$(wc -l < "$filepath")
        total_files=$((total_files + 1))
        total_lines=$((total_lines + lines))
        echo "✅ $file ($lines lines)"
    else
        echo "❌ $file (NOT FOUND)"
    fi
done

echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo "Total files found: $total_files / ${#files[@]}"
echo "Total lines of code: $total_lines"
echo ""

if [ $total_files -eq ${#files[@]} ]; then
    echo "🎉 All files successfully created!"
    exit 0
else
    echo "⚠️  Some files are missing!"
    exit 1
fi
