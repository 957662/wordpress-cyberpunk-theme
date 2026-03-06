#!/bin/bash

# ====================================================================
# CyberPress Platform - 数据库架构验证脚本
# ====================================================================
# 验证所有数据库架构文件是否正确创建
# ====================================================================

echo "🔍 CyberPress Platform - 数据库架构验证"
echo "========================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total_files=0
created_files=0
missing_files=0

# 检查文件是否存在
check_file() {
    local file=$1
    total_files=$((total_files + 1))

    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
        created_files=$((created_files + 1))
    else
        echo -e "${RED}❌${NC} $file (缺失)"
        missing_files=$((missing_files + 1))
    fi
}

echo "📄 核心文档文件"
echo "----------------"

# 检查文档文件
check_file "database/docs/ER_DIAGRAM.md"
check_file "database/docs/TABLE_DEFINITIONS.md"
check_file "database/docs/INDEX_DESIGN.md"
check_file "database/docs/QUERY_OPTIMIZATION.md"
check_file "database/docs/MIGRATION_GUIDE.md"
check_file "database/docs/QUICKSTART.md"
check_file "database/docs/DATABASE_COMPARISON.md"
check_file "database/docs/DELIVERY_SUMMARY.md"

echo ""
echo "🗄️ 数据库脚本文件"
echo "----------------"

# 检查脚本文件
check_file "database/schema/01-init-database.sql"
check_file "database/schema/01-init-database-postgres.sql"
check_file "database/migrations/002_add_indexes.sql"

echo ""
echo "📊 验证结果"
echo "===================="
echo -e "总文件数: ${YELLOW}$total_files${NC}"
echo -e "已创建: ${GREEN}$created_files${NC}"
echo -e "缺失: ${RED}$missing_files${NC}"
echo ""

# 计算完成率
if [ $total_files -gt 0 ]; then
    completion_rate=$((created_files * 100 / total_files))
    echo -e "完成率: ${YELLOW}${completion_rate}%${NC}"
fi

echo ""
echo "📋 文件详情"
echo "===================="

# 显示文件大小
if [ -f "database/docs/ER_DIAGRAM.md" ]; then
    size=$(wc -c < "database/docs/ER_DIAGRAM.md" | tr -d ' ')
    echo "ER_DIAGRAM.md: $size bytes"
fi

if [ -f "database/docs/TABLE_DEFINITIONS.md" ]; then
    size=$(wc -c < "database/docs/TABLE_DEFINITIONS.md" | tr -d ' ')
    echo "TABLE_DEFINITIONS.md: $size bytes"
fi

if [ -f "database/schema/01-init-database.sql" ]; then
    size=$(wc -c < "database/schema/01-init-database.sql" | tr -d ' ')
    lines=$(wc -l < "database/schema/01-init-database.sql" | tr -d ' ')
    echo "01-init-database.sql: $size bytes, $lines lines"
fi

if [ -f "database/schema/01-init-database-postgres.sql" ]; then
    size=$(wc -c < "database/schema/01-init-database-postgres.sql" | tr -d ' ')
    lines=$(wc -l < "database/schema/01-init-database-postgres.sql" | tr -d ' ')
    echo "01-init-database-postgres.sql: $size bytes, $lines lines"
fi

echo ""
echo "✅ 验证完成！"
echo ""
echo "下一步:"
echo "1. 查看文档: cd database/docs && ls -la"
echo "2. 初始化数据库: psql -U postgres -d cyberpress -f schema/01-init-database-postgres.sql"
echo "3. 阅读快速入门: cat docs/QUICKSTART.md"
