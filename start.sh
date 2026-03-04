#!/bin/bash

# ============================================
# CyberPress 项目启动脚本
# ============================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

# 日志函数
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

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 检查端口是否被占用
check_port() {
    local port=$1
    if command_exists lsof; then
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            return 0
        fi
    elif command_exists netstat; then
        if netstat -an | grep ":$port " | grep LISTEN >/dev/null 2>&1; then
            return 0
        fi
    fi
    return 1
}

# 显示横幅
show_banner() {
    echo -e "${BLUE}"
    echo "=============================================="
    echo "       🚀 CyberPress Platform"
    echo "=============================================="
    echo -e "${NC}"
}

# 检查依赖
check_dependencies() {
    log_info "检查系统依赖..."

    local missing_deps=()

    # 检查 Node.js
    if ! command_exists node; then
        missing_deps+=("nodejs")
    else
        log_success "Node.js $(node -v)"
    fi

    # 检查 npm
    if ! command_exists npm; then
        missing_deps+=("npm")
    else
        log_success "npm $(npm -v)"
    fi

    # 检查 Python
    if ! command_exists python3; then
        missing_deps+=("python3")
    else
        log_success "Python $(python3 --version)"
    fi

    # 检查 PostgreSQL
    if ! command_exists psql; then
        missing_deps+=("postgresql")
    else
        log_success "PostgreSQL $(psql --version)"
    fi

    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "缺少以下依赖: ${missing_deps[*]}"
        log_info "请先安装缺少的依赖"
        exit 1
    fi

    log_success "所有依赖已安装"
}

# 检查环境变量文件
check_env_files() {
    log_info "检查环境变量文件..."

    # 检查后端环境变量
    if [ ! -f "$BACKEND_DIR/.env" ]; then
        log_warning "后端 .env 文件不存在"
        if [ -f "$BACKEND_DIR/.env.example" ] || [ -f "$BACKEND_DIR/.env.template" ]; then
            log_info "从模板创建 .env 文件..."
            cp "$BACKEND_DIR/.env.template" "$BACKEND_DIR/.env" 2>/dev/null || \
            cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
            log_warning "请编辑 $BACKEND_DIR/.env 并填入正确的配置"
        else
            log_error "无法找到 .env 模板文件"
            exit 1
        fi
    fi

    # 检查前端环境变量
    if [ ! -f "$FRONTEND_DIR/.env.local" ]; then
        log_warning "前端 .env.local 文件不存在"
        if [ -f "$FRONTEND_DIR/.env.example" ] || [ -f "$FRONTEND_DIR/.env.template" ]; then
            log_info "从模板创建 .env.local 文件..."
            cp "$FRONTEND_DIR/.env.template" "$FRONTEND_DIR/.env.local" 2>/dev/null || \
            cp "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env.local"
            log_warning "请编辑 $FRONTEND_DIR/.env.local 并填入正确的配置"
        else
            log_error "无法找到 .env 模板文件"
            exit 1
        fi
    fi

    log_success "环境变量文件检查完成"
}

# 安装后端依赖
install_backend_deps() {
    log_info "检查后端依赖..."

    if [ ! -d "$BACKEND_DIR/venv" ]; then
        log_info "创建 Python 虚拟环境..."
        cd "$BACKEND_DIR"
        python3 -m venv venv
    fi

    log_info "激活虚拟环境并安装依赖..."
    source "$BACKEND_DIR/venv/bin/activate"
    pip install --upgrade pip
    pip install -r "$BACKEND_DIR/requirements.txt"

    log_success "后端依赖安装完成"
}

# 安装前端依赖
install_frontend_deps() {
    log_info "检查前端依赖..."

    if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
        log_info "安装前端依赖..."
        cd "$FRONTEND_DIR"
        npm install
        log_success "前端依赖安装完成"
    else
        log_success "前端依赖已存在"
    fi
}

# 初始化数据库
init_database() {
    log_info "初始化数据库..."

    source "$BACKEND_DIR/venv/bin/activate"
    cd "$BACKEND_DIR"

    # 运行数据库初始化脚本
    python scripts/init_database.py init

    log_success "数据库初始化完成"
}

