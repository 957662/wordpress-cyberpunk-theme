'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplet, Pipette, Palette, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ColorPickerProps {
  /** 当前颜色值 */
  value: string
  /** 颜色变化回调 */
  onChange: (color: string) => void
  /** 是否禁用 */
  disabled?: boolean
  /** 预设颜色 */
  presets?: string[]
  /** 是否显示预设颜色 */
  showPresets?: boolean
  /** 自定义样式类名 */
  className?: string
  /** 颜色格式 */
  format?: 'hex' | 'rgb' | 'hsl'
}

/**
 * 颜色选择器组件
 *
 * @example
 * ```tsx
 * <ColorPicker
 *   value="#00f0ff"
 *   onChange={(color) => setColor(color)}
 *   showPresets={true}
 * />
 * ```
 */
export function ColorPicker({
  value,
  onChange,
  disabled = false,
  presets,
  showPresets = true,
  className,
  format = 'hex',
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(100)
  const [lightness, setLightness] = useState(50)
  const pickerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const defaultPresets = [
    '#00f0ff', // cyan
    '#a855f7', // purple
    '#ec4899', // pink
    '#eab308', // yellow
    '#22c55e', // green
    '#3b82f6', // blue
    '#ef4444', // red
    '#f97316', // orange
    '#6366f1', // indigo
    '#14b8a6', // teal
    '#ffffff', // white
    '#000000', // black
  ]

  const presetColors = presets || defaultPresets

  // 初始化颜色值
  useEffect(() => {
    if (value) {
      const hsl = hexToHSL(value)
      setHue(hsl.h)
      setSaturation(hsl.s)
      setLightness(hsl.l)
    }
  }, [value])

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 绘制颜色选择区域
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // 清空画布
    ctx.clearRect(0, 0, width, height)

    // 绘制饱和度和亮度渐变
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const s = (x / width) * 100
        const l = 100 - (y / height) * 100
        ctx.fillStyle = `hsl(${hue}, ${s}%, ${l}%)`
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }, [hue])

  const currentColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
  const hexColor = hslToHex(hue, saturation, lightness)

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newSaturation = (x / rect.width) * 100
    const newLightness = 100 - (y / rect.height) * 100

    setSaturation(newSaturation)
    setLightness(newLightness)

    const hex = hslToHex(hue, newSaturation, newLightness)
    onChange(hex)
  }

  const handlePresetClick = (color: string) => {
    if (disabled) return
    onChange(color)
    const hsl = hexToHSL(color)
    setHue(hsl.h)
    setSaturation(hsl.s)
    setLightness(hsl.l)
  }

  return (
    <div ref={pickerRef} className={cn('relative', className)}>
      {/* 颜色预览按钮 */}
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg border-2',
          'transition-all duration-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        style={{
          borderColor: value,
          backgroundColor: `${value}20`,
        }}
      >
        <div
          className="w-6 h-6 rounded border-2 border-white shadow"
          style={{ backgroundColor: value }}
        />
        <span className="text-sm font-mono text-gray-300">
          {formatColor(value, format)}
        </span>
        <Palette className="w-4 h-4 text-gray-400 ml-auto" />
      </motion.button>

      {/* 颜色选择器面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 z-50 bg-cyber-card border border-cyber-border rounded-lg shadow-2xl p-4 min-w-[280px]"
          >
            {/* 颜色选择区域 */}
            <div className="space-y-4">
              {/* 饱和度和亮度选择器 */}
              <div>
                <div className="relative w-full h-40 rounded-lg overflow-hidden cursor-crosshair">
                  <canvas
                    ref={canvasRef}
                    width={256}
                    height={160}
                    onClick={handleCanvasClick}
                    className="w-full h-full"
                  />
                  {/* 当前颜色指示器 */}
                  <div
                    className="absolute w-3 h-3 rounded-full border-2 border-white shadow pointer-events-none"
                    style={{
                      left: `${(saturation / 100) * 100}%`,
                      top: `${100 - (lightness / 100) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: currentColor,
                    }}
                  />
                </div>
              </div>

              {/* 色相选择器 */}
              <div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  onChange={(e) => setHue(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${Array.from(
                      { length: 12 },
                      (_, i) => `hsl(${(i * 360) / 11}, 100%, 50%)`
                    ).join(', ')})`,
                  }}
                  disabled={disabled}
                />
              </div>

              {/* 当前颜色信息 */}
              <div className="flex items-center gap-3 p-3 bg-cyber-darker rounded-lg">
                <div
                  className="w-12 h-12 rounded border-2 border-white shadow"
                  style={{ backgroundColor: hexColor }}
                />
                <div className="flex-1 space-y-1">
                  <div className="text-xs text-gray-400">HEX</div>
                  <div className="font-mono text-sm text-gray-300">
                    {hexColor.toUpperCase()}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.clipboard.writeText(hexColor)
                  }}
                  className="p-2 text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-colors"
                  title="复制颜色"
                >
                  <Check className="w-4 h-4" />
                </motion.button>
              </div>

              {/* 预设颜色 */}
              {showPresets && (
                <div>
                  <div className="text-xs text-gray-400 mb-2">预设颜色</div>
                  <div className="grid grid-cols-6 gap-2">
                    {presetColors.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePresetClick(color)}
                        className={cn(
                          'w-8 h-8 rounded-lg border-2 transition-all',
                          'hover:shadow-lg',
                          value.toLowerCase() === color.toLowerCase()
                            ? 'border-white scale-110'
                            : 'border-transparent'
                        )}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 颜色转换工具函数
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  let r = 0,
    g = 0,
    b = 0

  if (hex.length === 4) {
    r = parseInt('0x' + hex[1] + hex[1])
    g = parseInt('0x' + hex[2] + hex[2])
    b = parseInt('0x' + hex[3] + hex[3])
  } else if (hex.length === 7) {
    r = parseInt('0x' + hex[1] + hex[2])
    g = parseInt('0x' + hex[3] + hex[4])
    b = parseInt('0x' + hex[5] + hex[6])
  }

  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100

  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }

  return `#${f(0)}${f(8)}${f(4)}`
}

function formatColor(hex: string, format: 'hex' | 'rgb' | 'hsl'): string {
  if (format === 'hex') return hex.toUpperCase()

  const hsl = hexToHSL(hex)

  if (format === 'hsl') {
    return `hsl(${hsl.h}, ${hsl.s.toFixed(0)}%, ${hsl.l.toFixed(0)}%)`
  }

  // Convert to RGB
  let r = 0,
    g = 0,
    b = 0

  if (hex.length === 4) {
    r = parseInt('0x' + hex[1] + hex[1])
    g = parseInt('0x' + hex[2] + hex[2])
    b = parseInt('0x' + hex[3] + hex[3])
  } else if (hex.length === 7) {
    r = parseInt('0x' + hex[1] + hex[2])
    g = parseInt('0x' + hex[3] + hex[4])
    b = parseInt('0x' + hex[5] + hex[6])
  }

  return `rgb(${r}, ${g}, ${b})`
}

export default ColorPicker
