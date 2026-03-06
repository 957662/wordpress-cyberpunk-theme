#!/bin/bash

# 博客组件导入路径修复脚本
# 修复所有不统一的导入路径

set -e

FRONTEND_DIR="/root/.openclaw/workspace/cyberpress-platform/frontend"
BLOG_DIR="$FRONTEND_DIR/components/blog"

echo "🔧 开始修复博客组件导入路径..."
echo "========================================"

# 1. 修复 @/lib/utils/cn 为 @/lib/utils
echo "📝 修复 cn 函数导入路径..."
find "$BLOG_DIR" -name "*.tsx" -type f -exec sed -i "s|from '@/lib/utils/cn'|from '@/lib/utils'|g" {} \;
find "$BLOG_DIR" -name "*.tsx" -type f -exec sed -i "s|from '@/lib/utils/classname'|from '@/lib/utils'|g" {} \;

# 2. 修复 @/lib/utils/format 为 @/lib/utils (如果存在)
echo "📝 修复 format 函数导入路径..."
find "$BLOG_DIR" -name "*.tsx" -type f -exec sed -i "s|from '@/lib/utils/format'|from '@/lib/utils'|g" {} \;

# 3. 统一类型导入
echo "📝 统一类型导入..."
find "$BLOG_DIR" -name "*.tsx" -type f -exec sed -i "s|from '@/types/blog'|from '@/types/blog'|g" {} \;
find "$BLOG_DIR" -name "*.tsx" -type f -exec sed -i "s|from '@/types'|from '@/types'|g" {} \;

# 4. 修复 WordPress 类型导入
echo "📝 修复 WordPress 类型导入..."
find "$BLOG_DIR" -name "*.tsx" -type f -exec sed -i "s|from '@/types/wordpress'|from '@/types/blog'|g" {} \;

# 5. 检查修复结果
echo ""
echo "✅ 导入路径修复完成！"
echo "========================================"
echo ""
echo "📊 修复统计:"
echo "   - cn 函数导入: 已统一为 @/lib/utils"
echo "   - format 函数导入: 已统一为 @/lib/utils"
echo "   - 类型导入: 已统一"
echo ""
echo "🔍 验证修复结果..."
echo ""

# 检查是否还有旧的导入路径
REMAINING=$(grep -r "from '@/lib/utils/cn" "$BLOG_DIR" 2>/dev/null | wc -l)
REMAINING2=$(grep -r "from '@/lib/utils/classname" "$BLOG_DIR" 2>/dev/null | wc -l)

if [ "$REMAINING" -eq 0 ] && [ "$REMAINING2" -eq 0 ]; then
    echo "✅ 所有导入路径已成功修复！"
else
    echo "⚠️  还有 $REMAINING 个文件使用 @/lib/utils/cn"
    echo "⚠️  还有 $REMAINING2 个文件使用 @/lib/utils/classname"
    echo ""
    echo "📄 需要手动检查的文件:"
    grep -r "from '@/lib/utils/cn" "$BLOG_DIR" 2>/dev/null | cut -d: -f1 | sort -u
    grep -r "from '@/lib/utils/classname" "$BLOG_DIR" 2>/dev/null | cut -d: -f1 | sort -u
fi

echo ""
echo "========================================"
echo "🎉 修复完成！"
