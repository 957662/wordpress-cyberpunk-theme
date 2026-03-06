#!/bin/bash

# 验证新组件创建脚本 - 2026-03-07 最终版

echo "========================================="
echo "验证新组件创建 - 2026-03-07"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total_files=0
created_files=0
missing_files=0

# 检查文件函数
check_file() {
    local file=$1
    total_files=$((total_files + 1))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
        created_files=$((created_files + 1))
        
        # 显示文件大小
        size=$(wc -l < "$file")
        echo "  代码行数: $size"
    else
        echo -e "${RED}✗${NC} $file (未找到)"
        missing_files=$((missing_files + 1))
    fi
}

echo "1. 检查组件文件"
echo "----------------"

check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/CommentSystem.tsx"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/RelatedPosts.tsx"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/ShareButtons.tsx"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/ReadingProgress.tsx"

echo ""
echo "2. 检查工具库文件"
echo "----------------"

check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/lib/blog-helpers.ts"

echo ""
echo "3. 检查类型定义文件"
echo "----------------"

check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/types/blog-components.ts"

echo ""
echo "4. 检查页面模板"
echo "----------------"

check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/app/blog/[slug]/page-template.tsx"

echo ""
echo "5. 检查索引文件"
echo "----------------"

check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/index.ts"

echo ""
echo "6. 检查文档文件"
echo "----------------"

check_file "/root/.openclaw/workspace/cyberpress-platform/NEW_COMPONENTS_GUIDE_2026-03-07.md"
check_file "/root/.openclaw/workspace/cyberpress-platform/CREATION_REPORT_2026-03-07-FINAL.md"

echo ""
echo "========================================="
echo "验证结果"
echo "========================================="
echo ""

echo -e "总计文件: ${YELLOW}$total_files${NC}"
echo -e "已创建: ${GREEN}$created_files${NC}"
echo -e "未找到: ${RED}$missing_files${NC}"
echo ""

if [ $missing_files -eq 0 ]; then
    echo -e "${GREEN}✓ 所有文件已成功创建！${NC}"
    echo ""
    echo "下一步:"
    echo "1. 查看 NEW_COMPONENTS_GUIDE_2026-03-07.md 了解如何使用"
    echo "2. 查看 CREATION_REPORT_2026-03-07-FINAL.md 了解详细信息"
    echo "3. 配置 .env.local 文件"
    echo "4. 运行开发服务器测试"
    exit 0
else
    echo -e "${RED}✗ 部分文件未找到，请检查！${NC}"
    exit 1
fi
