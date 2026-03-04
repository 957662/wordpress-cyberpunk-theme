#!/bin/bash

# CyberPress Platform - 测试运行脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 打印标题
print_title() {
    echo ""
    print_message "${BLUE}" "═══════════════════════════════════════════════════"
    print_message "${BLUE}" "$1"
    print_message "${BLUE}" "═══════════════════════════════════════════════════"
    echo ""
}

# 检查依赖
check_dependencies() {
    print_title "检查依赖"

    if ! command -v node &> /dev/null; then
        print_message "${RED}" "❌ Node.js 未安装"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        print_message "${RED}" "❌ npm 未安装"
        exit 1
    fi

    print_message "${GREEN}" "✅ 依赖检查通过"
}

# 安装依赖
install_dependencies() {
    print_title "安装依赖"
    npm install
    print_message "${GREEN}" "✅ 依赖安装完成"
}

# 运行单元测试
run_unit_tests() {
    print_title "运行单元测试"

    local coverage=$1

    if [ "$coverage" = true ]; then
        print_message "${YELLOW}" "运行单元测试（带覆盖率）..."
        npm test -- --coverage --watchAll=false
    else
        print_message "${YELLOW}" "运行单元测试..."
        npm test -- --watchAll=false
    fi

    print_message "${GREEN}" "✅ 单元测试完成"
}

# 运行集成测试
run_integration_tests() {
    print_title "运行集成测试"

    print_message "${YELLOW}" "运行集成测试..."
    npm test -- --testPathPattern=integration --watchAll=false

    print_message "${GREEN}" "✅ 集成测试完成"
}

# 运行 E2E 测试
run_e2e_tests() {
    print_title "运行 E2E 测试"

    if ! command -v npx &> /dev/null; then
        print_message "${RED}" "❌ npx 未安装"
        exit 1
    fi

    print_message "${YELLOW}" "安装 Playwright 浏览器..."
    npx playwright install --with-deps

    print_message "${YELLOW}" "运行 E2E 测试..."
    npx playwright test

    print_message "${GREEN}" "✅ E2E 测试完成"
}

# 运行所有测试
run_all_tests() {
    print_title "运行所有测试"

    local coverage=$1

    print_message "${YELLOW}" "运行所有前端测试..."
    if [ "$coverage" = true ]; then
        npm test -- --coverage --watchAll=false
    else
        npm test -- --watchAll=false
    fi

    print_message "${GREEN}" "✅ 所有测试完成"
}

# 运行后端测试
run_backend_tests() {
    print_title "运行后端测试"

    cd ../backend

    if ! command -v python &> /dev/null; then
        print_message "${RED}" "❌ Python 未安装"
        exit 1
    fi

    if ! command -v pytest &> /dev/null; then
        print_message "${YELLOW}" "安装 pytest..."
        pip install pytest pytest-cov
    fi

    print_message "${YELLOW}" "运行后端测试..."
    pytest tests/ -v --cov=app --cov-report=html --cov-report=term

    cd ../frontend

    print_message "${GREEN}" "✅ 后端测试完成"
}

# 生成测试报告
generate_reports() {
    print_title "生成测试报告"

    # 前端覆盖率报告
    if [ -d "coverage" ]; then
        print_message "${YELLOW}" "打开前端覆盖率报告..."
        if command -v open &> /dev/null; then
            open coverage/index.html
        elif command -v xdg-open &> /dev/null; then
            xdg-open coverage/index.html
        else
            print_message "${YELLOW}" "请手动打开 coverage/index.html"
        fi
    fi

    # 后端覆盖率报告
    if [ -f "../backend/htmlcov/index.html" ]; then
        print_message "${YELLOW}" "打开后端覆盖率报告..."
        if command -v open &> /dev/null; then
            open ../backend/htmlcov/index.html
        elif command -v xdg-open &> /dev/null; then
            xdg-open ../backend/htmlcov/index.html
        else
            print_message "${YELLOW}" "请手动打开 ../backend/htmlcov/index.html"
        fi
    fi

    # E2E 测试报告
    if [ -d "playwright-report" ]; then
        print_message "${YELLOW}" "打开 E2E 测试报告..."
        npx playwright show-report
    fi

    print_message "${GREEN}" "✅ 报告生成完成"
}

# 清理测试文件
cleanup() {
    print_title "清理测试文件"

    print_message "${YELLOW}" "清理覆盖率报告..."
    rm -rf coverage

    print_message "${YELLOW}" "清理测试输出..."
    rm -rf test-output

    print_message "${GREEN}" "✅ 清理完成"
}

# 显示帮助信息
show_help() {
    echo "用法: ./run-tests.sh [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help              显示帮助信息"
    echo "  -u, --unit              运行单元测试"
    echo "  -i, --integration       运行集成测试"
    echo "  -e, --e2e               运行 E2E 测试"
    echo "  -a, --all               运行所有测试（默认）"
    echo "  -b, --backend           运行后端测试"
    echo "  -c, --coverage          生成覆盖率报告"
    echo "  -r, --reports           打开测试报告"
    echo "  --clean                 清理测试文件"
    echo "  --install               安装依赖"
    echo ""
    echo "示例:"
    echo "  ./run-tests.sh                    # 运行所有测试"
    echo "  ./run-tests.sh -u -c              # 运行单元测试并生成覆盖率"
    echo "  ./run-tests.sh -e                 # 运行 E2E 测试"
    echo "  ./run-tests.sh -b                 # 运行后端测试"
    echo "  ./run-tests.sh -r                 # 打开测试报告"
}

# 主函数
main() {
    local run_unit=false
    local run_integration=false
    local run_e2e=false
    local run_backend=false
    local run_all=true
    local with_coverage=false
    local show_reports=false
    local clean_only=false
    local install_only=false

    # 解析命令行参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -u|--unit)
                run_unit=true
                run_all=false
                shift
                ;;
            -i|--integration)
                run_integration=true
                run_all=false
                shift
                ;;
            -e|--e2e)
                run_e2e=true
                run_all=false
                shift
                ;;
            -a|--all)
                run_all=true
                shift
                ;;
            -b|--backend)
                run_backend=true
                run_all=false
                shift
                ;;
            -c|--coverage)
                with_coverage=true
                shift
                ;;
            -r|--reports)
                show_reports=true
                shift
                ;;
            --clean)
                clean_only=true
                shift
                ;;
            --install)
                install_only=true
                shift
                ;;
            *)
                print_message "${RED}" "未知选项: $1"
                show_help
                exit 1
                ;;
        esac
    done

    # 执行操作
    if [ "$clean_only" = true ]; then
        cleanup
        exit 0
    fi

    if [ "$install_only" = true ]; then
        check_dependencies
        install_dependencies
        exit 0
    fi

    if [ "$show_reports" = true ]; then
        generate_reports
        exit 0
    fi

    check_dependencies

    if [ "$run_all" = true ]; then
        run_all_tests "$with_coverage"
    elif [ "$run_unit" = true ]; then
        run_unit_tests "$with_coverage"
    elif [ "$run_integration" = true ]; then
        run_integration_tests
    elif [ "$run_e2e" = true ]; then
        run_e2e_tests
    elif [ "$run_backend" = true ]; then
        run_backend_tests
    fi

    print_message "${GREEN}" ""
    print_message "${GREEN}" "🎉 测试运行完成！"
    print_message "${GREEN}" ""
}

# 运行主函数
main "$@"
