#!/bin/bash

# 阅读进度追踪系统 - 文件验证脚本

echo "=========================================="
echo "阅读进度追踪系统 - 文件验证"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total_files=0
created_files=0
missing_files=0

# 检查文件是否存在
check_file() {
    local file=$1
    total_files=$((total_files + 1))
    
    if [ -f "$file" ]; then
        size=$(ls -lh "$file" | awk '{print $5}')
        echo -e "${GREEN}✓${NC} $file ($size)"
        created_files=$((created_files + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $file (缺失)"
        missing_files=$((missing_files + 1))
        return 1
    fi
}

echo "📦 组件文件检查"
echo "----------------------------------------"

# 核心组件
check_file "frontend/components/reading-progress/ReadingProgressBar.tsx"
check_file "frontend/components/reading-progress/ReadingTimeEstimator.tsx"
check_file "frontend/components/reading-progress/ReadingStatsCard.tsx"
check_file "frontend/components/reading-progress/ReadingHistory.tsx"

# 高级组件
check_file "frontend/components/reading-progress/ReadingGoalSetting.tsx"
check_file "frontend/components/reading-progress/ReadingAchievement.tsx"

# 服务和 Hooks
check_file "frontend/components/reading-progress/ReadingProgressService.ts"
check_file "frontend/components/reading-progress/useReadingProgress.ts"

# 测试和文档
check_file "frontend/components/reading-progress/ReadingProgress.test.tsx"
check_file "frontend/components/reading-progress/README.md"
check_file "frontend/components/reading-progress/index.ts"

echo ""
echo "🔌 API 路由检查"
echo "----------------------------------------"

check_file "frontend/app/api/reading-progress/route.ts"
check_file "frontend/app/api/reading-history/route.ts"
check_file "frontend/app/api/reading-stats/route.ts"

echo ""
echo "📄 演示页面检查"
echo "----------------------------------------"

check_file "frontend/app/(public)/reading-progress-demo/page.tsx"

echo ""
echo "📘 类型定义检查"
echo "----------------------------------------"

check_file "frontend/types/reading-progress.types.ts"

echo ""
echo "=========================================="
echo "📊 统计结果"
echo "=========================================="
echo -e "总文件数: ${YELLOW}$total_files${NC}"
echo -e "已创建: ${GREEN}$created_files${NC}"
echo -e "缺失: ${RED}$missing_files${NC}"
echo ""

# 计算成功率
if [ $total_files -gt 0 ]; then
    success_rate=$((created_files * 100 / total_files))
    echo -e "成功率: ${GREEN}${success_rate}%${NC}"
fi

echo ""

# 最终结果
if [ $missing_files -eq 0 ]; then
    echo -e "${GREEN}🎉 所有文件创建成功！${NC}"
    echo ""
    echo "📚 使用文档: frontend/components/reading-progress/README.md"
    echo "🎯 演示页面: /reading-progress-demo"
    echo "📝 创建报告: READING_PROGRESS_CREATION_REPORT.md"
    exit 0
else
    echo -e "${RED}❌ 有 $missing_files 个文件创建失败${NC}"
    exit 1
fi
