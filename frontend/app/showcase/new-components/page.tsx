/**
 * CyberPress Platform - New Components Showcase
 * 新组件展示页面
 */

import {
  SpeedDial,
  BottomSheet,
  PullToRefresh,
  SkeletonCard,
  BlogCardSkeleton,
  UserCardSkeleton,
  StatCardSkeleton,
  SkeletonList,
  SkeletonTable,
  OTPInput,
  CommentItem,
  RadioGroup,
  AudioPlayer,
  ProgressBar,
  CircularProgress,
  MatrixBackground,
  DigitalRainBackground,
  CyberGrid,
  NewsletterCard,
} from '@/components/index-new-components';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function NewComponentsShowcase() {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [radioValue, setRadioValue] = useState('option1');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // SpeedDial 操作
  const speedDialActions = [
    {
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
      label: '新建',
      onClick: () => alert('新建'),
      color: 'cyan' as const,
    },
    {
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
      label: '上传',
      onClick: () => alert('上传'),
      color: 'purple' as const,
    },
    {
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>,
      label: '分享',
      onClick: () => alert('分享'),
      color: 'pink' as const,
    },
  ];

  // 模拟下拉刷新
  const handleRefresh = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  // 音频播放器曲目
  const audioTracks = [
    {
      id: '1',
      title: 'Cyber City',
      artist: 'Synthwave Artist',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      id: '2',
      title: 'Neon Dreams',
      artist: 'Retrowave Mix',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
  ];

  // 示例评论
  const exampleComment = {
    id: '1',
    author: {
      name: 'CyberUser',
      avatar: undefined,
    },
    content: '这个赛博朋克风格太酷了！🔥',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    likes: 42,
    isLiked: true,
    replies: [
      {
        id: '2',
        author: {
          name: 'DevBot',
          avatar: undefined,
        },
        content: '同意！设计非常精美 👍',
        createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        likes: 8,
        isLiked: false,
      },
    ],
  };

  // 单选项
  const radioOptions = [
    { value: 'option1', label: '赛博青', description: '经典的赛博朋克青色' },
    { value: 'option2', label: '霓虹紫', description: '神秘的紫色光芒' },
    { value: 'option3', label: '激光粉', description: '充满活力的粉色' },
  ];

  return (
    <div className="relative min-h-screen bg-cyber-dark">
      {/* Matrix 背景 */}
      <MatrixBackground density={30} fontSize={12} />

      {/* 网格背景 */}
      <CyberGrid size={60} opacity={0.05} />

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-cyber-cyan mb-4 font-display">
            新组件展示
          </h1>
          <p className="text-xl text-cyber-muted">
            最新创建的赛博朋克风格组件
          </p>
        </motion.div>

        <div className="space-y-24">
          {/* SpeedDial 快速拨号 */}
          <section className="relative">
            <h2 className="text-3xl font-bold text-cyber-purple mb-8 font-display">
              SpeedDial 快速拨号
            </h2>
            <div className="bg-cyber-card/50 backdrop-blur-sm border border-cyber-border rounded-lg p-8 h-96">
              <p className="text-cyber-muted mb-4">
                查看右下角的快速拨号按钮
              </p>
              <SpeedDial actions={speedDialActions} position="bottom-right" />
            </div>
          </section>

          {/* BottomSheet 底部抽屉 */}
          <section>
            <h2 className="text-3xl font-bold text-cyber-purple mb-8 font-display">
              BottomSheet 底部抽屉
            </h2>
            <Button onClick={() => setBottomSheetOpen(true)}>打开底部抽屉</Button>

            <BottomSheet
              isOpen={bottomSheetOpen}
              onClose={() => setBottomSheetOpen(false)}
              title="底部抽屉示例"
              height="half"
            >
              <div className="space-y-4">
                <p className="text-gray-300">
                  这是一个底部抽屉组件，支持多种高度选项和动画效果。
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-cyber-darker border border-cyber-border rounded-lg p-4">
                    <h3 className="text-cyber-cyan font-semibold mb-2">功能 1</h3>
                    <p className="text-sm text-cyber-muted">描述内容</p>
                  </div>
                  <div className="bg-cyber-darker border border-cyber-border rounded-lg p-4">
                    <h3 className="text-cyber-cyan font-semibold mb-2">功能 2</h3>
                    <p className="text-sm text-cyber-muted">描述内容</p>
                  </div>
                </div>
              </div>
            </BottomSheet>
          </section>

          {/* PullToRefresh 下拉刷新 */}
          <section>
            <h2 className="text-3xl font-bold text-cyber-purple mb-8 font-display">
              PullToRefresh 下拉刷新
            </h2>
            <div className="bg-cyber-card/50 backdrop-blur-sm border border-cyber-border rounded-lg">
              <PullToRefresh onRefresh={handleRefresh}>
                <div className="p-8 space-y-4">
                  <p className="text-gray-300">下拉此区域以刷新内容</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-cyber-darker border border-cyber-border rounded-lg p-4">
                        <h3 className="text-cyber-cyan font-semibold mb-2">项目 {i}</h3>
                        <p className="text-sm text-cyber-muted">
                          这是一些示例内容，用于展示下拉刷新功能。
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </PullToRefresh>
            </div>
          </section>

          {/* Skeleton 骨架屏 */}
          <section>
            <h2 className="text-3xl font-bold text-cyber-purple mb-8 font-display">
              Skeleton 骨架屏
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BlogCardSkeleton />
              <UserCardSkeleton />
              <StatCardSkeleton />
            </div>
            <div className="mt-8">
              <SkeletonList count={3} showAvatar showAction />
            </div>
          </section>

          {/* OTPInput 验证码输入 */}
          <section>
            <h2 className="text-3xl font-bold text-cyber-purple mb-8 font-display">
              OTPInput 验证码输入
            </h2>
            <div className="bg-cyber-card/50 backdrop-blur-sm border border-cyber-border rounded-lg p-8 max-w-md">
              <OTPInput
                length={6}
                value={otp}
                onChange={setOtp}
                onComplete={(val) => alert(`验证码: ${val}`)}
              />
              <p className="mt-4 text-sm text-cyber-muted text-center">
                输入的验证码: {otp || '（未输入）'}
              </p>
            </div>
          </section>

          {/* CommentItem 评论项 */}
          <section>
            <h2 className="text-3xl font-bold text-cyber-purple mb-8 font-display">
              CommentItem 评论组件
            </h2>
            <div className="max-w-2xl">
              <CommentItem
                {...exampleComment}
                onLike={(id) => alert(`点赞评论 ${id}`)}
                onReply={(id, content) => alert(`回复 ${id}: ${content}`)}
              />
            </div>
          </section>

          {/* RadioGroup 单选框组 */}
          <section>
            <h2 className="text-3xl font-bold text-cyber-purple mb-8 font-display">
              RadioGroup 单选框组
            </h2>
            <div className="bg-cyber-card/50 backdrop-blur-sm border border-cyber-border rounded-lg p-8 max-w-md">
              <RadioGroup
                name="color-choice"
                options={radioOptions}
                value={radioValue}
                onChange={setRadioValue}
                variant="neon"
              />
              <p className="mt-4 text-sm text-cyber-muted">
                选择的值: {radioValue}
              </p>
            </div>
          </section>

          {/* AudioPlayer 音频播放器 */}
          <section>
            <h2 className="text-3xl font-bold text-cyber-purple mb-8 font-display">
              AudioPlayer 音频播放器
            </h2>
            <div className="max-w-2xl">
              <AudioPlayer tracks={audioTracks} />
            </div>
          </section>

          {/* ProgressBar 进度条 */}
          <section>
            <h2 className="text-3xl font-bold text-cyber-purple mb-8 font-display">
              ProgressBar 进度条
            </h2>
            <div className="space-y-8">
              <div className="bg-cyber-card/50 backdrop-blur-sm border border-cyber-border rounded-lg p-8">
                <ProgressBar value={75} label="下载进度" showPercentage variant="neon" />
                <div className="mt-6">
                  <ProgressBar value={45} label="上传速度" showValue unit="MB/s" variant="gradient" />
                </div>
                <div className="mt-6">
                  <ProgressBar value={90} label="系统负载" variant="cyber" striped animated />
                </div>
              </div>

              <div className="flex justify-center gap-8">
                <CircularProgress value={75} label="完成度" size={150} />
                <CircularProgress value={45} label="CPU" color="purple" size={150} />
                <CircularProgress value={90} label="内存" color="pink" size={150} />
              </div>
            </div>
          </section>

          {/* NewsletterCard 订阅卡片 */}
          <section>
            <h2 className="text-3xl font-bold text-cyber-purple mb-8 font-display">
              NewsletterCard 订阅卡片
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <NewsletterCard variant="default" />
              <NewsletterCard variant="neon" />
              <NewsletterCard variant="hologram" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
