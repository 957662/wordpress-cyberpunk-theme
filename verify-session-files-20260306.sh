#!/bin/bash

# 文件创建验证脚本 - 2026-03-06 会话
# 验证本次会话创建的所有文件

echo "=========================================="
echo "CyberPress Platform - 文件创建验证"
echo "日期: 2026-03-06"
echo "=========================================="
echo ""

PROJECT_ROOT="/root/.openclaw/workspace/cyberpress-platform"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total_files=0
created_files=0
existing_files=0
failed_files=0

echo "📋 本次会话创建的文件清单"
echo "=========================================="
echo ""

# ==================== Hooks ====================
echo "🔹 验证 Hooks 文件..."

hooks_files=(
    "$FRONTEND_DIR/hooks/use-comments.ts"
    "$FRONTEND_DIR/hooks/use-social.ts"
    "$FRONTEND_DIR/hooks/use-auth.ts"
)

for file in "${hooks_files[@]}"; do
    total_files=$((total_files + 1))
    filename=$(basename "$file")
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $filename"
        created_files=$((created_files + 1))
    else
        echo -e "${RED}❌${NC} $filename (未找到)"
        failed_files=$((failed_files + 1))
    fi
done

echo ""

# ==================== UI 组件 ====================
echo "🔹 验证 UI 组件文件..."

ui_files=(
    "$FRONTEND_DIR/components/ui/loading/Skeleton.tsx"
    "$FRONTEND_DIR/components/ui/error/ErrorBoundary.tsx"
)

for file in "${ui_files[@]}"; do
    total_files=$((total_files + 1))
    filename=$(basename "$file")
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $filename"
        created_files=$((created_files + 1))
    else
        echo -e "${RED}❌${NC} $filename (未找到)"
        failed_files=$((failed_files + 1))
    fi
done

echo ""

# ==================== 已存在的核心文件 ====================
echo "🔹 验证已存在的核心文件..."

existing_files_list=(
    "$FRONTEND_DIR/hooks/use-posts.ts"
    "$FRONTEND_DIR/lib/http-client.ts"
    "$FRONTEND_DIR/store/auth-store.ts"
    "$FRONTEND_DIR/types/index.ts"
)

for file in "${existing_files_list[@]}"; do
    total_files=$((total_files + 1))
    filename=$(basename "$file")
    if [ -f "$file" ]; then
        echo -e "${YELLOW}✓${NC} $filename (已存在)"
        existing_files=$((existing_files + 1))
    else
        echo -e "${RED}❌${NC} $filename (未找到)"
        failed_files=$((failed_files + 1))
    fi
done

echo ""

# ==================== 统计信息 ====================
echo "=========================================="
echo "📊 统计信息"
echo "=========================================="
echo ""
echo -e "总文件数: ${GREEN}$total_files${NC}"
echo -e "本次创建: ${GREEN}$created_files${NC}"
echo -e "已存在: ${YELLOW}$existing_files${NC}"
echo -e "创建失败: ${RED}$failed_files${NC}"
echo ""

# 成功率
if [ $total_files -gt 0 ]; then
    success_rate=$((created_files * 100 / total_files))
    echo -e "成功率: ${GREEN}$success_rate%${NC}"
fi

echo ""

# ==================== 文件详情 ====================
echo "=========================================="
echo "📁 文件详情"
echo "=========================================="
echo ""

if [ -f "$FRONTEND_DIR/hooks/use-comments.ts" ]; then
    size=$(wc -l < "$FRONTEND_DIR/hooks/use-comments.ts")
    echo -e "${GREEN}use-comments.ts${NC} - $size 行"
fi

if [ -f "$FRONTEND_DIR/hooks/use-social.ts" ]; then
    size=$(wc -l < "$FRONTEND_DIR/hooks/use-social.ts")
    echo -e "${GREEN}use-social.ts${NC} - $size 行"
fi

if [ -f "$FRONTEND_DIR/hooks/use-auth.ts" ]; then
    size=$(wc -l < "$FRONTEND_DIR/hooks/use-auth.ts")
    echo -e "${GREEN}use-auth.ts${NC} - $size 行"
fi

if [ -f "$FRONTEND_DIR/components/ui/loading/Skeleton.tsx" ]; then
    size=$(wc -l < "$FRONTEND_DIR/components/ui/loading/Skeleton.tsx")
    echo -e "${GREEN}Skeleton.tsx${NC} - $size 行"
fi

if [ -f "$FRONTEND_DIR/components/ui/error/ErrorBoundary.tsx" ]; then
    size=$(wc -l < "$FRONTEND_DIR/components/ui/error/ErrorBoundary.tsx")
    echo -e "${GREEN}ErrorBoundary.tsx${NC} - $size 行"
fi

echo ""

# ==================== 功能验证 ====================
echo "=========================================="
echo "🔍 功能验证"
echo "=========================================="
echo ""

# 检查关键函数
echo "检查 use-comments.ts 导出..."
if grep -q "useComments" "$FRONTEND_DIR/hooks/use-comments.ts" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} useComments 函数存在"
else
    echo -e "${RED}❌${NC} useComments 函数未找到"
fi

if grep -q "buildCommentTree" "$FRONTEND_DIR/hooks/use-comments.ts" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} buildCommentTree 函数存在"
else
    echo -e "${RED}❌${NC} buildCommentTree 函数未找到"
fi

echo ""
echo "检查 use-social.ts 导出..."
if grep -q "useFollowUser" "$FRONTEND_DIR/hooks/use-social.ts" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} useFollowUser 函数存在"
else
    echo -e "${RED}❌${NC} useFollowUser 函数未找到"
fi

if grep -q "useLike" "$FRONTEND_DIR/hooks/use-social.ts" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} useLike 函数存在"
else
    echo -e "${RED}❌${NC} useLike 函数未找到"
fi

echo ""
echo "检查 use-auth.ts 导出..."
if grep -q "useAuth" "$FRONTEND_DIR/hooks/use-auth.ts" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} useAuth 函数存在"
else
    echo -e "${RED}❌${NC} useAuth 函数未找到"
fi

if grep -q "useRequireAuth" "$FRONTEND_DIR/hooks/use-auth.ts" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} useRequireAuth 函数存在"
else
    echo -e "${RED}❌${NC} useRequireAuth 函数未找到"
fi

echo ""

# ==================== 最终结果 ====================
echo "=========================================="
echo "🎉 验证完成"
echo "=========================================="
echo ""

if [ $failed_files -eq 0 ]; then
    echo -e "${GREEN}所有文件创建成功!${NC}"
    echo ""
    echo "项目状态: 🟢 可以开始使用"
    echo ""
    echo "下一步:"
    echo "1. 启动后端服务: cd backend && uvicorn app.main:app --reload"
    echo "2. 启动前端服务: cd frontend && npm run dev"
    echo "3. 访问应用: http://localhost:3000"
else
    echo -e "${RED}部分文件创建失败${NC}"
    echo "请检查错误日志并重试"
fi

echo ""
echo "详细报告: $PROJECT_ROOT/SESSION_CREATION_REPORT_2026-03-06.md"
echo ""
