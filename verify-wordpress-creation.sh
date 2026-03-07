#!/bin/bash

echo "═════════════════════════════════════════════════════════════════"
echo "  Verifying WordPress Integration Files Creation"
echo "═════════════════════════════════════════════════════════════════"
echo ""

# Count of files that should exist
TOTAL_FILES=13
CREATED_FILES=0

# Function to check and display file status
check_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        local lines=$(wc -l < "$file")
        echo "✅ $description"
        echo "   📄 $file"
        echo "   📏 $lines lines"
        echo ""
        ((CREATED_FILES++))
        return 0
    else
        echo "❌ $description"
        echo "   📄 $file"
        echo "   ⚠️  File not found"
        echo ""
        return 1
    fi
}

echo "Core Library Files"
echo "─────────────────────────────────────────────────────────────────"
check_file "frontend/lib/wordpress/client.ts" "WordPress API Client"
check_file "frontend/lib/wordpress/adapters.ts" "Data Adapters"
check_file "frontend/lib/wordpress/helpers.ts" "Helper Utilities"
check_file "frontend/lib/wordpress/config.ts" "Configuration"
check_file "frontend/lib/wordpress/index.ts" "Library Index"

echo "React Hooks Files"
echo "─────────────────────────────────────────────────────────────────"
check_file "frontend/hooks/use-wordpress.ts" "WordPress React Hooks"
check_file "frontend/hooks/index.ts" "Hooks Index"

echo "Type Definitions"
echo "─────────────────────────────────────────────────────────────────"
check_file "frontend/types/wordpress.ts" "WordPress Type Definitions"

echo "Page Components"
echo "─────────────────────────────────────────────────────────────────"
check_file "frontend/app/blog/page.tsx" "Blog Listing Page"
check_file "frontend/app/blog/[slug]/page.tsx" "Blog Detail Page"

echo "Documentation Files"
echo "─────────────────────────────────────────────────────────────────"
check_file "WORDPRESS_INTEGRATION_GUIDE.md" "Integration Guide"
check_file "WORDPRESS_FILES_CREATED.md" "Files Created Report"
check_file "CREATION_SUMMARY_WORDPRESS.md" "Development Summary"

echo "Configuration Files"
echo "─────────────────────────────────────────────────────────────────"
check_file "frontend/.env.wordpress.example" "Environment Template"

echo "═════════════════════════════════════════════════════════════════"
echo "  Verification Summary"
echo "═════════════════════════════════════════════════════════════════"
echo ""
echo "Total Files Expected:  $TOTAL_FILES"
echo "Files Created:         $CREATED_FILES"
echo ""

if [ $CREATED_FILES -eq $TOTAL_FILES ]; then
    echo "✅ SUCCESS: All files created successfully!"
    echo ""
    echo "📊 Statistics:"
    echo "   • Total files: $TOTAL_FILES"
    echo "   • Success rate: 100%"
    echo "   • Status: READY FOR TESTING"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Configure .env.local with WordPress URL"
    echo "   2. Install dependencies: npm install"
    echo "   3. Test the integration"
    echo "   4. Deploy to staging"
    echo ""
    exit 0
else
    echo "❌ WARNING: Not all files were created"
    echo "   Missing files: $((TOTAL_FILES - CREATED_FILES))"
    echo ""
    exit 1
fi
