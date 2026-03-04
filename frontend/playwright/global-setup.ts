/**
 * Playwright 全局设置
 * ============================================================================
 * 功能: 在所有测试前执行的设置
 * 版本: 1.0.0
 * 日期: 2026-03-05
 * ============================================================================
 */

import { FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 开始全局设置...')

  // 设置环境变量
  process.env.NODE_ENV = 'test'
  process.env.NEXT_PUBLIC_API_URL = process.env.TEST_API_URL || 'http://localhost:8000'

  // 等待服务就绪
  const baseURL = config.webServer?.url || 'http://localhost:3000'
  console.log(`📡 等待服务启动: ${baseURL}`)

  const maxRetries = 30
  const retryDelay = 2000

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(baseURL)
      if (response.ok) {
        console.log('✅ 服务已就绪')
        break
      }
    } catch (error) {
      if (i === maxRetries - 1) {
        throw new Error(`服务启动超时: ${baseURL}`)
      }
      console.log(`⏳ 等待服务... (${i + 1}/${maxRetries})`)
      await new Promise(resolve => setTimeout(resolve, retryDelay))
    }
  }

  // 创建测试用户
  console.log('👤 创建测试用户...')
  // 这里可以调用 API 创建测试用户

  console.log('✅ 全局设置完成')
}

export default globalSetup
