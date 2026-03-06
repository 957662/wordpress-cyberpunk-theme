#!/bin/bash

# ============================================
# CyberPress Database Tools
# ============================================
# A collection of useful database management scripts
# Version: 1.0.0
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="${DB_NAME:-cyberpress_db}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"

# ============================================
# UTILITY FUNCTIONS
# ============================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "Checking dependencies..."
    if ! command -v psql &> /dev/null; then
        log_error "PostgreSQL client not found. Please install postgresql-client."
        exit 1
    fi
    if ! command -v pg_dump &> /dev/null; then
        log_error "pg_dump not found. Please install postgresql-client."
        exit 1
    fi
    log_success "All dependencies found."
}

create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        log_info "Created backup directory: $BACKUP_DIR"
    fi
}

# ============================================
# DATABASE CONNECTION
# ============================================

DB_CONNECTION="postgresql://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

exec_sql() {
    local sql="$1"
    PGPASSWORD="${DB_PASSWORD}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$sql"
}

exec_sql_file() {
    local file="$1"
    PGPASSWORD="${DB_PASSWORD}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file"
}

# ============================================
# COMMANDS
# ============================================

# Initialize database
init_db() {
    log_info "Initializing database: $DB_NAME"

    # Check if database exists
    if exec_sql "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1; then
        log_warning "Database $DB_NAME already exists."
        read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            exec_sql "DROP DATABASE $DB_NAME;"
            log_info "Dropped existing database."
        else
            log_info "Aborting."
            exit 0
        fi
    fi

    # Create database
    exec_sql "CREATE DATABASE $DB_NAME;"
    log_success "Database created: $DB_NAME"

    # Run initialization script
    if [ -f "./init.sql" ]; then
        log_info "Running initialization script..."
        exec_sql_file "./init.sql"
        log_success "Database initialized successfully."
    else
        log_warning "init.sql not found. Database created but not initialized."
    fi
}

# Create backup
backup() {
    log_info "Creating backup of database: $DB_NAME"
    create_backup_dir

    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/${DB_NAME}_backup_${timestamp}.dump"

    PGPASSWORD="${DB_PASSWORD}" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
        -F c -d "$DB_NAME" -f "$backup_file"

    log_success "Backup created: $backup_file"

    # Compress backup
    gzip "$backup_file"
    log_success "Backup compressed: ${backup_file}.gz"
}

# Restore backup
restore() {
    local backup_file="$1"

    if [ -z "$backup_file" ]; then
        log_error "Please provide backup file path."
        echo "Usage: $0 restore <backup_file>"
        exit 1
    fi

    if [ ! -f "$backup_file" ]; then
        log_error "Backup file not found: $backup_file"
        exit 1
    fi

    log_info "Restoring database from: $backup_file"
    log_warning "This will overwrite existing data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Drop existing database
        exec_sql "DROP DATABASE IF EXISTS $DB_NAME;"
        exec_sql "CREATE DATABASE $DB_NAME;"

        # Restore backup
        PGPASSWORD="${DB_PASSWORD}" pg_restore -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
            -d "$DB_NAME" "$backup_file"

        log_success "Database restored successfully."
    else
        log_info "Restore aborted."
    fi
}

# Database info
info() {
    log_info "Database Information"
    echo "================================"

    # Database size
    exec_sql "SELECT pg_size_pretty(pg_database_size('$DB_NAME')) AS database_size;"

    echo ""
    log_info "Table Sizes:"
    exec_sql "SELECT
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"

    echo ""
    log_info "Connection Count:"
    exec_sql "SELECT count(*) AS connections FROM pg_stat_activity WHERE datname = '$DB_NAME';"
}

