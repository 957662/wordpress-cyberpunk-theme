#!/bin/bash
# =====================================================
# CyberPress Database Restore Script
# =====================================================
# 用途: 从备份恢复数据库
# 使用: ./scripts/restore.sh <backup_file> [environment]
# =====================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 参数检查
if [ -z "$1" ]; then
    echo -e "${RED}错误: 请指定备份文件${NC}"
    echo "使用: ./restore.sh <backup_file> [environment]"
    echo "示例: ./restore.sh cyberpress_production_20260302_020000.sql.gz production"
    exit 1
fi

BACKUP_FILE="$1"
ENV=${2:-development}
ENV_FILE="../../.env.${ENV}"

# 检查备份文件是否存在
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}错误: 备份文件不存在: $BACKUP_FILE${NC}"
    exit 1
fi

# 加载环境变量
if [ -f "$ENV_FILE" ]; then
    source $ENV_FILE
else
    echo -e "${YELLOW}警告: 环境文件不存在: $ENV_FILE${NC}"
    echo -e "请手动输入数据库连接信息"
    read -p "数据库主机 [localhost]: " DB_HOST
    read -p "数据库端口 [3306]: " DB_PORT
    read -p "数据库名称: " DB_NAME
    read -p "数据库用户: " DB_USER
    read -sp "数据库密码: " DB_PASSWORD
    echo ""
fi

echo -e "${GREEN}=== CyberPress 数据库恢复 ===${NC}"
echo -e "环境: ${YELLOW}${ENV}${NC}"
echo -e "备份文件: ${YELLOW}${BACKUP_FILE}${NC}"
echo -e "数据库: ${YELLOW}${DB_NAME}${NC}"
echo ""

# 警告确认
echo -e "${RED}警告: 此操作将覆盖现有数据库！${NC}"
read -p "确定要继续吗? (输入 'yes' 确认): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${YELLOW}操作已取消${NC}"
    exit 0
fi

# 创建临时备份（恢复前备份当前数据库）
echo -e "${GREEN}[1/5] 创建当前数据库的临时备份...${NC}"
TEMP_BACKUP="/tmp/cyberpress_pre_restore_$(date +%Y%m%d_%H%M%S).sql.gz"
mysqldump \
    -h "${DB_HOST}" \
    -P "${DB_PORT}" \
    -u "${DB_USER}" \
    -p"${DB_PASSWORD}" \
    "${DB_NAME}" | gzip > "$TEMP_BACKUP"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 临时备份创建成功: ${TEMP_BACKUP}${NC}"
else
    echo -e "${RED}✗ 临时备份创建失败，操作中止${NC}"
    exit 1
fi

# 删除并重新创建数据库
echo -e "${GREEN}[2/5] 重置数据库...${NC}"
mysql \
    -h "${DB_HOST}" \
    -P "${DB_PORT}" \
    -u "${DB_USER}" \
    -p"${DB_PASSWORD}" \
    -e "DROP DATABASE IF EXISTS \`${DB_NAME}\`; CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo -e "${GREEN}✓ 数据库重置完成${NC}"

# 恢复数据
echo -e "${GREEN}[3/5] 恢复数据...${NC}"

# 根据文件类型解压
if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip < "$BACKUP_FILE" | mysql \
        -h "${DB_HOST}" \
        -P "${DB_PORT}" \
        -u "${DB_USER}" \
        -p"${DB_PASSWORD}" \
        "${DB_NAME}"
else
    mysql \
        -h "${DB_HOST}" \
        -P "${DB_PORT}" \
        -u "${DB_USER}" \
        -p"${DB_PASSWORD}" \
        "${DB_NAME}" < "$BACKUP_FILE"
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 数据恢复成功${NC}"
else
    echo -e "${RED}✗ 数据恢复失败${NC}"
    echo -e "${YELLOW}尝试从临时备份恢复...${NC}"
    gunzip < "$TEMP_BACKUP" | mysql \
        -h "${DB_HOST}" \
        -P "${DB_PORT}" \
        -u "${DB_USER}" \
        -p"${DB_PASSWORD}" \
        "${DB_NAME}"
    exit 1
fi

# 验证恢复
echo -e "${GREEN}[4/5] 验证恢复...${NC}"
TABLE_COUNT=$(mysql \
    -h "${DB_HOST}" \
    -P "${DB_PORT}" \
    -u "${DB_USER}" \
    -p"${DB_PASSWORD}" \
    -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='${DB_NAME}';" \
    -s -N)

if [ $TABLE_COUNT -gt 0 ]; then
    echo -e "${GREEN}✓ 验证通过: 找到 ${TABLE_COUNT} 张表${NC}"
else
    echo -e "${RED}✗ 验证失败: 数据库中没有找到表${NC}"
    exit 1
fi

# 优化表
echo -e "${GREEN}[5/5] 优化表...${NC}"
mysql \
    -h "${DB_HOST}" \
    -P "${DB_PORT}" \
    -u "${DB_USER}" \
    -p"${DB_PASSWORD}" \
    "${DB_NAME}" \
    -e "OPTIMIZE TABLE \`analytics\`, \`comments\`, \`post_meta\`, \`posts\`;"

echo -e "${GREEN}✓ 优化完成${NC}"

# 完成
echo ""
echo -e "${GREEN}=== 恢复完成 ===${NC}"
echo -e "临时备份: ${YELLOW}${TEMP_BACKUP}${NC}"
echo ""
echo -e "${YELLOW}建议操作:${NC}"
echo "  1. 验证应用程序功能"
echo "  2. 检查数据完整性"
echo "  3. 更新应用缓存"
echo "  4. 保留临时备份直到确认无误"
