# 🧪 Testing Guide

> CyberPress Platform 测试指南

## 📋 目录

- [测试策略](#测试策略)
- [单元测试](#单元测试)
- [集成测试](#集成测试)
- [E2E 测试](#e2e-测试)
- [性能测试](#性能测试)
- [测试覆盖率](#测试覆盖率)
- [CI/CD](#cicd)

---

## 🎯 测试策略

### 测试金字塔

```
         /\
        /  \    E2E Tests (10%)
       /    \
      /------\  Integration Tests (20%)
     /        \
    /----------\ Unit Tests (70%)
```

- **单元测试**: 70% - 测试独立的函数和组件
- **集成测试**: 20% - 测试模块间的交互
- **E2E 测试**: 10% - 测试完整的用户流程

### 测试原则

- ✅ 快速反馈
- ✅ 易于维护
- ✅ 可读性强
- ✅ 独立运行
- ✅ 可重复执行

---

## 🔬 单元测试

### 运行单元测试

```bash
# 运行所有测试
npm test

# 监听模式
npm run test:watch

# CI 模式
npm run test:ci

# 生成覆盖率报告
npm run test:coverage
```

### 编写单元测试

```typescript
// __tests__/unit/utils/string.test.ts
import { truncate, slugify } from '@/lib/utils/string';

describe('String Utilities', () => {
  describe('truncate', () => {
    it('should truncate long text', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('should not truncate short text', () => {
      expect(truncate('Hi', 10)).toBe('Hi');
    });
  });

  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });
  });
});
```

### 组件测试

```typescript
// __tests__/unit/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('should render button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🔗 集成测试

### 运行集成测试

```bash
npm run test:integration
```

### 编写集成测试

```typescript
// __tests__/integration/api.integration.test.ts
import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('API Integration Tests', () => {
  it('should fetch posts', async () => {
    const queryClient = new QueryClient();

    const { result } = renderHook(
      () => useQuery({ queryKey: ['posts'], queryFn: fetchPosts }),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(10);
  });
});
```

---

## 🎭 E2E 测试

### 运行 E2E 测试

```bash
# 运行所有 E2E 测试
npm run test:e2e

# 运行特定测试
npx playwright test auth.e2e.ts

# 调试模式
npx playwright test --debug

# 显示浏览器
npx playwright test --headed
```

### 编写 E2E 测试

```typescript
// e2e/auth.e2e.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login user', async ({ page }) => {
    await page.goto('/auth/login');

    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('testuser')).toBeVisible();
  });
});
```

---

## ⚡ 性能测试

### 运行性能测试

```bash
npm run test:benchmark
```

### 编写性能测试

```typescript
// __tests__/performance/benchmark.test.ts
import { benchmark, compare } from '@/lib/performance/benchmark';

describe('Performance Benchmarks', () => {
  it('should benchmark array operations', async () => {
    const result = await benchmark(
      () => [1, 2, 3].map((x) => x * 2),
      { name: 'Array Map', iterations: 1000 }
    );

    expect(result.avgTime).toBeLessThan(1);
  });

  it('should compare performance', async () => {
    const comparison = await compare(
      () => [1, 2, 3].map((x) => x * 2),
      () => {
        const result = [];
        for (const x of [1, 2, 3]) {
          result.push(x * 2);
        }
        return result;
      },
      'map',
      'for loop'
    );

    expect(comparison.winner).toBeDefined();
  });
});
```

---

## 📊 测试覆盖率

### 查看覆盖率

```bash
npm run test:coverage
```

### 覆盖率目标

| 类型 | 目标 |
|------|------|
| 语句 | 70% |
| 分支 | 70% |
| 函数 | 70% |
| 行 | 70% |

### 覆盖率报告

覆盖率报告生成在 `coverage/` 目录：

- `coverage/index.html` - HTML 报告
- `coverage/lcov.info` - LCOV 格式

---

## 🚀 CI/CD

### GitHub Actions

测试在以下情况自动运行：

- Push to `main` or `develop`
- Pull Request to `main` or `develop`

### 工作流

1. **Unit Tests** - 运行所有单元测试
2. **Integration Tests** - 运行集成测试
3. **E2E Tests** - 运行端到端测试
4. **Coverage** - 生成覆盖率报告
5. **Lint** - 代码检查
6. **Type Check** - TypeScript 类型检查

### 本地模拟 CI

```bash
# 运行完整的 CI 流程
npm run test:ci
npm run lint
npm run type-check
```

---

## 📝 最佳实践

### 1. 测试命名

```typescript
// ❌ 不好
it('works', () => {});

// ✅ 好
it('should return user data when given valid ID', () => {});
```

### 2. 测试结构

```typescript
// AAA 模式 (Arrange, Act, Assert)

describe('UserService', () => {
  it('should create user', () => {
    // Arrange - 准备测试数据
    const userData = { name: 'John', email: 'john@example.com' };

    // Act - 执行被测试的代码
    const user = createUser(userData);

    // Assert - 验证结果
    expect(user.name).toBe('John');
    expect(user.email).toBe('john@example.com');
  });
});
```

### 3. Mock 外部依赖

```typescript
import { jest } from '@jest/globals';

// Mock API 调用
jest.mock('@/services/api', () => ({
  fetchPosts: jest.fn(() => Promise.resolve([])),
}));

// Mock 组件
jest.mock('@/components/Header', () => () => <div>Mock Header</div>);
```

### 4. 异步测试

```typescript
// 使用 async/await
it('should fetch data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// 使用 waitFor
it('should update state', async () => {
  render(<MyComponent />);
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

### 5. 清理副作用

```typescript
afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});
```

---

## 🔧 调试技巧

### 1. 只运行特定测试

```bash
# 运行匹配名称的测试
npm test -- --testNamePattern="should login"

# 运行特定文件
npm test path/to/test.test.ts
```

### 2. 调试模式

```bash
# Jest 调试
node --inspect-brk node_modules/.bin/jest --runInBand

# Playwright 调试
npx playwright test --debug
```

### 3. 查看输出

```typescript
it('should show output', () => {
  console.log('Debug info:', someVariable);
  expect(true).toBe(true);
});
```

---

## 📚 相关资源

- [Jest 文档](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Playwright 文档](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)

---

**更新时间**: 2026-03-05
**维护者**: AI Development Team