# 启动后端服务
start_backend() {
    log_info "启动后端服务..."

    # 检查端口
    if check_port 8000; then
        log_warning "端口 8000 已被占用，尝试终止现有进程..."
        pkill -f "uvicorn.*main:app" || true
        sleep 2
    fi

    cd "$BACKEND_DIR"
    source "$BACKEND_DIR/venv/bin/activate"

    # 使用 nohup 在后台启动
    nohup python main.py > logs/backend.log 2>&1 &
    BACKEND_PID=$!

    # 等待服务启动
    sleep 3

    if check_port 8000; then
        log_success "后端服务已启动 (PID: $BACKEND_PID)"
        log_info "后端地址: http://localhost:8000"
        log_info "API 文档: http://localhost:8000/api/docs"
    else
        log_error "后端服务启动失败，请查看日志: tail -f $BACKEND_DIR/logs/backend.log"
        exit 1
    fi
}

# 启动前端服务
start_frontend() {
    log_info "启动前端服务..."

    # 检查端口
    if check_port 3000; then
        log_warning "端口 3000 已被占用，尝试终止现有进程..."
        pkill -f "next dev" || true
        sleep 2
    fi

    cd "$FRONTEND_DIR"

    # 使用 nohup 在后台启动
    nohup npm run dev > logs/frontend.log 2>&1 &
    FRONTEND_PID=$!

    # 等待服务启动
    sleep 5

    if check_port 3000; then
        log_success "前端服务已启动 (PID: $FRONTEND_PID)"
        log_info "前端地址: http://localhost:3000"
    else
        log_error "前端服务启动失败，请查看日志: tail -f $FRONTEND_DIR/logs/frontend.log"
        exit 1
    fi
}

# 停止所有服务
stop_services() {
    log_info "停止所有服务..."

    pkill -f "uvicorn.*main:app" || true
    pkill -f "next dev" || true

    log_success "所有服务已停止"
}

# 显示状态
show_status() {
    log_info "服务状态:"

    echo ""
    if check_port 8000; then
        echo -e "  后端服务: ${GREEN}运行中${NC} (http://localhost:8000)"
    else
        echo -e "  后端服务: ${RED}未运行${NC}"
    fi

    if check_port 3000; then
        echo -e "  前端服务: ${GREEN}运行中${NC} (http://localhost:3000)"
    else
        echo -e "  前端服务: ${RED}未运行${NC}"
    fi
    echo ""
}

# 显示帮助
show_help() {
    echo "用法: ./start.sh [命令]"
    echo ""
    echo "可用命令:"
    echo "  start       - 启动所有服务 (默认)"
    echo "  stop        - 停止所有服务"
    echo "  restart     - 重启所有服务"
    echo "  status      - 显示服务状态"
    echo "  install     - 安装所有依赖"
    echo "  init        - 初始化数据库"
    echo "  backend     - 仅启动后端服务"
    echo "  frontend    - 仅启动前端服务"
    echo "  help        - 显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  ./start.sh          # 启动所有服务"
    echo "  ./start.sh install  # 安装依赖"
    echo "  ./start.sh stop     # 停止所有服务"
}

# 主函数
main() {
    show_banner

    # 创建日志目录
    mkdir -p "$BACKEND_DIR/logs"
    mkdir -p "$FRONTEND_DIR/logs"

    case "${1:-start}" in
        start)
            check_dependencies
            check_env_files
            install_backend_deps
            install_frontend_deps
            init_database
            start_backend
            start_frontend
            show_status
            log_success "所有服务已启动!"
            log_info "使用 './start.sh stop' 停止服务"
            ;;
        stop)
            stop_services
            ;;
        restart)
            stop_services
            sleep 2
            start_backend
            start_frontend
            show_status
            ;;
        status)
            show_status
            ;;
        install)
            check_dependencies
            install_backend_deps
            install_frontend_deps
            log_success "依赖安装完成!"
            ;;
        init)
            check_env_files
            install_backend_deps
            init_database
            ;;
        backend)
            check_dependencies
            check_env_files
            start_backend
            ;;
        frontend)
            check_dependencies
            check_env_files
            start_frontend
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "未知命令: $1"
            show_help
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@"
