import { cn, formatDate, truncate, debounce } from '@/lib/utils';

describe('Utils', () => {
  describe('cn', () => {
    it('应该合并类名', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('应该处理条件类名', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    });

    it('应该合并 Tailwind 类', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
    });
  });

  describe('formatDate', () => {
    it('应该格式化日期字符串', () => {
      const date = '2024-03-01T00:00:00Z';
      const formatted = formatDate(date);
      expect(formatted).toMatch(/2024/);
      expect(formatted).toMatch(/3/);
      expect(formatted).toMatch(/1/);
    });

    it('应该处理 Date 对象', () => {
      const date = new Date('2024-03-01');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/2024/);
    });
  });

  describe('truncate', () => {
    it('应该截断长文本', () => {
      const text = 'This is a very long text that should be truncated';
      const truncated = truncate(text, 20);
      expect(truncated).toHaveLength(23); // 20 + '...'
      expect(truncated). toEndWith('...');
    });

    it('不应该截断短文本', () => {
      const text = 'Short';
      const truncated = truncate(text, 20);
      expect(truncated).toBe('Short');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('应该防抖函数调用', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });
});
