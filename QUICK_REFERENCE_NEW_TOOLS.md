# 🚀 CyberPress Platform - 新工具快速参考

> **创建时间**: 2026-03-03
> **文件数**: 9个
> **代码行数**: ~2,696行

---

## 📁 文件清单

| 文件路径 | 类型 | 大小 | 功能 |
|---------|------|------|------|
| `frontend/lib/validation.ts` | 工具库 | 202行 | 数据验证 |
| `frontend/lib/formatting.ts` | 工具库 | 281行 | 数据格式化 |
| `frontend/lib/animation.ts` | 工具库 | 245行 | 动画工具 |
| `frontend/lib/cryptography.ts` | 工具库 | 254行 | 加密安全 |
| `frontend/lib/array.ts` | 工具库 | 375行 | 数组操作 |
| `frontend/lib/api-client.ts` | 工具库 | 309行 | API客户端 |
| `frontend/app/playground/page.tsx` | 页面 | ~14KB | 组件演示 |
| `frontend/app/showcase/page.tsx` | 页面 | ~12KB | 产品展示 |
| `frontend/components/hooks/useOnClickOutside.ts` | 钩子 | 80行 | 点击检测 |

---

## 🔧 验证工具 (validation.ts)

### 常用函数
```typescript
import { isValidEmail, getPasswordStrength } from '@/lib/validation';

// 邮箱验证
isValidEmail('user@example.com') // true

// 密码强度
getPasswordStrength('MyP@ssw0rd')
// { score: 5, level: 'strong', feedback: [] }

// URL验证
isValidUrl('https://example.com') // true

// 信用卡验证 (Luhn算法)
isValidCreditCard('4111111111111111') // true

// 颜色验证
isValidHexColor('#ff0000') // true
```

### Validator类
```typescript
import { Validator } from '@/lib/validation';

const validator = new Validator()
  .validateEmail(email)
  .validatePassword(password)
  .validateMinLength(name, 2)
  .validateMaxLength(name, 50);

if (!validator.isValid()) {
  console.log(validator.getErrors());
}
```

---

## 🎨 格式化工具 (formatting.ts)

### 数字与货币
```typescript
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/formatting';

formatCurrency(1234.56, 'USD', 'en-US') // "$1,234.56"
formatNumber(1234567) // "1,234,567"
formatPercentage(0.1234, 2) // "12.34%"
```

### 日期时间
```typescript
import { formatDate, formatRelativeTime } from '@/lib/formatting';

formatDate(new Date(), 'long') // "March 3, 2026"
formatRelativeTime(new Date(Date.now() - 7200000)) // "2 hours ago"
```

### 文本处理
```typescript
import { truncate, capitalize, toCamelCase, toKebabCase } from '@/lib/formatting';

truncate('Long text here', 10) // "Long text..."
capitalize('hello world') // "Hello world"
toCamelCase('hello-world') // "helloWorld"
toKebabCase('helloWorld') // "hello-world"
```

### 数据脱敏
```typescript
import { maskEmail, maskCardNumber } from '@/lib/formatting';

maskEmail('john.doe@example.com') // "j***.***@example.com"
maskCardNumber('4111111111111111') // "411111****1111"
```

---

## 🎬 动画工具 (animation.ts)

### 缓动函数
```typescript
import { easings, animateValue } from '@/lib/animation';

// 应用缓动
easings.easeInOutCubic(0.5) // 0.5

// 值动画
animateValue(0, 100, 1000, 'easeInOutCubic', (value) => {
  console.log(value); // 0 -> 100
});
```

### 预设动画
```typescript
import { animations, applyAnimation } from '@/lib/animation';

const element = document.getElementById('my-element');

applyAnimation(element, animations.fadeIn);
applyAnimation(element, animations.slideInUp);
applyAnimation(element, animations.bounce);
applyAnimation(element, animations.pulse);
```

### 数学工具
```typescript
import { lerp, clamp, mapRange } from '@/lib/animation';

lerp(0, 100, 0.5) // 50
clamp(150, 0, 100) // 100
mapRange(50, 0, 100, 0, 1) // 0.5
```

---

## 🔐 加密工具 (cryptography.ts)

### 生成器
```typescript
import { generateUUID, generateOTP, generateAPIKey } from '@/lib/cryptography';

generateUUID() // "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
generateOTP(6) // "123456"
generateAPIKey('cp') // "cp_xxx_xxx"
```

### 编码
```typescript
import { encodeBase64, decodeBase64 } from '@/lib/cryptography';

encodeBase64('Hello') // "SGVsbG8="
decodeBase64('SGVsbG8=') // "Hello"
```

### 密码哈希
```typescript
import { hashPassword, verifyPassword } from '@/lib/cryptography';

const hashed = await hashPassword('mypassword');
const isValid = await verifyPassword('mypassword', hashed);
```

