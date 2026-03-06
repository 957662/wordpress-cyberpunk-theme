#!/bin/bash

echo "======================================"
echo "  文件创建验证报告 - 2026-03-07"
echo "======================================"
echo ""

# 统计新创建的文件
echo "📁 新创建的组件文件:"
echo ""

if [ -f "frontend/components/recommendation/SmartRecommendationEngine.tsx" ]; then
    size=$(du -h frontend/components/recommendation/SmartRecommendationEngine.tsx | cut -f1)
    echo "  ✅ SmartRecommendationEngine.tsx ($size)"
else
    echo "  ❌ SmartRecommendationEngine.tsx (未找到)"
fi

if [ -f "frontend/components/profile/EnhancedUserProfile.tsx" ]; then
    size=$(du -h frontend/components/profile/EnhancedUserProfile.tsx | cut -f1)
    echo "  ✅ EnhancedUserProfile.tsx ($size)"
else
    echo "  ❌ EnhancedUserProfile.tsx (未找到)"
fi

if [ -f "frontend/components/realtime/RealtimeNotificationSystem.tsx" ]; then
    size=$(du -h frontend/components/realtime/RealtimeNotificationSystem.tsx | cut -f1)
    echo "  ✅ RealtimeNotificationSystem.tsx ($size)"
else
    echo "  ❌ RealtimeNotificationSystem.tsx (未找到)"
fi

echo ""
echo "📁 新创建的配置文件:"
echo ""

if [ -f "frontend/lib/config/performance.ts" ]; then
    size=$(du -h frontend/lib/config/performance.ts | cut -f1)
    echo "  ✅ frontend/lib/config/performance.ts ($size)"
else
    echo "  ❌ frontend/lib/config/performance.ts (未找到)"
fi

if [ -f "DEVELOPER_QUICK_REFERENCE.md" ]; then
    size=$(du -h DEVELOPER_QUICK_REFERENCE.md | cut -f1)
    echo "  ✅ DEVELOPER_QUICK_REFERENCE.md ($size)"
else
    echo "  ❌ DEVELOPER_QUICK_REFERENCE.md (未找到)"
fi

echo ""
echo "📁 新创建的导出文件:"
echo ""

if [ -f "frontend/components/recommendation/index.ts" ]; then
    echo "  ✅ frontend/components/recommendation/index.ts"
else
    echo "  ❌ frontend/components/recommendation/index.ts (未找到)"
fi

if [ -f "frontend/components/profile/index.ts" ]; then
    echo "  ✅ frontend/components/profile/index.ts"
else
    echo "  ❌ frontend/components/profile/index.ts (未找到)"
fi

if [ -f "frontend/components/realtime/index.ts" ]; then
    echo "  ✅ frontend/components/realtime/index.ts"
else
    echo "  ❌ frontend/components/realtime/index.ts (未找到)"
fi

echo ""
echo "======================================"
echo "  验证完成"
echo "======================================"
