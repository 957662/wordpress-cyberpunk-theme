#!/bin/bash

echo "🔍 Verifying created files..."
echo ""

errors=0

# Check types/models files
echo "📁 Checking types/models files..."
files=(
  "frontend/types/models/post.ts"
  "frontend/types/models/user.ts"
  "frontend/types/models/category.ts"
  "frontend/types/models/tag.ts"
  "frontend/types/models/comment.ts"
)

for file in "${files[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (missing)"
    ((errors++))
  fi
done

echo ""

# Check config files
echo "📁 Checking config files..."
if [ -f "frontend/config/constants.ts" ]; then
  echo "  ✅ frontend/config/constants.ts"
else
  echo "  ❌ frontend/config/constants.ts (missing)"
  ((errors++))
fi

echo ""

# Check components
echo "📁 Checking components..."
if [ -f "frontend/components/pagination/index.tsx" ]; then
  echo "  ✅ frontend/components/pagination/index.tsx"
else
  echo "  ❌ frontend/components/pagination/index.tsx (missing)"
  ((errors++))
fi

if [ -f "frontend/components/ui/toast/Toast.tsx" ]; then
  echo "  ✅ frontend/components/ui/toast/Toast.tsx"
else
  echo "  ❌ frontend/components/ui/toast/Toast.tsx (missing)"
  ((errors++))
fi

echo ""

if [ $errors -eq 0 ]; then
  echo "✅ All files verified successfully!"
  exit 0
else
  echo "❌ Found $errors missing files"
  exit 1
fi
