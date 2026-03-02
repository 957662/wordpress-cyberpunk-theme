#!/bin/bash

# =====================================================
# CyberPress Database Health Check Script
# =====================================================
# Description: 检查数据库健康状况并提供修复建议
# Author: AI Database Architect
# Version: 1.0.0
# Date: 2026-03-03
# =====================================================

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 健康检查结果
HEALTH_SCORE=100
ISSUES=()
RECOMMENDATIONS=()

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
    ISSUES+=("$1")
    HEALTH_SCORE=$((HEALTH_SCORE - 5))
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
    ISSUES+=("$1")
    HEALTH_SCORE=$((HEALTH_SCORE - 10))
}

log_recommendation() {
    echo -e "${BLUE}[→]${NC} $1"
    RECOMMENDATIONS+=("$1")
}

# 加载环境变量
load_env() {
    if [ -f .env ]; then
        source .env
        log_info "已加载环境变量"
    else
        log_error ".env 文件未找到"
        exit 1
    fi
}

# 检查数据库连接
check_connection() {
    log_info "检查数据库连接..."

    if mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "SELECT 1" &> /dev/null; then
        log_success "数据库连接正常"
    else
        log_error "数据库连接失败"
        return 1
    fi
}

# 检查数据库版本
check_version() {
    log_info "检查数据库版本..."

    VERSION=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "SELECT VERSION()")

    log_success "数据库版本: $VERSION"

    # 检查是否为推荐的版本
    if [[ "$VERSION" =~ ^8\.0\. ]]; then
        log_success "使用推荐的 MySQL 8.0 版本"
    elif [[ "$VERSION" =~ ^5\.7\. ]]; then
        log_warning "MySQL 5.7 仍然可用，但建议升级到 8.0"
    else
        log_error "MySQL 版本过旧，建议升级到 8.0"
        log_recommendation "升级到 MySQL 8.0 以获得更好的性能和功能"
    fi
}

# 检查字符集
check_charset() {
    log_info "检查字符集配置..."

    CHARSET=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "
        SELECT DEFAULT_CHARACTER_SET_NAME
        FROM information_schema.SCHEMATA
        WHERE SCHEMA_NAME = '${DB_NAME}'
    ")

    if [ "$CHARSET" == "utf8mb4" ]; then
        log_success "字符集配置正确: $CHARSET"
    else
        log_warning "字符集不是 utf8mb4: $CHARSET"
        log_recommendation "将数据库字符集转换为 utf8mb4 以支持完整的 Unicode"
    fi
}

# 检查表引擎
check_engines() {
    log_info "检查存储引擎..."

    NON_INNODB=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "
        SELECT COUNT(DISTINCT ENGINE)
        FROM information_schema.tables
        WHERE table_schema = '${DB_NAME}'
          AND ENGINE != 'InnoDB'
    ")

    if [ "$NON_INNODB" -eq 0 ]; then
        log_success "所有表都使用 InnoDB 引擎"
    else
        log_warning "发现非 InnoDB 表"
        mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "
            SELECT table_name, engine, row_format
            FROM information_schema.tables
            WHERE table_schema = '${DB_NAME}'
              AND engine != 'InnoDB'
        " | column -t
        log_recommendation "将所有表转换为 InnoDB 引擎以获得更好的性能和事务支持"
    fi
}

# 检查表完整性
check_table_integrity() {
    log_info "检查表完整性..."

    CORRUPTED_TABLES=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "
        SELECT COUNT(*)
        FROM information_schema.tables
        WHERE table_schema = '${DB_NAME}'
          AND table_comment LIKE '%crashed%'
          OR table_comment LIKE '%corrupt%'
    " 2>/dev/null || echo "0")

    if [ "$CORRUPTED_TABLES" -eq 0 ]; then
        log_success "没有检测到损坏的表"
    else
        log_error "检测到 $CORRUPTED_TABLES 个损坏的表"
        log_recommendation "运行 CHECK TABLE 和 REPAIR TABLE 修复损坏的表"
    fi
}

# 检查外键约束
check_foreign_keys() {
    log_info "检查外键约束..."

    FK_COUNT=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "
        SELECT COUNT(*)
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = '${DB_NAME}'
          AND REFERENCED_TABLE_NAME IS NOT NULL
    ")

    if [ "$FK_COUNT" -gt 0 ]; then
        log_success "外键约束配置正确: $FK_COUNT 个外键"

        # 检查外键约束是否被强制
        FK_CHECKS=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "SELECT @@FOREIGN_KEY_CHECKS")
        if [ "$FK_CHECKS" -eq 1 ]; then
            log_success "外键约束已启用"
        else
            log_warning "外键约束未启用"
            log_recommendation "启用外键约束: SET FOREIGN_KEY_CHECKS=1"
        fi
    else
        log_warning "没有配置外键约束"
        log_recommendation "考虑添加外键约束以确保数据完整性"
    fi
}

