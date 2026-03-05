/**
 * A/B 测试系统
 * CyberPress Platform
 *
 * 支持多变量测试、细分、实时统计等功能
 */

export interface ABTestVariant {
  id: string;
  name: string;
  weight: number; // 0-1
  config: Record<string, any>;
}

export interface ABTest {
  id: string;
  name: string;
  description?: string;
  variants: ABTestVariant[];
  startDate?: Date;
  endDate?: Date;
  targetAudience?: {
    criteria: Record<string, any>;
    percentage?: number; // 测试参与用户的百分比
  };
  status: 'draft' | 'running' | 'paused' | 'completed';
  metrics: {
    impressions: number;
    conversions: number;
    conversionRate: number;
    revenue?: number;
  };
}

export interface ABTestResult {
  testId: string;
  variantId: string;
  userId?: string;
  converted: boolean;
  conversionValue?: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class ABTestingSystem {
  private tests: Map<string, ABTest> = new Map();
  private userAssignments: Map<string, Map<string, string>> = new Map(); // userId -> testId -> variantId
  private results: ABTestResult[] = [];
  private storageKey = 'ab_tests';
  private isInitialized = false;

  /**
   * 初始化 A/B 测试系统
   */
  async init() {
    if (this.isInitialized) return;

    // 从存储加载测试配置
    await this.loadTests();

    // 从存储加载用户分配
    this.loadUserAssignments();

    this.isInitialized = true;
  }

  /**
   * 创建 A/B 测试
   */
  createTest(test: Omit<ABTest, 'metrics'>): ABTest {
    const newTest: ABTest = {
      ...test,
      metrics: {
        impressions: 0,
        conversions: 0,
        conversionRate: 0,
      },
    };

    this.tests.set(test.id, newTest);
    this.saveTests();

    return newTest;
  }

  /**
   * 获取用户的测试变体
   */
  getVariant(testId: string, userId?: string): ABTestVariant | null {
    const test = this.tests.get(testId);
    if (!test || test.status !== 'running') {
      return null;
    }

    // 检查用户是否在目标受众中
    if (userId && !this.isEligibleForTest(test, userId)) {
      return null;
    }

    // 如果用户已有分配,返回该变体
    if (userId) {
      const assignments = this.userAssignments.get(userId);
      if (assignments && assignments.has(testId)) {
        const variantId = assignments.get(testId)!;
        return test.variants.find((v) => v.id === variantId) || null;
      }
    }

    // 分配新变体
    const variant = this.assignVariant(test);
    if (userId && variant) {
      this.assignUserToVariant(userId, testId, variant.id);
    }

    // 记录展示
    this.trackImpression(testId, variant.id);

    return variant;
  }

  /**
   * 追踪转化
   */
  trackConversion(testId: string, variantId: string, value?: number): void {
    const test = this.tests.get(testId);
    if (!test) return;

    const result: ABTestResult = {
      testId,
      variantId,
      userId: this.getCurrentUserId(),
      converted: true,
      conversionValue: value,
      timestamp: Date.now(),
    };

    this.results.push(result);

    // 更新测试指标
    const variant = test.variants.find((v) => v.id === variantId);
    if (variant) {
      // 在实际应用中,这里应该从服务器获取最新的统计
      // 这里只是简单模拟
    }

    this.saveResults();
  }

  /**
   * 获取测试结果统计
   */
  getTestResults(testId: string): {
    variant: ABTestVariant;
    impressions: number;
    conversions: number;
    conversionRate: number;
    revenue?: number;
    zScore?: number;
    pValue?: number;
    winner?: boolean;
  }[] {
    const test = this.tests.get(testId);
    if (!test) return [];

    const variantResults = test.variants.map((variant) => {
      const variantResults_filtered = this.results.filter(
        (r) => r.testId === testId && r.variantId === variant.id
      );

      const impressions = variantResults_filtered.length;
      const conversions = variantResults_filtered.filter((r) => r.converted).length;
      const conversionRate = impressions > 0 ? conversions / impressions : 0;
      const revenue = variantResults_filtered.reduce(
        (sum, r) => sum + (r.conversionValue || 0),
        0
      );

      return {
        variant,
        impressions,
        conversions,
        conversionRate,
        revenue,
      };
    });

    // 计算统计显著性
    if (variantResults.length >= 2) {
      const control = variantResults[0];
      const treatment = variantResults[1];

      const zScore = this.calculateZScore(
        control.conversions,
        control.impressions,
        treatment.conversions,
        treatment.impressions
      );

      const pValue = this.calculatePValue(zScore);

      variantResults[0].zScore = zScore;
      variantResults[0].pValue = pValue;
      variantResults[1].zScore = -zScore;
      variantResults[1].pValue = pValue;

      // 如果 p < 0.05,标记获胜者
      if (pValue < 0.05) {
        variantResults[0].winner = treatment.conversionRate > control.conversionRate;
        variantResults[1].winner = control.conversionRate > treatment.conversionRate;
      }
    }

    return variantResults;
  }

  /**
   * 更新测试状态
   */
  updateTestStatus(testId: string, status: ABTest['status']): void {
    const test = this.tests.get(testId);
    if (test) {
      test.status = status;
      this.saveTests();
    }
  }

  /**
   * 删除测试
   */
  deleteTest(testId: string): void {
    this.tests.delete(testId);
    this.results = this.results.filter((r) => r.testId !== testId);
    this.saveTests();
    this.saveResults();
  }

  /**
   * 获取所有测试
   */
  getAllTests(): ABTest[] {
    return Array.from(this.tests.values());
  }

  /**
   * 获取测试详情
   */
  getTest(testId: string): ABTest | undefined {
    return this.tests.get(testId);
  }

  /**
   * 检查用户是否符合测试条件
   */
  private isEligibleForTest(test: ABTest, userId: string): boolean {
    if (!test.targetAudience) return true;

    // 检查百分比
    if (test.targetAudience.percentage !== undefined) {
      const hash = this.hashCode(userId + test.id);
      const modulo = Math.abs(hash) % 100;
      if (modulo >= test.targetAudience.percentage) {
        return false;
      }
    }

    // 检查其他条件(这里可以扩展更多逻辑)
    // 例如: 地理位置、设备类型、用户属性等

    return true;
  }

  /**
   * 为用户分配变体
   */
  private assignVariant(test: ABTest): ABTestVariant | null {
    const totalWeight = test.variants.reduce((sum, v) => sum + v.weight, 0);
    let random = Math.random() * totalWeight;

    for (const variant of test.variants) {
      random -= variant.weight;
      if (random <= 0) {
        return variant;
      }
    }

    return test.variants[0] || null;
  }

  /**
   * 将用户分配到变体
   */
  private assignUserToVariant(userId: string, testId: string, variantId: string): void {
    if (!this.userAssignments.has(userId)) {
      this.userAssignments.set(userId, new Map());
    }

    this.userAssignments.get(userId)!.set(testId, variantId);
    this.saveUserAssignments();
  }

  /**
   * 记录展示
   */
  private trackImpression(testId: string, variantId: string): void {
    const result: ABTestResult = {
      testId,
      variantId,
      userId: this.getCurrentUserId(),
      converted: false,
      timestamp: Date.now(),
    };

    this.results.push(result);
    this.saveResults();
  }

  /**
   * 计算 Z 分数
   */
  private calculateZScore(
    controlConversions: number,
    controlTotal: number,
    treatmentConversions: number,
    treatmentTotal: number
  ): number {
    const p1 = controlConversions / controlTotal;
    const p2 = treatmentConversions / treatmentTotal;
    const pPooled = (controlConversions + treatmentConversions) / (controlTotal + treatmentTotal);

    const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / controlTotal + 1 / treatmentTotal));
    if (se === 0) return 0;

