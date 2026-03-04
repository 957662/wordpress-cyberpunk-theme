/**
 * Performance Benchmarking
 *
 * 性能基准测试工具，用于测量和比较组件/功能的性能
 */

export interface BenchmarkConfig {
  name: string;
  iterations?: number;
  warmupIterations?: number;
  onProgress?: (iteration: number, total: number) => void;
}

export interface BenchmarkResult {
  name: string;
  iterations: number;
  totalTime: number;
  avgTime: number;
  minTime: number;
  maxTime: number;
  opsPerSecond: number;
  memoryBefore?: number;
  memoryAfter?: number;
  memoryDelta?: number;
}

export interface ComparisonResult {
  winner: string;
  difference: number;
  percentage: number;
  results: BenchmarkResult[];
}

/**
 * 执行性能基准测试
 */
export async function benchmark<T>(
  fn: () => T | Promise<T>,
  config: BenchmarkConfig
): Promise<BenchmarkResult> {
  const {
    name,
    iterations = 100,
    warmupIterations = 10,
    onProgress,
  } = config;

  // Warmup runs (not counted)
  for (let i = 0; i < warmupIterations; i++) {
    await fn();
  }

  // Force garbage collection if available
  if (typeof global.gc === 'function') {
    global.gc();
  }

  // Measure memory before
  const memoryBefore = getMemoryUsage();

  // Run benchmark
  const times: number[] = [];
  const startTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    const iterStart = performance.now();
    await fn();
    const iterEnd = performance.now();
    times.push(iterEnd - iterStart);

    onProgress?.(i + 1, iterations);
  }

  const totalTime = performance.now() - startTime;

  // Measure memory after
  const memoryAfter = getMemoryUsage();

  // Calculate statistics
  const avgTime = totalTime / iterations;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const opsPerSecond = (iterations / totalTime) * 1000;

  return {
    name,
    iterations,
    totalTime,
    avgTime,
    minTime,
    maxTime,
    opsPerSecond,
    memoryBefore,
    memoryAfter,
    memoryDelta: memoryAfter && memoryBefore ? memoryAfter - memoryBefore : undefined,
  };
}

/**
 * 比较两个函数的性能
 */
export async function compare<T>(
  fn1: () => T | Promise<T>,
  fn2: () => T | Promise<T>,
  name1: string,
  name2: string,
  iterations = 100
): Promise<ComparisonResult> {
  const result1 = await benchmark(fn1, { name: name1, iterations });
  const result2 = await benchmark(fn2, { name: name2, iterations });

  const winner = result1.avgTime < result2.avgTime ? name1 : name2;
  const difference = Math.abs(result1.avgTime - result2.avgTime);
  const percentage = (difference / Math.min(result1.avgTime, result2.avgTime)) * 100;

  return {
    winner,
    difference,
    percentage,
    results: [result1, result2],
  };
}

/**
 * 测量函数执行时间
 */
export async function measureTime<T>(
  fn: () => T | Promise<T>
): Promise<{ result: T; time: number }> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  return {
    result,
    time: end - start,
  };
}

/**
 * 测量内存使用
 */
export function measureMemory<T>(fn: () => T): { result: T; memory: number } {
  const before = getMemoryUsage();

  if (typeof global.gc === 'function') {
    global.gc();
  }

  const result = fn();
  const after = getMemoryUsage();

  return {
    result,
    memory: after && before ? after - before : 0,
  };
}

/**
 * 格式化基准测试结果
 */
export function formatBenchmarkResult(result: BenchmarkResult): string {
  const lines = [
    `Benchmark: ${result.name}`,
    `Iterations: ${result.iterations}`,
    `Total Time: ${result.totalTime.toFixed(2)}ms`,
    `Average: ${result.avgTime.toFixed(4)}ms`,
    `Min: ${result.minTime.toFixed(4)}ms`,
    `Max: ${result.maxTime.toFixed(4)}ms`,
    `Ops/sec: ${result.opsPerSecond.toFixed(2)}`,
  ];

  if (result.memoryDelta !== undefined) {
    lines.push(`Memory Delta: ${(result.memoryDelta / 1024 / 1024).toFixed(2)}MB`);
  }

  return lines.join('\n');
}

