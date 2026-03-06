# CyberPress Platform - 数据库备份与恢复策略

## 📋 目录
- [备份策略](#备份策略)
- [备份脚本](#备份脚本)
- [恢复策略](#恢复策略)
- [灾难恢复](#灾难恢复)
- [监控与告警](#监控与告警)

---

## 备份策略

### 备份类型

#### 1. 完整备份（Full Backup）
```bash
# 每天执行一次完整备份
pg_dump -h localhost -U cyberpress_user -d cyberpress_db \
    -F c -f "cyberpress_full_$(date +%Y%m%d).backup"
```

#### 2. 增量备份（Incremental Backup）
```bash
# 使用 WAL 归档实现增量备份
# 配置 postgresql.conf:
wal_level = replica
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/wal_archive/%f'
```

#### 3. 逻辑备份（Logical Backup）
```sql
-- 导出特定表
pg_dump -h localhost -U cyberpress_user -d cyberpress_db \
    -t posts -t users -f "cyberpress_tables_$(date +%Y%m%d).sql"

-- 只导出schema
pg_dump -h localhost -U cyberpress_user -d cyberpress_db \
    --schema-only -f "cyberpress_schema_$(date +%Y%m%d).sql"
```

### 备份频率

| 数据类型 | 备份频率 | 保留期限 |
|---------|---------|---------|
| 完整备份 | 每天 02:00 | 7天 |
| 增量备份 | 每小时 | 24小时 |
| WAL日志 | 持续 | 7天 |
| Schema备份 | 每周 | 30天 |

---

## 备份脚本

### 自动备份脚本

```bash
#!/bin/bash
# File: /usr/local/bin/backup-cyberpress.sh
# Description: CyberPress 数据库自动备份脚本

# 配置
DB_NAME="cyberpress_db"
DB_USER="cyberpress_user"
DB_HOST="localhost"
BACKUP_DIR="/var/backups/postgresql"
LOG_FILE="/var/log/postgresql/backup.log"
RETENTION_DAYS=7

# 创建备份目录
mkdir -p "$BACKUP_DIR/daily"
mkdir -p "$BACKUP_DIR/hourly"
mkdir -p "$BACKUP_DIR/wal"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 完整备份
full_backup() {
    log "开始完整备份..."

    local filename="${DB_NAME}_full_$(date +%Y%m%d_%H%M%S).backup"
    local filepath="${BACKUP_DIR}/daily/${filename}"

    # 执行备份
    pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" \
        -F c -f "$filepath" 2>&1 | tee -a "$LOG_FILE"

    if [ $? -eq 0 ]; then
        log "完整备份成功: $filename"

        # 压缩备份
        gzip "$filepath"
        log "备份已压缩: ${filepath}.gz"

        # 计算校验和
        sha256sum "${filepath}.gz" > "${filepath}.gz.sha256"
        log "校验和已生成"
    else
        log "完整备份失败!"
        return 1
    fi
}

# Schema备份
schema_backup() {
    log "开始Schema备份..."

    local filename="${DB_NAME}_schema_$(date +%Y%m%d).sql"
    local filepath="${BACKUP_DIR}/weekly/${filename}"

    pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" \
        --schema-only -f "$filepath" 2>&1 | tee -a "$LOG_FILE"

    if [ $? -eq 0 ]; then
        gzip "$filepath"
        log "Schema备份成功"
    else
        log "Schema备份失败!"
        return 1
    fi
}

# 清理过期备份
cleanup_old_backups() {
    log "清理过期备份（超过 ${RETENTION_DAYS} 天）..."

    # 删除过期的完整备份
    find "${BACKUP_DIR}/daily" -name "*.backup.gz" -mtime +${RETENTION_DAYS} -delete
    find "${BACKUP_DIR}/daily" -name "*.sha256" -mtime +${RETENTION_DAYS} -delete

    # 删除过期的增量备份
    find "${BACKUP_DIR}/hourly" -name "*.backup.gz" -mtime +1 -delete

    log "清理完成"
}

# 验证备份
verify_backup() {
    local backup_file="$1"

    log "验证备份: $backup_file"

    # 验证校验和
    if [ -f "${backup_file}.sha256" ]; then
        sha256sum -c "${backup_file}.sha256" >> "$LOG_FILE" 2>&1

        if [ $? -eq 0 ]; then
            log "校验和验证通过"
            return 0
        else
            log "校验和验证失败!"
            return 1
        fi
    else
        log "校验和文件不存在，跳过验证"
        return 0
    fi
}

# 上传到远程存储
upload_to_remote() {
    log "上传备份到远程存储..."

    # 使用 rclone 上传到云存储
    # rclone copy "${BACKUP_DIR}" remote:cyberpress-backups/ \
    #     --include "*.gz" --include "*.sha256" \
    #     >> "$LOG_FILE" 2>&1

    log "远程上传完成"
}

# 发送通知
send_notification() {
    local status="$1"
    local message="$2"

    # 发送邮件通知
    # echo "$message" | mail -s "CyberPress 备份${status}" admin@cyberpress.dev

    # 或使用 Slack 通知
    # curl -X POST -H 'Content-type: application/json' \
    #     --data "{\"text\":\"CyberPress 备份${status}: ${message}\"}" \
    #     YOUR_SLACK_WEBHOOK_URL

    log "通知已发送: $status"
}

# 主函数
main() {
    log "=========================================="
    log "开始备份流程"

    # 执行完整备份
    if full_backup; then
        send_notification "成功" "完整备份完成"
    else
        send_notification "失败" "完整备份失败"
        exit 1
    fi

    # 验证备份
    # verify_backup "${BACKUP_DIR}/daily/${DB_NAME}_full_$(date +%Y%m%d)*.backup.gz"

    # 上传到远程
    # upload_to_remote

    # 清理旧备份
    cleanup_old_backups

    log "备份流程完成"
    log "=========================================="
}

# 执行备份
main
```

### Cron 配置

```bash
# /etc/cron.d/cyberpress-backup

# 每天凌晨 2 点执行完整备份
0 2 * * * postgres /usr/local/bin/backup-cyberpress.sh

# 每小时执行增量备份（WAL归档）
0 * * * * postgres /usr/local/bin/backup-wal.sh

# 每周日凌晨 3 点执行 Schema 备份
0 3 * * 0 postgres /usr/local/bin/backup-schema.sh

# 每天凌晨 4 点清理过期备份
0 4 * * * postgres /usr/local/bin/cleanup-backups.sh
```

---

## 恢复策略

### 恢复脚本

```bash
#!/bin/bash
# File: /usr/local/bin/restore-cyberpress.sh
# Description: CyberPress 数据库恢复脚本

# 配置
DB_NAME="cyberpress_db"
DB_USER="cyberpress_user"
DB_HOST="localhost"
BACKUP_DIR="/var/backups/postgresql"
LOG_FILE="/var/log/postgresql/restore.log"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 列出可用备份
list_backups() {
    log "可用的备份文件:"
    ls -lh "${BACKUP_DIR}/daily/"*.backup.gz 2>/dev/null || log "没有找到备份文件"
}

# 从完整备份恢复
restore_full() {
    local backup_file="$1"

    log "开始从完整备份恢复: $backup_file"

    # 检查备份文件
    if [ ! -f "$backup_file" ]; then
        log "备份文件不存在: $backup_file"
        return 1
    fi

    # 解压备份
    local temp_file="${backup_file}.temp"
    gunzip -c "$backup_file" > "$temp_file"

    # 停止应用连接
    log "停止应用..."
    # systemctl stop cyberpress-backend

    # 删除现有数据库（可选）
    # dropdb -h "$DB_HOST" -U "$DB_USER" "$DB_NAME"

    # 创建新数据库
    # createdb -h "$DB_HOST" -U "$DB_USER" "$DB_NAME"

    # 恢复数据
    log "恢复数据中..."
    pg_restore -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" \
        -j 4 --clean --if-exists "$temp_file" 2>&1 | tee -a "$LOG_FILE"

    if [ $? -eq 0 ]; then
        log "数据恢复成功"

        # 分析表以优化查询
        psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "ANALYZE;" >> "$LOG_FILE" 2>&1

        # 重启应用
        log "重启应用..."
        # systemctl start cyberpress-backend

        # 清理临时文件
        rm -f "$temp_file"

        return 0
    else
        log "数据恢复失败!"

        # 清理临时文件
        rm -f "$temp_file"

        return 1
    fi
}

# 恢复到特定时间点（PITR）
restore_pitr() {
    local target_time="$1"  # 格式: "2024-01-15 14:30:00"

    log "开始恢复到时间点: $target_time"

    # 1. 恢复基础备份
    local base_backup="${BACKUP_DIR}/daily/${DB_NAME}_full_20240115.backup.gz"
    restore_full "$base_backup"

    # 2. 创建 recovery.conf
    cat > /var/lib/postgresql/data/recovery.conf <<EOF
restore_command = 'cp /var/lib/postgresql/wal_archive/%f %p'
recovery_target_time = '$target_time'
recovery_target_action = 'promote'
EOF

    # 3. 重启 PostgreSQL
    systemctl restart postgresql

    log "时间点恢复完成"
}

# 验证恢复的数据
verify_restore() {
    log "验证恢复的数据..."

    # 检查表数量
    local table_count=$(psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" \
        -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")

    log "表数量: $table_count"

    # 检查关键表的数据
    local user_count=$(psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" \
        -t -c "SELECT COUNT(*) FROM users;")
    local post_count=$(psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" \
        -t -c "SELECT COUNT(*) FROM posts;")

    log "用户数量: $user_count"
    log "文章数量: $post_count"

    if [ "$table_count" -gt 0 ] && [ "$user_count" -gt 0 ]; then
        log "数据验证成功"
        return 0
    else
        log "数据验证失败!"
        return 1
    fi
}

# 主函数
main() {
    if [ $# -eq 0 ]; then
        echo "用法: $0 <backup_file> | list | pitr <timestamp>"
        exit 1
    fi

    case "$1" in
        list)
            list_backups
            ;;
        pitr)
            if [ -z "$2" ]; then
                echo "请指定目标时间"
                exit 1
            fi
            restore_pitr "$2"
            ;;
        *)
            restore_full "$1"
            verify_restore
            ;;
    esac
}

# 执行恢复
main "$@"
```

---

## 灾难恢复

### 灾难恢复计划

#### 场景 1: 数据库服务器故障

```bash
# 1. 在新服务器上安装 PostgreSQL
apt-get install postgresql-15

# 2. 配置 PostgreSQL
# /etc/postgresql/15/main/postgresql.conf
# 修改监听地址和端口

# 3. 创建数据库和用户
createdb cyberpress_db
createuser -P cyberpress_user

# 4. 从最新备份恢复
/usr/local/bin/restore-cyberpress.sh /path/to/latest/backup

# 5. 更新应用配置
# 更新 .env 文件中的数据库连接信息

# 6. 重启应用
systemctl restart cyberpress-backend
```

#### 场景 2: 数据损坏

```bash
# 1. 立即停止应用
systemctl stop cyberpress-backend

# 2. 备份当前数据（用于分析）
pg_dump -h localhost -U cyberpress_user -d cyberpress_db \
    -f /tmp/corrupted_data.sql

# 3. 从干净备份恢复
/usr/local/bin/restore-cyberpress.sh /path/to/last_known_good_backup

# 4. 验证数据
/usr/local/bin/verify-restore.sh

# 5. 重启应用
systemctl start cyberpress-backend
```

#### 场景 3: 误删除数据

```sql
-- 1. 立即停止应用
-- systemctl stop cyberpress-backend

-- 2. 使用时间点恢复
-- 恢复到删除操作之前的时间点

-- 3. 创建 recovery.conf
restore_command = 'cp /var/lib/postgresql/wal_archive/%f %p'
recovery_target_time = '2024-01-15 14:25:00'  -- 删除操作之前
recovery_target_action = 'promote'

-- 4. 重启 PostgreSQL
-- systemctl restart postgresql

-- 5. 验证数据
SELECT COUNT(*) FROM posts;  -- 确认数据已恢复
```

---

## 监控与告警

### 备份监控

```sql
-- 创建备份监控表
CREATE TABLE backup_monitor (
    id SERIAL PRIMARY KEY,
    backup_type VARCHAR(50) NOT NULL,
    backup_file TEXT NOT NULL,
    backup_size BIGINT,
    backup_time TIMESTAMP NOT NULL,
    restore_time TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    checksum VARCHAR(64),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入备份记录
INSERT INTO backup_monitor (backup_type, backup_file, backup_size, backup_time, status, checksum)
VALUES (
    'full',
    '/var/backups/postgresql/daily/cyberpress_full_20240115.backup.gz',
    123456789,
    NOW(),
    'success',
    'abc123...'
);

-- 查询最近的备份
SELECT
    backup_type,
    backup_file,
    pg_size_pretty(backup_size) as size,
    backup_time,
    status,
    verified
FROM backup_monitor
ORDER BY backup_time DESC
LIMIT 10;
```

### 备份告警脚本

```bash
#!/bin/bash
# File: /usr/local/bin/check-backup.sh
# Description: 检查备份状态并发送告警

# 配置
BACKUP_DIR="/var/backups/postgresql"
MAX_AGE_HOURS=24
ADMIN_EMAIL="admin@cyberpress.dev"

# 检查最新备份
latest_backup=$(ls -t "${BACKUP_DIR}/daily/"*.backup.gz 2>/dev/null | head -1)

if [ -z "$latest_backup" ]; then
    echo "没有找到备份文件!" | mail -s "CyberPress 备份告警" "$ADMIN_EMAIL"
    exit 1
fi

# 检查备份年龄
backup_age=$(find "$latest_backup" -mmin +$((MAX_AGE_HOURS * 60)))

if [ -n "$backup_age" ]; then
    message="最新备份超过 ${MAX_AGE_HOURS} 小时: $(basename $latest_backup)"
    echo "$message" | mail -s "CyberPress 备份告警" "$ADMIN_EMAIL"
    exit 1
fi

# 检查备份大小
backup_size=$(stat -f%z "$latest_backup" 2>/dev/null || stat -c%s "$latest_backup")
min_size=1048576  # 1MB

if [ "$backup_size" -lt "$min_size" ]; then
    message="备份文件太小: $(basename $latest_backup) - $(numfmt --to=iec $backup_size)"
    echo "$message" | mail -s "CyberPress 备份告警" "$ADMIN_EMAIL"
    exit 1
fi

# 验证校验和
if [ -f "${latest_backup}.sha256" ]; then
    sha256sum -c "${latest_backup}.sha256" > /dev/null 2>&1

    if [ $? -ne 0 ]; then
        message="备份校验和不匹配: $(basename $latest_backup)"
        echo "$message" | mail -s "CyberPress 备份告警" "$ADMIN_EMAIL"
        exit 1
    fi
fi

echo "备份检查通过: $(basename $latest_backup)"
exit 0
```

### Cron 监控

```bash
# /etc/cron.d/cyberpress-monitor

# 每 6 小时检查一次备份
0 */6 * * * postgres /usr/local/bin/check-backup.sh

# 每天检查磁盘空间
0 8 * * * postgres /usr/local/bin/check-disk-space.sh

# 每天检查数据库大小
0 9 * * * postgres /usr/local/bin/check-db-size.sh
```

---

## 最佳实践

### 1. 3-2-1 备份原则

```
3 - 保留 3 份备份副本
2 - 使用 2 种不同的存储介质
1 - 至少 1 份异地备份

示例:
- 本地备份（服务器硬盘）
- 网络备份（NAS/SAN）
- 云备份（AWS S3/Azure Blob）
```

### 2. 备份加密

```bash
# 使用 GPG 加密备份
pg_dump -h localhost -U cyberpress_user -d cyberpress_db \
    | gzip \
    | gpg --encrypt --recipient admin@cyberpress.dev \
    > "${BACKUP_DIR}/cyberpress_encrypted_$(date +%Y%m%d).backup.gz.gpg"

# 解密
gpg --decrypt cyberpress_encrypted.backup.gz.gpg | gunzip | pg_restore -d cyberpress_db
```

### 3. 自动化测试

```bash
#!/bin/bash
# File: /usr/local/bin/test-restore.sh
# Description: 定期测试备份恢复

# 创建测试数据库
createdb cyberpress_test_restore

# 恢复最新备份到测试数据库
pg_restore -h localhost -U cyberpress_user -d cyberpress_test_restore \
    /path/to/latest/backup

# 运行验证脚本
psql -h localhost -U cyberpress_user -d cyberpress_test_restore \
    -f /usr/local/bin/verify-data.sql

# 清理测试数据库
dropdb cyberpress_test_restore

echo "恢复测试完成"
```

### 4. 文档记录

维护详细的备份恢复文档：

```
📁 备份恢复文档/
├── backup-policy.md           # 备份策略
├── restore-procedure.md       # 恢复流程
├── disaster-recovery.md       # 灾难恢复计划
├── backup-schedule.md         # 备份时间表
└── incident-response.md       # 事故响应流程
```

---

## 总结

数据备份和恢复是数据库运维的关键环节：

1. **定期备份**: 按照策略定期执行备份
2. **验证备份**: 定期验证备份的完整性
3. **测试恢复**: 定期测试恢复流程
4. **异地存储**: 保留一份异地备份
5. **加密保护**: 敏感数据备份加密
6. **监控告警**: 实时监控备份状态
7. **文档完善**: 详细记录恢复流程

记住：没有经过恢复测试的备份，只是虚假的安全感！