    return (p2 - p1) / se;
  }

  /**
   * 计算 P 值
   */
  private calculatePValue(zScore: number): number {
    // 简化的 P 值计算
    const absZ = Math.abs(zScore);
    if (absZ > 2.576) return 0.01;
    if (absZ > 1.96) return 0.05;
    if (absZ > 1.645) return 0.1;
    return 1;
  }

  /**
   * 获取当前用户 ID
   */
  private getCurrentUserId(): string | undefined {
    // 在实际应用中,应该从认证系统或 cookie 中获取
    if (typeof window !== 'undefined') {
      let userId = localStorage.getItem('user_id');
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('user_id', userId);
      }
      return userId;
    }
    return undefined;
  }

  /**
   * 字符串哈希
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  /**
   * 保存测试配置
   */
  private saveTests(): void {
    if (typeof window !== 'undefined') {
      const data = Array.from(this.tests.entries());
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  }

  /**
   * 加载测试配置
   */
  private async loadTests(): Promise<void> {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.tests = new Map(data);
      } catch (e) {
        console.error('Failed to load AB tests:', e);
      }
    }
  }

  /**
   * 保存用户分配
   */
  private saveUserAssignments(): void {
    if (typeof window === 'undefined') return;

    const data = Array.from(this.userAssignments.entries()).map(([userId, assignments]) => [
      userId,
      Array.from(assignments.entries()),
    ]);
    localStorage.setItem('user_assignments', JSON.stringify(data));
  }

  /**
   * 加载用户分配
   */
  private loadUserAssignments(): void {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('user_assignments');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.userAssignments = new Map(
          data.map(([userId, assignments]: [string, [string, string][]]) => [
            userId,
            new Map(assignments),
          ])
        );
      } catch (e) {
        console.error('Failed to load user assignments:', e);
      }
    }
  }

  /**
   * 保存结果
   */
  private saveResults(): void {
    if (typeof window === 'undefined') return;

    // 在实际应用中,应该发送到服务器
    // 这里只保存到本地存储作为演示
    const maxResults = 1000;
    const resultsToSave = this.results.slice(-maxResults);
    localStorage.setItem('ab_test_results', JSON.stringify(resultsToSave));
  }
}

// 创建全局实例
let globalABSystem: ABTestingSystem | null = null;

/**
 * 获取 A/B 测试系统实例
 */
export function getABTestingSystem(): ABTestingSystem {
  if (!globalABSystem) {
    globalABSystem = new ABTestingSystem();
  }
  return globalABSystem;
}

/**
 * 初始化 A/B 测试系统
 */
export async function initABTesting(): Promise<ABTestingSystem> {
  const system = getABTestingSystem();
  await system.init();
  return system;
}

/**
 * Hook: 获取测试变体
 */
export function useABTest(testId: string): ABTestVariant | null {
  const abSystem = getABTestingSystem();
  const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') || undefined : undefined;
  return abSystem.getVariant(testId, userId);
}

export default ABTestingSystem;
