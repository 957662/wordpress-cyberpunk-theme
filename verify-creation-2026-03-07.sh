#!/bin/bash

echo "🔍 Verifying files created on 2026-03-07..."
echo ""

FAILED=0
PASSED=0

check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1"
        ((PASSED++))
        return 0
    else
        echo "❌ $1 - NOT FOUND"
        ((FAILED++))
        return 1
    fi
}

echo "📦 AI Libraries:"
check_file "frontend/lib/ai/summarizer.ts"
check_file "frontend/lib/ai/chat.ts"
echo ""

echo "📊 Analytics Components:"
check_file "frontend/components/analytics/AnalyticsDashboard.tsx"
echo ""

echo "🤖 AI Components:"
check_file "frontend/components/ai/AIAssistant.tsx"
echo ""

echo "⚡ Performance Components:"
check_file "frontend/components/performance/LazyImage.tsx"
check_file "frontend/components/performance/VirtualList.tsx"
echo ""

echo "🪝 Hooks - Analytics:"
check_file "frontend/hooks/useAnalytics/index.ts"
echo ""

echo "🪝 Hooks - AI:"
check_file "frontend/hooks/useAI/index.ts"
echo ""

echo "🪝 Hooks - Performance:"
check_file "frontend/hooks/usePerformance/index.ts"
echo ""

echo "🛠️ Utils - Debounce:"
check_file "frontend/lib/utils/debounce.ts"
echo ""

echo "🛠️ Utils - Clipboard:"
check_file "frontend/lib/utils/clipboard.ts"
echo ""

echo "📄 Documentation:"
check_file "FILES_CREATED_2026-03-07-NEW.md"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -eq 0 ]; then
    echo "✅ All files verified successfully!"
    exit 0
else
    echo "❌ Some files are missing!"
    exit 1
fi
