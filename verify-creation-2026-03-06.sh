#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# CyberPress Platform - 文件创建验证脚本
# ═══════════════════════════════════════════════════════════════

PROJECT_DIR="/root/.openclaw/workspace/cyberpress-platform"
TOTAL_FILES=0
FOUND_FILES=0
MISSING_FILES=()

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "════════════════════════════════════════════════════════════════"
echo "  CyberPress - 文件验证脚本"
echo "════════════════════════════════════════════════════════════════"
echo ""

# 函数：检查文件
check_file() {
    local file_path="$1"
    TOTAL_FILES=$((TOTAL_FILES + 1))
    
    if [ -f "$file_path" ]; then
        FOUND_FILES=$((FOUND_FILES + 1))
        echo -e "${GREEN}✓${NC} $(basename $file_path)"
        return 0
    else
        MISSING_FILES+=("$file_path")
        echo -e "${RED}✗${NC} $(basename $file_path) - ${RED}缺失${NC}"
        return 1
    fi
}

echo "📁 检查前端文件..."
echo "─────────────────────────────────────────────────────────────"

# 前端文件
check_file "$PROJECT_DIR/frontend/app/manifest.ts"
check_file "$PROJECT_DIR/frontend/app/sitemap.ts"
check_file "$PROJECT_DIR/frontend/app/robots.ts"
check_file "$PROJECT_DIR/frontend/lib/api-client.ts"
check_file "$PROJECT_DIR/frontend/lib/analytics.ts"
check_file "$PROJECT_DIR/frontend/hooks/use-api.ts"
check_file "$PROJECT_DIR/frontend/components/errors/error-boundary.tsx"
check_file "$PROJECT_DIR/frontend/next.config.optimized.js"

echo ""
echo "📁 检查后端文件..."
echo "─────────────────────────────────────────────────────────────"

# 后端文件
check_file "$PROJECT_DIR/backend/app/core/logging.py"
check_file "$PROJECT_DIR/backend/app/core/security.py"
check_file "$PROJECT_DIR/backend/app/services/cache_service.py"

echo ""
echo "📁 检查配置文件..."
echo "─────────────────────────────────────────────────────────────"

# 配置文件
check_file "$PROJECT_DIR/backend/.env.example"
check_file "$PROJECT_DIR/frontend/.env.local.example"

echo ""
echo "📁 检查文档文件..."
echo "─────────────────────────────────────────────────────────────"

# 文档文件
check_file "$PROJECT_DIR/CREATION_REPORT_2026-03-06.md"
check_file "$PROJECT_DIR/DEVELOPMENT_GUIDE.md"
check_file "$PROJECT_DIR/USAGE_EXAMPLES.md"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  验证结果"
echo "════════════════════════════════════════════════════════════════"
echo ""

if [ $FOUND_FILES -eq $TOTAL_FILES ]; then
    echo -e "${GREEN}✓ 所有文件验证成功！${NC}"
    echo ""
    echo "📊 统计信息:"
    echo "  总文件数: $TOTAL_FILES"
    echo "  成功: $FOUND_FILES"
    echo "  失败: 0"
    echo ""
    echo "🚀 项目已就绪，可以开始开发！"
else
    echo -e "${RED}✗ 部分文件验证失败！${NC}"
    echo ""
    echo "📊 统计信息:"
    echo "  总文件数: $TOTAL_FILES"
    echo "  成功: $FOUND_FILES"
    echo "  失败: $((TOTAL_FILES - FOUND_FILES))"
    echo ""
    echo "❌ 缺失的文件:"
    for file in "${MISSING_FILES[@]}"; do
        echo "  - $file"
    done
    echo ""
    echo "请检查文件创建过程！"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
exit $((TOTAL_FILES - FOUND_FILES))
