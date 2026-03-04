# 🧪 CyberPress Platform - 完整测试指南

> 全面的测试策略、工具和最佳实践

## 📋 目录

- [测试概览](#测试概览)
- [项目测试现状](#项目测试现状)
- [快速开始](#快速开始)
- [测试类型](#测试类型)
- [测试文件结构](#测试文件结构)
- [编写测试](#编写测试)
- [运行测试](#运行测试)
- [覆盖率目标](#覆盖率目标)
- [CI/CD 集成](#cicd-集成)
- [最佳实践](#最佳实践)

---

## 🎯 测试概览

### 测试金字塔

CyberPress Platform 采用标准的测试金字塔策略：

```
        E2E (5%)
       ┌─────────┐
      │           │
     │ Integration (15%)
    │               │
   │   Unit Tests (80%)   │
  └───────────────────────┘
```

**分配原则**:
- **单元测试 (80%)**: 快速、独立、覆盖核心逻辑
- **集成测试 (15%)**: 验证模块间交互
- **E2E 测试 (5%)**: 关键用户流程

### 技术栈

| 类型 | 工具 | 用途 |
|------|------|------|
| 单元测试 | Jest + Testing Library | 组件和函数测试 |
| 集成测试 | Jest + MSW | API 集成测试 |
| E2E 测试 | Playwright | 完整流程测试 |
| 性能测试 | 自定义基准测试 | 性能回归检测 |

---

## 📊 项目测试现状

### 当前状态

```
总体测试覆盖率: ████████████████████ 75%

前端测试:     ███████████████████░ 78%
├── 组件测试: ████████████████████ 85%
├── 工具函数: ████████████████████ 90%
├── Hooks:    ████████████████░░░░ 70%
└── 页面:     ██████████████░░░░░░░ 60%

后端测试:     ██████████████████░░ 72%
├── API:      ████████████████░░░░ 70%
├── Services: ███████████████████░ 75%
└── Models:   ████████████████████ 80%
```

### 已完成的测试

✅ **单元测试** (~100+ 测试用例)
- Button 组件测试
- Card 组件测试
- SEO 工具测试
- i18n 工具测试
- 性能监控测试
- 字符串工具测试
- 颜色工具测试
- 验证工具测试

✅ **集成测试** (~20+ 测试用例)
- API 集成测试
- 认证流程测试
- 博客文章测试
- 用户操作测试

✅ **E2E 测试** (~15+ 测试用例)
- 登录/注册流程
- 博客浏览
- 文章交互
- 评论功能

✅ **性能测试**
- 数组操作基准测试
- 字符串操作基准测试
- 对象操作基准测试
- 渲染性能测试

---

## 🚀 快速开始

### 安装依赖

```bash
# 前端测试依赖
npm install --save-dev \
  jest \
  @jest/globals \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @playwright/test \
  msw \
  @swc/jest

# 后端测试依赖
pip install pytest pytest-cov pytest-asyncio httpx
```

### 运行测试

```bash
# 前端单元测试
npm test

# 前端 E2E 测试
npm run test:e2e

# 后端测试
cd backend && pytest

# 生成覆盖率报告
npm run test:coverage
```

---

## 📁 测试类型

### 1. 单元测试

**目标**: 测试独立的函数和组件

**示例**:
```typescript
// __tests__/unit/utils/string.test.ts
import { slugify, truncate } from '@/lib/utils/string';

describe('String Utilities', () => {
  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test   Multiple    Spaces')).toBe('test-multiple-spaces');
    });

    it('should handle special characters', () => {
      expect(slugify('Hello @#$% World')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(slugify('')).toBe('');
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      expect(truncate('This is a very long text', 10)).toBe('This is a...');
    });

    it('should not truncate short text', () => {
      expect(truncate('Short', 10)).toBe('Short');
    });
  });
});
```

### 2. 组件测试

**目标**: 测试 React 组件的渲染和交互

**示例**:
```typescript
// __tests__/unit/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should apply variant classes', () => {
    const { container } = render(<Button variant="neon">Click</Button>);
    expect(container.firstChild).toHaveClass('variant-neon');
  });
});
```

### 3. 集成测试

**目标**: 测试多个模块协同工作

**示例**:
```typescript
// __tests__/integration/api.integration.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/posts', () => {
    return HttpResponse.json([
      { id: 1, title: 'Post 1' },
      { id: 2, title: 'Post 2' },
    ]);
  })
);

describe('API Integration Tests', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should fetch and display posts', async () => {
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
    expect(result.current.data).toHaveLength(2);
  });
});
```

### 4. E2E 测试

**目标**: 测试完整的用户流程

**示例**:
```typescript
// e2e/auth.e2e.ts
import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('should complete registration flow', async ({ page }) => {
    await page.goto('/auth/register');

    // Fill registration form
    await page.getByLabel('Username').fill('newuser');
    await page.getByLabel('Email').fill('new@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByLabel('Confirm Password').fill('password123');

    // Submit form
    await page.getByRole('button', { name: 'Register' }).click();

    // Verify success
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome, newuser')).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    await page.goto('/auth/register');

    // Submit empty form
    await page.getByRole('button', { name: 'Register' }).click();

    // Verify errors
    await expect(page.getByText('Username is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
  });
});
```

### 5. 性能测试

**目标**: 确保性能没有退化

**示例**:
```typescript
// __tests__/performance/benchmark.test.ts
import { benchmark, compare } from '@/lib/performance/benchmark';

describe('Performance Benchmarks', () => {
  it('should complete array operations under threshold', async () => {
    const arr = Array.from({ length: 1000 }, (_, i) => i);

    const result = await benchmark(
      () => arr.map((x) => x * 2),
      { name: 'Array Map 1000 items', iterations: 1000 }
    );

    expect(result.avgTime).toBeLessThan(1); // < 1ms
  });

  it('should compare map vs for loop', async () => {
    const arr = Array.from({ length: 1000 }, (_, i) => i);

    const comparison = await compare(
      () => arr.map((x) => x * 2),
      () => {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
          result.push(arr[i] * 2);
        }
        return result;
      },
      'map',
      'for loop',
      1000
    );

    // Log comparison results
    console.log(`Winner: ${comparison.winner}`);
    console.log(`Difference: ${comparison.difference.toFixed(4)}ms`);
    console.log(`Percentage: ${comparison.percentage.toFixed(2)}%`);
  });
});
```

---

## 📂 测试文件结构

```
frontend/
├── __tests__/
│   ├── unit/
│   │   ├── components/
│   │   │   ├── Button.test.tsx
│   │   │   ├── Card.test.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── seo.test.ts
│   │   │   ├── i18n.test.ts
│   │   │   ├── performance.test.ts
│   │   │   └── utils/
│   │   │       ├── string.test.ts
│   │   │       ├── color.test.ts
│   │   │       └── validation.test.ts
│   │   └── hooks/
│   │       ├── useDebounce.test.ts
│   │       └── useLocalStorage.test.ts
│   ├── integration/
│   │   ├── api.integration.test.ts
│   │   └── auth.integration.test.ts
│   └── __mocks__/
│       ├── fileMock.js
│       └── styleMock.js
├── e2e/
│   ├── auth.e2e.ts
│   ├── blog.e2e.ts
│   └── ...
└── lib/
    └── testing/
        ├── performance-tests.test.ts
        └── test-utils.tsx

backend/
└── tests/
    ├── unit/
    │   ├── test_models.py
    │   ├── test_services.py
    │   └── test_utils.py
    ├── integration/
    │   ├── test_api.py
    │   └── test_auth.py
    └── conftest.py
```

---

## ✍️ 编写测试

### 测试模板

```typescript
/**
 * 组件测试模板
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from '@/components/...';

describe('ComponentName', () => {
  // 准备测试数据
  const defaultProps = { ... };
  const renderComponent = (props = {}) =>
    render(<ComponentName {...defaultProps} {...props} />);

  // 基础渲染测试
  it('should render successfully', () => {
    const { container } = renderComponent();
    expect(container).toBeInTheDocument();
  });

  // Props 测试
  it('should handle prop changes', () => {
    renderComponent({ prop: 'value' });
    expect(screen.getByText('value')).toBeInTheDocument();
  });

  // 交互测试
  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    renderComponent({ onClick: handleClick });
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // 边界情况
  it('should handle edge cases', () => {
    renderComponent({ data: null });
    expect(screen.getByText('No data')).toBeInTheDocument();
  });
});
```

### 测试最佳实践

1. **使用描述性的测试名称**
   ```typescript
   // ❌ 不好
   it('works', () => {});

   // ✅ 好
   it('should return user profile when given valid ID', () => {});
   ```

2. **遵循 AAA 模式**
   ```typescript
   it('should calculate total price', () => {
     // Arrange - 准备
     const items = [{ price: 10 }, { price: 20 }];

     // Act - 执行
     const total = calculateTotal(items);

     // Assert - 断言
     expect(total).toBe(30);
   });
   ```

3. **测试行为而非实现**
   ```typescript
   // ❌ 不好
   it('should set state variable', () => {
     expect(component.state.isLoading).toBe(true);
   });

   // ✅ 好
   it('should show loading indicator', () => {
     expect(screen.getByRole('progressbar')).toBeInTheDocument();
   });
   ```

4. **使用辅助函数减少重复**
   ```typescript
   const renderForm = (props = {}) => {
     return render(<LoginForm {...defaultProps} {...props} />);
   };
   ```

---

## 🎯 覆盖率目标

### 目标覆盖率

| 类型 | 当前 | 目标 |
|------|------|------|
| 语句 | 75% | 80% |
| 分支 | 70% | 75% |
| 函数 | 75% | 80% |
| 行 | 75% | 80% |

### 查看覆盖率

```bash
# 生成覆盖率报告
npm run test:coverage

# 在浏览器中查看
open coverage/index.html
```

### 覆盖率排除

```javascript
// jest.config.js
collectCoverageFrom: [
  '**/*.{js,jsx,ts,tsx}',
  '!**/*.d.ts',
  '!**/node_modules/**',
  '!**/.next/**',
  '!**/coverage/**',
  '!**/__tests__/**',
  '!**/*.stories.{js,jsx,ts,tsx}',
  '!**/dist/**',
  '!**/build/**',
],
```

---

## 🔄 CI/CD 集成

### GitHub Actions 工作流

测试在以下情况自动运行：
- Push to `main` or `develop`
- Pull Request

### 工作流步骤

1. **Lint** - ESLint 检查
2. **Type Check** - TypeScript 类型检查
3. **Unit Tests** - 运行所有单元测试
4. **Integration Tests** - 运行集成测试
5. **E2E Tests** - 运行 E2E 测试
6. **Backend Tests** - 运行后端测试
7. **Coverage** - 生成覆盖率报告

### 本地测试 CI 流程

```bash
# 模拟完整 CI 流程
npm run lint
npm run type-check
npm run test:ci
npm run test:integration
npm run test:e2e
```

---

## 📚 最佳实践总结

### DO ✅

- 使用描述性的测试名称
- 遵循 AAA 模式
- 测试用户行为而非实现细节
- 保持测试简单和独立
- 使用辅助函数减少重复
- Mock 外部依赖
- 测试边界情况
- 保持测试快速运行

### DON'T ❌

- 不要测试第三方库
- 不要编写脆弱的测试
- 不要过度 mock
- 不要忽略测试警告
- 不要在测试中包含逻辑
- 不要测试私有方法
- 不要编写重复的测试
- 不要忽略覆盖率目标

---

## 🔗 相关文档

- [Jest 文档](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Playwright 文档](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)

---

**最后更新**: 2026-03-05
**维护者**: AI Development Team
