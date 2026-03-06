#!/bin/bash

# 验证本次会话创建的文件

echo "=========================================="
echo "验证文件创建 - CyberPress Platform"
echo "日期: 2026-03-07"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

success_count=0
fail_count=0

# 检查文件函数
check_file() {
    local file=$1
    local description=$2

    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description: $file"
        ((success_count++))
        return 0
    else
        echo -e "${RED}✗${NC} $description: $file"
        ((fail_count++))
        return 1
    fi
}

echo "数据库文档:"
echo "----------------------------------------"
check_file "database/schema/00-introduction.md" "数据库架构介绍"
check_file "database/docs/INDEX.md" "数据库文档索引"
echo ""

echo "WordPress 集成文档:"
echo "----------------------------------------"
check_file "frontend/lib/wordpress/README.md" "WordPress 客户端文档"
echo ""

echo "前端配置文件:"
echo "----------------------------------------"
check_file "frontend/config/site.ts" "站点配置"
check_file "frontend/lib/constants/index.ts" "常量定义"
echo ""

echo "项目文档:"
echo "----------------------------------------"
check_file "PROJECT_STATUS_REPORT.md" "项目状态报告"
check_file "FILES_CREATED_THIS_SESSION_FINAL.md" "创建文件总结"
echo ""

echo "=========================================="
echo "验证结果:"
echo "=========================================="
echo -e "成功: ${GREEN}${success_count}${NC} 个文件"
echo -e "失败: ${RED}${fail_count}${NC} 个文件"
echo ""

if [ $fail_count -eq 0 ]; then
    echo -e "${GREEN}✓ 所有文件创建成功！${NC}"
    exit 0
else
    echo -e "${RED}✗ 有 ${fail_count} 个文件创建失败${NC}"
    exit 1
fi
