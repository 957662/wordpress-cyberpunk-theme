'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface FlipCardProps {
  front: React.ReactNode
  back: React.ReactNode
  className?: string
  direction?: 'horizontal' | 'vertical'
  speed?: number
  width?: string
  height?: string
}

export function FlipCard({
  front,
  back,
  className,
  direction = 'horizontal',
  speed = 600,
  width = '100%',
  height = '300px',
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const flipDirection = direction === 'horizontal' ? 'rotate-y-180' : 'rotate-x-180'

  return (
    <div
      className={cn('perspective-1000', className)}
      style={{ width, height }}
    >
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-600 transform-style-3d cursor-pointer',
          isFlipped && flipDirection,
        )}
        style={{ transitionDuration: `${speed}ms` }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* 正面 */}
        <div
          className={cn(
            'absolute w-full h-full backface-hidden',
            'bg-cyber-card border border-cyber-border rounded-lg p-6',
            'hover:border-cyber-cyan transition-colors',
          )}
        >
          {front}
        </div>

        {/* 背面 */}
        <div
          className={cn(
            'absolute w-full h-full backface-hidden',
            'bg-cyber-card border border-cyber-cyan rounded-lg p-6',
            direction === 'horizontal' ? 'rotate-y-180' : 'rotate-x-180',
          )}
        >
          {back}
        </div>
      </div>
    </div>
  )
}

// 3D 悬浮卡片
interface FloatingCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export function FloatingCard({
  children,
  className,
  intensity = 20,
}: FloatingCardProps) {
  const [transform, setTransform] = useState('')

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * intensity
    const rotateY = ((x - centerX) / centerX) * -intensity

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`)
  }

  const handleMouseLeave = () => {
    setTransform('')
  }

  return (
    <div
      className={cn('transition-transform duration-200 ease-out', className)}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

// 全息投影卡片
interface HolographicCardProps {
  children: React.ReactNode
  className?: string
  colors?: string[]
}

export function HolographicCard({
  children,
  className,
  colors = ['#00f0ff', '#9d00ff', '#ff0080', '#f0ff00'],
}: HolographicCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const gradientStyle = {
    background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${colors.join(', ')})`,
    backgroundSize: '200% 200%',
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-cyber-border bg-cyber-card',
        'hover:border-cyber-cyan transition-colors duration-300',
        className,
      )}
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-300"
        style={gradientStyle}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// 发光边框卡片
interface GlowingCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: 'cyan' | 'purple' | 'pink' | 'yellow'
  intensity?: 'low' | 'medium' | 'high'
}

export function GlowingCard({
  children,
  className,
  glowColor = 'cyan',
  intensity = 'medium',
}: GlowingCardProps) {
  const glowColors = {
    cyan: 'rgba(0, 240, 255',
    purple: 'rgba(157, 0, 255',
    pink: 'rgba(255, 0, 128',
    yellow: 'rgba(240, 255, 0',
  }

  const intensityValues = {
    low: '0.1, 0.3)',
    medium: '0.3, 0.5)',
    high: '0.5, 0.8)',
  }

  const glow = `${glowColors[glowColor]}, ${intensityValues[intensity]}`

  return (
    <div
      className={cn(
        'relative rounded-lg border border-cyber-border bg-cyber-card',
        'hover:shadow-lg transition-all duration-300',
        className,
      )}
      style={{
        boxShadow: `0 0 20px ${glow}`,
      }}
    >
      {children}
    </div>
  )
}

// 使用示例
export function CardEffectsExample() {
  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-cyber-cyan">Card Effects Demo</h2>

      {/* Flip Card */}
      <div>
        <h3 className="text-lg font-semibold text-cyber-purple mb-4">Flip Card</h3>
        <FlipCard
          width="300px"
          height="200px"
          front={
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-cyber-cyan text-lg font-semibold">Front Side</p>
              <p className="text-gray-400 text-sm mt-2">Hover to flip</p>
            </div>
          }
          back={
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-cyber-purple text-lg font-semibold">Back Side</p>
              <p className="text-gray-400 text-sm mt-2">Click to flip back</p>
            </div>
          }
        />
      </div>

      {/* Floating Card */}
      <div>
        <h3 className="text-lg font-semibold text-cyber-purple mb-4">Floating Card</h3>
        <FloatingCard intensity={15} className="max-w-sm">
          <div className="p-6 bg-cyber-card border border-cyber-border rounded-lg">
            <p className="text-cyber-cyan text-lg font-semibold">Floating Effect</p>
            <p className="text-gray-400 text-sm mt-2">
              Move your mouse over this card to see the 3D floating effect
            </p>
          </div>
        </FloatingCard>
      </div>

      {/* Holographic Card */}
      <div>
        <h3 className="text-lg font-semibold text-cyber-purple mb-4">
          Holographic Card
        </h3>
        <HolographicCard className="max-w-sm p-6">
          <p className="text-cyber-cyan text-lg font-semibold">
            Holographic Effect
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Move your mouse to see the holographic gradient
          </p>
        </HolographicCard>
      </div>

      {/* Glowing Card */}
      <div>
        <h3 className="text-lg font-semibold text-cyber-purple mb-4">
          Glowing Cards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlowingCard glowColor="cyan" intensity="medium" className="p-6">
            <p className="text-cyber-cyan text-lg font-semibold">Cyan Glow</p>
          </GlowingCard>
          <GlowingCard glowColor="purple" intensity="medium" className="p-6">
            <p className="text-cyber-purple text-lg font-semibold">
              Purple Glow
            </p>
          </GlowingCard>
          <GlowingCard glowColor="pink" intensity="medium" className="p-6">
            <p className="text-cyber-pink text-lg font-semibold">Pink Glow</p>
          </GlowingCard>
        </div>
      </div>
    </div>
  )
}
