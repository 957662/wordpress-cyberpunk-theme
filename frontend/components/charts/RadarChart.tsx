'use client'

import React, { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface RadarDataPoint {
  label: string
  value: number
  maxValue?: number
}

interface RadarChartProps {
  data: RadarDataPoint[]
  className?: string
  size?: number
  colors?: {
    stroke?: string
    fill?: string
    grid?: string
    label?: string
    point?: string
  }
  showGrid?: boolean
  showLabels?: boolean
  animate?: boolean
  levels?: number
}

export function RadarChart({
  data,
  className,
  size = 300,
  colors = {
    stroke: '#00f0ff',
    fill: 'rgba(0, 240, 255, 0.2)',
    grid: '#2a2a4a',
    label: '#9ca3af',
    point: '#00f0ff',
  },
  showGrid = true,
  showLabels = true,
  animate = true,
  levels = 4,
}: RadarChartProps) {
  const center = size / 2
  const radius = size / 2 - 40
  const angleStep = (2 * Math.PI) / data.length

  // 计算点的位置
  const points = useMemo(() => {
    return data.map((point, index) => {
      const maxValue = point.maxValue || Math.max(...data.map((d) => d.value))
      const normalizedValue = point.value / maxValue
      const angle = index * angleStep - Math.PI / 2
      const x = center + radius * normalizedValue * Math.cos(angle)
      const y = center + radius * normalizedValue * Math.sin(angle)
      return { x, y, value: point.value, label: point.label }
    })
  }, [data, center, radius, angleStep])

  // 生成网格点
  const gridPoints = useMemo(() => {
    const grids = []
    for (let level = 1; level <= levels; level++) {
      const levelRadius = (radius / levels) * level
      const levelPoints = data.map((_, index) => {
        const angle = index * angleStep - Math.PI / 2
        return {
          x: center + levelRadius * Math.cos(angle),
          y: center + levelRadius * Math.sin(angle),
        }
      })
      grids.push({ level, points: levelPoints })
    }
    return grids
  }, [data.length, levels, radius, center, angleStep])

  // 生成网格线
  const gridLines = useMemo(() => {
    return data.map((_, index) => {
      const angle = index * angleStep - Math.PI / 2
      const x = center + radius * Math.cos(angle)
      const y = center + radius * Math.sin(angle)
      return { x1: center, y1: center, x2: x, y2: y }
    })
  }, [data.length, center, radius, angleStep])

  // 生成多边形路径
  const polygonPath = useMemo(() => {
    return points
      .map((point, index) => {
        return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
      })
      .join(' ') + ' Z'
  }, [points])

  return (
    <div className={cn('inline-block', className)}>
      <svg
        width={size}
        height={size}
        className={cn(animate && 'animate-fade-in')}
      >
        {/* 网格线 */}
        {showGrid && (
          <>
            {gridPoints.map(({ level, points: levelPoints }) => (
              <polygon
                key={`grid-${level}`}
                points={levelPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={colors.grid}
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            ))}
            {gridLines.map((line, index) => (
              <line
                key={`grid-line-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={colors.grid}
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            ))}
          </>
        )}

        {/* 数据多边形 */}
        <path
          d={polygonPath}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="2"
          className={cn(animate && 'animate-scale-in origin-center')}
        />

        {/* 数据点 */}
        {points.map((point, index) => (
          <g key={`point-${index}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill={colors.point}
              className={cn(
                'hover:r-8 transition-all duration-200',
                animate && 'animate-pulse-glow',
              )}
            />
            {/* 标签 */}
            {showLabels && (
              <text
                x={point.x}
                y={point.y - 15}
                textAnchor="middle"
                fill={colors.label}
                fontSize="12"
                className="font-mono"
              >
                {point.value}
              </text>
            )}
          </g>
        ))}

        {/* 轴标签 */}
        {showLabels &&
          data.map((point, index) => {
            const angle = index * angleStep - Math.PI / 2
            const labelRadius = radius + 25
            const x = center + labelRadius * Math.cos(angle)
            const y = center + labelRadius * Math.sin(angle)
            return (
              <text
                key={`label-${index}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={colors.label}
                fontSize="12"
                className="font-mono"
              >
                {point.label}
              </text>
            )
          })}
      </svg>
    </div>
  )
}

// 多数据系列雷达图
interface RadarSeries {
  name: string
  data: number[]
  color: {
    stroke: string
    fill: string
  }
}

interface MultiSeriesRadarChartProps extends Omit<RadarChartProps, 'data' | 'colors'> {
  labels: string[]
  series: RadarSeries[]
}

export function MultiSeriesRadarChart({
  labels,
  series,
  className,
  size = 300,
  showGrid = true,
  showLabels = true,
  animate = true,
  levels = 4,
}: MultiSeriesRadarChartProps) {
  const data = labels.map((label, index) => ({
    label,
    value: series[0]?.data[index] || 0,
  }))

  return (
    <div className={cn('relative', className)}>
      {/* 背景（网格） */}
      <RadarChart
        data={data}
        size={size}
        colors={{
          stroke: 'transparent',
          fill: 'transparent',
          grid: '#2a2a4a',
          label: '#9ca3af',
        }}
        showGrid={showGrid}
        showLabels={showLabels}
        animate={false}
        levels={levels}
      />

      {/* 叠加数据系列 */}
      <div className="absolute top-0 left-0">
        {series.map((s, seriesIndex) => (
          <RadarChart
            key={s.name}
            data={labels.map((label, index) => ({
              label,
              value: s.data[index] || 0,
            }))}
            size={size}
            colors={s.color}
            showGrid={false}
            showLabels={false}
            animate={animate}
            levels={levels}
          />
        ))}
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {series.map((s) => (
          <div key={s.name} className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: s.color.stroke,
                boxShadow: `0 0 10px ${s.color.stroke}`,
              }}
            />
            <span className="text-sm text-gray-300">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 使用示例
export function RadarChartExample() {
  const singleData = [
    { label: '速度', value: 85 },
    { label: '力量', value: 70 },
    { label: '技巧', value: 90 },
    { label: '防御', value: 65 },
    { label: '耐力', value: 80 },
    { label: '智力', value: 75 },
  ]

  const multiSeriesData = {
    labels: ['速度', '力量', '技巧', '防御', '耐力', '智力'],
    series: [
      {
        name: '角色 A',
        data: [85, 70, 90, 65, 80, 75],
        color: {
          stroke: '#00f0ff',
          fill: 'rgba(0, 240, 255, 0.2)',
        },
      },
      {
        name: '角色 B',
        data: [70, 85, 75, 80, 70, 90],
        color: {
          stroke: '#9d00ff',
          fill: 'rgba(157, 0, 255, 0.2)',
        },
      },
      {
        name: '角色 C',
        data: [90, 60, 85, 70, 85, 80],
        color: {
          stroke: '#ff0080',
          fill: 'rgba(255, 0, 128, 0.2)',
        },
      },
    ],
  }

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-cyber-cyan">Radar Chart Demo</h2>

      {/* 单系列 */}
      <div>
        <h3 className="text-lg font-semibold text-cyber-purple mb-4">
          Single Series
        </h3>
        <RadarChart data={singleData} size={400} />
      </div>

      {/* 多系列 */}
      <div>
        <h3 className="text-lg font-semibold text-cyber-purple mb-4">
          Multi Series
        </h3>
        <MultiSeriesRadarChart
          labels={multiSeriesData.labels}
          series={multiSeriesData.series}
          size={400}
        />
      </div>
    </div>
  )
}
