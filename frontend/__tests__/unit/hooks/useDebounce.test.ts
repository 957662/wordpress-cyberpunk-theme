/**
 * useDebounce Hook 测试
 * ============================================================================
 * 功能: 测试防抖 Hook 的所有功能
 * 版本: 1.0.0
 * 日期: 2026-03-05
 * ============================================================================
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useDebounce } from '@/lib/hooks/useDebounce'

describe('useDebounce Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('基础功能', () => {
    it('应该返回初始值', () => {
      const { result } = renderHook(() => useDebounce('initial', 500))
      expect(result.current).toBe('initial')
    })

    it('应该在延迟后更新值', async () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      )

      // 更新值
      rerender({ value: 'updated', delay: 500 })

      // 立即检查，值应该还是初始值
      expect(result.current).toBe('initial')

      // 快进时间
      act(() => {
        jest.advanceTimersByTime(500)
      })

      // 现在值应该更新了
      expect(result.current).toBe('updated')
    })

    it('应该在快速更新时只触发最后一次', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      )

      // 快速多次更新
      rerender({ value: 'update1', delay: 500 })
      act(() => jest.advanceTimersByTime(200))

      rerender({ value: 'update2', delay: 500 })
      act(() => jest.advanceTimersByTime(200))

      rerender({ value: 'update3', delay: 500 })
      act(() => jest.advanceTimersByTime(200))

      // 值应该还是初始值
      expect(result.current).toBe('initial')

      // 快进到延迟时间后
      act(() => {
        jest.advanceTimersByTime(500)
      })

      // 应该只触发最后一次更新
      expect(result.current).toBe('update3')
    })
  })

  describe('延迟时间', () => {
    it('应该使用自定义延迟时间', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 1000 } }
      )

      rerender({ value: 'updated', delay: 1000 })

      act(() => jest.advanceTimersByTime(999))
      expect(result.current).toBe('initial')

      act(() => jest.advanceTimersByTime(1))
      expect(result.current).toBe('updated')
    })

    it('应该支持零延迟', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 0 } }
      )

      rerender({ value: 'updated', delay: 0 })

      act(() => {
        jest.advanceTimersByTime(0)
      })

      expect(result.current).toBe('updated')
    })
  })

  describe('不同数据类型', () => {
    it('应该处理字符串类型', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'hello', delay: 500 } }
      )

      rerender({ value: 'world', delay: 500 })
      act(() => jest.advanceTimersByTime(500))

      expect(result.current).toBe('world')
    })

    it('应该处理数字类型', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 0, delay: 500 } }
      )

      rerender({ value: 42, delay: 500 })
      act(() => jest.advanceTimersByTime(500))

      expect(result.current).toBe(42)
    })

    it('应该处理对象类型', () => {
      const initialValue = { name: 'John' }
      const updatedValue = { name: 'Jane' }

      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: initialValue, delay: 500 } }
      )

      rerender({ value: updatedValue, delay: 500 })
      act(() => jest.advanceTimersByTime(500))

      expect(result.current).toEqual(updatedValue)
    })

    it('应该处理数组类型', () => {
      const initialValue = [1, 2, 3]
      const updatedValue = [4, 5, 6]

      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: initialValue, delay: 500 } }
      )

      rerender({ value: updatedValue, delay: 500 })
      act(() => jest.advanceTimersByTime(500))

      expect(result.current).toEqual(updatedValue)
    })

    it('应该处理布尔类型', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: false, delay: 500 } }
      )

      rerender({ value: true, delay: 500 })
      act(() => jest.advanceTimersByTime(500))

      expect(result.current).toBe(true)
    })

    it('应该处理 null 和 undefined', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: null, delay: 500 } }
      )

      rerender({ value: undefined, delay: 500 })
      act(() => jest.advanceTimersByTime(500))

      expect(result.current).toBeUndefined()
    })
  })

  describe('重置和取消', () => {
    it('应该在值变化时重置计时器', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 1000 } }
      )

      rerender({ value: 'update1', delay: 1000 })
      act(() => jest.advanceTimersByTime(500))

      // 在计时器完成前再次更新
      rerender({ value: 'update2', delay: 1000 })
      act(() => jest.advanceTimersByTime(500))

      // 值应该还是初始值
      expect(result.current).toBe('initial')

      // 从第二次更新开始计时，再快进 1000ms
      act(() => jest.advanceTimersByTime(1000))

      // 现在应该更新为第二次的值
      expect(result.current).toBe('update2')
    })
  })

  describe('内存泄漏', () => {
    it('应该在组件卸载时清理计时器', () => {
      const { result, rerender, unmount } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      )

      rerender({ value: 'updated', delay: 500 })

      // 在计时器完成前卸载
      unmount()

      // 快进时间，不应该报错
      act(() => {
        jest.advanceTimersByTime(500)
      })

      // 卸载后不应该更新值
      expect(result.current).toBe('initial')
    })
  })

  describe('边界情况', () => {
    it('应该处理非常短的延迟时间', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 1 } }
      )

      rerender({ value: 'updated', delay: 1 })
      act(() => jest.advanceTimersByTime(1))

      expect(result.current).toBe('updated')
    })

    it('应该处理非常长的延迟时间', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 10000 } }
      )

      rerender({ value: 'updated', delay: 10000 })

      // 快进一半时间
      act(() => jest.advanceTimersByTime(5000))
      expect(result.current).toBe('initial')

      // 快进剩余时间
      act(() => jest.advanceTimersByTime(5000))
      expect(result.current).toBe('updated')
    })

    it('应该处理相同值的更新', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'same', delay: 500 } }
      )

      rerender({ value: 'same', delay: 500 })
      act(() => jest.advanceTimersByTime(500))

      // 值保持不变
      expect(result.current).toBe('same')
    })
  })

  describe('性能优化', () => {
    it('不应该在每次渲染时创建新的计时器', () => {
      const spy = jest.spyOn(global, 'setTimeout')

      const { rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      )

      const initialCallCount = spy.mock.calls.length

      rerender({ value: 'updated', delay: 500 })
      act(() => jest.advanceTimersByTime(500))

      // 应该只创建必要的计时器
      expect(spy.mock.calls.length).toBeGreaterThan(initialCallCount)

      spy.mockRestore()
    })
  })
})
