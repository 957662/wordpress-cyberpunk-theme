'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, FileText, Clock, User, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Version {
  id: string
  version: string
  date: string
  author: {
    name: string
    avatar?: string
  }
  changes: string[]
  wordCount: number
}

interface ArticleVersionHistoryProps {
  versions: Version[]
  className?: string
}

export function ArticleVersionHistory({
  versions,
  className,
}: ArticleVersionHistoryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return '今天'
    if (diffDays === 1) return '昨天'
    if (diffDays < 7) return `${diffDays} 天前`
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className={cn('rounded-lg border border-[var(--cyber-border)]', className)}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between p-4',
          'bg-gradient-to-r from-[var(--cyber-card-bg)] to-transparent',
          'hover:from-[var(--cyber-muted)] transition-all duration-200'
        )}
      >
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-[var(--cyber-cyan)]" />
          <span className="font-semibold text-white">版本历史</span>
          <span className="px-2 py-0.5 text-xs bg-[var(--cyber-primary)] bg-opacity-20 rounded-full text-[var(--cyber-cyan)]">
            {versions.length} 个版本
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-[var(--cyber-border)] space-y-3">
              {versions.map((version, index) => (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'p-4 rounded-lg border transition-all duration-200',
                    'hover:border-[var(--cyber-cyan)] hover:bg-[var(--cyber-muted)]',
                    expandedVersion === version.id ? 'border-[var(--cyber-cyan)] bg-[var(--cyber-muted)]' : 'border-[var(--cyber-border)]'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--cyber-primary)] bg-opacity-20 text-[var(--cyber-cyan)] font-semibold text-sm">
                        v{version.version}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{version.author.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(version.date)}</span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setExpandedVersion(expandedVersion === version.id ? null : version.id)}
                      className="p-1 rounded hover:bg-[var(--cyber-primary)] hover:bg-opacity-20 transition-colors"
                    >
                      {expandedVersion === version.id ? <ChevronUp className="w-4 h-4 text-[var(--cyber-cyan)]" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </motion.button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>{version.wordCount} 字</span>
                    </div>
                    {version.changes.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span>•</span>
                        <span>{version.changes.length} 项变更</span>
                      </div>
                    )}
                  </div>
                  <AnimatePresence>
                    {expandedVersion === version.id && version.changes.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 mt-2 border-t border-[var(--cyber-border)]">
                          <h5 className="text-xs font-semibold text-[var(--cyber-cyan)] mb-2">变更内容</h5>
                          <ul className="space-y-1">
                            {version.changes.map((change, changeIndex) => (
                              <motion.li
                                key={changeIndex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: changeIndex * 0.05 }}
                                className="flex items-start gap-2 text-xs text-gray-400"
                              >
                                <span className="text-[var(--cyber-purple)] mt-0.5">•</span>
                                <span>{change}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
