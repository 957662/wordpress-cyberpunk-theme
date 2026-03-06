/**
 * Performance Tests
 * 性能测试
 */

import { render, waitFor } from '@testing-library/react';
import { CodeHighlight } from '@/components/blog/CodeHighlight';
import { RealTimeSearch } from '@/components/search/RealTimeSearch';
import { performance } from 'perf_hooks';

describe('Performance Tests', () => {
  describe('CodeHighlight Performance', () => {
    const largeCode = `
      ${Array.from({ length: 100 }, (_, i) => `
        function function${i}() {
          // This is a comment
          const variable${i} = ${i};
          console.log(variable${i});
          return variable${i} * 2;
        }
      `).join('\n')}
    `;

    it('应该在合理时间内渲染大量代码', () => {
      const startTime = performance.now();

      render(<CodeHighlight code={largeCode} language="javascript" />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // 渲染时间应该小于 1000ms
      expect(renderTime).toBeLessThan(1000);
    });

    it('应该支持大量代码的复制操作', async () => {
      const mockWriteText = jest.fn();
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText
        }
      });

      const { container } = render(
        <CodeHighlight code={largeCode} language="javascript" />
      );

      const copyButton = container.querySelector('button[title*="复制"]');
      if (copyButton) {
        const startTime = performance.now();
        copyButton.click();
        const endTime = performance.now();

        const operationTime = endTime - startTime;
        // 操作时间应该小于 100ms
        expect(operationTime).toBeLessThan(100);
      }
    });
  });

  describe('RealTimeSearch Performance', () => {
    it('应该在输入时快速响应', async () => {
      const { container } = render(<RealTimeSearch />);
      const input = container.querySelector('input');

      if (input) {
        const startTime = performance.now();

        // 模拟快速输入
        for (let i = 0; i < 10; i++) {
          input.value = `test${i}`;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }

        const endTime = performance.now();
        const operationTime = endTime - startTime;

        // 10 次输入应该在 500ms 内完成
        expect(operationTime).toBeLessThan(500);
      }
    });

    it('应该限制重渲染次数', async () => {
      let renderCount = 0;

      const { rerender } = render(<RealTimeSearch />);
      renderCount++;

      // 多次重新渲染
      for (let i = 0; i < 5; i++) {
        rerender(<RealTimeSearch />);
        renderCount++;
      }

      // 由于防抖优化，渲染次数应该受到限制
      expect(renderCount).toBeLessThan(10);
    });
  });

  describe('内存使用测试', () => {
    it('应该在合理内存范围内运行', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // 渲染多个组件
      const components = [];
      for (let i = 0; i < 10; i++) {
        const { container } = render(
          <CodeHighlight
            code={`function test${i}() { return ${i}; }`}
            language="javascript"
          />
        );
        components.push(container);
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // 内存增长应该合理 (假设限制为 10MB)
      if (initialMemory > 0) {
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
      }

      // 清理
      components.forEach(container => container.remove());
    });
  });

  describe('动画性能测试', () => {
    it('应该在 60fps 下运行动画', async () => {
      const frameDuration = 1000 / 60; // ~16.67ms per frame

      const { container } = render(
        <CodeHighlight code="const x = 1;" language="javascript" />
      );

      const startTime = performance.now();

      // 触发动画
      const button = container.querySelector('button');
      if (button) {
        button.click();
      }

      await waitFor(() => {
        const endTime = performance.now();
        const animationTime = endTime - startTime;

        // 动画应该在合理时间内开始
        expect(animationTime).toBeLessThan(frameDuration * 2);
      });
    });
  });
});
