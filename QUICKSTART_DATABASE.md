# Database Quickstart Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Docker (Recommended)

```bash
# 1. Navigate to database directory
cd backend/database

# 2. Start database services
docker-compose -f docker-compose.db.yml up -d

# 3. Wait for services to be ready (check logs)
docker-compose -f docker-compose.db.yml logs -f postgres

# 4. Your database is ready!
# Connection details:
# Host: localhost
# Port: 5432
# Database: cyberpress_db
# User: postgres
# Password: (set in .env file)
```

### Option 2: Manual Setup

```bash
# 1. Install PostgreSQL
sudo apt-get install postgresql-15 postgresql-client-15

# 2. Create database
sudo -u postgres createdb cyberpress_db

# 3. Initialize schema
psql -U postgres -d cyberpress_db -f backend/database/init.sql

# 4. Done!
```

## 📊 Database Tools

### Using the CLI Tool

```bash
# Make executable
chmod +x backend/database/db-tools.sh

# Available commands:
./db-tools.sh init         # Initialize database
./db-tools.sh backup       # Create backup
./db-tools.sh restore      # Restore from backup
./db-tools.sh info         # Show database info
./db-tools.sh migrate      # Run migrations
./db-tools.sh vacuum       # Optimize database
./db-tools.sh slow-queries # Show slow queries
./db-tools.sh reset        # Reset database (WARNING!)
```

### Example Workflows

**Create a backup:**
```bash
./db-tools.sh backup
# Creates: ./backups/cyberpress_db_backup_YYYYMMDD_HHMMSS.dump.gz
```

**Restore from backup:**
```bash
./db-tools.sh restore ./backups/cyberpress_db_backup_20260306_120000.dump.gz
```

**Check database size:**
```bash
./db-tools.sh info
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Database
DB_NAME=cyberpress_db
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432

# Backup
BACKUP_DIR=./backups
RETENTION_DAYS=7
```

## 📁 Database Structure

### Core Tables
- **users** - User accounts and profiles
- **posts** - Blog posts and articles
- **categories** - Post categories
- **tags** - Post tags
- **comments** - Post comments

### Social Features
- **likes** - Like system for posts/comments
- **bookmarks** - User saved posts
- **follows** - User following system
- **notifications** - User notifications

### Additional Features
- **reading_progress** - Track reading progress
- **audit_logs** - System audit trail
- **settings** - Application settings

## 🔍 Common Queries

### Check database connection
```bash
psql -h localhost -p 5432 -U postgres -d cyberpress_db
```

### View all tables
```sql
\dt
```

### Check table sizes
```sql
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Count records
```sql
SELECT COUNT(*) FROM posts;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM comments;
```

## 🛠️ Migrations

### Create a new migration

```bash
# Create migration file
cat > backend/database/migrations/004_new_feature.sql << 'EOF'
-- Migration: 004_new_feature
-- Description: Add new feature

BEGIN;

-- Your SQL here

COMMIT;
