'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  Maximize2,
} from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/Badge'

// 图表数据类型
export interface ChartDataPoint {
  label: string
  value: number
  change?: number // 变化百分比
  metadata?: Record<string, any>
}

export interface ChartDataset {
  id: string
  name: string
  data: ChartDataPoint[]
  color: string
  type?: 'line' | 'bar' | 'area'
}

export interface AdvancedDataChartProps {
  title: string
  description?: string
  datasets: ChartDataset[]
  chartType?: 'line' | 'bar' | 'area' | 'mixed'
  timeRange?: '7d' | '30d' | '90d' | '1y' | 'all'
  showLegend?: boolean
  showStats?: boolean
  showControls?: boolean
  height?: number
  className?: string
  onDataPointClick?: (datasetId: string, point: ChartDataPoint) => void
}

export function AdvancedDataChart({
  title,
  description,
  datasets,
  chartType = 'line',
  timeRange = '30d',
  showLegend = true,
  showStats = true,
  showControls = true,
  height = 300,
  className = '',
  onDataPointClick,
}: AdvancedDataChartProps) {
  const [loading, setLoading] = useState(false)
  const [activeDataset, setActiveDataset] = useState<string>(datasets[0]?.id)
  const [hoveredPoint, setHoveredPoint] = useState<{ datasetId: string; index: number } | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 计算统计数据
  const calculateStats = (dataset: ChartDataset) => {
    const values = dataset.data.map((d) => d.value)
    const current = values[values.length - 1] || 0
    const previous = values[values.length - 2] || current
    const change = previous > 0 ? ((current - previous) / previous) * 100 : 0
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const max = Math.max(...values)
    const min = Math.min(...values)

    return { current, change, avg, max, min }
  }

  // 刷新数据
  const handleRefresh = async () => {
    setLoading(true)
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
  }

  // 导出数据
  const handleExport = () => {
    const csvContent = datasets
      .map((dataset) => {
        const header = `${dataset.name}\nLabel,Value,Change\n`
        const rows = dataset.data.map((point) =>
          `${point.label},${point.value},${point.change || 0}`
        )
        return header + rows.join('\n')
      })
      .join('\n\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title}-data.csv`
    a.click()
  }

  // 绘制图表
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 设置画布尺寸
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // 清空画布
    ctx.clearRect(0, 0, rect.width, rect.height)

    // 获取当前数据集
    const activeDatasetObj = datasets.find((d) => d.id === activeDataset)
    if (!activeDatasetObj) return

    const data = activeDatasetObj.data
    if (data.length === 0) return

    // 计算缩放比例
    const padding = { top: 20, right: 20, bottom: 40, left: 60 }
    const chartWidth = rect.width - padding.left - padding.right
    const chartHeight = rect.height - padding.top - padding.bottom
    const maxValue = Math.max(...data.map((d) => d.value)) * 1.1
    const minValue = 0

    // 绘制网格线
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()

      // Y轴标签
      const value = maxValue - (maxValue / 5) * i
      ctx.fillStyle = '#94a3b8'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(value.toFixed(0), padding.left - 10, y + 4)
    }

    // 绘制X轴标签
    const xStep = chartWidth / (data.length - 1)
    data.forEach((point, index) => {
      const x = padding.left + xStep * index
      ctx.fillStyle = '#94a3b8'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(point.label, x, rect.height - 10)
    })

    // 绘制数据
    if (chartType === 'line' || chartType === 'area') {
      // 绘制区域(如果是面积图)
      if (chartType === 'area') {
        ctx.beginPath()
        ctx.moveTo(padding.left, padding.top + chartHeight)

        data.forEach((point, index) => {
          const x = padding.left + xStep * index
          const y = padding.top + chartHeight - (point.value / maxValue) * chartHeight
          ctx.lineTo(x, y)
        })

        ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
        ctx.closePath()

        // 渐变填充
        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
        gradient.addColorStop(0, activeDatasetObj.color + '40')
        gradient.addColorStop(1, activeDatasetObj.color + '00')
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // 绘制线条
      ctx.beginPath()
      ctx.strokeStyle = activeDatasetObj.color
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      data.forEach((point, index) => {
        const x = padding.left + xStep * index
        const y = padding.top + chartHeight - (point.value / maxValue) * chartHeight
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // 绘制数据点
      data.forEach((point, index) => {
        const x = padding.left + xStep * index
        const y = padding.top + chartHeight - (point.value / maxValue) * chartHeight

        // 外圈
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fillStyle = '#0a0a0f'
        ctx.fill()
        ctx.strokeStyle = activeDatasetObj.color
        ctx.lineWidth = 2
        ctx.stroke()

        // 内圈
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = activeDatasetObj.color
        ctx.fill()

        // 悬停效果
        if (hoveredPoint?.datasetId === activeDataset && hoveredPoint?.index === index) {
          ctx.beginPath()
          ctx.arc(x, y, 10, 0, Math.PI * 2)
          ctx.fillStyle = activeDatasetObj.color + '30'
          ctx.fill()
        }
      })
    } else if (chartType === 'bar') {
      const barWidth = (chartWidth / data.length) * 0.6
      const barGap = (chartWidth / data.length) * 0.4

      data.forEach((point, index) => {
        const x = padding.left + (chartWidth / data.length) * index + barGap / 2
        const barHeight = (point.value / maxValue) * chartHeight
        const y = padding.top + chartHeight - barHeight

        // 渐变填充
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
        gradient.addColorStop(0, activeDatasetObj.color)
        gradient.addColorStop(1, activeDatasetObj.color + '60')

        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barWidth, barHeight)

        // 悬停效果
        if (hoveredPoint?.datasetId === activeDataset && hoveredPoint?.index === index) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
          ctx.fillRect(x - 2, y - 2, barWidth + 4, barHeight + 4)
        }
      })
    }
  }, [datasets, activeDataset, chartType, hoveredPoint])

  const activeDatasetObj = datasets.find((d) => d.id === activeDataset)
  const stats = activeDatasetObj ? calculateStats(activeDatasetObj) : null

  return (
    <Card className={`${className} ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-100">{title}</h3>
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500" />
              )}
            </div>
            {description && <p className="text-sm text-gray-400">{description}</p>}
          </div>

          {showControls && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-gray-400 hover:text-white"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="text-gray-400 hover:text-white"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                className="text-gray-400 hover:text-white"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* 时间范围选择器 */}
        {showControls && (
          <div className="flex items-center gap-2 mt-4">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div className="flex gap-2">
              {[
                { value: '7d', label: '7天' },
                { value: '30d', label: '30天' },
                { value: '90d', label: '90天' },
                { value: '1y', label: '1年' },
                { value: 'all', label: '全部' },
              ].map((range) => (
                <button
                  key={range.value}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    timeRange === range.value
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardHeader>

      <CardBody>
        {/* 统计卡片 */}
        {showStats && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <div className="text-sm text-gray-400 mb-1">当前值</div>
              <div className="text-2xl font-bold text-gray-100">{stats.current.toLocaleString()}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <div className="text-sm text-gray-400 mb-1">变化</div>
              <div
                className={`flex items-center gap-2 text-2xl font-bold ${
                  stats.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {stats.change >= 0 ? (
                  <TrendingUp className="w-6 h-6" />
                ) : (
                  <TrendingDown className="w-6 h-6" />
                )}
                {Math.abs(stats.change).toFixed(1)}%
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <div className="text-sm text-gray-400 mb-1">平均值</div>
              <div className="text-2xl font-bold text-gray-100">{stats.avg.toFixed(0)}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <div className="text-sm text-gray-400 mb-1">峰值</div>
              <div className="text-2xl font-bold text-gray-100">{stats.max.toLocaleString()}</div>
            </motion.div>
          </div>
        )}

        {/* 数据集选择器 */}
        {showLegend && datasets.length > 1 && (
          <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="flex gap-2">
              {datasets.map((dataset) => (
                <button
                  key={dataset.id}
                  onClick={() => setActiveDataset(dataset.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeDataset === dataset.id
                      ? 'bg-gray-700 text-white border-2'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-transparent'
                  }`}
                  style={
                    activeDataset === dataset.id
                      ? { borderColor: dataset.color }
                      : { borderLeftColor: dataset.color }
                  }
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dataset.color }}
                  />
                  {dataset.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 图表画布 */}
        <div className="relative" style={{ height: `${height}px` }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            onMouseMove={(e) => {
              const canvas = canvasRef.current
              if (!canvas || !activeDatasetObj) return

              const rect = canvas.getBoundingClientRect()
              const x = e.clientX - rect.left
              const padding = { left: 60, right: 20 }
              const chartWidth = rect.width - padding.left - padding.right
              const xStep = chartWidth / (activeDatasetObj.data.length - 1)
              const index = Math.round((x - padding.left) / xStep)

              if (index >= 0 && index < activeDatasetObj.data.length) {
                setHoveredPoint({ datasetId: activeDataset, index })
              } else {
                setHoveredPoint(null)
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
            onClick={() => {
              if (hoveredPoint && activeDatasetObj) {
                const point = activeDatasetObj.data[hoveredPoint.index]
                onDataPointClick?.(activeDataset, point)
              }
            }}
          />

          {/* 悬停提示 */}
          {hoveredPoint && activeDatasetObj && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl pointer-events-none"
              style={{
                left: `${(hoveredPoint.index / (activeDatasetObj.data.length - 1)) * 100}%`,
                top: '10px',
                transform: 'translateX(-50%)',
              }}
            >
              <div className="text-sm text-gray-400 mb-1">
                {activeDatasetObj.data[hoveredPoint.index].label}
              </div>
              <div className="text-lg font-bold text-gray-100">
                {activeDatasetObj.data[hoveredPoint.index].value.toLocaleString()}
              </div>
              {activeDatasetObj.data[hoveredPoint.index].change !== undefined && (
                <div
                  className={`text-sm flex items-center gap-1 ${
                    activeDatasetObj.data[hoveredPoint.index].change >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {activeDatasetObj.data[hoveredPoint.index].change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(activeDatasetObj.data[hoveredPoint.index].change).toFixed(1)}%
                </div>
              )}
            </motion.div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default AdvancedDataChart
