#!/bin/bash

echo "🔍 验证新创建的文件..."
echo "================================"

# 检查文件是否存在
check_file() {
  if [ -f "$1" ]; then
    size=$(du -h "$1" | cut -f1)
    echo "✅ $1 ($size)"
    return 0
  else
    echo "❌ $1 - 文件不存在"
    return 1
  fi
}

# 检查目录是否存在
check_dir() {
  if [ -d "$1" ]; then
    echo "✅ $1 (目录)"
    return 0
  else
    echo "❌ $1 - 目录不存在"
    return 1
  fi
}

echo ""
echo "📁 新创建的文件:"
echo "----------------"

count=0

# 工具文件
if check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/lib/utils/classnames.ts"; then
  ((count++))
fi

# 页面组件
if check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/app/dashboard/analytics/page.tsx"; then
  ((count++))
fi

if check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/app/tools/page.tsx"; then
  ((count++))
fi

# React 组件
if check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/tools/PasswordGenerator.tsx"; then
  ((count++))
fi

if check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/tools/index.ts"; then
  ((count++))
fi

echo ""
echo "📊 统计:"
echo "--------"
echo "✅ 成功创建: $count/5 个文件"
echo ""

# 检查文件内容
echo "📝 文件内容验证:"
echo "----------------"

if [ -f "/root/.openclaw/workspace/cyberpress-platform/frontend/lib/utils/classnames.ts" ]; then
  lines=$(wc -l < /root/.openclaw/workspace/cyberpress-platform/frontend/lib/utils/classnames.ts)
  echo "classnames.ts: $lines 行"
fi

if [ -f "/root/.openclaw/workspace/cyberpress-platform/frontend/components/tools/PasswordGenerator.tsx" ]; then
  lines=$(wc -l < /root/.openclaw/workspace/cyberpress-platform/frontend/components/tools/PasswordGenerator.tsx)
  echo "PasswordGenerator.tsx: $lines 行"
fi

if [ -f "/root/.openclaw/workspace/cyberpress-platform/frontend/app/dashboard/analytics/page.tsx" ]; then
  lines=$(wc -l < /root/.openclaw/workspace/cyberpress-platform/frontend/app/dashboard/analytics/page.tsx)
  echo "analytics/page.tsx: $lines 行"
fi

echo ""
echo "✅ 验证完成！"
echo "================================"

if [ $count -eq 5 ]; then
  echo "🎉 所有文件创建成功！"
  exit 0
else
  echo "⚠️  部分文件创建失败"
  exit 1
fi
