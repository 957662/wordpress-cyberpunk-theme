#!/bin/bash

# AI 协作套件组件验证脚本

echo "🔍 验证 AI 协作套件组件..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success_count=0
fail_count=0

# 检查函数
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((success_count++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 - 文件不存在"
        ((fail_count++))
        return 1
    fi
}

echo "📦 检查组件文件..."
echo ""

# 核心组件
check_file "frontend/components/ai/ai-chat.tsx"
check_file "frontend/components/whiteboard/collaborative-whiteboard.tsx"
check_file "frontend/components/code-share/code-snippet-card.tsx"
check_file "frontend/components/article-summary/article-summary-generator.tsx"
check_file "frontend/components/search-advanced/advanced-search.tsx"
check_file "frontend/components/reading-progress/reading-progress-tracker.tsx"
check_file "frontend/components/collaborative/collaborative-editor.tsx"
check_file "frontend/components/tasks/task-board.tsx"

echo ""
echo "📄 检查支持文件..."
echo ""

# 支持文件
check_file "frontend/components/new-ai-collaboration-index.ts"
check_file "frontend/app/examples/ai-collaboration-suite/page.tsx"
check_file "frontend/docs/AI_COLLABORATION_SUITE_GUIDE.md"
check_file "AI_COLLABORATION_FILES_CREATED.md"

echo ""
echo "📊 统计信息..."
echo ""

# 统计代码行数
total_lines=0
for file in \
    "frontend/components/ai/ai-chat.tsx" \
    "frontend/components/whiteboard/collaborative-whiteboard.tsx" \
    "frontend/components/code-share/code-snippet-card.tsx" \
    "frontend/components/article-summary/article-summary-generator.tsx" \
    "frontend/components/search-advanced/advanced-search.tsx" \
    "frontend/components/reading-progress/reading-progress-tracker.tsx" \
    "frontend/components/collaborative/collaborative-editor.tsx" \
    "frontend/components/tasks/task-board.tsx"
do
    if [ -f "$file" ]; then
        lines=$(wc -l < "$file")
        total_lines=$((total_lines + lines))
        echo "  $file: $lines 行"
    fi
done

echo ""
echo "  总计: $total_lines 行代码"
echo ""

# 总结
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $fail_count -eq 0 ]; then
    echo -e "${GREEN}✓ 所有文件验证通过！${NC}"
    echo ""
    echo "成功创建的文件: $success_count"
    echo ""
    echo "🚀 下一步:"
    echo "  1. 访问示例页面: /examples/ai-collaboration-suite"
    echo "  2. 阅读使用文档: frontend/docs/AI_COLLABORATION_SUITE_GUIDE.md"
    echo "  3. 开始在项目中使用这些组件"
    exit 0
else
    echo -e "${RED}✗ 验证失败！${NC}"
    echo ""
    echo "成功: $success_count"
    echo "失败: $fail_count"
    exit 1
fi
