#!/bin/bash

echo "🔍 验证新创建的组件..."
echo "================================"

# 验证 AI Chat Assistant
echo ""
echo "📦 检查 AI Chat Assistant 组件..."
if [ -f "frontend/components/ai-chat/AIChatAssistant.tsx" ]; then
    echo "✅ AIChatAssistant.tsx 存在"
    lines=$(wc -l < frontend/components/ai-chat/AIChatAssistant.tsx)
    echo "   📄 行数: $lines"
else
    echo "❌ AIChatAssistant.tsx 不存在"
fi

# 验证 SystemMonitor
echo ""
echo "📦 检查 SystemMonitor 组件..."
if [ -f "frontend/components/performance/SystemMonitor.tsx" ]; then
    echo "✅ SystemMonitor.tsx 存在"
    lines=$(wc -l < frontend/components/performance/SystemMonitor.tsx)
    echo "   📄 行数: $lines"
else
    echo "❌ SystemMonitor.tsx 不存在"
fi

# 验证 EnhancedCodeBlock
echo ""
echo "📦 检查 EnhancedCodeBlock 组件..."
if [ -f "frontend/components/code-display/EnhancedCodeBlock.tsx" ]; then
    echo "✅ EnhancedCodeBlock.tsx 存在"
    lines=$(wc -l < frontend/components/code-display/EnhancedCodeBlock.tsx)
    echo "   📄 行数: $lines"
else
    echo "❌ EnhancedCodeBlock.tsx 不存在"
fi

# 验证 SmartSearch
echo ""
echo "📦 检查 SmartSearch 组件..."
if [ -f "frontend/components/smart-search/SmartSearch.tsx" ]; then
    echo "✅ SmartSearch.tsx 存在"
    lines=$(wc -l < frontend/components/smart-search/SmartSearch.tsx)
    echo "   📄 行数: $lines"
else
    echo "❌ SmartSearch.tsx 不存在"
fi

# 验证演示页面
echo ""
echo "📦 检查演示页面..."
if [ -f "frontend/app/examples/component-showcase-2026/page.tsx" ]; then
    echo "✅ component-showcase-2026/page.tsx 存在"
    lines=$(wc -l < frontend/app/examples/component-showcase-2026/page.tsx)
    echo "   📄 行数: $lines"
else
    echo "❌ component-showcase-2026/page.tsx 不存在"
fi

# 验证文档
echo ""
echo "📦 检查文档..."
if [ -f "NEW_COMPONENTS_DELIVERY_REPORT.md" ]; then
    echo "✅ NEW_COMPONENTS_DELIVERY_REPORT.md 存在"
else
    echo "❌ NEW_COMPONENTS_DELIVERY_REPORT.md 不存在"
fi

# 统计总代码行数
echo ""
echo "📊 代码统计..."
echo "================================"

total_lines=0

for file in \
    "frontend/components/ai-chat/AIChatAssistant.tsx" \
    "frontend/components/performance/SystemMonitor.tsx" \
    "frontend/components/code-display/EnhancedCodeBlock.tsx" \
    "frontend/components/smart-search/SmartSearch.tsx" \
    "frontend/app/examples/component-showcase-2026/page.tsx"
do
    if [ -f "$file" ]; then
        lines=$(wc -l < "$file")
        total_lines=$((total_lines + lines))
        echo "📄 $file: $lines 行"
    fi
done

echo ""
echo "✨ 总计: $total_lines 行代码"

echo ""
echo "🎉 验证完成！"
echo "================================"
echo ""
echo "📍 访问演示页面: /examples/component-showcase-2026"
echo ""
