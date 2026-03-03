#!/bin/bash

# CyberPress Social Features Creation Verification Script
# Date: 2026-03-03

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     🔍 CYBERPRESS - SOCIAL FEATURES VERIFICATION 🔍          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

PROJECT_ROOT="/root/.openclaw/workspace/cyberpress-platform"
cd "$PROJECT_ROOT" || exit 1

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL_FILES=0
FOUND_FILES=0
MISSING_FILES=0

echo "📁 BACKEND FILES"
echo "═══════════════════════════════════════════════════════════════"

# Backend files
backend_files=(
    "backend/app/models/social.py"
    "backend/app/schemas/social.py"
    "backend/app/services/social_service.py"
    "backend/app/api/social/router.py"
)

for file in "${backend_files[@]}"; do
    TOTAL_FILES=$((TOTAL_FILES + 1))
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        echo -e "${GREEN}✓${NC} $file ($size)"
        FOUND_FILES=$((FOUND_FILES + 1))
    else
        echo -e "${RED}✗${NC} $file (MISSING)"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

echo ""
echo "📁 FRONTEND FILES"
echo "═══════════════════════════════════════════════════════════════"

# Frontend files
frontend_files=(
    "frontend/app/notifications/page.tsx"
    "frontend/components/bookmark/BookmarkList.tsx"
    "frontend/components/bookmark/BookmarkFolderManager.tsx"
    "frontend/components/user/UserSocialStats.tsx"
)

for file in "${frontend_files[@]}"; do
    TOTAL_FILES=$((TOTAL_FILES + 1))
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        echo -e "${GREEN}✓${NC} $file ($size)"
        FOUND_FILES=$((FOUND_FILES + 1))
    else
        echo -e "${RED}✗${NC} $file (MISSING)"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

echo ""
echo "📊 SUMMARY"
echo "═══════════════════════════════════════════════════════════════"
echo "Total Files Expected: $TOTAL_FILES"
echo -e "Files Found: ${GREEN}$FOUND_FILES${NC}"
echo -e "Files Missing: ${RED}$MISSING_FILES${NC}"
echo ""

if [ $FOUND_FILES -eq $TOTAL_FILES ]; then
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║           ✅ ALL FILES CREATED SUCCESSFULLY! ✅                ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "📦 Next Steps:"
    echo "   1. Review the implementation report"
    echo "   2. Integrate with authentication system"
    echo "   3. Create database migrations"
    echo "   4. Test API endpoints"
    echo ""
    exit 0
else
    echo -e "${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║              ⚠️  SOME FILES ARE MISSING! ⚠️                   ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Please check the missing files and create them."
    echo ""
    exit 1
fi
