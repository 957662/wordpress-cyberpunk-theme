/**
 * CyberPress Platform - Jest 配置
 * ============================================================================
 * 功能: 单元测试框架配置
 * 版本: 1.0.0
 * 日期: 2026-03-03
 * ============================================================================
 */

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // 提供 Next.js 应用的路径
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  // 设置测试环境
  testEnvironment: 'jest-environment-jsdom',

  // 模块路径映射（与 tsconfig.json 一致）
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/services/(.*)$': '<rootDir>/services/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/store/(.*)$': '<rootDir>/store/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',

    // 处理 CSS 和静态资源
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__tests__/__mocks__/fileMock.js',
  },

  // 测试文件匹配模式
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // 测试覆盖的文件
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'services/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/__tests__/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/.storybook/**',
    '!**/stories/**',
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
  coverageReporters: ['text', 'text-summary', 'html', 'lcov'],

  // 覆盖率输出目录
  coverageDirectory: 'coverage',

  // 安装模块
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // 忽略的文件和目录
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/.storybook/',
    '<rootDir>/coverage/',
  ],

  // 模块目录
  moduleDirectories: ['node_modules', '<rootDir>'],

  // 全局变量
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    },
  },

  // 转换器
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },

  // 快照序列化
  snapshotSerializers: ['@emotion/jest/enzyme-serializer'],

  // 测试超时时间（毫秒）
  testTimeout: 10000,

  // 并行执行测试
  maxWorkers: '50%',

  // 详细输出
  verbose: true,

  // 显示测试用例的完整名称和堆栈跟踪
  errorOnDeprecated: true,

  // 清除模拟
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};

// 导出配置
module.exports = createJestConfig(customJestConfig);
