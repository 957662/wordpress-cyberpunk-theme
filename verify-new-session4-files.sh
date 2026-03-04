#!/bin/bash

# 验证新创建的文件
# Session 4 - 2026-03-05

PROJECT_ROOT="/root/.openclaw/workspace/cyberpress-platform"
cd "$PROJECT_ROOT"

echo "=========================================="
echo "验证新创建的文件 - Session 4"
echo "日期: 2026-03-05"
echo "=========================================="
echo ""

# 计数器
total=0
success=0
failed=0

# 检查文件函数
check_file() {
    local file=$1
    total=$((total + 1))
    
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        lines=$(wc -l < "$file")
        echo "✅ $file"
        echo "   大小: $size | 行数: $lines"
        success=$((success + 1))
        return 0
    else
        echo "❌ $file (不存在)"
        failed=$((failed + 1))
        return 1
    fi
}

echo "📦 前端组件 (4个)"
echo "----------------------------------------"
check_file "frontend/components/blog/ReadingProgress.tsx"
check_file "frontend/components/blog/SearchSuggestion.tsx"
check_file "frontend/components/blog/AuthorProfile.tsx"
check_file "frontend/components/blog/NewsletterCard.tsx"
echo ""

echo "🔧 后端 API (1个)"
echo "----------------------------------------"
check_file "backend/app/api/v1/social.ts"
echo ""

echo "🛠️ 后端核心 (1个)"
echo "----------------------------------------"
check_file "backend/app/core/ratelimit.py"
echo ""

echo "📄 文档 (1个)"
echo "----------------------------------------"
check_file "NEW_FILES_CREATED_2026-03-05_SESSION4.md"
echo ""

echo "=========================================="
echo "📊 统计结果"
echo "=========================================="
echo "总计: $total"
echo "成功: $success ✅"
echo "失败: $failed ❌"
echo ""

if [ $failed -eq 0 ]; then
    echo "🎉 所有文件验证通过！"
    echo ""
    echo "📋 文件详情:"
    echo "   - 4 个前端组件 (ReadingProgress, SearchSuggestion, AuthorProfile, NewsletterCard)"
    echo "   - 1 个后端 API (social.ts)"
    echo "   - 1 个后端核心 (ratelimit.py)"
    echo "   - 1 个文档报告"
    echo ""
    echo "🚀 准备就绪，可以开始使用！"
    exit 0
else
    echo "⚠️  有 $failed 个文件未找到"
    exit 1
fi
