#!/bin/bash
# ============================================================================
# CyberPress Platform - PostgreSQL 数据库备份脚本
# ============================================================================
# 功能：自动备份数据库，支持完整备份、增量备份和压缩
# 版本：1.0.0
# 创建日期：2026-03-06
# ============================================================================

set -e  # 遇到错误立即退出

# ============================================================================
# 配置参数
# ============================================================================

# 数据库配置
DB_NAME="${DB_NAME:-cyberpress}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

# 备份配置
BACKUP_DIR="${BACKUP_DIR:-/var/backups/postgresql}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="cyberpress_${TIMESTAMP}"
LOG_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.log"

# 保留策略
DAYS_TO_KEEP=${DAYS_TO_KEEP:-7}  # 保留最近7天的备份
WEEKLY_TO_KEEP=${WEEKLY_TO_KEEP:-4}  # 保留最近4周的周备份
MONTHLY_TO_KEEP=${MONTHLY_TO_KEEP:-12}  # 保留最近12个月的月备份

# 其他配置
COMPRESS=${COMPRESS:-true}  # 是否压缩备份
COMPRESSION_LEVEL=${COMPRESSION_LEVEL:-6}  # 压缩级别 (1-9)
PARALLEL_JOBS=${PARALLEL_JOBS:-4}  # 并行任务数

# ============================================================================
# 颜色输出
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# 日志函数
# ============================================================================

log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[${timestamp}] [${level}] ${message}" | tee -a "${LOG_FILE}"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $@" | tee -a "${LOG_FILE}"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $@" | tee -a "${LOG_FILE}"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $@" | tee -a "${LOG_FILE}"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $@" | tee -a "${LOG_FILE}"
}

# ============================================================================
# 检查函数
# ============================================================================

check_dependencies() {
    log_info "检查依赖..."

    # 检查 pg_dump
    if ! command -v pg_dump &> /dev/null; then
        log_error "pg_dump 未找到，请安装 PostgreSQL 客户端工具"
        exit 1
    fi

    # 检查 psql
    if ! command -v psql &> /dev/null; then
        log_error "psql 未找到，请安装 PostgreSQL 客户端工具"
        exit 1
    fi

    # 检查 gzip（如果需要压缩）
    if [ "$COMPRESS" = "true" ]; then
        if ! command -v gzip &> /dev/null; then
            log_error "gzip 未找到，请安装 gzip"
            exit 1
        fi
    fi

    log_success "依赖检查完成"
}

check_db_connection() {
    log_info "检查数据库连接..."

    if PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -c '\q' 2>/dev/null; then
        log_success "数据库连接正常"
        return 0
    else
        log_error "无法连接到数据库"
        log_error "请检查数据库配置和连接参数"
        exit 1
    fi
}

create_backup_dir() {
    if [ ! -d "${BACKUP_DIR}" ]; then
        log_info "创建备份目录: ${BACKUP_DIR}"
        mkdir -p "${BACKUP_DIR}"
    fi

    # 创建子目录
    mkdir -p "${BACKUP_DIR}/daily"
    mkdir -p "${BACKUP_DIR}/weekly"
    mkdir -p "${BACKUP_DIR}/monthly"
    mkdir -p "${BACKUP_DIR}/logs"
}

# ============================================================================
# 备份函数
# ============================================================================

backup_database() {
    local backup_type=$1
    local backup_file="${BACKUP_DIR}/${backup_type}/${BACKUP_NAME}.sql"

    log_info "开始备份数据库: ${DB_NAME}"
    log_info "备份文件: ${backup_file}"

    local pg_dump_opts=(
        -h "${DB_HOST}"
        -p "${DB_PORT}"
        -U "${DB_USER}"
        -d "${DB_NAME}"
        --verbose
        --no-owner
        --no-acl
        --format=plain
        --encoding=UTF8
    )

    # 添加并行选项
    if [ "${PARALLEL_JOBS}" -gt 1 ]; then
        pg_dump_opts+=(--jobs="${PARALLEL_JOBS}")
    fi

    # 执行备份
    local start_time=$(date +%s)

    if PGPASSWORD="${DB_PASSWORD}" pg_dump "${pg_dump_opts[@]}" > "${backup_file}" 2>&1 | tee -a "${LOG_FILE}"; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))

        log_success "数据库备份完成，耗时: ${duration}秒"

        # 获取文件大小
        local file_size=$(du -h "${backup_file}" | cut -f1)
        log_info "备份文件大小: ${file_size}"

        # 压缩备份
        if [ "$COMPRESS" = "true" ]; then
            compress_backup "${backup_file}"
        fi

        # 计算校验和
        local checksum_file="${backup_file}.sha256"
        if [ -f "${backup_file}" ]; then
            sha256sum "${backup_file}" > "${checksum_file}"
            log_success "校验和文件已创建: ${checksum_file}"
        fi

        return 0
    else
        log_error "数据库备份失败"
        return 1
    fi
}

