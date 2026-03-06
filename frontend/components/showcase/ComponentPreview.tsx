'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Code, Eye, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ComponentPreviewProps {
  name: string
  description?: string
  component: React.ReactNode
  code?: string
  className?: string
}

export function ComponentPreview({
  name,
  description,
  component,
  code,
  className,
}: ComponentPreviewProps) {
  const [view, setView] = useState<'preview' | 'code'>('preview')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!code) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('cyber-card border border-cyber-border/50', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-border/50">
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          {description && (
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {code && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('preview')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  view === 'preview'
                    ? 'bg-cyber-cyan/20 text-cyber-cyan'
                    : 'text-gray-400 hover:text-cyber-cyan'
                )}
                aria-label="Preview"
              >
                <Eye className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('code')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  view === 'code'
                    ? 'bg-cyber-cyan/20 text-cyber-cyan'
                    : 'text-gray-400 hover:text-cyber-cyan'
                )}
                aria-label="View code"
              >
                <Code className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="p-2 rounded-lg text-gray-400 hover:text-cyber-cyan transition-colors"
                aria-label="Copy code"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {view === 'preview' ? (
          <div className="flex items-center justify-center min-h-[200px]">
            {component}
          </div>
        ) : code ? (
          <pre className="overflow-x-auto">
            <code className="text-sm text-gray-300">{code}</code>
          </pre>
        ) : null}
      </div>
    </div>
  )
}

export function ComponentShowcase({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        {description && (
          <p className="text-gray-400">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}
