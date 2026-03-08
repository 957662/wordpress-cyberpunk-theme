'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

type Theme = 'light' | 'dark' | 'system'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  showLabel = false,
}) => {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as Theme
    if (stored) {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    root.classList.toggle('dark', isDark)
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  if (!mounted) {
    return (
      <div className={cn('w-9 h-9 rounded-lg bg-white/10 animate-pulse', className)} />
    )
  }

  const themes: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: '浅色' },
    { value: 'dark', icon: Moon, label: '深色' },
    { value: 'system', icon: Monitor, label: '跟随系统' },
  ]

  const currentIndex = themes.findIndex(t => t.value === theme)
  const nextTheme = themes[(currentIndex + 1) % themes.length]
  const Icon = nextTheme.icon

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(nextTheme.value)}
      className={cn(
        'relative group p-2 rounded-lg hover:bg-white/5 transition-colors',
        className
      )}
      title={`切换主题: ${nextTheme.label}`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 180, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Icon className="w-5 h-5 text-cyan-400" />
      </motion.div>

      {showLabel && (
        <span className="ml-2 text-sm text-gray-300">{nextTheme.label}</span>
      )}

      {/* Tooltip */}
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 backdrop-blur-sm rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-cyan-500/30">
        {nextTheme.label}
      </div>
    </motion.button>
  )
}

// 主题选择器组件
export const ThemeSelector: React.FC<{ className?: string }> = ({ className }) => {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as Theme
    if (stored) {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    root.classList.toggle('dark', isDark)
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const themes: { value: Theme; icon: typeof Sun; label: string; color: string }[] = [
    { value: 'light', icon: Sun, label: '浅色', color: 'text-yellow-400' },
    { value: 'dark', icon: Moon, label: '深色', color: 'text-purple-400' },
    { value: 'system', icon: Monitor, label: '跟随系统', color: 'text-cyan-400' },
  ]

  if (!mounted) return null

  return (
    <div className={cn('flex gap-2 p-1 bg-white/5 rounded-lg', className)}>
      {themes.map(({ value, icon: Icon, label, color }) => (
        <motion.button
          key={value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(value)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-md transition-all',
            theme === value
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-gray-400 hover:bg-white/5'
          )}
        >
          <Icon className={cn('w-4 h-4', color)} />
          <span className="text-sm">{label}</span>
        </motion.button>
      ))}
    </div>
  )
}

export default ThemeToggle
