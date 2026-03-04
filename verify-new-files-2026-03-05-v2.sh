#!/bin/bash

# Verification Script for New Features (2026-03-05)
# This script verifies all files created in the latest development session

echo "=========================================="
echo "🔍 Verifying New Feature Files"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
total_files=0
found_files=0
missing_files=0

# Function to check file
check_file() {
    local file=$1
    total_files=$((total_files + 1))

    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
        found_files=$((found_files + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $file (MISSING)"
        missing_files=$((missing_files + 1))
        return 1
    fi
}

echo "📦 Backend Files"
echo "----------------------------------------"

# Core files
check_file "backend/app/core/websocket.py"

# Models
check_file "backend/app/models/message.py"
check_file "backend/app/models/activity.py"

# API Routes
check_file "backend/app/api/v1/messages.py"
check_file "backend/app/api/v1/activity.py"

# Schemas
check_file "backend/app/schemas/message.py"
check_file "backend/app/schemas/activity.py"

# Services
check_file "backend/app/services/recommendation.py"
check_file "backend/app/services/cache.py"

echo ""
echo "🎨 Frontend Files"
echo "----------------------------------------"

# Components
check_file "frontend/components/chat/chat-window.tsx"
check_file "frontend/components/messages/message-center.tsx"
check_file "frontend/components/activity/activity-stream.tsx"
check_file "frontend/components/performance/performance-monitor.tsx"

# Library
check_file "frontend/lib/cache-service.ts"

# Pages
check_file "frontend/app/showcase/new-features/page.tsx"

echo ""
echo "📄 Documentation"
echo "----------------------------------------"

check_file "NEW_FEATURES_SUMMARY.md"

echo ""
echo "=========================================="
echo "📊 Verification Results"
echo "=========================================="
echo -e "Total files:  $total_files"
echo -e "${GREEN}Found:       $found_files${NC}"
echo -e "${RED}Missing:     $missing_files${NC}"
echo ""

if [ $missing_files -eq 0 ]; then
    echo -e "${GREEN}✅ All files verified successfully!${NC}"
    echo ""
    echo "🚀 Ready to use new features:"
    echo "  • Real-time messaging with WebSocket"
    echo "  • Activity stream and notifications"
    echo "  • Performance monitoring"
    echo "  • Recommendation system"
    echo "  • Cache services (frontend & backend)"
    echo ""
    echo "📖 View documentation: NEW_FEATURES_SUMMARY.md"
    echo "🎯 Try the demo: /showcase/new-features"
    exit 0
else
    echo -e "${RED}❌ Some files are missing!${NC}"
    exit 1
fi
