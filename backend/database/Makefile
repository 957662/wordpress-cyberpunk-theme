# =====================================================
# CyberPress Database - Makefile
# =====================================================
# 使用: make [target] [ENV=environment]
# 示例: make db-backup ENV=production
# =====================================================

.PHONY: help db-init db-backup db-restore db-monitor db-migrate-status db-migrate-up db-shell db-clean

# 默认环境
ENV ?= development

# 配置
MYSQL := mysql -h $$(grep DB_HOST .env.${ENV} | cut -d '=' -f2) \
              -P $$(grep DB_PORT .env.${ENV} | cut -d '=' -f2) \
              -u $$(grep DB_USER .env.${ENV} | cut -d '=' -f2) \
              -p$$(grep DB_PASSWORD .env.${ENV} | cut -d '=' -f2) \
              $$(grep DB_NAME .env.${ENV} | cut -d '=' -f2)

# 数据库目录
DB_DIR := $(shell pwd)
SCRIPTS_DIR := $(DB_DIR)/scripts
MIGRATIONS_DIR := $(DB_DIR)/migrations

# 颜色定义
COLOR_RESET := \033[0m
COLOR_INFO := \033[0;34m
COLOR_SUCCESS := \033[0;32m
COLOR_WARNING := \033[1;33m
COLOR_ERROR := \033[0;31m

# 默认目标
help:
	@echo "$(COLOR_INFO)=== CyberPress Database Management ===$(COLOR_RESET)"
	@echo ""
	@echo "使用方法: make [target] ENV=[environment]"
	@echo "环境: development (默认) | staging | production"
	@echo ""
	@echo "$(COLOR_SUCCESS)可用命令:$(COLOR_RESET)"
	@echo "  make db-init                 - 初始化数据库（从 schema.sql）"
	@echo "  make db-backup               - 备份数据库"
	@echo "  make db-restore FILE=...     - 从备份恢复"
	@echo "  make db-monitor              - 监控数据库状态"
	@echo "  make db-migrate-status       - 查看迁移状态"
	@echo "  make db-migrate-up           - 执行待执行迁移"
	@echo "  make db-migrate-create NAME= - 创建新迁移"
	@echo "  make db-shell                - 进入 MySQL shell"
	@echo "  make db-clean                - 删除所有数据（危险！）"
	@echo "  make db-optimize             - 优化所有表"
	@echo "  make db-info                 - 显示数据库信息"
	@echo "  make test-connection         - 测试数据库连接"
	@echo ""

# 初始化数据库
db-init:
	@echo "$(COLOR_INFO)初始化数据库 [$(ENV)]...$(COLOR_RESET)"
	@$(MYSQL) < $(DB_DIR)/schema.sql
	@echo "$(COLOR_SUCCESS)✓ 数据库初始化完成$(COLOR_RESET)"

# 备份数据库
db-backup:
	@echo "$(COLOR_INFO)备份数据库 [$(ENV)]...$(COLOR_RESET)"
	@$(SCRIPTS_DIR)/backup.sh $(ENV)
	@echo "$(COLOR_SUCCESS)✓ 备份完成$(COLOR_RESET)"

# 恢复数据库
db-restore:
	@echo "$(COLOR_WARNING)恢复数据库 [$(ENV)]...$(COLOR_RESET)"
	@if [ -z "$(FILE)" ]; then \
		echo "$(COLOR_ERROR)错误: 请指定备份文件 (FILE=...)$(COLOR_RESET)"; \
		exit 1; \
	fi
	@$(SCRIPTS_DIR)/restore.sh $(FILE) $(ENV)

# 监控数据库
db-monitor:
	@echo "$(COLOR_INFO)监控数据库 [$(ENV)]...$(COLOR_RESET)"
	@$(SCRIPTS_DIR)/monitor.sh $(ENV)

# 查看迁移状态
db-migrate-status:
	@echo "$(COLOR_INFO)迁移状态 [$(ENV)]...$(COLOR_RESET)"
	@$(SCRIPTS_DIR)/migrate.sh status $(ENV)

# 执行迁移
db-migrate-up:
	@echo "$(COLOR_INFO)执行迁移 [$(ENV)]...$(COLOR_RESET)"
	@$(SCRIPTS_DIR)/migrate.sh up $(ENV)

# 创建迁移
db-migrate-create:
	@if [ -z "$(NAME)" ]; then \
		echo "$(COLOR_ERROR)错误: 请提供迁移名称 (NAME=...)$(COLOR_RESET)"; \
		exit 1; \
	fi
	@$(SCRIPTS_DIR)/migrate.sh create $(NAME)
	@echo "$(COLOR_SUCCESS)✓ 迁移文件已创建，请编辑 $(MIGRATIONS_DIR)/XXX_$(NAME).sql$(COLOR_RESET)"

# 进入 MySQL shell
db-shell:
	@echo "$(COLOR_INFO)连接到数据库 [$(ENV)]...$(COLOR_RESET)"
	@$(MYSQL)

# 清空数据库（危险！）
db-clean:
	@echo "$(COLOR_ERROR)警告: 此操作将删除所有数据！$(COLOR_RESET)"
	@read -p "确定要继续吗? (输入 'yes' 确认): " confirm; \
	if [ "$$confirm" != "yes" ]; then \
		echo "操作已取消"; \
		exit 1; \
	fi
	@echo "$(COLOR_ERROR)删除所有数据...$(COLOR_RESET)"
	@$(MYSQL) -e "DROP DATABASE \`$$(grep DB_NAME .env.$(ENV) | cut -d '=' -f2)\`; CREATE DATABASE \`$$(grep DB_NAME .env.$(ENV) | cut -d '=' -f2)\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
	@echo "$(COLOR_SUCCESS)✓ 数据库已清空$(COLOR_RESET)"

# 优化所有表
db-optimize:
	@echo "$(COLOR_INFO)优化数据库表 [$(ENV)]...$(COLOR_RESET)"
	@$(MYSQL) -e "OPTIMIZE TABLE \`analytics\`, \`comments\`, \`post_categories\`, \`post_meta\`, \`posts\`, \`portfolio_gallery\`, \`portfolio_items\`, \`media\`, \`settings\`, \`users\`, \`categories\`;"
	@echo "$(COLOR_SUCCESS)✓ 表优化完成$(COLOR_RESET)"

# 显示数据库信息
db-info:
	@echo "$(COLOR_INFO)=== 数据库信息 [$(ENV)] ===$(COLOR_RESET)"
	@echo ""
	@echo "$(COLOR_SUCCESS)表列表:$(COLOR_RESET)"
	@$(MYSQL) -e "SHOW TABLES;"
	@echo ""
	@echo "$(COLOR_SUCCESS)数据库大小:$(COLOR_RESET)"
	@$(MYSQL) -e "SELECT table_name, ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)' FROM information_schema.tables WHERE table_schema='$$(grep DB_NAME .env.$(ENV) | cut -d '=' -f2)' ORDER BY (data_length + index_length) DESC;"
	@echo ""
	@echo "$(COLOR_SUCCESS)用户统计:$(COLOR_RESET)"
	@$(MYSQL) -e "SELECT role, COUNT(*) as count FROM users GROUP BY role;"

# 测试数据库连接
test-connection:
	@echo "$(COLOR_INFO)测试数据库连接 [$(ENV)]...$(COLOR_RESET)"
	@if $(MYSQL) -e "SELECT 1;" &> /dev/null; then \
		echo "$(COLOR_SUCCESS)✓ 数据库连接成功$(COLOR_RESET)"; \
		$(MYSQL) -e "SELECT VERSION() as mysql_version, NOW() as current_time;"; \
	else \
		echo "$(COLOR_ERROR)✗ 数据库连接失败$(COLOR_RESET)"; \
		exit 1; \
	fi

# 快速开发命令
dev-init: db-init db-migrate-up
	@echo "$(COLOR_SUCCESS)✓ 开发环境初始化完成$(COLOR_RESET)"

dev-reset: db-clean db-init
	@echo "$(COLOR_SUCCESS)✓ 开发环境已重置$(COLOR_RESET)"

dev-backup: db-backup
	@echo "$(COLOR_SUCCESS)✓ 开发环境已备份$(COLOR_RESET)"

# 生产命令
prod-backup:
	@$(MAKE) db-backup ENV=production

prod-monitor:
	@$(MAKE) db-monitor ENV=production

prod-migrate:
	@$(MAKE) db-migrate-up ENV=production
