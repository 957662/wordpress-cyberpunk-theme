#!/bin/bash

# 最终文件创建验证脚本
# 生成时间: 2026-03-06

echo "========================================"
echo "CyberPress Platform - 文件创建验证"
echo "生成时间: 2026-03-06"
echo "========================================"
echo ""

# 创建时间戳
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="verification_report_${TIMESTAMP}.txt"

# 计数器
TOTAL_FILES=0
EXISTING_FILES=0
MISSING_FILES=0

# 检查函数
check_file() {
  local file=$1
  local description=$2

  TOTAL_FILES=$((TOTAL_FILES + 1))

  if [ -f "$file" ]; then
    echo "✅ $description"
    echo "   路径: $file"
    EXISTING_FILES=$((EXISTING_FILES + 1))
  else
    echo "❌ $description"
    echo "   路径: $file (缺失)"
    MISSING_FILES=$((MISSING_FILES + 1))
  fi
  echo ""
}

echo "## 1. 测试文件"
echo "----------------------------------------"
check_file "frontend/__tests__/components/blog/CodeHighlight.test.tsx" "代码高亮组件测试"
check_file "frontend/__tests__/components/search/RealTimeSearch.test.tsx" "实时搜索组件测试"
check_file "frontend/__tests__/performance/component-performance.test.tsx" "性能测试"

echo "## 2. E2E 测试文件"
echo "----------------------------------------"
check_file "frontend/playwright/blog.spec.ts" "博客 E2E 测试"

echo "## 3. 文档文件"
echo "----------------------------------------"
check_file "PROJECT_CREATION_SUMMARY_2026-03-06.md" "项目总结文档"
check_file "QUICKSTART_GUIDE.md" "快速启动指南"
check_file "FILE_CREATION_REPORT_2026-03-06-FINAL.md" "文件创建报告"

echo "## 4. 组件文件"
echo "----------------------------------------"
check_file "frontend/components/blog/CodeHighlight.tsx" "代码高亮组件"
check_file "frontend/components/blog/TableOfContents.tsx" "目录导航组件"
check_file "frontend/components/blog/TagCloud.tsx" "标签云组件"

echo "## 5. 类型定义"
echo "----------------------------------------"
check_file "frontend/types/blog.ts" "博客类型定义"

echo "========================================"
echo "## 验证结果汇总"
echo "========================================"
echo ""
echo "📊 统计信息:"
echo "  总计文件: $TOTAL_FILES"
echo "  已创建: $EXISTING_FILES"
echo "  缺失: $MISSING_FILES"
echo ""

if [ $EXISTING_FILES -eq $TOTAL_FILES ]; then
  echo "🎉 所有文件已成功创建！"
  echo "✅ 项目状态: 完成"
elif [ $EXISTING_FILES -gt $((TOTAL_FILES / 2)) ]; then
  echo "⚠️  部分文件已创建"
  echo "📊 完成度: $(($EXISTING_FILES * 100 / $TOTAL_FILES))%"
else
  echo "❌ 多数文件未创建"
  echo "📊 完成度: $(($EXISTING_FILES * 100 / $TOTAL_FILES))%"
fi

echo ""
echo "========================================"
echo "详细报告已保存至: $REPORT_FILE"
echo "========================================"

# 生成详细报告
{
  echo "CyberPress Platform - 文件创建验证报告"
  echo "生成时间: $(date)"
  echo "========================================"
  echo ""
  echo "## 本次会话创建的文件列表"
  echo ""
  echo "### 1. 测试文件 (3 个)"
  echo "- frontend/__tests__/components/blog/CodeHighlight.test.tsx"
  echo "- frontend/__tests__/components/search/RealTimeSearch.test.tsx"
  echo "- frontend/__tests__/performance/component-performance.test.tsx"
  echo ""
  echo "### 2. E2E 测试 (1 个)"
  echo "- frontend/playwright/blog.spec.ts"
  echo ""
  echo "### 3. 文档文件 (3 个)"
  echo "- PROJECT_CREATION_SUMMARY_2026-03-06.md"
  echo "- QUICKSTART_GUIDE.md"
  echo "- FILE_CREATION_REPORT_2026-03-06-FINAL.md"
  echo ""
  echo "### 4. 组件文件 (4 个)"
  echo "- frontend/components/blog/CodeHighlight.tsx"
  echo "- frontend/components/blog/TableOfContents.tsx"
  echo "- frontend/components/blog/TagCloud.tsx"
  echo "- frontend/components/blog/CommentSystem.tsx"
  echo ""
  echo "### 5. 类型定义 (1 个)"
  echo "- frontend/types/blog.ts"
  echo ""
  echo "## 验证结果"
  echo "总计: $TOTAL_FILES 个文件"
  echo "已创建: $EXISTING_FILES 个"
  echo "缺失: $MISSING_FILES 个"
  echo "完成度: $(($EXISTING_FILES * 100 / $TOTAL_FILES))%"
  echo ""
  echo "## 项目状态"
  if [ $EXISTING_FILES -eq $TOTAL_FILES ]; then
    echo "✅ 所有文件已成功创建"
    echo "✅ 项目可以继续下一步开发"
  elif [ $EXISTING_FILES -gt $((TOTAL_FILES / 2)) ]; then
    echo "⚠️  部分文件已创建，建议检查缺失文件"
  else
    echo "❌ 文件创建失败，请重新执行创建命令"
  fi
} > "$REPORT_FILE"

echo ""
echo "✅ 验证完成！"
echo "📄 查看详细报告: cat $REPORT_FILE"