### 密码
```typescript
import { caesarCipher, rot13 } from '@/lib/cryptography';

caesarCipher('HELLO', 3) // "KHOOR"
rot13('HELLO') // "URYYB"
```

---

## 📊 数组工具 (array.ts)

### 基础操作
```typescript
import { chunk, unique, shuffle, sample } from '@/lib/array';

chunk([1,2,3,4,5], 2) // [[1,2], [3,4], [5]]
unique([1,2,2,3,3,4]) // [1,2,3,4]
shuffle([1,2,3,4,5]) // [3,1,5,2,4]
sample([1,2,3,4,5], 3) // [2,5,1]
```

### 高级操作
```typescript
import { groupBy, sortBy, partition, paginate } from '@/lib/array';

groupBy(
  [{type: 'a'}, {type: 'b'}, {type: 'a'}],
  (x) => x.type
) // { a: [...], b: [...] }

sortBy(
  [{age: 30}, {age: 20}],
  (x) => x.age
) // [{age: 20}, {age: 30}]

partition([1,2,3,4,5], (x) => x % 2 === 0)
// [[2,4], [1,3,5]]

paginate([1..100], 2, 10)
// { data: [11..20], totalPages: 10, currentPage: 2 }
```

### 集合操作
```typescript
import { intersection, difference, union } from '@/lib/array';

intersection([1,2,3], [2,3,4]) // [2,3]
difference([1,2,3], [2,3,4]) // [1]
union([1,2], [3,4]) // [1,2,3,4]
```

---

## 🌐 API客户端 (api-client.ts)

### 基本使用
```typescript
import { api, apiClient } from '@/lib/api-client';

// GET
const users = await api.getUsers({ page: 1, limit: 10 });

// POST
const newUser = await api.register({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe'
});

// PUT/PATCH
await api.updateUser('123', { name: 'Jane' });

// DELETE
await api.deleteUser('123');
```

### 文件操作
```typescript
// 上传
await api.uploadFile(file);

// 下载
await api.downloadFile('file-id', 'filename.pdf');
```

### 自定义请求
```typescript
const response = await apiClient.get('/custom-endpoint', {
  params: { key: 'value' }
});
```

---

## 🪝 Hooks (useOnClickOutside.ts)

### 使用示例
```typescript
import { useOnClickOutside, useOnEscape } from '@/components/hooks/useOnClickOutside';

function Modal() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // 点击外部关闭
  useOnClickOutside(ref, () => setIsOpen(false));

  // ESC键关闭
  useOnEscape(() => setIsOpen(false), isOpen);

  return isOpen ? (
    <div ref={ref} className="modal">
      Modal Content
    </div>
  ) : null;
}
```

---

## 📄 页面访问

### 开发环境
```bash
npm run dev
```

### 访问地址
- **组件演示场**: http://localhost:3000/playground
- **产品展示**: http://localhost:3000/showcase

### Playground页面包含
- Badge组件演示
- Avatar组件演示
- Rating组件演示
- Slider组件演示
- Toggle组件演示
- Input组件演示
- Button组件演示

### Showcase页面包含
- Hero区域
- 特性展示
- 用户评价
- 统计数据
- CTA区域
- 页脚

---

## 🎯 快速导入

### 验证相关
```typescript
import { isValidEmail, getPasswordStrength, Validator } from '@/lib/validation';
```

### 格式化相关
```typescript
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/formatting';
```

### 动画相关
```typescript
import { animations, applyAnimation, animateValue } from '@/lib/animation';
```

### 加密相关
```typescript
import { generateUUID, generateOTP, encodeBase64 } from '@/lib/cryptography';
```

### 数组相关
```typescript
import { chunk, sortBy, paginate, intersection } from '@/lib/array';
```

### API相关
```typescript
import { api, apiClient } from '@/lib/api-client';
```

### Hooks相关
```typescript
import { useOnClickOutside, useOnEscape } from '@/components/hooks/useOnClickOutside';
```

---

## 💡 最佳实践

### 1. 验证
```typescript
// ✅ 好
const validator = new Validator()
  .validateEmail(email)
  .validatePassword(password);

// ❌ 避免
if (email.includes('@') && password.length > 7) { }
```

### 2. 格式化
```typescript
// ✅ 好
const price = formatCurrency(amount, 'USD', 'en-US');

// ❌ 避免
const price = '$' + amount.toFixed(2);
```

### 3. API调用
```typescript
// ✅ 好
try {
  const user = await api.getUser('123');
} catch (error) {
  // 处理错误
}

// ❌ 避免
const user = await fetch('/api/users/123').then(r => r.json());
```

---

## 📚 更多资源

- **完整文档**: `/SESSION_COMPLETION_2026_03_03_FINAL.md`
- **项目README**: `/README.md`
- **快速开始**: `/QUICKSTART.md`

---

**创建于**: 2026-03-03
**版本**: 2.0.0
**状态**: ✅ 生产就绪
