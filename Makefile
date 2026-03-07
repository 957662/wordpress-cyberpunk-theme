# CyberPress Platform - Makefile
# 便捷的开发命令集合

.PHONY: help start stop restart test clean install setup

# 颜色定义
GREEN := \033[0;32m
BLUE := \033[0;34m
YELLOW := \033[1;33m
NC := \033[0m

# 默认目标 - 显示帮助
help:
	@echo "$(BLUE)CyberPress Platform - 开发命令$(NC)"
	@echo ""
	@echo "$(GREEN)可用命令:$(NC)"
	@echo "  make start        - 启动开发环境"
	@echo "  make stop         - 停止所有服务"
	@echo "  make restart      - 重启服务"
	@echo "  make setup        - 初始设置"
	@echo "  make install      - 安装所有依赖"
	@echo "  make test         - 运行所有测试"
	@echo "  make clean        - 清理缓存和临时文件"
	@echo "  make db-reset     - 重置数据库"
	@echo "  make db-migrate   - 运行数据库迁移"
	@echo "  make lint         - 代码检查"
	@echo "  make format       - 代码格式化"
	@echo "  make build        - 构建生产版本"
	@echo "  make docker-up    - 启动 Docker 服务"
	@echo "  make docker-down  - 停止 Docker 服务"
	@echo "  make api-test     - 测试 API"
	@echo ""

# 启动开发环境
start:
	@echo "$(BLUE)🚀 启动开发环境...$(NC)"
	@./start-dev.sh

# 停止服务
stop:
	@echo "$(BLUE)🛑 停止服务...$(NC)"
	@./stop-dev.sh

# 重启服务
restart:
	@echo "$(BLUE)🔄 重启服务...$(NC)"
	@./restart-dev.sh

# 初始设置
setup:
	@echo "$(BLUE)🔧 初始设置...$(NC)"
	@mkdir -p backend/uploads backend/logs
	@mkdir -p frontend/.next
	@chmod +x start-dev.sh stop-dev.sh restart-dev.sh
	@chmod +x scripts/api-test.py
	@echo "$(GREEN)✅ 设置完成!$(NC)"
	@echo "$(YELLOW)运行 'make install' 安装依赖$(NC)"

# 安装所有依赖
install: install-backend install-frontend

# 安装后端依赖
install-backend:
	@echo "$(BLUE)📦 安装后端依赖...$(NC)"
	@cd backend && \
		if [ ! -d "venv" ]; then \
			python3 -m venv venv; \
		fi; \
		source venv/bin/activate && \
		pip install --upgrade pip && \
		pip install -r requirements.txt
	@echo "$(GREEN)✅ 后端依赖安装完成$(NC)"

# 安装前端依赖
install-frontend:
	@echo "$(BLUE)📦 安装前端依赖...$(NC)"
	@cd frontend && \
		if [ ! -d "node_modules" ]; then \
			npm install; \
		fi
	@echo "$(GREEN)✅ 前端依赖安装完成$(NC)"

# 运行所有测试
test: test-backend test-frontend

# 运行后端测试
test-backend:
	@echo "$(BLUE)🧪 运行后端测试...$(NC)"
	@cd backend && \
		source venv/bin/activate && \
		pytest tests/ -v --cov=app

# 运行前端测试
test-frontend:
	@echo "$(BLUE)🧪 运行前端测试...$(NC)"
	@cd frontend && \
		npm run test

# API 测试
api-test:
	@echo "$(BLUE)🔌 测试 API...$(NC)"
	@python scripts/api-test.py

# 清理缓存和临时文件
clean:
	@echo "$(BLUE)🧹 清理缓存...$(NC)"
	@rm -rf backend/__pycache__
	@rm -rf backend/app/__pycache__
	@rm -rf backend/**/*/__pycache__
	@rm -rf frontend/.next
	@rm -rf frontend/node_modules/.cache
	@find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	@find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@echo "$(GREEN)✅ 清理完成$(NC)"

# 重置数据库
db-reset:
	@echo "$(YELLOW)⚠️  警告: 这将删除所有数据!$(NC)"
	@read -p "确定要重置数据库吗? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		cd backend && \
		source venv/bin/activate && \
		alembic downgrade base && \
		alembic upgrade head; \
		echo "$(GREEN)✅ 数据库已重置$(NC)"; \
	else \
		echo "$(YELLOW)已取消$(NC)"; \
	fi

# 运行数据库迁移
db-migrate:
	@echo "$(BLUE)🔄 运行数据库迁移...$(NC)"
	@cd backend && \
		source venv/bin/activate && \
		alembic upgrade head
	@echo "$(GREEN)✅ 迁移完成$(NC)"

# 创建新的迁移
db-create-migration:
	@read -p "输入迁移描述: " desc; \
	cd backend && \
	source venv/bin/activate && \
	alembic revision --autogenerate -m "$$desc"

# 代码检查
lint: lint-backend lint-frontend

# 后端代码检查
lint-backend:
	@echo "$(BLUE)🔍 检查后端代码...$(NC)"
	@cd backend && \
		source venv/bin/activate && \
		flake8 app/ && \
		mypy app/

# 前端代码检查
lint-frontend:
	@echo "$(BLUE)🔍 检查前端代码...$(NC)"
	@cd frontend && \
		npm run lint && \
		npm run type-check

# 代码格式化
format: format-backend format-frontend

# 后端代码格式化
format-backend:
	@echo "$(BLUE)✨ 格式化后端代码...$(NC)"
	@cd backend && \
		source venv/bin/activate && \
		black app/ && \
		isort app/

# 前端代码格式化
format-frontend:
	@echo "$(BLUE)✨ 格式化前端代码...$(NC)"
	@cd frontend && \
		npm run format

# 构建生产版本
build: build-frontend build-backend

# 构建前端
build-frontend:
	@echo "$(BLUE)🏗️  构建前端...$(NC)"
	@cd frontend && \
		npm run build
	@echo "$(GREEN)✅ 前端构建完成$(NC)"

# 构建后端
build-backend:
	@echo "$(BLUE)🏗️  构建后端...$(NC)"
	@echo "$(GREEN)✅ 后端构建完成$(NC)"

# 启动 Docker 服务
docker-up:
	@echo "$(BLUE)🐳 启动 Docker 服务...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✅ Docker 服务已启动$(NC)"

# 停止 Docker 服务
docker-down:
	@echo "$(BLUE)🐳 停止 Docker 服务...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✅ Docker 服务已停止$(NC)"

# 查看 Docker 日志
docker-logs:
	@docker-compose logs -f

# 查看 Docker 状态
docker-ps:
	@docker-compose ps

# 检查环境
check-env:
	@echo "$(BLUE)🔍 检查环境...$(NC)"
	@echo "Node.js: $$(node --version)"
	@echo "Python: $$(python3 --version)"
	@echo "Docker: $$(docker --version)"
	@echo "Docker Compose: $$(docker-compose --version)"
	@echo ""
	@echo "$(BLUE)检查端口占用...$(NC)"
	@lsof -i :3000 || echo "✅ 端口 3000 未被占用"
	@lsoj -i :8000 || echo "✅ 端口 8000 未被占用"
	@lsof -i :5432 || echo "✅ 端口 5432 未被占用"

# 显示帮助信息（默认）
.DEFAULT_GOAL := help
