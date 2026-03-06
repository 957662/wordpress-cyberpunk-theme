#!/bin/bash

# 验证创建的文件
# 2026-03-07

echo "======================================"
echo "验证创建的文件"
echo "======================================"
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
        echo "✅ $file"
        success=$((success + 1))
        return 0
    else
        echo "❌ $file (不存在)"
        failed=$((failed + 1))
        return 1
    fi
}

echo "📁 UI 组件"
echo "----------------------------"
check_file "frontend/components/ui/table/Table.tsx"
check_file "frontend/components/ui/table/index.ts"
check_file "frontend/components/ui/tabs/Tabs.tsx"
check_file "frontend/components/ui/tabs/index.ts"
check_file "frontend/components/ui/index.ts"
echo ""

echo "📁 工具函数"
echo "----------------------------"
check_file "frontend/lib/utils/markdown.ts"
check_file "frontend/lib/utils/image.ts"
check_file "frontend/lib/utils/performance.ts"
check_file "frontend/lib/utils/index-new.ts"
echo ""

echo "📁 文档"
echo "----------------------------"
check_file "QUICKREF_DEVELOPMENT.md"
check_file "FILES_CREATED_SUMMARY_2026-03-07-FINAL.md"
echo ""

echo "======================================"
echo "统计信息"
echo "======================================"
echo "总计: $total"
echo "成功: $success"
echo "失败: $failed"
echo ""

if [ $failed -eq 0 ]; then
    echo "✅ 所有文件创建成功！"
    exit 0
else
    echo "❌ 有 $failed 个文件创建失败"
    exit 1
fi
