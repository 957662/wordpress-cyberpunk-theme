#!/bin/bash

# CyberPress Platform - 快速设置脚本
# 此脚本帮助您快速设置和启动 CyberPress 项目

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

print_header() {
    echo ""
    print_message "$CYAN" "═══════════════════════════════════════════════════════════"
    print_message "$CYAN" "  $1"
    print_message "$CYAN" "═══════════════════════════════════════════════════════════"
    echo ""
}

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 检查 Node.js 版本
check_nodejs() {
    print_header "检查 Node.js"

    if ! command_exists node; then
        print_message "$RED" "❌ Node.js 未安装"
        print_message "$YELLOW" "请访问 https://nodejs.org/ 下载并安装 Node.js"
        print_message "$YELLOW" "推荐版本: 18.x 或更高"
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_message "$RED" "❌ Node.js 版本过低: $(node -v)"
        print_message "$YELLOW" "请升级到 Node.js 18 或更高版本"
        exit 1
    fi

    print_message "$GREEN" "✅ Node.js 版本: $(node -v)"
}

# 检查 npm
check_npm() {
    if command_exists npm; then
        print_message "$GREEN" "✅ npm 版本: $(npm -v)"
    else
        print_message "$RED" "❌ npm 未安装"
        exit 1
    fi
}

# 进入前端目录
cd_frontend() {
    if [ -d "frontend" ]; then
        cd frontend
        print_message "$GREEN" "✅ 进入 frontend 目录"
    else
        print_message "$RED" "❌ frontend 目录不存在"
        exit 1
    fi
}

# 安装依赖
install_dependencies() {
    print_header "安装依赖"

    if [ -d "node_modules" ]; then
        print_message "$YELLOW" "⚠️  node_modules 已存在"
        read -p "是否重新安装依赖？(y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf node_modules package-lock.json
            print_message "$BLUE" "📦 正在安装依赖..."
            npm install
            print_message "$GREEN" "✅ 依赖安装完成"
        else
            print_message "$GREEN" "✅ 跳过依赖安装"
        fi
    else
        print_message "$BLUE" "📦 正在安装依赖..."
        npm install
        print_message "$GREEN" "✅ 依赖安装完成"
    fi
}

# 设置环境变量
setup_env() {
    print_header "配置环境变量"

    if [ -f ".env.local" ]; then
        print_message "$YELLOW" "⚠️  .env.local 文件已存在"
        read -p "是否重新配置？(y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm .env.local
        else
            print_message "$GREEN" "✅ 跳过环境变量配置"
            return
        fi
    fi

    print_message "$BLUE" "📝 创建 .env.local 文件..."
    cp .env.local.example .env.local

    print_message "$YELLOW" "⚠️  请编辑 .env.local 文件并填入实际配置"
    print_message "$CYAN" "必需配置项:"
    print_message "$CYAN" "  - NEXT_PUBLIC_WORDPRESS_API_URL"
    print_message "$CYAN" "  - NEXT_PUBLIC_SITE_URL"

    read -p "是否现在编辑 .env.local？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ${EDITOR:-nano} .env.local
    fi

    print_message "$GREEN" "✅ 环境变量配置完成"
}

# 运行类型检查
type_check() {
    print_header "类型检查"

    print_message "$BLUE" "🔍 正在运行 TypeScript 类型检查..."
    if npm run type-check; then
        print_message "$GREEN" "✅ 类型检查通过"
    else
        print_message "$RED" "❌ 类型检查失败"
        return 1
    fi
}

# 运行 linter
lint_check() {
    print_header "代码检查"

    print_message "$BLUE" "🔍 正在运行 ESLint..."
    if npm run lint; then
        print_message "$GREEN" "✅ 代码检查通过"
    else
        print_message "$YELLOW" "⚠️  代码检查发现问题"
    fi
}

# 构建项目
build_project() {
    print_header "构建项目"

    print_message "$BLUE" "🔨 正在构建项目..."
    if npm run build; then
        print_message "$GREEN" "✅ 构建成功"
    else
        print_message "$RED" "❌ 构建失败"
        return 1
    fi
}

# 启动开发服务器
start_dev() {
    print_header "启动开发服务器"

    print_message "$BLUE" "🚀 正在启动开发服务器..."
    print_message "$CYAN" "访问地址: http://localhost:3000"
    echo ""
    npm run dev
}

# 显示帮助信息
show_help() {
    cat << EOF
CyberPress Platform - 快速设置脚本

用法: ./scripts/setup.sh [选项]

选项:
    check       检查环境（Node.js, npm）
    install     安装依赖
    env         配置环境变量
    type-check  运行类型检查
    lint        运行代码检查
    build       构建项目
    dev         启动开发服务器
    all         执行完整设置流程（默认）
    help        显示此帮助信息

示例:
    ./scripts/setup.sh           # 完整设置
    ./scripts/setup.sh dev       # 仅启动开发服务器
    ./scripts/setup.sh check     # 仅检查环境

EOF
}

# 主函数
main() {
    print_message "$CYAN" "╔══════════════════════════════════════════════════════════╗"
    print_message "$CYAN" "║                                                        ║"
    print_message "$CYAN" "║           CyberPress Platform - 快速设置               ║"
    print_message "$CYAN" "║                                                        ║"
    print_message "$CYAN" "╚══════════════════════════════════════════════════════════╝"

    # 解析命令行参数
    case "${1:-all}" in
        check)
            check_nodejs
            check_npm
            ;;
        install)
            cd_frontend
            install_dependencies
            ;;
        env)
            cd_frontend
            setup_env
            ;;
        type-check)
            cd_frontend
            type_check
            ;;
        lint)
            cd_frontend
            lint_check
            ;;
        build)
            cd_frontend
            build_project
            ;;
        dev)
            cd_frontend
            start_dev
            ;;
        all)
            check_nodejs
            check_npm
            cd_frontend
            install_dependencies
            setup_env
            type_check || true
            lint_check || true
            print_header "设置完成"
            print_message "$GREEN" "✅ 所有设置已完成！"
            print_message "$CYAN" "运行 'npm run dev' 启动开发服务器"
            print_message "$CYAN" "或运行 './scripts/setup.sh dev'"
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_message "$RED" "❌ 未知选项: $1"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