/**
 * 格式化比较结果
 */
export function formatComparisonResult(comparison: ComparisonResult): string {
  const lines = [
    '=== Performance Comparison ===',
    `Winner: ${comparison.winner}`,
    `Difference: ${comparison.difference.toFixed(4)}ms`,
    `Percentage: ${comparison.percentage.toFixed(2)}%`,
    '',
    '--- Results ---',
  ];

  comparison.results.forEach((result) => {
    lines.push(formatBenchmarkResult(result));
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * 批量基准测试
 */
export async function batchBenchmark(
  benchmarks: Map<string, () => any>,
  iterations = 100
): Promise<BenchmarkResult[]> {
  const results: BenchmarkResult[] = [];

  for (const [name, fn] of benchmarks.entries()) {
    const result = await benchmark(fn, { name, iterations });
    results.push(result);
  }

  return results.sort((a, b) => a.avgTime - b.avgTime);
}

/**
 * 性能回归测试
 */
export class PerformanceRegression {
  private baselines: Map<string, number> = new Map();

  /**
   * 设置基线
   */
  setBaseline(name: string, time: number): void {
    this.baselines.set(name, time);
  }

  /**
   * 检查性能是否退化
   */
  async checkRegression(
    name: string,
    fn: () => any,
    threshold = 0.1
  ): Promise<{ passed: boolean; actual: number; baseline: number; difference: number }> {
    const baseline = this.baselines.get(name);
    if (!baseline) {
      throw new Error(`No baseline found for ${name}`);
    }

    const result = await benchmark(fn, { name, iterations: 50 });
    const actual = result.avgTime;
    const difference = ((actual - baseline) / baseline) * 100;
    const passed = difference <= threshold * 100;

    return {
      passed,
      actual,
      baseline,
      difference,
    };
  }

  /**
   * 从 JSON 加载基线
   */
  loadBaselines(json: string): void {
    const data = JSON.parse(json);
    Object.entries(data).forEach(([name, time]) => {
      this.baselines.set(name, time as number);
    });
  }

  /**
   * 保存基线到 JSON
   */
  saveBaselines(): string {
    return JSON.stringify(Object.fromEntries(this.baselines), null, 2);
  }
}

/**
 * 获取内存使用情况
 */
function getMemoryUsage(): number | undefined {
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    return (performance as any).memory.usedJSHeapSize;
  }
  return undefined;
}

/**
 * 性能分析器
 */
export class Profiler {
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number[]> = new Map();

  /**
   * 开始标记
   */
  mark(name: string): void {
    this.marks.set(name, performance.now());
    performance.mark(`${name}-start`);
  }

  /**
   * 结束标记并测量
   */
  measure(name: string): number {
    const start = this.marks.get(name);
    if (!start) {
      throw new Error(`No mark found for ${name}`);
    }

    const end = performance.now();
    const duration = end - start;

    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    if (!this.measures.has(name)) {
      this.measures.set(name, []);
    }
    this.measures.get(name)!.push(duration);

    this.marks.delete(name);

    return duration;
  }

  /**
   * 获取测量统计
   */
  getStats(name: string): { count: number; total: number; avg: number; min: number; max: number } | null {
    const measures = this.measures.get(name);
    if (!measures || measures.length === 0) {
      return null;
    }

    const total = measures.reduce((sum, val) => sum + val, 0);

    return {
      count: measures.length,
      total,
      avg: total / measures.length,
      min: Math.min(...measures),
      max: Math.max(...measures),
    };
  }

  /**
   * 重置所有标记和测量
   */
  reset(): void {
    this.marks.clear();
    this.measures.clear();
  }

  /**
   * 获取所有测量结果
   */
  getAllStats(): Map<string, ReturnType<Profiler['getStats']>> {
    const stats = new Map();
    for (const name of this.measures.keys()) {
      stats.set(name, this.getStats(name));
    }
    return stats;
  }
}

// 默认导出全局性能回归测试实例
export const performanceRegression = new PerformanceRegression();
export const profiler = new Profiler();
