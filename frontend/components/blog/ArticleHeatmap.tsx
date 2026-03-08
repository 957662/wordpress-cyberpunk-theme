'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface HeatmapData {
  date: string
  views: number
  engagement: number
}

interface ArticleHeatmapProps {
  data?: HeatmapData[]
  days?: number
  className?: string
}

export function ArticleHeatmap({
  data: initialData = [],
  days = 30,
  className,
}: ArticleHeatmapProps) {
  const [data, setData] = useState<HeatmapData[]>([])
  const [hoveredCell, setHoveredCell] = useState<HeatmapData | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // 如果没有数据，生成模拟数据
    if (initialData.length === 0) {
      const mockData: HeatmapData[] = []
      const today = new Date()

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        mockData.push({
          date: date.toISOString().split('T')[0],
          views: Math.floor(Math.random() * 1000),
          engagement: Math.floor(Math.random() * 100),
        })
      }

      setData(mockData)
    } else {
      setData(initialData.slice(-days))
    }
  }, [initialData, days])

  const getIntensity = (value: number, max: number): number => {
    if (max === 0) return 0
    const ratio = value / max
    return Math.min(Math.max(ratio, 0), 1)
  }

  const maxValue = Math.max(...data.map((d) => d.views), 1)

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  const getWeekData = (weekIndex: number) => {
    const startIndex = weekIndex * 7
    return data.slice(startIndex, startIndex + 7)
  }

  const weeksCount = Math.ceil(data.length / 7)

  return (
    <div
      className={cn(
        'p-6 rounded-lg',
        'bg-[var(--cyber-card-bg)]',
        'border border-[var(--cyber-border)]',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[var(--cyber-cyan)]" />
          <h3 className="text-lg font-semibold text-white">阅读热力图</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>最近 {days} 天</span>
        </div>
      </div>

      {/* 热力图网格 */}
      <div className="space-y-1">
        {Array.from({ length: weeksCount }).map((_, weekIndex) => (
          <div key={weekIndex} className="flex gap-1">
            {getWeekData(weekIndex).map((cell) => {
              const intensity = getIntensity(cell.views, maxValue)
              const opacity = 0.1 + intensity * 0.9

              return (
                <motion.div
                  key={cell.date}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: weekIndex * 0.05 }}
                  onMouseEnter={(e) => {
                    setHoveredCell(cell)
                    setPosition({
                      x: e.currentTarget.offsetLeft,
                      y: e.currentTarget.offsetTop,
                    })
                  }}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={cn(
                    'relative w-full aspect-square rounded-sm cursor-pointer transition-all duration-200',
                    'hover:ring-2 hover:ring-[var(--cyber-cyan)]'
                  )}
                  style={{
                    backgroundColor: `rgba(0, 240, 255, ${opacity})`,
                  }}
                  title={`${cell.date}: ${cell.views} 次阅读`}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* 悬停提示 */}
      {hoveredCell && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 p-3 rounded-lg bg-[var(--cyber-bg)] border border-[var(--cyber-border)] shadow-lg pointer-events-none"
          style={{
            left: `${position.x + 20}px`,
            top: `${position.y - 80}px`,
          }}
        >
          <div className="text-sm font-medium text-white mb-1">
            {formatDate(hoveredCell.date)}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <TrendingUp className="w-3 h-3" />
            <span>{hoveredCell.views} 次阅读</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            <span>参与度: {hoveredCell.engagement}%</span>
          </div>
        </motion.div>
      )}

      {/* 图例 */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-400">
        <span>少</span>
        <div className="flex gap-1">
          {[0, 0.25, 0.5, 0.75, 1].map((level) => (
            <div
              key={level}
              className="w-4 h-4 rounded-sm"
              style={{
                backgroundColor: `rgba(0, 240, 255, ${0.1 + level * 0.9})`,
              }}
            />
          ))}
        </div>
        <span>多</span>
      </div>
    </div>
  )
}

// 简化版本 - 只显示趋势
export function TrendIndicator({
  current,
  previous,
}: {
  current: number
  previous: number
}) {
  const change = current - previous
  const percentage = previous > 0 ? ((change / previous) * 100).toFixed(1) : '0'
  const isPositive = change >= 0

  return (
    <div className="flex items-center gap-2">
      <TrendingUp
        className={cn(
          'w-4 h-4',
          isPositive ? 'text-green-400' : 'text-red-400',
          !isPositive && 'rotate-180'
        )}
      />
      <span
        className={cn(
          'text-sm font-medium',
          isPositive ? 'text-green-400' : 'text-red-400'
        )}
      >
        {isPositive ? '+' : ''}
        {percentage}%
      </span>
    </div>
  )
}
