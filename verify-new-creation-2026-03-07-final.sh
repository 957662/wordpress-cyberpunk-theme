#!/bin/bash

echo "=========================================="
echo "验证新创建的文件 - 2026-03-07"
echo "=========================================="
echo ""

# 检查文件是否存在
check_file() {
  if [ -f "$1" ]; then
    echo "✅ $1"
    return 0
  else
    echo "❌ $1 (不存在)"
    return 1
  fi
}

# 组件文件
echo "📦 组件文件:"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/FeaturedPosts.tsx"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/BlogStats.tsx"
echo ""

# API 文件
echo "🔌 API 文件:"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/lib/api/blog.ts"
echo ""

# Hooks 文件
echo "🎣 Hooks 文件:"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/hooks/useBlog.ts"
echo ""

# 工具函数文件
echo "🛠️ 工具函数文件:"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/lib/utils/formatters.ts"
echo ""

# 统计代码行数
echo "📊 代码统计:"
echo "FeaturedPosts.tsx: $(wc -l < /root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/FeaturedPosts.tsx 2>/dev/null || echo '0') 行"
echo "BlogStats.tsx: $(wc -l < /root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/BlogStats.tsx 2>/dev/null || echo '0') 行"
echo "blog.ts (API): $(wc -l < /root/.openclaw/workspace/cyberpress-platform/frontend/lib/api/blog.ts 2>/dev/null || echo '0') 行"
echo "useBlog.ts: $(wc -l < /root/.openclaw/workspace/cyberpress-platform/frontend/hooks/useBlog.ts 2>/dev/null || echo '0') 行"
echo "formatters.ts: $(wc -l < /root/.openclaw/workspace/cyberpress-platform/frontend/lib/utils/formatters.ts 2>/dev/null || echo '0') 行"
echo ""

echo "=========================================="
echo "✅ 验证完成"
echo "=========================================="
