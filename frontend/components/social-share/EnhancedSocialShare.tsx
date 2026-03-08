'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Share2,
  X,
  Link as LinkIcon,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  MessageCircle,
  Check,
  Copy,
  QrCode,
  Download,
  Bookmark,
  Printer,
  MoreHorizontal,
  Heart,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'

export interface SocialShareProps {
  title: string
  description?: string
  url?: string
  imageUrl?: string
  tags?: string[]
  platforms?: ('twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'email' | 'copy' | 'qr' | 'more')[]
  showText?: boolean
  variant?: 'button' | 'card' | 'dropdown'
  position?: 'horizontal' | 'vertical'
  className?: string
  onShare?: (platform: string) => void
}

export function EnhancedSocialShare({
  title,
  description,
  url,
  imageUrl,
  tags = [],
  platforms = ['twitter', 'facebook', 'linkedin', 'whatsapp', 'copy'],
  showText = false,
  variant = 'button',
  position = 'horizontal',
  className = '',
  onShare,
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [showMore, setShowMore] = useState(false)

  // 获取当前页面URL
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareTitle = title
  const shareDescription = description || title

  // 社交平台配置
  const socialPlatforms = {
    twitter: {
      name: 'Twitter',
      icon: Twitter,
      color: '#1DA1F2',
      getUrl: () =>
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}&hashtags=${tags.map((t) => t.replace('#', '')).join(',')}`,
    },
    facebook: {
      name: 'Facebook',
      icon: Facebook,
      color: '#1877F2',
      getUrl: () =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    linkedin: {
      name: 'LinkedIn',
      icon: Linkedin,
      color: '#0A66C2',
      getUrl: () =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    whatsapp: {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: '#25D366',
      getUrl: () =>
        `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
    },
    email: {
      name: 'Email',
      icon: Mail,
      color: '#EA4335',
      getUrl: () =>
        `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareDescription}\n\n${shareUrl}`)}`,
    },
    copy: {
      name: '复制链接',
      icon: LinkIcon,
      color: '#6B7280',
      action: () => handleCopy(),
    },
    qr: {
      name: '二维码',
      icon: QrCode,
      color: '#10B981',
      action: () => setShowQR(true),
    },
    bookmark: {
      name: '收藏',
      icon: Bookmark,
      color: '#F59E0B',
      action: () => handleBookmark(),
    },
    print: {
      name: '打印',
      icon: Printer,
      color: '#6366F1',
      action: () => handlePrint(),
    },
  }

  // 复制链接
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('链接已复制到剪贴板')
      onShare?.('copy')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('复制失败,请手动复制')
    }
  }

  // 收藏
  const handleBookmark = () => {
    if (typeof window !== 'undefined' && 'sidebar' in window) {
      // @ts-ignore
      window.sidebar.addPanel(shareTitle, shareUrl, '')
    } else {
      toast.info('请按 Ctrl+D (Mac: Cmd+D) 收藏此页面')
    }
    onShare?.('bookmark')
  }

  // 打印
  const handlePrint = () => {
    window.print()
    onShare?.('print')
  }

  // 分享到社交平台
  const handleShare = (platform: keyof typeof socialPlatforms) => {
    const config = socialPlatforms[platform]
    if (config.getUrl) {
      window.open(config.getUrl(), '_blank', 'width=600,height=400')
      onShare?.(platform)
    } else if (config.action) {
      config.action()
    }
  }

  // 生成二维码URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`

  // 渲染分享按钮
  const renderShareButton = (platform: keyof typeof socialPlatforms) => {
    const config = socialPlatforms[platform]
    const Icon = config.icon

    return (
      <motion.button
        key={platform}
        onClick={() => handleShare(platform)}
        className={`relative overflow-hidden group ${
          position === 'vertical'
            ? 'w-full justify-start'
            : variant === 'card'
            ? 'flex-1'
            : ''
        }`}
        style={{
          padding: variant === 'card' ? '12px' : '8px 12px',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
          style={{ backgroundColor: config.color }}
        />
        <div className="relative flex items-center gap-2">
          <Icon className="w-5 h-5" style={{ color: config.color }} />
          {showText && variant !== 'button' && (
            <span className="text-sm font-medium text-gray-300">{config.name}</span>
          )}
        </div>
      </motion.button>
    )
  }

  // 按钮变体
  if (variant === 'button') {
    return (
      <div className={`inline-block ${className}`}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 transition-all group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Share2 className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
          {showText && <span className="text-gray-300">分享</span>}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* 背景遮罩 */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />

              {/* 下拉菜单 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute z-50 mt-2 p-2 bg-gray-900 border border-gray-700 rounded-xl shadow-xl"
              >
                <div className="flex gap-2">
                  {platforms.map((platform) => renderShareButton(platform))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // 卡片变体
  if (variant === 'card') {
    return (
      <Card className={`${className}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-100">分享这篇文章</h3>
                <p className="text-sm text-gray-400">让更多人看到有价值的内容</p>
              </div>
            </div>

            <button
              onClick={() => setShowMore(!showMore)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* 主要平台 */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {platforms.slice(0, 5).map((platform) => {
              const config = socialPlatforms[platform]
              const Icon = config.icon

              return (
                <motion.button
                  key={platform}
                  onClick={() => handleShare(platform)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-all group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: config.color + '20' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                  </div>
                  <span className="text-xs text-gray-400">{config.name}</span>
                </motion.button>
              )
            })}
          </div>

          {/* 更多选项 */}
          {showMore && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-700"
            >
              {['qr', 'bookmark', 'print'].map((platform) => {
                const config = socialPlatforms[platform as keyof typeof socialPlatforms]
                const Icon = config.icon

                return (
                  <motion.button
                    key={platform}
                    onClick={() => handleShare(platform as keyof typeof socialPlatforms)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                    <span className="text-xs text-gray-400">{config.name}</span>
                  </motion.button>
                )
              })}
            </motion.div>
          )}

          {/* 复制链接 */}
          <div className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-400 outline-none"
              />
              <Button
                size="sm"
                variant={copied ? 'success' : 'ghost'}
                onClick={handleCopy}
                className="flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    复制
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // 默认横向布局
  return (
    <div className={`flex gap-2 ${position === 'vertical' ? 'flex-col' : ''} ${className}`}>
      {platforms.map((platform) => renderShareButton(platform))}

      {/* 二维码弹窗 */}
      <AnimatePresence>
        {showQR && (
          <>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowQR(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <Card className="max-w-sm w-full">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-100">扫码分享</h3>
                    <button
                      onClick={() => setShowQR(false)}
                      className="p-1 hover:bg-gray-800 rounded transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="bg-white p-4 rounded-xl mb-4">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-full aspect-square"
                    />
                  </div>

                  <p className="text-sm text-gray-400 text-center mb-4">
                    使用手机扫描二维码分享
                  </p>

                  <Button
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = qrCodeUrl
                      link.download = 'qrcode.png'
                      link.click()
                    }}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    下载二维码
                  </Button>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EnhancedSocialShare
