'use client'

import { useState, useRef, useEffect } from 'react'
import Image, { ImageProps as NextImageProps } from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, AlertCircle } from 'lucide-react'

interface OptimizedImageProps extends Omit<NextImageProps, 'onLoad' | 'onError'> {
  /** 加载中的占位符 */
  placeholder?: string | React.ReactNode
  /** 错误时的占位符 */
  fallback?: string | React.ReactNode
  /** 是否显示模糊效果 */
  blurEffect?: boolean
  /** 是否显示加载动画 */
  showLoader?: boolean
  /** 容器类名 */
  containerClassName?: string
  /** 加载完成回调 */
  onLoad?: () => void
  /** 加载错误回调 */
  onError?: () => void
}

/**
 * OptimizedImage - 优化的图片组件
 * 提供加载状态、错误处理和性能优化
 */
export function OptimizedImage({
  src,
  alt,
  placeholder,
  fallback,
  blurEffect = true,
  showLoader = true,
  containerClassName = '',
  onLoad,
  onError,
  className,
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [imgSrc, setImgSrc] = useState(src)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setImgSrc(src)
    setHasError(false)
    setIsLoading(true)
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${containerClassName}`}
    >
      <AnimatePresence mode="wait">
        {/* 加载状态 */}
        {isLoading && showLoader && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-cyber-muted/50"
          >
            {placeholder || (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-cyber-cyan animate-spin" />
                <span className="text-sm text-gray-400">Loading...</span>
              </div>
            )}
          </motion.div>
        )}

        {/* 模糊效果 */}
        {isLoading && blurEffect && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/10 to-cyber-purple/10 backdrop-blur-sm"
          />
        )}

        {/* 错误状态 */}
        {hasError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-cyber-muted/30"
          >
            {fallback || (
              <div className="flex flex-col items-center gap-3 text-gray-500">
                <AlertCircle className="w-8 h-8" />
                <span className="text-sm">Failed to load image</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 实际图片 */}
      {!hasError && (
        <Image
          src={imgSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className || ''}`}
          {...props}
        />
      )}

      {/* 赛博朋克边框效果 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyber-cyan/50" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyber-cyan/50" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyber-cyan/50" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyber-cyan/50" />
      </div>
    </div>
  )
}

/**
 * LazyImage - 懒加载图片组件
 * 当图片进入视口时才加载
 */
export function LazyImage(props: OptimizedImageProps) {
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px',
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={imgRef}>
      {isInView ? (
        <OptimizedImage {...props} />
      ) : (
        <div
          className={`bg-cyber-muted/30 animate-pulse ${props.containerClassName || ''}`}
          style={{ aspectRatio: props.width && props.height ? `${props.width}/${props.height}` : undefined }}
        />
      )}
    </div>
  )
}

/**
 * ImageGallery - 图片画廊组件
 * 支持网格布局和灯箱效果
 */
interface ImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    width?: number
    height?: number
  }>
  columns?: 2 | 3 | 4
  gap?: string
  className?: string
}

export function ImageGallery({
  images,
  columns = 3,
  gap = '1rem',
  className = '',
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  return (
    <>
      <div
        className={`grid grid-cols-${columns} gap-${gap.replace(/\s/g, '')} ${className}`}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap,
        }}
      >
        {images.map((image, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedImage(index)}
            className="relative overflow-hidden rounded-lg border border-cyber-border hover:border-cyber-cyan/50 transition-all group"
          >
            <OptimizedImage
              {...image}
              width={image.width || 400}
              height={image.height || 300}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium">
                查看
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* 灯箱 */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] w-full"
            >
              <Image
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                width={images[selectedImage].width || 1200}
                height={images[selectedImage].height || 800}
                className="w-full h-auto"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-cyber-cyan transition-colors"
              >
                <span className="text-2xl">✕</span>
              </button>

              {/* 导航箭头 */}
              {selectedImage > 0 && (
                <button
                  onClick={() => setSelectedImage(selectedImage - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-cyber-cyan/20 transition-colors"
                >
                  ←
                </button>
              )}
              {selectedImage < images.length - 1 && (
                <button
                  onClick={() => setSelectedImage(selectedImage + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-cyber-cyan/20 transition-colors"
                >
                  →
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default OptimizedImage
