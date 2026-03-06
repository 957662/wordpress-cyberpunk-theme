# CyberPress Database Setup Guide

## Quick Start

### 1. Using Docker (Recommended)

```bash
# Start database services
docker-compose -f docker-compose.db.yml up -d

# Initialize database
docker exec -it cyberpress-postgres psql -U postgres -d cyberpress_db -f /docker-entrypoint-initdb.d/init.sql

# Check logs
docker-compose -f docker-compose.db.yml logs -f postgres
```

### 2. Manual Setup

```bash
# Install PostgreSQL 15+
sudo apt-get install postgresql-15 postgresql-client-15

# Create database
sudo -u postgres createdb cyberpress_db

# Run initialization
psql -U postgres -d cyberpress_db -f init.sql
```

## Database Tools

### Using the Shell Script

```bash
# Make script executable
chmod +x db-tools.sh

# Initialize database
./db-tools.sh init

# Create backup
./db-tools.sh backup

# Restore backup
./db-tools.sh restore ./backups/cyberpress_db_backup_20260306.dump.gz

# Show database info
./db-tools.sh info

# Run migrations
./db-tools.sh migrate

# Vacuum and analyze
./db-tools.sh vacuum

# View slow queries
./db-tools.sh slow-queries

# Reset database (WARNING: deletes all data)
./db-tools.sh reset
```

## Environment Variables

```bash
# Database connection
export DB_NAME=cyberpress_db
export DB_USER=postgres
export DB_PASSWORD=your_secure_password
export DB_HOST=localhost
export DB_PORT=5432

# Backup settings
export BACKUP_DIR=./backups
export RETENTION_DAYS=7
```

## Backup and Restore

### Manual Backup

```bash
# Full backup
pg_dump -U postgres -d cyberpress_db -F c -f backup.dump

# Schema only
pg_dump -U postgres -d cyberpress_db --schema-only -f schema.sql

# Data only
pg_dump -U postgres -d cyberpress_db --data-only -f data.sql
```

### Restore

```bash
# From custom format
pg_restore -U postgres -d cyberpress_db backup.dump

# From SQL file
psql -U postgres -d cyberpress_db < schema.sql
```

## Monitoring

### Check Database Size

```sql
SELECT pg_size_pretty(pg_database_size('cyberpress_db'));
```

### Check Table Sizes

```sql
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Troubleshooting

### Database Won't Start

```bash
# Check PostgreSQL logs
docker logs cyberpress-postgres

# Check if port is in use
sudo lsof -i :5432
```

### Connection Refused

```bash
# Check if database is running
docker ps | grep cyberpress-postgres

# Test connection
psql -h localhost -p 5432 -U postgres -d cyberpress_db
```
