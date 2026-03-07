'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface ChartData {
  label: string
  value: number
  color?: string
}

export interface DonutChartProps {
  /** 图表数据 */
  data: ChartData[]
  /** 图表尺寸 */
  size?: number
  /** 甜甜圈宽度 */
  thickness?: number
  /** 是否显示标签 */
  showLabels?: boolean
  /** 是否显示图例 */
  showLegend?: boolean
  /** 是否显示百分比 */
  showPercentage?: boolean
  /** 自定义样式类名 */
  className?: string
  /** 空心区域内容 */
  centerContent?: React.ReactNode
  /** 动画延迟 */
  animationDelay?: number
}

/**
 * 甜甜圈图表组件
 *
 * @example
 * ```tsx
 * <DonutChart
 *   data={[
 *     { label: 'React', value: 40, color: '#61dafb' },
 *     { label: 'Vue', value: 30, color: '#42b883' },
 *     { label: 'Angular', value: 20, color: '#dd0031' },
 *   ]}
 *   showLabels={true}
 *   showLegend={true}
 * />
 * ```
 */
export function DonutChart({
  data,
  size = 200,
  thickness = 40,
  showLabels = true,
  showLegend = true,
  showPercentage = true,
  className,
  centerContent,
  animationDelay = 0,
}: DonutChartProps) {
  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data])

  const defaultColors = [
    '#00f0ff', // cyan
    '#a855f7', // purple
    '#ec4899', // pink
    '#eab308', // yellow
    '#22c55e', // green
    '#3b82f6', // blue
    '#f97316', // orange
  ]

  const chartData = useMemo(() => {
    let accumulatedAngle = 0

    return data.map((item, index) => {
      const percentage = (item.value / total) * 100
      const angle = (item.value / total) * 360
      const startAngle = accumulatedAngle
      const endAngle = accumulatedAngle + angle
      accumulatedAngle += angle

      return {
        ...item,
        percentage,
        startAngle,
        endAngle,
        color: item.color || defaultColors[index % defaultColors.length],
      }
    })
  }, [data, total])

  const createPath = (startAngle: number, endAngle: number) => {
    const radius = size / 2
    const innerRadius = radius - thickness

    const start = polarToCartesian(radius, radius, radius, endAngle)
    const end = polarToCartesian(radius, radius, radius, startAngle)
    const startInner = polarToCartesian(radius, radius, innerRadius, endAngle)
    const endInner = polarToCartesian(radius, radius, innerRadius, startAngle)

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

    return [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      'L',
      endInner.x,
      endInner.y,
      'A',
      innerRadius,
      innerRadius,
      0,
      largeArcFlag,
      1,
      startInner.x,
      startInner.y,
      'Z',
    ].join(' ')
  }

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    }
  }

  return (
    <div className={cn('inline-flex items-center gap-8', className)}>
      {/* 图表 */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {chartData.map((segment, index) => (
            <motion.path
              key={segment.label}
              d={createPath(segment.startAngle, segment.endAngle)}
              fill={segment.color}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: animationDelay + index * 0.1,
                ease: 'easeInOut',
              }}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <title>
                {segment.label}: {segment.value} ({segment.percentage.toFixed(1)}%)
              </title>
            </motion.path>
          ))}
        </svg>

        {/* 中心内容 */}
        {centerContent && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {centerContent}
            </div>
          </div>
        )}

        {/* 默认中心内容 */}
        {!centerContent && showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: animationDelay + 0.5 }}
                className="text-3xl font-bold text-white"
              >
                {total}
              </motion.div>
              <div className="text-xs text-gray-400">总计</div>
            </div>
          </div>
        )}
      </div>

      {/* 图例 */}
      {showLegend && (
        <div className="space-y-3">
          {chartData.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: animationDelay + index * 0.1 }}
              className="flex items-center gap-3"
            >
              {/* 颜色指示器 */}
              <div
                className="w-4 h-4 rounded-full shadow-lg"
                style={{
                  backgroundColor: item.color,
                  boxShadow: `0 0 10px ${item.color}40`,
                }}
              />

              {/* 标签 */}
              <div className="flex-1">
                <div className="text-sm font-medium text-white">
                  {item.label}
                </div>
                {showLabels && (
                  <div className="text-xs text-gray-400">
                    {item.value} ({item.percentage.toFixed(1)}%)
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * 柱状图组件
 */
export interface BarChartProps {
  /** 图表数据 */
  data: ChartData[]
  /** 图表高度 */
  height?: number
  /** 柱子宽度 */
  barWidth?: number
  /** 是否显示数值 */
  showValues?: boolean
  /** 是否显示标签 */
  showLabels?: boolean
  /** 自定义样式类名 */
  className?: string
  /** 布局方向 */
  direction?: 'horizontal' | 'vertical'
}

/**
 * 柱状图组件
 *
 * @example
 * ```tsx
 * <BarChart
 *   data={[
 *     { label: '一月', value: 65 },
 *     { label: '二月', value: 45 },
 *     { label: '三月', value: 78 },
 *   ]}
 *   direction="vertical"
 * />
 * ```
 */
export function BarChart({
  data,
  height = 200,
  barWidth = 40,
  showValues = true,
  showLabels = true,
  className,
  direction = 'vertical',
}: BarChartProps) {
  const maxValue = useMemo(
    () => Math.max(...data.map((item) => item.value)),
    [data]
  )

  const defaultColors = [
    'from-cyber-cyan to-cyber-blue',
    'from-cyber-purple to-cyber-pink',
    'from-cyber-pink to-cyber-yellow',
    'from-cyber-green to-cyber-cyan',
  ]

  return (
    <div className={cn('space-y-4', className)}>
      {direction === 'vertical' ? (
        <div className="flex items-end gap-4" style={{ height }}>
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * height
            const colorClass = item.color || defaultColors[index % defaultColors.length]

            return (
              <motion.div
                key={item.label}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: barHeight, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex-1 flex flex-col items-center justify-end group"
              >
                {/* 数值 */}
                {showValues && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="mb-2 text-sm font-semibold text-cyber-cyan"
                  >
                    {item.value}
                  </motion.div>
                )}

                {/* 柱子 */}
                <div
                  className={cn(
                    'w-full rounded-t-lg bg-gradient-to-t shadow-lg',
                    'group-hover:shadow-cyber-cyan/50 transition-shadow',
                    colorClass
                  )}
                  style={{ maxWidth: barWidth }}
                >
                  <motion.div
                    className="h-full rounded-t-lg"
                    whileHover={{ opacity: 0.8 }}
                  />
                </div>

                {/* 标签 */}
                {showLabels && (
                  <div className="mt-2 text-xs text-gray-400 text-center">
                    {item.label}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => {
            const barWidth = (item.value / maxValue) * 100
            const colorClass = item.color || defaultColors[index % defaultColors.length]

            return (
              <motion.div
                key={item.label}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-1"
              >
                {/* 标签和数值 */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{item.label}</span>
                  {showValues && (
                    <span className="text-cyber-cyan font-semibold">
                      {item.value}
                    </span>
                  )}
                </div>

                {/* 柱子 */}
                <div className="h-8 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    className={cn(
                      'h-full rounded-full bg-gradient-to-r shadow-lg',
                      colorClass
                    )}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DonutChart
