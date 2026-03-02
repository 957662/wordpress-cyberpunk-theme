#!/bin/bash
# Database Restore Script
set -e

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-cyberpress}"
DB_USER="${DB_USER:-postgres}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/postgresql}"

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

if [ "$1" = "-l" ] || [ "$1" = "--list" ]; then
    log "可用的备份文件:"
    ls -lht "$BACKUP_DIR"/${DB_NAME}_*.sql.gz 2>/dev/null | awk '{print $9, $5}'
    exit 0
fi

if [ -z "$1" ]; then
    error "请指定备份文件"
    echo "用法: $0 <backup_file> | --list"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    error "备份文件不存在: $BACKUP_FILE"
    exit 1
fi

log "开始恢复数据库: $BACKUP_FILE"
log "目标数据库: $DB_NAME"

if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1; then
    error "无法连接到 PostgreSQL 服务器"
    exit 1
fi

log "正在恢复数据..."
if gunzip -c "$BACKUP_FILE" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" --quiet; then
    log "✓ 数据库恢复成功"
else
    error "数据库恢复失败"
    exit 1
fi
