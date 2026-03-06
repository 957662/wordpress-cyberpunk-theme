#!/bin/bash
# ============================================================================
# CyberPress Platform - 数据库文件验证脚本
# ============================================================================
# 功能：验证所有创建的数据库文件是否正确
# 版本：1.0.0
# 创建日期：2026-03-06
# ============================================================================

set -e

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "==============================================="
echo "CyberPress Platform - 数据库文件验证"
echo "==============================================="
echo ""

# 文件列表
files=(
    "scripts/01-init-database.sql"
    "scripts/02-performance-optimization.sql"
    "scripts/03-database-backup.sh"
    "scripts/04-database-monitor.sh"
    "scripts/05-data-migration.sql"
    "QUICKSTART_DATABASE.md"
)

# 检查函数
check_file() {
    local file=$1
    local base_dir="/root/.openclaw/workspace/cyberpress-platform/backend/database"

    if [ -f "${base_dir}/${file}" ]; then
        local size=$(du -h "${base_dir}/${file}" | cut -f1)
        local lines=$(wc -l < "${base_dir}/${file}")

        echo -e "${GREEN}✓${NC} ${file}"
        echo "  大小: ${size}, 行数: ${lines}"

        # 检查是否是脚本文件
        if [[ "${file}" == *.sh ]]; then
            if [ -x "${base_dir}/${file}" ]; then
                echo -e "  ${GREEN}✓${NC} 可执行权限已设置"
            else
                echo -e "  ${YELLOW}⚠${NC} 缺少可执行权限"
            fi
        fi

        return 0
    else
        echo -e "${RED}✗${NC} ${file} - 文件不存在"
        return 1
    fi
}

# 验证所有文件
echo "验证文件:"
echo "-----------------------------------"

total_files=${#files[@]}
success_count=0

cd /root/.openclaw/workspace/cyberpress-platform/backend/database

for file in "${files[@]}"; do
    if check_file "${file}"; then
        ((success_count++))
    fi
    echo ""
done

# 总结
echo "==============================================="
echo "验证结果:"
echo "-----------------------------------"
echo "总文件数: ${total_files}"
echo -e "${GREEN}成功: ${success_count}${NC}"
echo -e "${RED}失败: $((total_files - success_count))${NC}"
echo "==============================================="

if [ ${success_count} -eq ${total_files} ]; then
    echo -e "${GREEN}所有文件验证通过！${NC}"
    exit 0
else
    echo -e "${RED}部分文件验证失败！${NC}"
    exit 1
fi
