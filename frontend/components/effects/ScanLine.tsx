import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface ScanLineProps {
  className?: string
  speed?: 'slow' | 'medium' | 'fast'
}

export default function ScanLine({ className, speed = 'medium' }: ScanLineProps) {
  const [position, setPosition] = useState(0)

  useEffect(() => {
    const speeds = {
      slow: 0.05,
      medium: 0.1,
      fast: 0.2,
    }

    const interval = setInterval(() => {
      setPosition((prev) => (prev + speeds[speed]) % 100)
    }, 16)

    return () => clearInterval(interval)
  }, [speed])

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={{ opacity: 0.03 }}
    >
      <div
        className="absolute left-0 right-0 h-px bg-neon-cyan"
        style={{
          top: `${position}%`,
          boxShadow: '0 0 10px #00f0ff, 0 0 20px #00f0ff',
        }}
      />
    </div>
  )
}
