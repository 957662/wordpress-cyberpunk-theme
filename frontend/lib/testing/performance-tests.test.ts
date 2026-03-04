/**
 * Performance Benchmark Tests
 *
 * 性能基准测试套件
 */

import { describe, it, expect } from '@jest/globals';
import {
  benchmark,
  compare,
  batchBenchmark,
  PerformanceRegression,
  profiler,
  formatBenchmarkResult,
  formatComparisonResult,
} from '../performance/benchmark';

describe('Performance Benchmarks', () => {
  describe('Array Operations', () => {
    it('should benchmark array map', async () => {
      const arr = Array.from({ length: 1000 }, (_, i) => i);

      const result = await benchmark(
        () => arr.map((x) => x * 2),
        { name: 'Array Map (1000 items)', iterations: 1000 }
      );

      expect(result.avgTime).toBeLessThan(1); // Should be fast
      expect(result.iterations).toBe(1000);
    });

    it('should benchmark array filter', async () => {
      const arr = Array.from({ length: 1000 }, (_, i) => i);

      const result = await benchmark(
        () => arr.filter((x) => x % 2 === 0),
        { name: 'Array Filter (1000 items)', iterations: 1000 }
      );

      expect(result.avgTime).toBeLessThan(1);
    });

    it('should benchmark array reduce', async () => {
      const arr = Array.from({ length: 1000 }, (_, i) => i);

      const result = await benchmark(
        () => arr.reduce((sum, x) => sum + x, 0),
        { name: 'Array Reduce (1000 items)', iterations: 1000 }
      );

      expect(result.avgTime).toBeLessThan(1);
    });
  });

  describe('String Operations', () => {
    it('should benchmark string concatenation', async () => {
      const str = 'test';

      const result = await benchmark(
        () => str.repeat(100),
        { name: 'String Concatenation', iterations: 1000 }
      );

      expect(result.avgTime).toBeLessThan(0.1);
    });

    it('should benchmark string split', async () => {
      const str = 'a,b,c,d,e,f,g,h,i,j';

      const result = await benchmark(
        () => str.split(','),
        { name: 'String Split', iterations: 10000 }
      );

      expect(result.avgTime).toBeLessThan(0.01);
    });
  });

  describe('Object Operations', () => {
    it('should benchmark object property access', async () => {
      const obj = { a: 1, b: 2, c: 3 };

      const result = await benchmark(
        () => obj.a,
        { name: 'Object Property Access', iterations: 100000 }
      );

      expect(result.avgTime).toBeLessThan(0.001);
    });

    it('should benchmark object keys', async () => {
      const obj = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`key${i}`, i]));

      const result = await benchmark(
        () => Object.keys(obj),
        { name: 'Object Keys (100 properties)', iterations: 1000 }
      );

      expect(result.avgTime).toBeLessThan(1);
    });
  });

  describe('Comparison Tests', () => {
    it('should compare for vs forEach', async () => {
      const arr = Array.from({ length: 1000 }, (_, i) => i);

      const comparison = await compare(
        () => {
          let sum = 0;
          for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
          }
          return sum;
        },
        () => {
          let sum = 0;
          arr.forEach((x) => {
            sum += x;
          });
          return sum;
        },
        'for loop',
        'forEach',
        1000
      );

      expect(comparison.winner).toBeDefined();
      expect(comparison.difference).toBeGreaterThan(0);
    });

    it('should compare map vs for...of', async () => {
      const arr = Array.from({ length: 1000 }, (_, i) => i);

      const comparison = await compare(
        () => arr.map((x) => x * 2),
        () => {
          const result = [];
          for (const x of arr) {
            result.push(x * 2);
          }
          return result;
        },
        'map',
        'for...of',
        1000
      );

      expect(comparison.results).toHaveLength(2);
    });
  });

  describe('Batch Benchmarks', () => {
    it('should run batch benchmarks', async () => {
      const benchmarks = new Map([
        ['map', () => [1, 2, 3].map((x) => x * 2)],
        ['filter', () => [1, 2, 3, 4, 5].filter((x) => x % 2 === 0)],
        ['reduce', () => [1, 2, 3].reduce((a, b) => a + b, 0)],
      ]);

      const results = await batchBenchmark(benchmarks, 1000);

      expect(results).toHaveLength(3);
      expect(results[0].avgTime).toBeLessThan(results[1].avgTime * 10);
    });
  });

  describe('Performance Regression', () => {
    it('should detect performance regression', async () => {
      const regression = new PerformanceRegression();

      // Set baseline
      regression.setBaseline('test-operation', 1.0);

      // Test with faster operation
      const result1 = await regression.checkRegression('test-operation', () => {
        return Array.from({ length: 100 }, (_, i) => i);
      }, 0.5);

      expect(result1.passed).toBe(true);
      expect(result1.difference).toBeLessThan(50);

      // Test with slower operation (simulated regression)
      const slowOperation = async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(Array.from({ length: 100 }, (_, i) => i));
          }, 2);
        });
      };

      const result2 = await regression.checkRegression('test-operation', slowOperation, 0.5);

      expect(result2.passed).toBe(false);
      expect(result2.difference).toBeGreaterThan(50);
    });

    it('should save and load baselines', () => {
      const regression = new PerformanceRegression();

      regression.setBaseline('test1', 1.5);
      regression.setBaseline('test2', 2.5);

      const json = regression.saveBaselines();
      expect(json).toContain('test1');
      expect(json).toContain('test2');

      const regression2 = new PerformanceRegression();
      regression2.loadBaselines(json);

      // Baselines should be loaded
      expect(() => regression2.checkRegression('test1', () => {})).not.toThrow();
    });
  });

  describe('Profiler', () => {
    it('should mark and measure operations', () => {
      profiler.mark('test-operation');

      // Simulate some work
      let sum = 0;
      for (let i = 0; i < 1000; i++) {
        sum += i;
      }

      const duration = profiler.measure('test-operation');

      expect(duration).toBeGreaterThan(0);
    });

    it('should get statistics for measurements', () => {
      profiler.reset();

      // Run multiple measurements
      for (let i = 0; i < 10; i++) {
        profiler.mark('test');
        profiler.measure('test');
      }

      const stats = profiler.getStats('test');

      expect(stats).not.toBeNull();
      expect(stats?.count).toBe(10);
      expect(stats?.avg).toBeGreaterThan(0);
    });

    it('should get all stats', () => {
      profiler.reset();

      profiler.mark('op1');
      profiler.measure('op1');

      profiler.mark('op2');
      profiler.measure('op2');

      const allStats = profiler.getAllStats();

      expect(allStats.size).toBe(2);
    });
  });

  describe('Formatting', () => {
    it('should format benchmark result', () => {
      const result = {
        name: 'Test',
        iterations: 100,
        totalTime: 100,
        avgTime: 1,
        minTime: 0.5,
        maxTime: 2,
        opsPerSecond: 1000,
      };

      const formatted = formatBenchmarkResult(result);

      expect(formatted).toContain('Test');
      expect(formatted).toContain('100');
      expect(formatted).toContain('1.0000ms');
    });

    it('should format comparison result', () => {
      const comparison = {
        winner: 'Method 1',
        difference: 0.5,
        percentage: 25,
        results: [
          {
            name: 'Method 1',
            iterations: 100,
            totalTime: 100,
            avgTime: 1,
            minTime: 0.5,
            maxTime: 2,
            opsPerSecond: 1000,
          },
          {
            name: 'Method 2',
            iterations: 100,
            totalTime: 150,
            avgTime: 1.5,
            minTime: 0.75,
            maxTime: 3,
            opsPerSecond: 666.67,
          },
        ],
      };

      const formatted = formatComparisonResult(comparison);

      expect(formatted).toContain('Method 1');
      expect(formatted).toContain('Winner');
      expect(formatted).toContain('25.00%');
    });
  });
});
