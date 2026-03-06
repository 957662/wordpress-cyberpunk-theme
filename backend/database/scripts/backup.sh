#!/bin/bash

# ============================================
# CyberPress Database Backup Script
# ============================================

set -e

# Configuration from environment
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-cyberpress_db}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"
BACKUP_DIR="/backups"
RETENTION_DAYS=${RETENTION_DAYS:-7}

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to create backup
create_backup() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/${DB_NAME}_backup_${timestamp}.dump"
    local backup_log="$BACKUP_DIR/backup_${timestamp}.log"

    log "Starting backup: $backup_file"

    # Create backup
    PGPASSWORD="$DB_PASSWORD" pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -F c \
        -d "$DB_NAME" \
        -f "$backup_file" \
        2>&1 | tee "$backup_log"

    # Compress backup
    gzip "$backup_file"
    local compressed_file="${backup_file}.gz"

    # Get file size
    local size=$(du -h "$compressed_file" | cut -f1)

    log "Backup completed: $compressed_file (Size: $size)"

    # Clean up old backups
    clean_old_backups

    return 0
}

# Function to clean old backups
clean_old_backups() {
    log "Cleaning backups older than $RETENTION_DAYS days..."

    find "$BACKUP_DIR" \
        -name "${DB_NAME}_backup_*.dump.gz" \
        -mtime +$RETENTION_DAYS \
        -delete

    log "Old backups cleaned up."
}

# Main execution
log "=== Backup Process Started ==="

if create_backup; then
    log "=== Backup Process Completed Successfully ==="
    exit 0
else
    log "=== Backup Process Failed ==="
    exit 1
fi
