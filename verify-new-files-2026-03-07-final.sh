#!/bin/bash

cd /root/.openclaw/workspace/cyberpress-platform

echo "🔍 Verifying NEW files created on 2026-03-07..."
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

echo "📦 AI Libraries (lib/ai/):"
check_file "frontend/lib/ai/summarizer.ts"
check_file "frontend/lib/ai/chat.ts"
echo ""

echo "🛠️ Utils Libraries:"
check_file "frontend/lib/utils/debounce.ts"
check_file "frontend/lib/utils/clipboard.ts"
echo ""

echo "🪝 Hooks:"
check_file "frontend/hooks/useAnalytics/index.ts"
check_file "frontend/hooks/useAI/index.ts"
check_file "frontend/hooks/usePerformance/index.ts"
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
