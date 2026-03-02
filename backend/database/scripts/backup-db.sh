#!/bin/bash
# =====================================================
# CyberPress Platform - Database Backup Script
# 数据库备份脚本
# =====================================================
# Author: AI Database Architect
# Created: 2026-03-03
# =====================================================

set -e

# 配置变量
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-cyberpress}"
DB_USER="${DB_USER:-postgres}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/postgresql}"
RETENTION_DAYS=${RETENTION_DAYS:-30}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"
LOG_FILE="${BACKUP_DIR}/backup.log"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

# 创建备份目录
mkdir -p "$BACKUP_DIR"

log "开始数据库备份..."
log "数据库: $DB_NAME"
log "主机: $DB_HOST:$DB_PORT"

# 检查 PostgreSQL 是否运行
if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1; then
    error "无法连接到 PostgreSQL 服务器"
    exit 1
fi

# 执行备份
log "正在执行备份..."
if pg_dump -h "$DB_HOST" \
           -p "$DB_PORT" \
           -U "$DB_USER" \
           -d "$DB_NAME" \
           --verbose \
           --no-owner \
           --no-acl \
           --format=plain \
           2>&1 | gzip > "$BACKUP_FILE"; then
    log "备份成功: $BACKUP_FILE"
    
    # 获取备份文件大小
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log "备份文件大小: $BACKUP_SIZE"
else
    error "备份失败"
    exit 1
fi

# 验证备份文件
if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
    log "备份文件验证成功"
else
    error "备份文件为空或不存在"
    exit 1
fi

# 清理旧备份
log "清理 $RETENTION_DAYS 天前的旧备份..."
find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
OLD_COUNT=$(find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -type f | wc -l)
log "当前保留的备份数量: $OLD_COUNT"

# 列出所有备份
log "所有备份文件:"
ls -lh "$BACKUP_DIR"/${DB_NAME}_*.sql.gz | awk '{print $9, $5}'

# 发送通知（如果配置了 Slack 或其他通知服务）
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
         --data "{\"text\":\"✅ 数据库备份成功: $BACKUP_FILE ($BACKUP_SIZE)\"}" \
         "$SLACK_WEBHOOK_URL" 2>/dev/null || true
fi

log "备份完成！"
