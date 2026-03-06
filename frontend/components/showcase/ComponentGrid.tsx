'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ComponentItem {
  name: string
  description: string
  category: string
  status: 'stable' | 'beta' | 'alpha'
  href: string
  icon?: React.ReactNode
}

export interface ComponentGridProps {
  components: ComponentItem[]
  title?: string
  description?: string
  className?: string
}

export function ComponentGrid({
  components,
  title,
  description,
  className,
}: ComponentGridProps) {
  const statusColors = {
    stable: 'bg-green-500/20 text-green-400 border-green-500/50',
    beta: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    alpha: 'bg-red-500/20 text-red-400 border-red-500/50',
  }

  return (
    <div className={cn('w-full', className)}>
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          )}
          {description && (
            <p className="text-gray-400">{description}</p>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {components.map((component, index) => (
          <motion.div
            key={component.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <Link href={component.href}>
              <div className="cyber-card p-6 h-full border border-cyber-border/50 hover:border-cyber-cyan/50 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {component.name}
                    </h3>
                    <span className="text-xs text-gray-500">{component.category}</span>
                  </div>
                  {component.icon && (
                    <div className="flex-shrink-0 ml-2 text-cyber-cyan">
                      {component.icon}
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {component.description}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium border',
                      statusColors[component.status]
                    )}
                  >
                    {component.status}
                  </span>
                  <ArrowRight className="w-4 h-4 text-cyber-cyan" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function ComponentList({ components }: { components: ComponentItem[] }) {
  return (
    <div className="space-y-2">
      {components.map((component) => (
        <Link key={component.name} href={component.href}>
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center justify-between p-4 rounded-lg border border-cyber-border/30 hover:border-cyber-cyan/50 bg-cyber-dark/30 hover:bg-cyber-dark/50 transition-all duration-300"
          >
            <div className="flex-1">
              <h3 className="text-white font-medium">{component.name}</h3>
              <p className="text-sm text-gray-400">{component.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-cyber-cyan flex-shrink-0 ml-4" />
          </motion.div>
        </Link>
      ))}
    </div>
  )
}
