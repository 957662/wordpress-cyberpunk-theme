#!/bin/bash

# 验证 2026-03-05 创建的文件

echo "🔍 验证新创建的文件..."
echo ""

# 统计变量
total_files=0
verified_files=0

# 检查函数
check_file() {
    total_files=$((total_files + 1))
    if [ -f "$1" ]; then
        echo "✅ $1"
        verified_files=$((verified_files + 1))
        return 0
    else
        echo "❌ $1 (未找到)"
        return 1
    fi
}

echo "📦 组件文件:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/components/virtual-list/VirtualList.tsx"
check_file "frontend/components/virtual-list/VirtualGrid.tsx"
check_file "frontend/components/virtual-list/index.ts"
check_file "frontend/components/media/LazyImage.tsx"
check_file "frontend/components/media/OptimizedImage.tsx"
check_file "frontend/components/analytics/AnalyticsTracker.tsx"
check_file "frontend/components/performance/PerformanceMonitor.tsx"
check_file "frontend/components/scheduler/TaskQueue.tsx"
check_file "frontend/components/clipboard/CopyButton.tsx"
echo ""

echo "🪝 Hooks:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/hooks/useImageLazy.ts"
check_file "frontend/hooks/useScheduler.ts"
check_file "frontend/hooks/useEventBus.ts"
check_file "frontend/hooks/useGlobalState.ts"
check_file "frontend/hooks/useValidator.ts"
echo ""

echo "📚 工具库:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/lib/image-optimizer.ts"
check_file "frontend/lib/performance-monitor.ts"
check_file "frontend/lib/scheduler.ts"
check_file "frontend/lib/event-bus.ts"
check_file "frontend/lib/state-manager.ts"
check_file "frontend/lib/clipboard/index.ts"
check_file "frontend/lib/validator.ts"
echo ""

echo "🛠️ 服务:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/services/analytics-enhanced.ts"
echo ""

echo "📄 文档:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_file "frontend/CREATED_FILES_SUMMARY.md"
check_file "FILES_CREATED_2026_03_05.md"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 统计:"
echo "   总文件数: $total_files"
echo "   已验证: $verified_files"
echo "   成功率: $((verified_files * 100 / total_files))%"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $verified_files -eq $total_files ]; then
    echo "🎉 所有文件验证成功！"
    exit 0
else
    echo "⚠️  部分文件未找到"
    exit 1
fi
