#!/bin/bash

# 验证后端 API 文件创建
# 日期: 2026-03-06

echo "🔍 验证后端 API 文件创建..."
echo "======================================"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

success_count=0
fail_count=0

# 检查文件函数
check_file() {
    if [ -f "$1" ]; then
        size=$(wc -c < "$1")
        echo -e "${GREEN}✓${NC} $1 ($size bytes)"
        success_count=$((success_count + 1))
    else
        echo -e "${RED}✗${NC} $1 (未找到)"
        fail_count=$((fail_count + 1))
    fi
}

echo ""
echo "📦 数据模型 (Models)"
echo "-------------------"
check_file "backend/app/models/api_key.py"
check_file "backend/app/models/content_scheduler.py"
check_file "backend/app/models/backup.py"
check_file "backend/app/models/email_marketing.py"

echo ""
echo "📋 Pydantic Schemas"
echo "-------------------"
check_file "backend/app/schemas/api_key.py"
check_file "backend/app/schemas/content_scheduler.py"
check_file "backend/app/schemas/backup.py"
check_file "backend/app/schemas/email_marketing.py"

echo ""
echo "🛣️ API 路由 (Routes)"
echo "-------------------"
check_file "backend/app/api/v1/api_keys.py"
check_file "backend/app/api/v1/content_scheduler.py"
check_file "backend/app/api/v1/backups.py"
check_file "backend/app/api/v1/email_marketing.py"

echo ""
echo "📄 文档"
echo "------"
check_file "BACKEND_API_CREATION_SUMMARY.md"

echo ""
echo "======================================"
echo "验证结果:"
echo -e "成功: ${GREEN}${success_count}${NC}"
echo -e "失败: ${RED}${fail_count}${NC}"
echo ""

if [ $fail_count -eq 0 ]; then
    echo -e "${GREEN}✅ 所有文件创建成功！${NC}"
    exit 0
else
    echo -e "${RED}❌ 有 $fail_count 个文件未创建${NC}"
    exit 1
fi