# 检查索引
check_indexes() {
    log_info "检查索引状态..."

    # 检查缺失的索引（在常用查询字段上）
    log_info "检查常用查询字段的索引..."

    # 检查是否有未索引的外键
    UNINDEXED_FKS=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "
        SELECT COUNT(DISTINCT CONCAT(TABLE_NAME, '.', COLUMN_NAME))
        FROM information_schema.KEY_COLUMN_USAGE k
        WHERE k.TABLE_SCHEMA = '${DB_NAME}'
          AND k.REFERENCED_TABLE_NAME IS NOT NULL
          AND NOT EXISTS (
              SELECT 1 FROM information_schema.STATISTICS s
              WHERE s.TABLE_SCHEMA = k.TABLE_SCHEMA
                AND s.TABLE_NAME = k.TABLE_NAME
                AND s.COLUMN_NAME = k.COLUMN_NAME
                AND s.INDEX_NAME = CONCAT('idx_', k.COLUMN_NAME)
          )
    ")

    if [ "$UNINDEXED_FKS" -eq 0 ]; then
        log_success "所有外键都有索引"
    else
        log_warning "发现 $UNINDEXED_FKS 个未索引的外键"
        log_recommendation "为外键字段添加索引以提高 JOIN 性能"
    fi

    # 检查重复索引
    log_info "检查重复索引..."
    # 这里需要更复杂的查询，简化版
}

# 检查表碎片化
check_fragmentation() {
    log_info "检查表碎片化..."

    FRAGMENTED_TABLES=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "
        SELECT COUNT(*)
        FROM information_schema.tables
        WHERE table_schema = '${DB_NAME}'
          AND data_free > 0
          AND (data_free / (data_length + index_length)) > 0.05
    ")

    if [ "$FRAGMENTED_TABLES" -eq 0 ]; then
        log_success "没有严重的表碎片化"
    else
        log_warning "发现 $FRAGMENTED_TABLES 个碎片化的表"
        log_recommendation "运行 OPTIMIZE TABLE 减少碎片化"
    fi
}

# 检查慢查询配置
check_slow_query_config() {
    log_info "检查慢查询配置..."

    SLOW_QUERY_LOG=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "SHOW VARIABLES LIKE 'slow_query_log'" | awk '{print $2}')
    LONG_QUERY_TIME=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "SHOW VARIABLES LIKE 'long_query_time'" | awk '{print $2}')

    if [ "$SLOW_QUERY_LOG" == "ON" ]; then
        log_success "慢查询日志已启用 (阈值: ${LONG_QUERY_TIME}s)"
    else
        log_warning "慢查询日志未启用"
        log_recommendation "启用慢查询日志: SET GLOBAL slow_query_log = 'ON'"
    fi
}

# 检查二进制日志
check_binary_log() {
    log_info "检查二进制日志..."

    LOG_BIN=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "SHOW VARIABLES LIKE 'log_bin'" | awk '{print $2}')

    if [ "$LOG_BIN" == "ON" ]; then
        log_success "二进制日志已启用"

        # 检查日志过期时间
        EXPIRE_LOGS_DAYS=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "SHOW VARIABLES LIKE 'expire_logs_days'" | awk '{print $2}')

        if [ "$EXPIRE_LOGS_DAYS" -gt 0 ]; then
            log_success "二进制日志过期天数: $EXPIRE_LOGS_DAYS"
        else
            log_warning "未设置二进制日志过期时间"
            log_recommendation "设置二进制日志过期时间: SET GLOBAL expire_logs_days = 7"
        fi
    else
        log_warning "二进制日志未启用"
        log_recommendation "启用二进制日志以支持数据恢复和主从复制"
    fi
}

# 检查内存配置
check_memory_config() {
    log_info "检查内存配置..."

    BUFFER_POOL_SIZE=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "SHOW VARIABLES LIKE 'innodb_buffer_pool_size'" | awk '{print $2}')

    # 转换为MB
    BUFFER_POOL_MB=$((BUFFER_POOL_SIZE / 1024 / 1024))

    if [ "$BUFFER_POOL_MB" -ge 1024 ]; then
        log_success "InnoDB 缓冲池大小: ${BUFFER_POOL_MB}MB"
    else
        log_warning "InnoDB 缓冲池大小可能不足: ${BUFFER_POOL_MB}MB"
        log_recommendation "建议将 innodb_buffer_pool_size 设置为可用内存的 70-80%"
    fi
}

