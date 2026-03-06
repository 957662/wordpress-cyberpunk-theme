#!/bin/bash

# =====================================================
# CyberPress Platform - 核心文件创建验证脚本
# =====================================================

echo "====================================================="
echo "CyberPress Platform - 核心文件验证"
echo "====================================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 计数器
TOTAL_FILES=0
PASSED_FILES=0
FAILED_FILES=0

# 检查文件函数
check_file() {
    local file=$1
    local min_lines=$2
    local description=$3

    TOTAL_FILES=$((TOTAL_FILES + 1))

    if [ -f "$file" ]; then
        lines=$(wc -l < "$file")

        if [ "$lines" -ge "$min_lines" ]; then
            echo -e "${GREEN}✓ PASS${NC}: $description"
            echo -e "  文件: $file"
            echo -e "  行数: $lines"
            echo -e "  大小: $(du -h "$file" | cut -f1)"
            PASSED_FILES=$((PASSED_FILES + 1))
        else
            echo -e "${YELLOW}⚠ WARNING${NC}: $description"
            echo -e "  文件: $file"
            echo -e "  预期行数: $min_lines, 实际行数: $lines"
            FAILED_FILES=$((FAILED_FILES + 1))
        fi
    else
        echo -e "${RED}✗ FAIL${NC}: $description"
        echo -e "  文件: $file"
        echo -e "  状态: 文件不存在"
        FAILED_FILES=$((FAILED_FILES + 1))
    fi

    echo ""
}

# =====================================================
# 开始验证
# =====================================================

echo -e "${BLUE}=== 数据库文件验证 ===${NC}"
echo ""

check_file \
    "/root/.openclaw/workspace/cyberpress-platform/backend/database/schema-complete.sql" \
    700 \
    "数据库架构设计"

check_file \
    "/root/.openclaw/workspace/cyberpress-platform/backend/database/ER-DIAGRAM.md" \
    300 \
    "数据库ER图文档"

echo -e "${BLUE}=== 前端核心库验证 ===${NC}"
echo ""

check_file \
    "/root/.openclaw/workspace/cyberpress-platform/frontend/lib/auth/index.ts" \
    500 \
    "认证系统核心库"

check_file \
    "/root/.openclaw/workspace/cyberpress-platform/frontend/lib/config/site-complete.ts" \
    500 \
    "网站配置文件"

echo -e "${BLUE}=== 文档文件验证 ===${NC}"
echo ""

check_file \
    "/root/.openclaw/workspace/cyberpress-platform/CORE_FILES_CREATION_REPORT.md" \
    200 \
    "核心文件创建报告"

# =====================================================
# 统计信息
# =====================================================

echo "====================================================="
echo -e "${BLUE}验证统计${NC}"
echo "====================================================="
echo ""
echo -e "总文件数: ${BLUE}$TOTAL_FILES${NC}"
echo -e "${GREEN}通过: $PASSED_FILES${NC}"
echo -e "${RED}失败: $FAILED_FILES${NC}"
echo ""

# 计算通过率
if [ $TOTAL_FILES -gt 0 ]; then
    pass_rate=$((PASSED_FILES * 100 / TOTAL_FILES))
    echo -e "通过率: ${BLUE}${pass_rate}%${NC}"
    echo ""

    if [ $pass_rate -eq 100 ]; then
        echo -e "${GREEN}🎉 所有文件验证通过！${NC}"
        exit 0
    elif [ $pass_rate -ge 80 ]; then
        echo -e "${YELLOW}⚠ 大部分文件验证通过，但有少量问题${NC}"
        exit 1
    else
        echo -e "${RED}✗ 许多文件验证失败，请检查${NC}"
        exit 2
    fi
else
    echo -e "${RED}✗ 没有找到任何文件${NC}"
    exit 3
fi

echo ""
echo "====================================================="
echo "验证完成"
echo "====================================================="
