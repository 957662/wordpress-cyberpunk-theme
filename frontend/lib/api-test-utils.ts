/**
 * API 测试工具
 * 用于测试和调试 API 端点
 */

import { apiClient } from './api-client';

// 测试结果类型
export interface TestResult {
  endpoint: string;
  method: string;
  success: boolean;
  status?: number;
  data?: any;
  error?: string;
  duration: number;
}

// 测试套件结果
export interface TestSuiteResult {
  name: string;
  results: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  totalDuration: number;
}

/**
 * API 测试工具类
 */
export class ApiTester {
  private results: TestResult[] = [];

  /**
   * 执行单个 API 测试
   */
  async testEndpoint(
    name: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any,
    config?: any
  ): Promise<TestResult> {
    const startTime = Date.now();

    try {
      let response: any;

      switch (method) {
        case 'GET':
          response = await apiClient.get(endpoint, { ...config, params: data });
          break;
        case 'POST':
          response = await apiClient.post(endpoint, data, config);
          break;
        case 'PUT':
          response = await apiClient.put(endpoint, data, config);
          break;
        case 'PATCH':
          response = await apiClient.patch(endpoint, data, config);
          break;
        case 'DELETE':
          response = await apiClient.delete(endpoint, { ...config, data });
          break;
      }

      const duration = Date.now() - startTime;
      const result: TestResult = {
        endpoint: name,
        method,
        success: true,
        status: response?.code || 200,
        data: response,
        duration,
      };

      this.results.push(result);
      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const result: TestResult = {
        endpoint: name,
        method,
        success: false,
        status: error?.status,
        error: error?.message || 'Unknown error',
        duration,
      };

      this.results.push(result);
      return result;
    }
  }

  /**
   * 获取所有测试结果
   */
  getResults(): TestResult[] {
    return this.results;
  }

  /**
   * 清除测试结果
   */
  clearResults(): void {
    this.results = [];
  }

  /**
   * 打印测试报告
   */
  printReport(): void {
    console.log('\n=== API 测试报告 ===\n');

    const passedTests = this.results.filter((r) => r.success).length;
    const failedTests = this.results.filter((r) => !r.success).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`总测试数: ${this.results.length}`);
    console.log(`通过: ${passedTests}`);
    console.log(`失败: ${failedTests}`);
    console.log(`总耗时: ${totalDuration}ms\n`);

