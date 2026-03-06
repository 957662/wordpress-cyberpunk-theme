#!/bin/bash

echo "======================================"
echo "代码行数统计 - CyberPress Platform"
echo "======================================"
echo ""

files=(
  "backend/app/api/v1/auth_enhanced.py"
  "backend/app/api/v1/posts_enhanced.py"
  "backend/app/api/v1/social.py"
  "backend/app/services/auth_service_enhanced.py"
  "backend/app/services/post_service_enhanced.py"
  "backend/app/services/social_service_enhanced.py"
  "backend/app/services/search_service.py"
  "backend/app/services/email_service.py"
  "frontend/lib/services/auth-service.ts"
  "frontend/lib/services/post-service.ts"
  "frontend/lib/services/social-service.ts"
)

total_lines=0
echo "文件详情:"
echo "----------"

for file in "${files[@]}"; do
  filepath="/root/.openclaw/workspace/cyberpress-platform/$file"
  if [ -f "$filepath" ]; then
    lines=$(wc -l < "$filepath")
    total_lines=$((total_lines + lines))
    echo "$file: $lines 行"
  fi
done

echo ""
echo "======================================"
echo "总计: $total_lines 行代码"
echo "======================================"
