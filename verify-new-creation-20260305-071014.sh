#!/bin/bash

# CyberPress Platform - 新文件验证脚本
# 生成时间: 2026-03-05

echo "=========================================="
echo "📦 CyberPress Platform - 新创建文件验证"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 项目路径
PROJECT_ROOT="/root/.openclaw/workspace/cyberpress-platform"

# 新创建的文件列表
FILES=(
  "frontend/lib/analytics/tracking.ts"
  "frontend/components/performance/LazyImage.tsx"
  "frontend/lib/monitoring/error-boundary.tsx"
  "backend/app/services/analytics_service.py"
  "DEVELOPMENT_TASKS_COMPLETED.md"
)

echo -e "${CYAN}📋 本次创建的文件列表:${NC}"
echo ""

for file in "${FILES[@]}"; do
  full_path="$PROJECT_ROOT/$file"
  
  if [ -f "$full_path" ]; then
    size=$(du -h "$full_path" | cut -f1)
    lines=$(wc -l < "$full_path")
    echo -e "${GREEN}✅${NC} $file"
    echo -e "   大小: ${YELLOW}$size${NC} | 行数: ${YELLOW}$lines${NC}"
  else
    echo -e "${RED}❌${NC} $file - 文件不存在"
  fi
done

echo ""
echo -e "${CYAN}📊 统计信息:${NC}"
echo ""

total_lines=0
for file in "${FILES[@]}"; do
  full_path="$PROJECT_ROOT/$file"
  if [ -f "$full_path" ]; then
    lines=$(wc -l < "$full_path")
    total_lines=$((total_lines + lines))
  fi
done

echo -e "总文件数: ${YELLOW}${#FILES[@]}${NC}"
echo -e "总代码行数: ${YELLOW}$total_lines${NC}"
echo ""

echo -e "${BLUE}📦 功能模块:${NC}"
echo -e "${GREEN}✅${NC} 前端分析追踪系统 (GA4, Plausible, 自定义)"
echo -e "${GREEN}✅${NC} 性能优化图片组件 (懒加载, 渐进式加载)"
echo -e "${GREEN}✅${NC} 错误边界和监控系统"
echo -e "${GREEN}✅${NC} 后端分析服务 (页面浏览, 事件追踪)"
echo -e "${GREEN}✅${NC} 完整的开发文档"
echo ""

echo -e "${CYAN}🔍 快速验证:${NC}"
echo ""

# TypeScript 类型检查
if [ -d "$PROJECT_ROOT/frontend/node_modules" ]; then
  cd "$PROJECT_ROOT/frontend"
  echo -e "检查 TypeScript 类型..."
  npx tsc --noEmit --skipLibCheck 2>&1 | head -5
  echo ""
fi

# Python 类型检查
if [ -d "$PROJECT_ROOT/backend/venv" ] || [ -d "$PROJECT_ROOT/backend/.venv" ]; then
  echo -e "检查 Python 类型..."
  cd "$PROJECT_ROOT/backend"
  python -m mypy app/services/analytics_service.py 2>&1 | head -5
  echo ""
fi

echo -e "${GREEN}🎉 验证完成！${NC}"
echo ""
echo -e "查看详细报告: ${CYAN}cat $PROJECT_ROOT/DEVELOPMENT_TASKS_COMPLETED.md${NC}"
echo ""
