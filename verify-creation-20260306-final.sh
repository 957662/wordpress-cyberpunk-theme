#!/bin/bash

# ============================================
# Verify Files Created Session 2026-03-06
# ============================================

echo "================================"
echo "File Creation Verification"
echo "Session: 2026-03-06"
echo "================================"
echo ""

# Count files
total_files=0
existing_files=0

# Array of files to check
files=(
    "backend/database/init.sql"
    "backend/database/migrations/001_initial_schema.sql"
    "backend/database/migrations/002_social_features.sql"
    "backend/database/migrations/003_reading_progress.sql"
    "backend/database/db-tools.sh"
    "backend/database/docker-compose.db.yml"
    "backend/database/scripts/backup.sh"
    "backend/database/README.md"
    "frontend/lib/api/axios-config.ts"
    "frontend/hooks/api/useApi.ts"
    "frontend/lib/utils/helpers.ts"
    "frontend/lib/utils/cn.ts"
    "frontend/hooks/useDebounce.ts"
    "frontend/hooks/useLocalStorage.ts"
    "docs/database/database-design.md"
)

echo "Checking files..."
echo ""

for file in "${files[@]}"; do
    total_files=$((total_files + 1))
    if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
        echo "✅ $file"
        existing_files=$((existing_files + 1))
    else
        echo "❌ $file (NOT FOUND)"
    fi
done

echo ""
echo "================================"
echo "Summary"
echo "================================"
echo "Total Files: $total_files"
echo "Created: $existing_files"
echo "Missing: $((total_files - existing_files))"
echo ""

if [ $existing_files -eq $total_files ]; then
    echo "✅ All files created successfully!"
    exit 0
else
    echo "❌ Some files are missing!"
    exit 1
fi
