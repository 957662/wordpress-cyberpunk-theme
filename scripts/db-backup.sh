#!/bin/bash

# CyberPress Platform - 数据库备份脚本
# 自动备份 PostgreSQL 数据库并压缩存储

set -e

# 配置
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS=${RETENTION_DAYS:-7}
DB_NAME="${DB_NAME:-cyberpress}"
DB_USER="${DB_USER:-cyberpress}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"
LOG_FILE="${BACKUP_DIR}/backup.log"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_info() {
    log "${BLUE}[INFO]${NC} $1"
}

log_success() {
    log "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    log "${RED}[ERROR]${NC} $1"
}

log_warning() {
    log "${YELLOW}[WARNING]${NC} $1"
}

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 开始备份
log_info "开始备份数据库: $DB_NAME"

# 检查 pg_dump 是否可用
if ! command -v pg_dump &> /dev/null; then
    # 如果在 Docker 环境中
    if docker ps | grep -q "cyberpress-postgres"; then
        log_info "使用 Docker 容器进行备份..."

        # 使用 Docker 执行备份
        docker exec cyberpress-postgres pg_dump -U "$DB_USER" -d "$DB_NAME" --verbose 2>&1 | \
        tee -a "$LOG_FILE" | \
        gzip > "$BACKUP_FILE"

        if [ $? -eq 0 ]; then
            BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
            log_success "数据库备份成功: $BACKUP_FILE (大小: $BACKUP_SIZE)"
        else
            log_error "数据库备份失败"
            exit 1
        fi
    else
        log_error "pg_dump 命令不可用，且未找到 Docker 容器"
        exit 1
    fi
else
    # 直接使用 pg_dump
    log_info "使用 pg_dump 进行备份..."

    PGPASSWORD="${DB_PASSWORD:-}" pg_dump -h "$DB_HOST" -p "$DB_PORT" \
        -U "$DB_USER" -d "$DB_NAME" --verbose 2>&1 | \
    tee -a "$LOG_FILE" | \
    gzip > "$BACKUP_FILE"

    if [ $? -eq 0 ]; then
        BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
        log_success "数据库备份成功: $BACKUP_FILE (大小: $BACKUP_SIZE)"
    else
        log_error "数据库备份失败"
        exit 1
    fi
fi

# 清理旧备份
log_info "清理超过 $RETENTION_DAYS 天的旧备份..."

find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -type f -mtime +$RETENTION_DAYS -exec rm {} \;

OLD_BACKUPS=$(find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -type f | wc -l)
log_info "保留的备份数量: $OLD_BACKUPS"

# 显示备份列表
log_info "当前备份列表:"
ls -lh "$BACKUP_DIR"/${DB_NAME}_*.sql.gz 2>/dev/null | tail -10 | tee -a "$LOG_FILE"

log_success "备份流程完成"

# 如果设置了 S3 或其他远程存储，可以在这里添加上传逻辑
# 例如: aws s3 cp "$BACKUP_FILE" s3://your-bucket/backups/
