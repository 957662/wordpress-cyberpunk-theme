/**
 * Playwright E2E 测试配置
 * ============================================================================
 * 功能: 配置端到端测试框架
 * 版本: 1.0.0
 * 日期: 2026-03-05
 * ============================================================================
 */

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  // 测试目录
  testDir: './playwright',

  // 测试文件匹配模式
  testMatch: '**/*.spec.ts',

  // 超时时间（毫秒）
  timeout: 30 * 1000,

  // 每个测试的超时时间
  expect: {
    timeout: 5000
  },

  // 失败时截图
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  // 完全并行运行测试
  fullyParallel: true,

  // CI 环境下禁止并行
  workers: process.env.CI ? 1 : undefined,

  // 测试报告
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'junit-results.xml' }],
    ['list']
  ],

  // 全局设置
  globalSetup: './playwright/global-setup.ts',
  globalTeardown: './playwright/global-teardown.ts',

  // 测试用例配置
  use: {
    // 基础 URL
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // 追踪设置
    trace: 'on-first-retry',

    // 截图设置
    screenshot: 'only-on-failure',

    // 视频设置
    video: 'retain-on-failure',

    // 操作超时
    actionTimeout: 10000,

    // 导航超时
    navigationTimeout: 30000,

    // 浏览器视口大小
    viewport: { width: 1280, height: 720 },

    // 忽略 HTTPS 错误
    ignoreHTTPSErrors: true,

    // 用户代理
    userAgent: 'CyberPress-E2E-Test/1.0.0',

    // 额外的 HTTP 头
    extraHTTPHeaders: {
      'X-Test-Environment': 'e2e',
    },

    // 上下文选项
    contextOptions: {
      // 存储状态（登录信息等）
      storageState: './playwright/.auth/user.json',
    },
  },

  // 项目配置
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* 移动端测试 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* 平板测试 */
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // 开发服务器
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },

  // 输出目录
  outputDir: 'test-results',

  // 保留测试输出
  preserveOutput: 'failures-only',
})
