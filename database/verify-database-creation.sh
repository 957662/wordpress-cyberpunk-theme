#!/bin/bash

# =====================================================
# CyberPress Platform - Database Files Verification
# 数据库文件验证脚本
# =====================================================
# Author: AI Development Team
# Created: 2026-03-07
# Version: 1.0.0
# =====================================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 计数器
total_files=0
found_files=0

# 检查文件
check_file() {
    local file=$1
    local description=$2
    total_files=$((total_files + 1))

    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description: $file"
        found_files=$((found_files + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $description: $file"
        return 1
    fi
}

# 检查目录
check_dir() {
    local dir=$1
    local description=$2
    total_files=$((total_files + 1))

    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $description: $dir"
        found_files=$((found_files + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $description: $dir"
        return 1
    fi
}

# 检查可执行权限
check_executable() {
    local file=$1
    local description=$2

    if [ -x "$file" ]; then
        echo -e "${GREEN}✓${NC} $description is executable"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $description is not executable"
        return 1
    fi
}

echo "====================================================="
echo "  CyberPress Platform - Database Files Verification"
echo "====================================================="
echo ""

# 文档文件
echo -e "${BLUE}📄 Documentation Files:${NC}"
check_file "README.md" "Database README"
check_file "schema/er-diagram.md" "ER Diagram"
check_file "schema/tables-reference.md" "Tables Reference"
echo ""

# 架构文件
echo -e "${BLUE}🗄️  Schema Files:${NC}"
check_file "schema/postgres-schema.sql" "PostgreSQL Schema"
echo ""

# 脚本文件
echo -e "${BLUE}🔧 Script Files:${NC}"
check_file "scripts/init-database.sh" "Database Initialization Script"
check_file "scripts/backup-database.sh" "Database Backup Script"
check_file "scripts/monitor-database.sh" "Database Monitoring Script"
echo ""

# 工具文件
echo -e "${BLUE}🛠️  Utility Files:${NC}"
check_file "tools/db-utils.sh" "Database Utilities"
check_file "tools/seed-data.sql" "Seed Data"
echo ""

# 配置文件
echo -e "${BLUE}⚙️  Configuration Files:${NC}"
check_file "docker-compose.db.yml" "Docker Compose Configuration"
echo ""

# 检查可执行权限
echo -e "${BLUE}🔐 Executable Permissions:${NC}"
check_executable "scripts/init-database.sh" "Init Script"
check_executable "scripts/backup-database.sh" "Backup Script"
check_executable "scripts/monitor-database.sh" "Monitor Script"
check_executable "tools/db-utils.sh" "Utils Script"
echo ""

# 目录结构
echo -e "${BLUE}📁 Directory Structure:${NC}"
check_dir "schema" "Schema Directory"
check_dir "scripts" "Scripts Directory"
check_dir "tools" "Tools Directory"
echo ""

# 文件统计
echo "====================================================="
echo -e "${BLUE}📊 Statistics:${NC}"
echo "  Total files checked: $total_files"
echo -e "  Files found: ${GREEN}$found_files${NC}"
echo -e "  Files missing: ${RED}$((total_files - found_files))${NC}"
echo "====================================================="
echo ""

# 最终结果
if [ $found_files -eq $total_files ]; then
    echo -e "${GREEN}✓ All database files created successfully!${NC}"
    echo ""
    echo "📚 Quick Start:"
    echo "  1. Initialize database:"
    echo "     cd database"
    echo "     ./scripts/init-database.sh"
    echo ""
    echo "  2. Or use Docker:"
    echo "     cd database"
    echo "     docker-compose -f docker-compose.db.yml up -d"
    echo ""
    echo "  3. Load seed data:"
    echo "     psql -U postgres -d cyberpress_db -f tools/seed-data.sql"
    echo ""
    echo "  4. Use database tools:"
    echo "     ./tools/db-utils.sh status"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some files are missing!${NC}"
    exit 1
fi
