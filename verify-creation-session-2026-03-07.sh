#!/bin/bash

# 验证创建的文件
echo "========================================="
echo "验证创建的文件 - 2026-03-07"
echo "========================================="
echo ""

PROJECT_ROOT="/root/.openclaw/workspace/cyberpress-platform"
ERRORS=0

# 检查函数
check_file() {
    local file="$1"
    local description="$2"
    
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        echo "✓ $description"
        echo "  文件: $file"
        echo "  大小: $size"
        echo ""
    else
        echo "✗ $description"
        echo "  文件: $file"
        echo "  状态: 未找到"
        echo ""
        ERRORS=$((ERRORS + 1))
    fi
}

# 数据库架构
echo "=== 数据库架构 ==="
check_file "$PROJECT_ROOT/database/schema/core-schema.sql" "核心数据库架构"
check_file "$PROJECT_ROOT/database/schema/performance-schema.sql" "性能优化架构"
check_file "$PROJECT_ROOT/database/schema/init.sh" "数据库初始化脚本"

# 前端组件
echo "=== 前端组件 ==="
check_file "$PROJECT_ROOT/frontend/components/ui/PaginationNew.tsx" "分页组件"
check_file "$PROJECT_ROOT/frontend/components/ui/CarouselNew.tsx" "轮播图组件"
check_file "$PROJECT_ROOT/frontend/components/ui/CodeHighlighterNew.tsx" "代码高亮组件"

# API 路由
echo "=== API 路由 ==="
check_file "$PROJECT_ROOT/backend/app/api/v1/posts.ts" "文章列表 API"
check_file "$PROJECT_ROOT/backend/app/api/v1/posts/[id]/route.ts" "单个文章 API"
check_file "$PROJECT_ROOT/backend/lib/db.ts" "数据库客户端"

# 工具函数
echo "=== 工具函数 ==="
check_file "$PROJECT_ROOT/frontend/lib/utils/date.ts" "日期时间工具"
check_file "$PROJECT_ROOT/frontend/lib/utils/validation.ts" "数据验证工具"

# 示例页面
echo "=== 示例页面 ==="
check_file "$PROJECT_ROOT/frontend/app/showcase/components/page.tsx" "组件展示页面"

# 总结
echo "========================================="
if [ $ERRORS -eq 0 ]; then
    echo "✓ 所有文件创建成功！"
    echo ""
    echo "文件统计:"
    echo "  数据库文件: 3 个"
    echo "  前端组件: 3 个"
    echo "  API 路由: 3 个"
    echo "  工具函数: 2 个"
    echo "  示例页面: 1 个"
    echo "  总计: 12 个文件"
    exit 0
else
    echo "✗ 发现 $ERRORS 个错误"
    exit 1
fi
