#!/bin/bash
# =====================================================
# CyberPress Platform - Database Initialization Script
# 数据库初始化脚本
# =====================================================
# Author: AI Database Architect
# Created: 2026-03-03
# =====================================================

set -e

# 配置变量
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_ADMIN="${DB_ADMIN:-postgres}"
DB_NAME="${DB_NAME:-cyberpress}"
DB_USER="${DB_USER:-cyberpress}"
DB_PASSWORD="${DB_PASSWORD:-cyberpress123}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
header() { echo -e "${CYAN}=== $1 ===${NC}"; }

# 检查 PostgreSQL 连接
check_connection() {
    header "检查 PostgreSQL 连接"
    
    if pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_ADMIN" >/dev/null 2>&1; then
        log "✓ PostgreSQL 连接正常"
        return 0
    else
        error "✗ 无法连接到 PostgreSQL"
        error "请检查 PostgreSQL 是否运行，以及连接参数是否正确"
        exit 1
    fi
}

# 创建数据库和用户
create_database() {
    header "创建数据库和用户"
    
    # 检查数据库是否已存在
    local db_exists=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_ADMIN" -lqt | cut -d \| -f 1 | grep -w "$DB_NAME" | wc -l)
    
    if [ "$db_exists" -eq 1 ]; then
        warn "数据库 '$DB_NAME' 已存在"
        read -p "是否删除并重新创建? [y/N]: " choice
        
        if [ "$choice" = "y" ] || [ "$choice" = "Y" ]; then
            log "删除现有数据库..."
            psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_ADMIN" -c "DROP DATABASE IF EXISTS $DB_NAME;"
            log "✓ 数据库已删除"
        else
            log "保留现有数据库"
            return 0
        fi
    fi
    
    # 创建用户
    log "创建数据库用户: $DB_USER"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_ADMIN" -c "DROP USER IF EXISTS $DB_USER;" 2>/dev/null || true
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_ADMIN" -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
    
    # 创建数据库
    log "创建数据库: $DB_NAME"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_ADMIN" -c "CREATE DATABASE $DB_NAME OWNER $DB_USER ENCODING 'UTF8';"
    
    # 授予权限
    log "设置权限..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_ADMIN" -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
    
    log "✓ 数据库和用户创建完成"
}

# 导入数据库架构
import_schema() {
    header "导入数据库架构"
    
    local schema_file="$SCRIPT_DIR/../postgres-schema.sql"
    
    if [ ! -f "$schema_file" ]; then
        error "架构文件不存在: $schema_file"
        exit 1
    fi
    
    log "导入架构文件: $schema_file"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$schema_file"
    
    log "✓ 数据库架构导入完成"
}

# 导入种子数据
import_seed_data() {
    header "导入种子数据"
    
    local seed_file="$SCRIPT_DIR/../seed-data.sql"
    
    if [ ! -f "$seed_file" ]; then
        warn "种子数据文件不存在: $seed_file"
        warn "跳过种子数据导入"
        return 0
    fi
    
    read -p "是否导入种子数据? [Y/n]: " choice
    choice=${choice:-Y}
    
    if [ "$choice" = "y" ] || [ "$choice" = "Y" ]; then
        log "导入种子数据..."
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$seed_file" 2>/dev/null || true
        log "✓ 种子数据导入完成"
    else
        log "跳过种子数据导入"
    fi
}

# 验证安装
verify_installation() {
    header "验证安装"
    
    log "检查表创建..."
    local table_count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
    
    if [ "$table_count" -gt 0 ]; then
        log "✓ 已创建 $table_count 个表"
    else
        error "✗ 未找到任何表"
        exit 1
    fi
    
    log "检查用户..."
    local user_count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM users;")
    
    if [ "$user_count" -gt 0 ]; then
        log "✓ 已创建 $user_count 个用户"
    fi
    
    echo ""
    header "安装摘要"
    echo ""
    echo "数据库名称: $DB_NAME"
    echo "数据库用户: $DB_USER"
    echo "数据库主机: $DB_HOST:$DB_PORT"
    echo "表数量: $table_count"
    echo ""
}

# 创建配置文件
create_config() {
    header "创建配置文件"
    
    local env_file="$SCRIPT_DIR/../../.env"
    
    log "创建 .env 文件..."
    cat > "$env_file" << EOF
# Database Configuration
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

# Database URLs
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME
POSTGRES_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME
EOF
    
    log "✓ 配置文件已创建: $env_file"
    warn "请将 .env 文件添加到 .gitignore"
}

# 主程序
main() {
    echo ""
    header "CyberPress Platform - 数据库初始化"
    echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    
    # 显示配置
    log "配置信息:"
    echo "  数据库主机: $DB_HOST:$DB_PORT"
    echo "  数据库名称: $DB_NAME"
    echo "  数据库用户: $DB_USER"
    echo ""
    
    # 执行初始化步骤
    check_connection
    echo ""
    
    create_database
    echo ""
    
    import_schema
    echo ""
    
    import_seed_data
    echo ""
    
    verify_installation
    echo ""
    
    create_config
    echo ""
    
    header "初始化完成！"
    echo ""
    log "默认管理员账户:"
    echo "  用户名: admin"
    echo "  密码: admin123"
    echo ""
    warn "请在生产环境中修改默认密码！"
}

# 运行主程序
main
