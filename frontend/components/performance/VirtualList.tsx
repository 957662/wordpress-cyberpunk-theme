/**
 * Virtual List Component - 虚拟滚动列表
 * 高性能渲染大列表，只渲染可见区域的项目
 *
 * @version 1.0.0
 * @author CyberPress Team
 */

'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  CSSProperties,
} from 'react';
import { cn } from '@/lib/utils';

// =====================================================
// 类型定义
// =====================================================

export interface VirtualListProps<T = any> {
  // 数据源
  items: T[];
  // 渲染函数
  renderItem: (item: T, index: number) => React.ReactNode;
  // 项目高度（固定）
  itemHeight: number;
  // 容器高度
  height: number;
  // 预渲染项目数量（上下缓冲区）
  overscan?: number;
  // 唯一键提取函数
  getItemKey?: (item: T, index: number) => string | number;
  // 容器类名
  className?: string;
  // 容器样式
  style?: CSSProperties;
  // 滚动到指定项
  scrollToIndex?: number;
  // 滚动对齐方式
  scrollToAlignment?: 'start' | 'center' | 'end' | 'auto';
  // 滚动回调
  onScroll?: (scrollTop: number) => void;
  // 是否显示滚动条
  showScrollbar?: boolean;
  // 加载更多
  onLoadMore?: () => void;
  // 加载更多阈值（距离底部多少像素时触发）
  loadMoreThreshold?: number;
  // 是否正在加载
  isLoading?: boolean;
  // 加载更多组件
  loadMoreComponent?: React.ReactNode;
}

export interface VirtualListHandle {
  scrollToIndex: (index: number, alignment?: 'start' | 'center' | 'end' | 'auto') => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
}

// =====================================================
// 虚拟列表组件
// =====================================================

export const VirtualList = React.forwardRef<VirtualListHandle, VirtualListProps>(
  <T,>(
    {
      items,
      renderItem,
      itemHeight,
      height,
      overscan = 3,
      getItemKey,
      className,
      style,
      scrollToIndex: controlledScrollToIndex,
      scrollToAlignment = 'start',
      onScroll,
      showScrollbar = true,
      onLoadMore,
      loadMoreThreshold = 200,
      isLoading = false,
      loadMoreComponent,
    },
    ref
  ) => {
    // =====================================================
    // 状态管理
    // =====================================================

    const [scrollTop, setScrollTop] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();

    // 容器引用
    const containerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    // =====================================================
    // 计算可见项目
    // =====================================================

    const { visibleItems, totalHeight, offsetY } = useMemo(() => {
      // 计算可见区域的起始和结束索引
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
      const endIndex = Math.min(
        items.length - 1,
        Math.ceil((scrollTop + height) / itemHeight) + overscan
      );

      // 提取可见项目
      const visibleItems = [];
      for (let i = startIndex; i <= endIndex; i++) {
        visibleItems.push({
          index: i,
          data: items[i],
          offset: i * itemHeight,
        });
      }

      // 总高度
      const totalHeight = items.length * itemHeight;

      // 偏移量
      const offsetY = startIndex * itemHeight;

      return { visibleItems, totalHeight, offsetY };
    }, [items, itemHeight, scrollTop, height, overscan]);

    // =====================================================
    // 滚动处理
    // =====================================================

    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const newScrollTop = target.scrollTop;

        setScrollTop(newScrollTop);
        onScroll?.(newScrollTop);

        // 设置滚动状态
        setIsScrolling(true);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150);

        // 加载更多检测
        if (onLoadMore && !isLoading) {
          const scrollHeight = target.scrollHeight;
          const clientHeight = target.clientHeight;
          const distanceToBottom = scrollHeight - (newScrollTop + clientHeight);

          if (distanceToBottom <= loadMoreThreshold) {
            onLoadMore();
          }
        }
      },
      [onScroll, onLoadMore, isLoading, loadMoreThreshold]
    );

    // =====================================================
    // 滚动到指定项
    // =====================================================

    const scrollToIndex = useCallback(
      (index: number, alignment: 'start' | 'center' | 'end' | 'auto' = 'start') => {
        if (!containerRef.current) return;

        const maxIndex = items.length - 1;
        const safeIndex = Math.max(0, Math.min(index, maxIndex));

        let scrollTop = 0;
        switch (alignment) {
          case 'start':
            scrollTop = safeIndex * itemHeight;
            break;
          case 'center':
            scrollTop = safeIndex * itemHeight - height / 2 + itemHeight / 2;
            break;
          case 'end':
            scrollTop = safeIndex * itemHeight - height + itemHeight;
            break;
          case 'auto':
            const currentScrollTop = containerRef.current.scrollTop;
            const itemTop = safeIndex * itemHeight;
            const itemBottom = itemTop + itemHeight;
            
            if (itemTop < currentScrollTop) {
              scrollTop = itemTop;
            } else if (itemBottom > currentScrollTop + height) {
              scrollTop = itemBottom - height;
            } else {
              scrollTop = currentScrollTop;
            }
            break;
        }

        containerRef.current.scrollTop = scrollTop;
      },
      [items.length, itemHeight, height]
    );

    const scrollToTop = useCallback(() => {
      scrollToIndex(0);
    }, [scrollToIndex]);

    const scrollToBottom = useCallback(() => {
      scrollToIndex(items.length - 1);
    }, [scrollToIndex, items.length]);

    // =====================================================
    // 暴露方法
    // =====================================================

    React.useImperativeHandle(
      ref,
      () => ({
        scrollToIndex,
        scrollToTop,
        scrollToBottom,
      }),
      [scrollToIndex, scrollToTop, scrollToBottom]
    );

    // =====================================================
    // 受控滚动
    // =====================================================

    useEffect(() => {
      if (controlledScrollToIndex !== undefined) {
        scrollToIndex(controlledScrollToIndex, scrollToAlignment);
      }
    }, [controlledScrollToIndex, scrollToAlignment, scrollToIndex]);

    // =====================================================
    // 清理
    // =====================================================

    useEffect(() => {
      return () => {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, []);

    // =====================================================
    // 渲染
    // =====================================================

    const containerStyle: CSSProperties = {
      height,
      overflow: showScrollbar ? 'auto' : 'hidden',
      position: 'relative',
      ...style,
    };

    const innerStyle: CSSProperties = {
      height: totalHeight,
      position: 'relative',
    };

    return (
      <div
        ref={containerRef}
        className={cn('cyber-virtual-list overflow-auto', className)}
        style={containerStyle}
        onScroll={handleScroll}
      >
        <div ref={innerRef} style={innerStyle}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              willChange: isScrolling ? 'transform' : 'auto',
            }}
          >
            {visibleItems.map(({ index, data }) => (
              <div
                key={getItemKey ? getItemKey(data, index) : index}
                style={{
                  height: itemHeight,
                  boxSizing: 'border-box',
                }}
              >
                {renderItem(data, index)}
              </div>
            ))}
          </div>
        </div>

        {/* 加载更多 */}
        {isLoading && loadMoreComponent && (
          <div className="cyber-load-more py-4 text-center">
            {loadMoreComponent}
          </div>
        )}
      </div>
    );
  }
) as <T>(props: VirtualListProps<T> & { ref?: React.Ref<VirtualListHandle> }) => React.ReactElement;

VirtualList.displayName = 'VirtualList';

// =====================================================
// 导出
// =====================================================

export default VirtualList;
