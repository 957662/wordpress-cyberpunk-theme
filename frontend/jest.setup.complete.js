/**
 * Jest 设置文件 - 完整版
 * 在所有测试前执行的全局设置
 */

import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// =====================================================
// 全局模拟
// =====================================================

// 模拟 matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// 模仿 IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// 模拟 ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// 模仿 requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0)
}

global.cancelAnimationFrame = (id) => {
  clearTimeout(id)
}

// =====================================================
// 环境变量
// =====================================================

process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000/api'

// =====================================================
// TextEncoder/TextDecoder polyfill
// =====================================================

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// =====================================================
// 测试工具函数
// =====================================================

// 创建一个模拟的 localStorage
const createMockLocalStorage = () => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    get length: () => {
      return Object.keys(store).length
    },
    key: (index: number) => {
      return Object.keys(store)[index] || null
    },
  }
}

// 模拟 localStorage
Object.defineProperty(window, 'localStorage', {
  value: createMockLocalStorage(),
})

// 模拟 sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: createMockLocalStorage(),
})

// =====================================================
// 清理函数
// =====================================================

afterEach(() => {
  // 在每个测试后清理
  jest.clearAllMocks()
})

// =====================================================
// 控制台错误抑制（可选）
// =====================================================

// 在测试中抑制某些预期的控制台错误
// const originalError = console.error
// console.error = (...args) => {
//   if (
//     typeof args[0] === 'string' &&
//     args[0].includes('Warning: ReactDOM.render')
//   ) {
//     return
//   }
//   originalError.call(console, ...args)
// }