# 检查最大连接数
check_max_connections() {
    log_info "检查最大连接数配置..."

    MAX_CONNECTIONS=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "SHOW VARIABLES LIKE 'max_connections'" | awk '{print $2}')
    MAX_USED=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "SHOW STATUS LIKE 'Max_used_connections'" | awk '{print $2}')

    USAGE_PERCENT=$((MAX_USED * 100 / MAX_CONNECTIONS))

    log_success "最大连接数: $MAX_CONNECTIONS"
    log_success "历史最大使用: $MAX_USED ($USAGE_PERCENT%)"

    if [ "$USAGE_PERCENT" -gt 80 ]; then
        log_warning "连接数使用率较高"
        log_recommendation "考虑增加 max_connections 或优化应用连接管理"
    fi
}

# 检查表统计信息
check_table_stats() {
    log_info "检查表统计信息..."

    # 检查是否有表需要分析
    mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "
        SELECT
            table_name,
            table_rows,
            ROUND((data_length + index_length) / 1024 / 1024, 2) AS size_mb
        FROM information_schema.tables
        WHERE table_schema = '${DB_NAME}'
        ORDER BY (data_length + index_length) DESC
        LIMIT 5
    " | column -t

    log_recommendation "定期运行 ANALYZE TABLE 更新统计信息"
}

# 检查备份
check_backups() {
    log_info "检查备份配置..."

    if [ -d "../backups" ]; then
        BACKUP_COUNT=$(find ../backups -name "*.sql.gz" 2>/dev/null | wc -l)
        LATEST_BACKUP=$(find ../backups -name "*.sql.gz" -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2-)

        if [ "$BACKUP_COUNT" -gt 0 ]; then
            log_success "发现 $BACKUP_COUNT 个备份文件"

            if [ -n "$LATEST_BACKUP" ]; then
                BACKUP_AGE=$((($(date +%s) - $(stat -c %Y "$LATEST_BACKUP")) / 86400))
                log_success "最新备份: $(basename "$LATEST_BACKUP") (${BACKUP_AGE}天前)"

                if [ "$BACKUP_AGE" -gt 7 ]; then
                    log_warning "最新备份超过7天"
                    log_recommendation "设置自动备份任务，至少每天备份一次"
                fi
            fi
        else
            log_warning "未找到备份文件"
            log_recommendation "设置自动备份任务保护数据安全"
        fi
    else
        log_warning "备份目录不存在"
        log_recommendation "创建备份目录并设置自动备份任务"
    fi
}

# 生成报告
generate_health_report() {
    echo ""
    echo "======================================"
    echo "数据库健康检查报告"
    echo "======================================"
    echo "数据库: ${DB_NAME}"
    echo "检查时间: $(date)"
    echo ""

    # 显示健康分数
    if [ "$HEALTH_SCORE" -ge 90 ]; then
        echo -e "${GREEN}健康分数: ${HEALTH_SCORE}/100 (优秀)${NC}"
    elif [ "$HEALTH_SCORE" -ge 70 ]; then
        echo -e "${YELLOW}健康分数: ${HEALTH_SCORE}/100 (良好)${NC}"
    elif [ "$HEALTH_SCORE" -ge 50 ]; then
        echo -e "${YELLOW}健康分数: ${HEALTH_SCORE}/100 (一般)${NC}"
    else
        echo -e "${RED}健康分数: ${HEALTH_SCORE}/100 (需要关注)${NC}"
    fi

    echo ""

    # 显示发现的问题
    if [ "${#ISSUES[@]}" -gt 0 ]; then
        echo "======================================"
        echo "发现的问题"
        echo "======================================"
        for issue in "${ISSUES[@]}"; do
            echo "• $issue"
        done
        echo ""
    fi

    # 显示建议
    if [ "${#RECOMMENDATIONS[@]}" -gt 0 ]; then
        echo "======================================"
        echo "优化建议"
        echo "======================================"
        for recommendation in "${RECOMMENDATIONS[@]}"; do
            echo "→ $recommendation"
        done
        echo ""
    fi

    echo "======================================"
}

# 主函数
main() {
    echo "======================================"
    echo "CyberPress Database Health Check"
    echo "======================================"
    echo ""

    load_env

    if ! check_connection; then
        exit 1
    fi

    # 执行所有检查
    check_version
    check_charset
    check_engines
    check_table_integrity
    check_foreign_keys
    check_indexes
    check_fragmentation
    check_slow_query_config
    check_binary_log
    check_memory_config
    check_max_connections
    check_table_stats
    check_backups

    # 生成报告
    generate_health_report
}

# 执行主函数
main "$@"
