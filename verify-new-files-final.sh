#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     🎉 CyberPress Platform - 新文件验证报告 (2026-03-05)      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# 定义项目根目录
PROJECT_ROOT="/root/.openclaw/workspace/cyberpress-platform"
cd "$PROJECT_ROOT" || exit 1

# 统计变量
total_files=0
total_lines=0
success_count=0

# 检查文件的函数
check_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        lines=$(wc -l < "$file")
        total_files=$((total_files + 1))
        total_lines=$((total_lines + lines))
        success_count=$((success_count + 1))
        echo "✅ $description"
        echo "   📄 $file"
        echo "   📏 $lines 行代码"
        echo ""
    else
        echo "❌ $description"
        echo "   📄 $file (不存在)"
        echo ""
    fi
}

echo "📦 UI 组件"
echo "─────────────────────────────────────────────────────────────────"
check_file "frontend/components/ui/Knob.tsx" "旋钮组件"
check_file "frontend/components/ui/Slider.tsx" "滑块组件"
check_file "frontend/components/ui/Divider.tsx" "分割线组件"

echo "🪝 自定义 Hooks"
echo "─────────────────────────────────────────────────────────────────"
check_file "frontend/hooks/useLocalStorage.ts" "本地存储 Hook"
check_file "frontend/hooks/useDebounce.ts" "防抖 Hook"
check_file "frontend/hooks/useIntersectionObserver.ts" "交叉观察器 Hook"
check_file "frontend/hooks/useMediaQuery.ts" "媒体查询 Hook"

echo "🔧 服务层"
echo "─────────────────────────────────────────────────────────────────"
check_file "frontend/services/api/httpClient.ts" "HTTP 客户端"
check_file "frontend/services/api/authService.ts" "认证服务"

echo "🛠️  工具函数"
echo "─────────────────────────────────────────────────────────────────"
check_file "frontend/lib/validators.ts" "验证器工具"
check_file "frontend/lib/formatters.ts" "格式化工具"
check_file "frontend/lib/constants/index.ts" "常量定义"
check_file "frontend/lib/performance/lazyLoad.ts" "懒加载工具"

echo "📝 类型定义"
echo "─────────────────────────────────────────────────────────────────"
check_file "frontend/types/common.ts" "通用类型"
check_file "frontend/types/index.ts" "类型导出"

echo "🎨 实用组件"
echo "─────────────────────────────────────────────────────────────────"
check_file "frontend/components/utility/EmptyState.tsx" "空状态组件"
check_file "frontend/components/utility/BackToTop.tsx" "返回顶部组件"
check_file "frontend/components/utility/ScrollIndicator.tsx" "滚动指示器组件"
check_file "frontend/components/utility/CodeBlock.tsx" "代码块组件"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                        📊 统计摘要                              ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║  ✅ 成功创建文件: $success_count / 19"
echo "║  📄 总文件数: $total_files"
echo "║  📏 总代码行数: ~$total_lines 行"
echo "║  📦 项目路径: $PROJECT_ROOT"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

if [ $success_count -eq 19 ]; then
    echo "🎉 所有文件创建成功！"
    exit 0
else
    echo "⚠️  部分文件创建失败"
    exit 1
fi