compress_backup() {
    local backup_file=$1

    log_info "压缩备份文件..."

    if gzip -"${COMPRESSION_LEVEL}" "${backup_file}" 2>&1 | tee -a "${LOG_FILE}"; then
        local compressed_file="${backup_file}.gz"
        local file_size=$(du -h "${compressed_file}" | cut -f1)
        log_success "压缩完成: ${compressed_file} (${file_size})"
    else
        log_error "压缩失败"
        return 1
    fi
}

backup_schema_only() {
    local backup_file="${BACKUP_DIR}/schema/${BACKUP_NAME}_schema.sql"

    log_info "备份数据库结构..."

    mkdir -p "${BACKUP_DIR}/schema"

    if PGPASSWORD="${DB_PASSWORD}" pg_dump \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        --schema-only \
        --no-owner \
        --no-acl \
        > "${backup_file}" 2>&1 | tee -a "${LOG_FILE}"; then
        log_success "数据库结构备份完成: ${backup_file}"

        if [ "$COMPRESS" = "true" ]; then
            compress_backup "${backup_file}"
        fi
    else
        log_error "数据库结构备份失败"
        return 1
    fi
}

backup_specific_tables() {
    local tables=$1
    local backup_file="${BACKUP_DIR}/tables/${BACKUP_NAME}_tables.sql"

    log_info "备份指定表: ${tables}"

    mkdir -p "${BACKUP_DIR}/tables"

    if PGPASSWORD="${DB_PASSWORD}" pg_dump \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -t "${tables}" \
        --no-owner \
        --no-acl \
        > "${backup_file}" 2>&1 | tee -a "${LOG_FILE}"; then
        log_success "表备份完成: ${backup_file}"

        if [ "$COMPRESS" = "true" ]; then
            compress_backup "${backup_file}"
        fi
    else
        log_error "表备份失败"
        return 1
    fi
}

# ============================================================================
# 清理函数
# ============================================================================

cleanup_old_backups() {
    log_info "清理旧备份文件..."

    # 清理日备份（保留指定天数）
    find "${BACKUP_DIR}/daily" -name "cyberpress_*.sql.gz" -mtime +${DAYS_TO_KEEP} -delete 2>/dev/null || true
    find "${BACKUP_DIR}/daily" -name "cyberpress_*.sql" -mtime +${DAYS_TO_KEEP} -delete 2>/dev/null || true

    # 清理周备份
    find "${BACKUP_DIR}/weekly" -name "cyberpress_*.sql.gz" -mtime +$((WEEKLY_TO_KEEP * 7)) -delete 2>/dev/null || true
    find "${BACKUP_DIR}/weekly" -name "cyberpress_*.sql" -mtime +$((WEEKLY_TO_KEEP * 7)) -delete 2>/dev/null || true

    # 清理月备份
    find "${BACKUP_DIR}/monthly" -name "cyberpress_*.sql.gz" -mtime +$((MONTHLY_TO_KEEP * 30)) -delete 2>/dev/null || true
    find "${BACKUP_DIR}/monthly" -name "cyberpress_*.sql" -mtime +$((MONTHLY_TO_KEEP * 30)) -delete 2>/dev/null || true

    # 清理旧日志
    find "${BACKUP_DIR}/logs" -name "backup_*.log" -mtime +30 -delete 2>/dev/null || true

    log_success "旧备份清理完成"
}

# ============================================================================
# 恢复函数
# ============================================================================

restore_database() {
    local backup_file=$1

    if [ -z "${backup_file}" ]; then
        log_error "请指定备份文件路径"
        exit 1
    fi

    if [ ! -f "${backup_file}" ]; then
        log_error "备份文件不存在: ${backup_file}"
        exit 1
    fi

    log_warning "即将恢复数据库，这将覆盖现有数据！"
    read -p "确认继续？(yes/no): " confirm

    if [ "${confirm}" != "yes" ]; then
        log_info "恢复操作已取消"
        exit 0
    fi

    log_info "开始恢复数据库..."

    local restore_cmd="cat ${backup_file}"

    # 如果是压缩文件，添加解压
    if [[ "${backup_file}" == *.gz ]]; then
        restore_cmd="gunzip -c ${backup_file}"
    fi

    if ${restore_cmd} | PGPASSWORD="${DB_PASSWORD}" psql \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        --quiet \
        2>&1 | tee -a "${LOG_FILE}"; then
        log_success "数据库恢复完成"
    else
        log_error "数据库恢复失败"
        exit 1
    fi
}

# ============================================================================
# 监控函数
# ============================================================================

send_notification() {
    local status=$1
    local message=$2

    # 这里可以添加邮件、Slack、Webhook 等通知方式
    # 示例：发送邮件通知
    # if command -v mail &> /dev/null; then
    #     echo "${message}" | mail -s "数据库备份${status}" admin@example.com
    # fi

    log_info "通知: ${status} - ${message}"
}

