/**
 * Jest 配置文件 - 完整版
 * 用于测试前端组件和功能
 */

const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // 提供 Next.js 应用的路径
  dir: './',
})

// 自定义 Jest 配置
const customJestConfig = {
  // 测试环境
  testEnvironment: 'jest-environment-jsdom',

  // 设置文件
  setupFilesAfterEnv: ['<rootDir>/jest.setup.complete.js'],

  // 模块路径映射
  moduleNameMapper: {
    // 处理绝对路径导入
    '^@/(.*)$': '<rootDir>/$1',

    // 处理静态资源
    '\\.(jpg|jpeg|png|gif|svg|ico)$': '<rootDir>/__mocks__/fileMock.js',

    // 处理 CSS 文件
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    // 处理样式模块
    '^@/styles/(.*)$': 'identity-obj-proxy',
  },

  // 测试匹配模式
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // 转换配置
  transform: {
    '^.+\\.(ts|tsx)$': ['@swc/jest', {
      jsc: {
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
  },

  // 忽略转换
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],

  // 覆盖率收集
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'services/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/dist/**',
  ],

  // 覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // 覆盖率报告格式
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
  ],

  // 模块目录
  moduleDirectories: ['node_modules', '<rootDir>'],

  // 测试超时时间（毫秒）
  testTimeout: 10000,

  // 并行执行测试
  maxWorkers: '50%',

  // 清除模拟
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // 全局变量
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
}

// 导出配置
module.exports = createJestConfig(customJestConfig)
