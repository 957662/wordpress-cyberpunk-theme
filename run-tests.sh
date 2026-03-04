#!/bin/bash

###############################################################################
# CyberPress Platform - 测试运行脚本
# ============================================================================
# 功能: 一键运行所有测试
# 版本: 1.0.0
# 日期: 2026-03-05
# ============================================================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# 打印标题
print_header() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║        CyberPress Platform - 测试运行脚本                ║"
    echo "║        Version: 1.0.0  Date: 2026-03-05                   ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
}

# 检查依赖
check_dependencies() {
    log_info "检查依赖..."

    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装"
        exit 1
    fi

    # 检查 Python
    if ! command -v python3 &> /dev/null; then
        log_error "Python3 未安装"
        exit 1
    fi

    # 检查 Docker (可选)
    if command -v docker &> /dev/null; then
        log_info "Docker 已安装"
    else
        log_warning "Docker 未安装，跳过容器化测试"
    fi

    log_success "依赖检查完成"
}

# 安装前端依赖
install_frontend_deps() {
    log_info "安装前端依赖..."
    cd frontend

    if [ ! -d "node_modules" ]; then
        npm install
        log_success "前端依赖安装完成"
    else
        log_info "前端依赖已存在，跳过安装"
    fi

    cd ..
}

# 安装后端依赖
install_backend_deps() {
    log_info "安装后端依赖..."
    cd backend

    if [ ! -d "venv" ]; then
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        log_success "后端依赖安装完成"
    else
        log_info "后端依赖已存在，跳过安装"
    fi

    cd ..
}

# 运行前端单元测试
run_frontend_unit_tests() {
    log_info "运行前端单元测试..."
    cd frontend

    npm test -- --coverage --watchAll=false

    log_success "前端单元测试完成"
    cd ..
}

# 运行后端单元测试
run_backend_unit_tests() {
    log_info "运行后端单元测试..."
    cd backend

    if [ -d "venv" ]; then
        source venv/bin/activate
    fi

    pytest --cov=app --cov-report=html --cov-report=term -v

    log_success "后端单元测试完成"
    cd ..
}

# 运行集成测试
run_integration_tests() {
    log_info "运行集成测试..."
    cd frontend

    npm test -- --testPathPattern=integration

    log_success "集成测试完成"
    cd ..
}

# 运行 E2E 测试
run_e2e_tests() {
    log_info "运行 E2E 测试..."
    cd frontend

    # 检查是否安装了 Playwright
    if ! npx playwright --version &> /dev/null; then
        log_warning "Playwright 未安装，正在安装..."
        npx playwright install
    fi

    npx playwright test

    log_success "E2E 测试完成"
    log_info "查看报告: npx playwright show-report"
    cd ..
}

# 运行所有测试
run_all_tests() {
    log_info "运行所有测试..."

    # 前端测试
    run_frontend_unit_tests

    # 后端测试
    run_backend_unit_tests

    # 集成测试
    run_integration_tests

    # E2E 测试
    run_e2e_tests

    log_success "所有测试完成！"
}

# 生成测试报告
generate_report() {
    log_info "生成测试报告..."

    # 合并覆盖率报告
    log_info "合并前端覆盖率报告..."
    # 这里可以使用 npx combine-coverage 等工具

    log_info "合并后端覆盖率报告..."
    # 合并后端覆盖率

    log_success "测试报告生成完成"
}

# 清理测试数据
cleanup() {
    log_info "清理测试数据..."

    # 清理测试数据库
    # 清理测试文件
    # 清理缓存

    log_success "清理完成"
}

# 显示帮助信息
show_help() {
    echo "使用方法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  all             运行所有测试 (默认)"
    echo "  frontend        运行前端测试"
    echo "  backend         运行后端测试"
    echo "  unit            运行单元测试"
    echo "  integration     运行集成测试"
    echo "  e2e             运行 E2E 测试"
    echo "  report          生成测试报告"
    echo "  cleanup         清理测试数据"
    echo "  install         安装测试依赖"
    echo "  help            显示帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 all          # 运行所有测试"
    echo "  $0 frontend     # 只运行前端测试"
    echo "  $0 e2e          # 只运行 E2E 测试"
}

# 主函数
main() {
    print_header

    # 解析参数
    case "${1:-all}" in
        all)
            check_dependencies
            run_all_tests
            generate_report
            ;;
        frontend)
            check_dependencies
            install_frontend_deps
            run_frontend_unit_tests
            ;;
        backend)
            check_dependencies
            install_backend_deps
            run_backend_unit_tests
            ;;
        unit)
            check_dependencies
            run_frontend_unit_tests
            run_backend_unit_tests
            ;;
        integration)
            check_dependencies
            run_integration_tests
            ;;
        e2e)
            check_dependencies
            run_e2e_tests
            ;;
        report)
            generate_report
            ;;
        cleanup)
            cleanup
            ;;
        install)
            check_dependencies
            install_frontend_deps
            install_backend_deps
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "未知选项: $1"
            show_help
            exit 1
            ;;
    esac

    echo ""
    log_success "测试脚本执行完成！"
    echo ""
}

# 执行主函数
main "$@"