    this.results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.method} ${result.endpoint}`);
      console.log(`   状态: ${result.success ? '✅ 通过' : '❌ 失败'}`);
      console.log(`   耗时: ${result.duration}ms`);

      if (result.status) {
        console.log(`   HTTP状态码: ${result.status}`);
      }

      if (!result.success && result.error) {
        console.log(`   错误: ${result.error}`);
      }

      if (result.success && result.data) {
        console.log(`   响应:`, JSON.stringify(result.data, null, 2).slice(0, 200) + '...');
      }

      console.log('');
    });

    console.log('==================\n');
  }

  /**
   * 导出测试报告为 JSON
   */
  exportReport(): TestSuiteResult {
    const passedTests = this.results.filter((r) => r.success).length;
    const failedTests = this.results.filter((r) => !r.success).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    return {
      name: 'API Test Suite',
      results: this.results,
      totalTests: this.results.length,
      passedTests,
      failedTests,
      totalDuration,
    };
  }
}

/**
 * 社交功能测试套件
 */
export async function testSocialFeatures() {
  const tester = new ApiTester();

  console.log('开始测试社交功能 API...\n');

  // 测试关注系统
  console.log('测试关注系统...');
  await tester.testEndpoint('检查关注状态', 'GET', '/api/v1/follows/check/1');
  await tester.testEndpoint('获取关注统计', 'GET', '/api/v1/follows/stats/1');
  await tester.testEndpoint('获取粉丝列表', 'GET', '/api/v1/follows/followers/1');
  await tester.testEndpoint('获取关注列表', 'GET', '/api/v1/follows/following/1');

  // 测试通知系统
  console.log('测试通知系统...');
  await tester.testEndpoint('获取通知列表', 'GET', '/api/v1/notifications/');
  await tester.testEndpoint('获取通知统计', 'GET', '/api/v1/notifications/stats');
  await tester.testEndpoint('获取未读数量', 'GET', '/api/v1/notifications/unread-count');
  await tester.testEndpoint('获取通知偏好', 'GET', '/api/v1/notifications/preferences');

  // 测试点赞系统
  console.log('测试点赞系统...');
  await tester.testEndpoint('获取点赞统计', 'GET', '/api/social/likes/1/stats', {
    target_type: 'post',
  });

  // 测试收藏系统
  console.log('测试收藏系统...');
  await tester.testEndpoint('获取收藏列表', 'GET', '/api/social/bookmarks');

  // 打印报告
  tester.printReport();

  return tester.exportReport();
}

/**
 * 快速测试单个端点
 */
export async function quickTest(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  endpoint: string,
  data?: any
) {
  const tester = new ApiTester();
  const result = await tester.testEndpoint(endpoint, method, endpoint, data);

  console.log('\n=== 快速测试结果 ===');
  console.log(`端点: ${result.method} ${result.endpoint}`);
  console.log(`状态: ${result.success ? '✅ 成功' : '❌ 失败'}`);
  console.log(`耗时: ${result.duration}ms`);

  if (result.status) {
    console.log(`HTTP状态码: ${result.status}`);
  }

  if (!result.success && result.error) {
    console.log(`错误: ${result.error}`);
  } else if (result.data) {
    console.log('\n响应数据:');
    console.log(JSON.stringify(result.data, null, 2));
  }

  console.log('==================\n');

  return result;
}

/**
 * 批量测试端点
 */
export async function batchTest(
  tests: Array<{
    name: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    endpoint: string;
    data?: any;
  }>
) {
  const tester = new ApiTester();

  console.log(`开始批量测试 ${tests.length} 个端点...\n`);

  for (const test of tests) {
    console.log(`测试: ${test.name}...`);
    await tester.testEndpoint(test.name, test.method, test.endpoint, test.data);
  }

  tester.printReport();

  return tester.exportReport();
}

/**
 * 性能测试
 */
export async function performanceTest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  iterations = 10
) {
  console.log(`\n=== 性能测试 ===`);
  console.log(`端点: ${method} ${endpoint}`);
  console.log(`迭代次数: ${iterations}\n`);

  const durations: number[] = [];
  const tester = new ApiTester();

  for (let i = 0; i < iterations; i++) {
    const result = await tester.testEndpoint(
      `性能测试 #${i + 1}`,
      method,
      endpoint
    );
    durations.push(result.duration);
  }

  const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);

  console.log('性能测试结果:');
  console.log(`平均响应时间: ${avgDuration.toFixed(2)}ms`);
  console.log(`最快响应时间: ${minDuration}ms`);
  console.log(`最慢响应时间: ${maxDuration}ms`);
  console.log(`总耗时: ${durations.reduce((sum, d) => sum + d, 0)}ms`);
  console.log('==================\n');

  return {
    endpoint,
    method,
    iterations,
    durations,
    avgDuration,
    minDuration,
    maxDuration,
  };
}

/**
 * 使用示例:
 *
 * // 1. 测试所有社交功能
 * await testSocialFeatures();
 *
 * // 2. 快速测试单个端点
 * await quickTest('GET', '/api/v1/notifications/stats');
 *
 * // 3. 批量测试
 * await batchTest([
 *   { name: '获取通知', method: 'GET', endpoint: '/api/v1/notifications/' },
 *   { name: '获取统计', method: 'GET', endpoint: '/api/v1/notifications/stats' },
 * ]);
 *
 * // 4. 性能测试
 * await performanceTest('/api/v1/notifications/stats', 'GET', 20);
 */