# Run migrations
migrate() {
    log_info "Running database migrations..."

    local migrations_dir="./migrations"
    if [ ! -d "$migrations_dir" ]; then
        log_error "Migrations directory not found: $migrations_dir"
        exit 1
    fi

    # Get list of migration files
    local migrations=($(ls -1 "$migrations_dir"/*.sql 2>/dev/null | sort))

    if [ ${#migrations[@]} -eq 0 ]; then
        log_warning "No migration files found."
        exit 0
    fi

    # Create migrations table if not exists
    exec_sql "CREATE TABLE IF NOT EXISTS _migrations (id SERIAL PRIMARY KEY, filename VARCHAR(255) UNIQUE NOT NULL, executed_at TIMESTAMP DEFAULT NOW());"

    for migration in "${migrations[@]}"; do
        local filename=$(basename "$migration")

        # Check if migration already executed
        local executed=$(exec_sql "SELECT 1 FROM _migrations WHERE filename='$filename'" | grep -c 1 || true)

        if [ "$executed" -eq 0 ]; then
            log_info "Running migration: $filename"
            exec_sql_file "$migration"
            exec_sql "INSERT INTO _migrations (filename) VALUES ('$filename');"
            log_success "Migration completed: $filename"
        else
            log_info "Skipping already executed migration: $filename"
        fi
    done

    log_success "All migrations completed."
}

# Vacuum and analyze
vacuum() {
    log_info "Running VACUUM ANALYZE..."
    exec_sql "VACUUM ANALYZE;"
    log_success "VACUUM ANALYZE completed."
}

# Show slow queries
slow_queries() {
    log_info "Checking for slow queries..."

    # Check if pg_stat_statements is available
    local has_ext=$(exec_sql "SELECT 1 FROM pg_extension WHERE extname='pg_stat_statements'" | grep -c 1 || true)

    if [ "$has_ext" -eq 0 ]; then
        log_warning "pg_stat_statements extension not enabled."
        log_info "Enable it with: CREATE EXTENSION pg_stat_statements;"
        exit 1
    fi

    exec_sql "SELECT
        query,
        calls,
        total_exec_time,
        mean_exec_time,
        max_exec_time
    FROM pg_stat_statements
    ORDER BY mean_exec_time DESC
    LIMIT 20;"
}

# Reset database
reset_db() {
    log_warning "This will completely reset the database!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Resetting database..."

        # Drop and recreate
        exec_sql "DROP DATABASE IF EXISTS $DB_NAME;"
        exec_sql "CREATE DATABASE $DB_NAME;"

        # Run init script if exists
        if [ -f "./init.sql" ]; then
            exec_sql_file "./init.sql"
        fi

        log_success "Database reset completed."
    else
        log_info "Reset aborted."
    fi
}

# Show help
show_help() {
    cat << EOF
CyberPress Database Tools

Usage: $0 <command> [options]

Commands:
    init        Initialize database
    backup      Create database backup
    restore     Restore from backup
    info        Show database information
    migrate     Run pending migrations
    vacuum      Run VACUUM ANALYZE
    slow-queries Show slow queries
    reset       Completely reset database
    help        Show this help message

Environment Variables:
    DB_NAME     Database name (default: cyberpress_db)
    DB_USER     Database user (default: postgres)
    DB_HOST     Database host (default: localhost)
    DB_PORT     Database port (default: 5432)
    DB_PASSWORD Database password (required)
    BACKUP_DIR  Backup directory (default: ./backups)

Examples:
    # Initialize database
    $0 init

    # Create backup
    $0 backup

    # Restore from backup
    $0 restore ./backups/cyberpress_db_backup_20260306.dump

    # Show database info
    $0 info

    # Run migrations
    $0 migrate

EOF
}

# ============================================
# MAIN
# ============================================

main() {
    check_dependencies

    local command="$1"
    shift || true

    case "$command" in
        init)
            init_db
            ;;
        backup)
            backup
            ;;
        restore)
            restore "$@"
            ;;
        info)
            info
            ;;
        migrate)
            migrate
            ;;
        vacuum)
            vacuum
            ;;
        slow-queries)
            slow_queries
            ;;
        reset)
            reset_db
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
