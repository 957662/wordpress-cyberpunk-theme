'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { EnhancedToastProvider, useEnhancedToast } from '@/components/ui/EnhancedToast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { StatsCard, StatsGrid, statsCardPresets } from '@/components/dashboard/StatsCard';
import { MetaTags } from '@/components/seo/MetaTags';
import { CyberButton } from '@/components/ui/CyberButton';
import { 
  TrendingUp, 
  Heart, 
  MessageCircle, 
  Share2, 
  Users,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle
} from 'lucide-react';

function DemoContent() {
  const { success, error, warning, info, toast } = useEnhancedToast();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Meta Tags */}
      <MetaTags
        title="新组件示例"
        description="展示最新创建的 UI 组件"
        keywords={['Next.js', 'React', 'Components', 'CyberPress']}
        type="website"
      />

      {/* Header */}
      <section className="relative py-16 px-4 border-b border-cyber-border">
        <div className="absolute inset-0 bg-cyber-grid opacity-10" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              <span className="text-glow-cyan text-cyber-cyan">新组件</span>
              <span className="text-glow-purple text-cyber-purple">示例</span>
            </h1>
            <p className="text-xl text-gray-400">
              展示最新创建的 UI 组件和功能
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Toast Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-cyber-cyan" />
              通知组件
            </h2>
            <div className="bg-deep-black/50 border border-cyber-border rounded-lg p-6">
              <div className="flex flex-wrap gap-3">
                <CyberButton
                  variant="primary"
                  onClick={() => success('操作成功', '数据已成功保存到服务器')}
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                >
                  成功通知
                </CyberButton>
                <CyberButton
                  variant="outline"
                  onClick={() => error('操作失败', '无法连接到服务器，请稍后重试')}
                  leftIcon={<AlertCircle className="w-4 h-4" />}
                >
                  错误通知
                </CyberButton>
                <CyberButton
                  variant="outline"
                  onClick={() => warning('警告', '您的会话即将过期')}
                  leftIcon={<AlertTriangle className="w-4 h-4" />}
                >
                  警告通知
                </CyberButton>
                <CyberButton
                  variant="outline"
                  onClick={() => info('提示', '新功能已上线')}
                  leftIcon={<Info className="w-4 h-4" />}
                >
                  信息通知
                </CyberButton>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-cyber-purple" />
              统计卡片
            </h2>
            <StatsGrid>
              <StatsCard {...statsCardPresets.totalViews} />
              <StatsCard {...statsCardPresets.totalLikes} />
              <StatsCard {...statsCardPresets.totalComments} />
              <StatsCard {...statsCardPresets.totalShares} />
            </StatsGrid>
          </motion.div>

          {/* Optimized Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Share2 className="w-6 h-6 text-cyber-pink" />
              优化图片
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-deep-black/50 border border-cyber-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">基础图片</h3>
                <OptimizedImage
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800"
                  alt="AI Technology"
                  width={400}
                  height={300}
                  className="rounded-lg"
                  showSkeleton={true}
                />
              </div>
              <div className="bg-deep-black/50 border border-cyber-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">可缩放图片</h3>
                <OptimizedImage
                  src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"
                  alt="Next.js"
                  width={400}
                  height={300}
                  className="rounded-lg"
                  showSkeleton={true}
                  enableZoom={true}
                  zoomOnClick={true}
                />
                <p className="text-sm text-gray-400 mt-2">点击图片可以放大查看</p>
              </div>
            </div>
          </motion.div>

          {/* Error Boundary Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-cyber-yellow" />
              错误边界
            </h2>
            <div className="bg-deep-black/50 border border-cyber-border rounded-lg p-6">
              <p className="text-gray-400 mb-4">
                点击下方按钮测试错误边界功能：
              </p>
              <CyberButton
                variant="outline"
                onClick={() => {
                  throw new Error('这是一个测试错误');
                }}
              >
                触发错误
              </CyberButton>
            </div>
          </motion.div>

          {/* Social Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-cyber-green" />
              社交数据
            </h2>
            <StatsGrid>
              <StatsCard
                title="总用户数"
                value="8.5K"
                change={15.2}
                changeType="increase"
                period="本月"
                color="cyan"
                icon={<Users className="w-6 h-6 text-cyber-cyan" />}
              />
              <StatsCard
                title="活跃用户"
                value="3.2K"
                change={8.7}
                changeType="increase"
                period="本周"
                color="purple"
                icon={<Heart className="w-6 h-6 text-cyber-purple" />}
              />
              <StatsCard
                title="评论数"
                value="1.8K"
                change={-3.2}
                changeType="decrease"
                period="本周"
                color="pink"
                icon={<MessageCircle className="w-6 h-6 text-cyber-pink" />}
              />
              <StatsCard
                title="分享数"
                value="956"
                change={22.5}
                changeType="increase"
                period="本周"
                color="green"
                icon={<Share2 className="w-6 h-6 text-cyber-green" />}
              />
            </StatsGrid>
          </motion.div>

        </div>
      </section>
    </div>
  );
}

export default function NewComponentsDemo() {
  return (
    <ErrorBoundary showDetails={true}>
      <EnhancedToastProvider>
        <DemoContent />
      </EnhancedToastProvider>
    </ErrorBoundary>
  );
}
