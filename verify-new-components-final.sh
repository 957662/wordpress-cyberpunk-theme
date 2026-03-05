#!/bin/bash

echo "=== CyberPress 新组件验证报告 ==="
echo "生成时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 定义组件列表
declare -A components=(
  ["loading/CyberSpinner.tsx"]="赛博朋克风格加载组件"
  ["loading/ScanLineLoader.tsx"]="扫描线加载组件"
  ["pwa/InstallPrompt.tsx"]="PWA安装提示组件"
  ["theme/ThemeCustomizer.tsx"]="主题自定义组件"
  ["features/NotificationCenter.tsx"]="通知中心组件"
  ["features/QuickActions.tsx"]="快捷操作组件"
  ["utility/ErrorBoundary.tsx"]="错误边界组件"
  ["performance/CoreWebVitals.tsx"]="核心网页指标组件"
  ["seo/MetaTags.tsx"]="SEO元标签组件"
)

echo "检查组件文件..."
echo ""

total=0
success=0
failed=0

for file in "${!components[@]}"; do
  total=$((total + 1))
  filepath="/root/.openclaw/workspace/cyberpress-platform/frontend/components/$file"
  
  if [ -f "$filepath" ]; then
    lines=$(wc -l < "$filepath")
    if [ "$lines" -gt 50 ]; then
      echo "✅ ${components[$file]}"
      echo "   文件: $file"
      echo "   行数: $lines"
      success=$((success + 1))
    else
      echo "⚠️  ${components[$file]} (文件可能不完整)"
      echo "   文件: $file"
      echo "   行数: $lines"
      failed=$((failed + 1))
    fi
  else
    echo "❌ ${components[$file]} (文件不存在)"
    echo "   文件: $file"
    failed=$((failed + 1))
  fi
  echo ""
done

echo "=== 统计信息 ==="
echo "总计: $total"
echo "成功: $success"
echo "失败: $failed"
echo ""

if [ $failed -eq 0 ]; then
  echo "🎉 所有组件创建成功！"
  exit 0
else
  echo "⚠️  部分组件创建失败或可能不完整"
  exit 1
fi
