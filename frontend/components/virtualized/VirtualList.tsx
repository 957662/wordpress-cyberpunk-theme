'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  height: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  className?: string
  estimatedItemHeight?: number
}

export function VirtualList<T>({
  items,
  itemHeight,
  height,
  renderItem,
  overscan = 3,
  className,
  estimatedItemHeight,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const actualItemHeight = itemHeight || estimatedItemHeight || 50

  const totalHeight = items.length * actualItemHeight

  const { visibleStart, visibleEnd } = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / actualItemHeight)
    const visibleEnd = Math.ceil((scrollTop + height) / actualItemHeight)
    return {
      visibleStart: Math.max(0, visibleStart - overscan),
      visibleEnd: Math.min(items.length, visibleEnd + overscan),
    }
  }, [scrollTop, actualItemHeight, height, items.length, overscan])

  const visibleItems = useMemo(
    () => items.slice(visibleStart, visibleEnd),
    [items, visibleStart, visibleEnd],
  )

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={visibleStart + index}
            style={{
              position: 'absolute',
              top: (visibleStart + index) * actualItemHeight,
              width: '100%',
              height: actualItemHeight,
            }}
          >
            {renderItem(item, visibleStart + index)}
          </div>
        ))}
      </div>
    </div>
  )
}

// 使用示例组件
interface ExampleItem {
  id: number
  name: string
  description: string
}

export function VirtualListExample() {
  const [items] = useState<ExampleItem[]>(
    Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i + 1}`,
      description: `This is the description for item ${i + 1}`,
    })),
  )

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-cyber-cyan">
        Virtual List Demo
      </h2>
      <VirtualList
        items={items}
        itemHeight={80}
        height={600}
        renderItem={(item) => (
          <div className="p-4 border border-cyber-border rounded-lg bg-cyber-card mb-2 hover:border-cyber-cyan transition-colors">
            <h3 className="font-semibold text-cyber-cyan">{item.name}</h3>
            <p className="text-sm text-gray-400">{item.description}</p>
          </div>
        )}
        className="border border-cyber-border rounded-lg"
      />
    </div>
  )
}