generate_backup_report() {
    log_info "生成备份报告..."

    local report_file="${BACKUP_DIR}/backup_report_${TIMESTAMP}.txt"

    {
        echo "==============================================="
        echo "CyberPress Platform - 数据库备份报告"
        echo "==============================================="
        echo ""
        echo "备份时间: $(date)"
        echo "数据库名称: ${DB_NAME}"
        echo "备份类型: 完整备份"
        echo ""
        echo "备份文件:"
        find "${BACKUP_DIR}" -name "cyberpress_${TIMESTAMP}*" -type f
        echo ""
        echo "磁盘使用情况:"
        df -h "${BACKUP_DIR}"
        echo ""
        echo "数据库大小:"
        PGPASSWORD="${DB_PASSWORD}" psql \
            -h "${DB_HOST}" \
            -p "${DB_PORT}" \
            -U "${DB_USER}" \
            -d "${DB_NAME}" \
            -c "SELECT pg_size_pretty(pg_database_size('${DB_NAME}')) AS db_size;"
        echo ""
        echo "==============================================="
    } > "${report_file}"

    log_success "备份报告已生成: ${report_file}"
}

# ============================================================================
# 主函数
# ============================================================================

usage() {
    cat << EOF
用法: $0 [选项]

选项:
    -b, --backup              执行完整备份（默认）
    -s, --schema-only         仅备份数据库结构
    -t, --tables TABLES       备份指定表（逗号分隔）
    -r, --restore FILE        从备份文件恢复
    -c, --cleanup             清理旧备份
    -d, --daily               执行日备份
    -w, --weekly              执行周备份
    -m, --monthly             执行月备份
    -h, --help                显示帮助信息

环境变量:
    DB_NAME                   数据库名称（默认: cyberpress）
    DB_USER                   数据库用户（默认: postgres）
    DB_PASSWORD               数据库密码
    DB_HOST                   数据库主机（默认: localhost）
    DB_PORT                   数据库端口（默认: 5432）
    BACKUP_DIR                备份目录（默认: /var/backups/postgresql）
    DAYS_TO_KEEP              保留天数（默认: 7）
    COMPRESS                  是否压缩（默认: true）
    COMPRESSION_LEVEL         压缩级别（默认: 6）

示例:
    # 执行完整备份
    $0 --backup

    # 执行日备份
    $0 --daily

    # 仅备份结构
    $0 --schema-only

    # 恢复数据库
    $0 --restore /path/to/backup.sql.gz

    # 清理旧备份
    $0 --cleanup

EOF
    exit 0
}

main() {
    local action="backup"

    # 解析命令行参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -b|--backup)
                action="backup"
                shift
                ;;
            -s|--schema-only)
                action="schema"
                shift
                ;;
            -t|--tables)
                action="tables"
                TABLES="$2"
                shift 2
                ;;
            -r|--restore)
                action="restore"
                BACKUP_FILE="$2"
                shift 2
                ;;
            -c|--cleanup)
                action="cleanup"
                shift
                ;;
            -d|--daily)
                action="daily"
                shift
                ;;
            -w|--weekly)
                action="weekly"
                shift
                ;;
            -m|--monthly)
                action="monthly"
                shift
                ;;
            -h|--help)
                usage
                ;;
            *)
                log_error "未知选项: $1"
                usage
                ;;
        esac
    done

    # 打印开始信息
    echo "==============================================="
    echo "CyberPress Platform - 数据库备份工具"
    echo "==============================================="
    echo ""
    log_info "开始时间: $(date)"
    log_info "操作: ${action}"

    # 执行前置检查
    check_dependencies
    create_backup_dir
    check_db_connection

    # 执行相应操作
    case ${action} in
        backup)
            if backup_database "daily"; then
                send_notification "成功" "数据库备份已成功完成"
                generate_backup_report
            else
                send_notification "失败" "数据库备份失败"
                exit 1
            fi
            ;;
        schema)
            backup_schema_only
            ;;
        tables)
            backup_specific_tables "${TABLES}"
            ;;
        restore)
            restore_database "${BACKUP_FILE}"
            ;;
        cleanup)
            cleanup_old_backups
            ;;
        daily)
            backup_database "daily"
            ;;
        weekly)
            backup_database "weekly"
            ;;
        monthly)
            backup_database "monthly"
            ;;
        *)
            log_error "未知操作: ${action}"
            usage
            ;;
    esac

    # 清理旧备份
    if [[ "${action}" == "backup" ]] || [[ "${action}" == "daily" ]] || [[ "${action}" == "weekly" ]] || [[ "${action}" == "monthly" ]]; then
        cleanup_old_backups
    fi

    # 打印结束信息
    log_success "操作完成！"
    log_info "结束时间: $(date)"
    echo "==============================================="
}

# 执行主函数
main "$@"
