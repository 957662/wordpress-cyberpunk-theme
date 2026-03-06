#!/bin/bash

# Verification script for new files created on 2026-03-06

echo "🔍 Verifying newly created files..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL=0
FOUND=0
MISSING=0

# Function to check file
check_file() {
    TOTAL=$((TOTAL + 1))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        FOUND=$((FOUND + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        MISSING=$((MISSING + 1))
        return 1
    fi
}

echo "📦 Backend Services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "backend/app/services/post_service.py"
check_file "backend/app/services/comment_service.py"
check_file "backend/app/services/notification_service.py"
echo ""

echo "🔌 Backend API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "backend/app/api/v1/analytics.py"
check_file "backend/app/middleware/rate_limit.py"
echo ""

echo "🧪 Backend Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "backend/app/tests/__init__.py"
check_file "backend/app/tests/api/test_auth.py"
check_file "backend/app/tests/api/test_posts.py"
echo ""

echo "🎨 Frontend Components - Code"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/components/code/SyntaxHighlighter.tsx"
check_file "frontend/components/code/CodeViewer.tsx"
check_file "frontend/components/code/DiffViewer.tsx"
echo ""

echo "🔍 Frontend Components - SEO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/components/seo/Metadata.tsx"
check_file "frontend/components/seo/JsonLd.tsx"
check_file "frontend/components/seo/OpenGraph.tsx"
echo ""

echo "⚡ Frontend Components - Performance"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/components/performance/ImageOptimization.tsx"
check_file "frontend/components/performance/LazyLoad.tsx"
check_file "frontend/components/performance/VirtualList.tsx"
echo ""

echo "🎣 Frontend Hooks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/lib/hooks/performance/useThrottle.ts"
check_file "frontend/lib/hooks/performance/useMemoizedCallback.ts"
check_file "frontend/lib/hooks/performance/useIntersectionObserver.ts"
echo ""

echo "📄 Frontend Pages"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/app/[username]/page.tsx"
check_file "frontend/app/search/page.tsx"
echo ""

echo "⚙️  Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/.env.example"
check_file "backend/.env.example"
check_file "API_DOCUMENTATION.md"
echo ""

echo "📊 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Total files: ${TOTAL}"
echo -e "${GREEN}Found: ${FOUND}${NC}"
echo -e "${RED}Missing: ${MISSING}${NC}"
echo ""

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✓ All files successfully created!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some files are missing${NC}"
    exit 1
fi
