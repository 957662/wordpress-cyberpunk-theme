#!/bin/bash
# =====================================================
# CyberPress Database Backup Script
# =====================================================
# 用途: 自动备份数据库
# 使用: ./scripts/backup.sh [environment]
# =====================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 加载环境变量
ENV=${1:-development}
ENV_FILE="../../.env.${ENV}"

if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}错误: 环境文件不存在: $ENV_FILE${NC}"
    exit 1
fi

source $ENV_FILE

# 配置
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="${BACKUP_DIR:-/var/backups/cyberpress}"
BACKUP_NAME="cyberpress_${ENV}_${TIMESTAMP}"
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-7}

# 创建备份目录
mkdir -p "$BACKUP_DIR"

echo -e "${GREEN}=== CyberPress 数据库备份 ===${NC}"
echo -e "环境: ${YELLOW}${ENV}${NC}"
echo -e "时间: $(date)"
echo ""

# 1. 全量备份
echo -e "${GREEN}[1/4] 创建全量备份...${NC}"
mysqldump \
    -h "${DB_HOST}" \
    -P "${DB_PORT}" \
    -u "${DB_USER}" \
    -p"${DB_PASSWORD}" \
    --single-transaction \
    --quick \
    --lock-tables=false \
    --routines \
    --triggers \
    --events \
    "${DB_NAME}" | gzip > "${BACKUP_DIR}/${BACKUP_NAME}.sql.gz"

if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_NAME}.sql.gz" | cut -f1)
    echo -e "${GREEN}✓ 全量备份完成: ${BACKUP_NAME}.sql.gz (${BACKUP_SIZE})${NC}"
else
    echo -e "${RED}✗ 全量备份失败${NC}"
    exit 1
fi

# 2. 仅结构备份
echo -e "${GREEN}[2/4] 创建结构备份...${NC}"
mysqldump \
    -h "${DB_HOST}" \
    -P "${DB_PORT}" \
    -u "${DB_USER}" \
    -p"${DB_PASSWORD}" \
    --no-data \
    "${DB_NAME}" | gzip > "${BACKUP_DIR}/${BACKUP_NAME}_schema.sql.gz"

echo -e "${GREEN}✓ 结构备份完成${NC}"

# 3. 仅数据备份
echo -e "${GREEN}[3/4] 创建数据备份...${NC}"
mysqldump \
    -h "${DB_HOST}" \
    -P "${DB_PORT}" \
    -u "${DB_USER}" \
    -p"${DB_PASSWORD}" \
    --no-create-info \
    --skip-triggers \
    "${DB_NAME}" | gzip > "${BACKUP_DIR}/${BACKUP_NAME}_data.sql.gz"

echo -e "${GREEN}✓ 数据备份完成${NC}"

# 4. 清理旧备份
echo -e "${GREEN}[4/4] 清理旧备份...${NC}"
DELETED=$(find "$BACKUP_DIR" -name "cyberpress_${ENV}_*.sql.gz" -mtime +${RETENTION_DAYS} -delete -print | wc -l)
echo -e "${GREEN}✓ 清理完成: 删除了 ${DELETED} 个旧备份${NC}"

# 5. 生成备份报告
REPORT_FILE="${BACKUP_DIR}/${BACKUP_NAME}_report.txt"
cat > "$REPORT_FILE" << EOF
========================================
CyberPress 数据库备份报告
========================================
环境: ${ENV}
备份时间: $(date)
备份名称: ${BACKUP_NAME}
备份大小: ${BACKUP_SIZE}
保留期限: ${RETENTION_DAYS} 天

备份文件:
- $(basename ${BACKUP_DIR}/${BACKUP_NAME}.sql.gz)
- $(basename ${BACKUP_DIR}/${BACKUP_NAME}_schema.sql.gz)
- $(basename ${BACKUP_DIR}/${BACKUP_NAME}_data.sql.gz)

数据库信息:
- 主机: ${DB_HOST}:${DB_PORT}
- 数据库: ${DB_NAME}
- 用户: ${DB_USER}

========================================
生成时间: $(date)
========================================
EOF

echo ""
echo -e "${GREEN}=== 备份完成 ===${NC}"
echo -e "报告文件: ${YELLOW}${REPORT_FILE}${NC}"
echo -e "备份目录: ${YELLOW}${BACKUP_DIR}${NC}"

# 发送通知（可选）
if [ ! -z "$WEBHOOK_URL" ]; then
    curl -X POST "$WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "{\"text\":\"✅ 数据库备份完成: ${BACKUP_NAME}\"}"
fi
