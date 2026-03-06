'use client';

/**
 * 点赞和收藏功能使用示例页面
 */

import { LikeButtonEnhanced } from '@/components/blog/LikeButtonEnhanced';
import { BookmarkButtonEnhanced } from '@/components/blog/BookmarkButtonEnhanced';
import { LikeTargetType } from '@/types/like.types';
import { BookmarkTargetType } from '@/types/bookmark.types';

export default function LikesAndBookmarksExample() {
  return (
    <div className="min-h-screen bg-cyber-dark p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 标题 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            点赞和收藏功能示例
          </h1>
          <p className="text-cyber-muted">
            演示如何使用新的点赞和收藏组件
          </p>
        </div>

        {/* 基础示例 */}
        <section className="bg-cyber-muted/10 border border-cyber-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">基础示例</h2>
          <p className="text-cyber-muted mb-6">最简单的使用方式</p>

          <div className="flex gap-4">
            {/* 点赞按钮 */}
            <LikeButtonEnhanced
              targetType={LikeTargetType.POST}
              targetId="example-post-1"
              initialLiked={false}
              initialCount={42}
              showCount
            />

            {/* 收藏按钮 */}
            <BookmarkButtonEnhanced
              targetType={BookmarkTargetType.POST}
              targetId="example-post-1"
              initialBookmarked={false}
            />
          </div>
        </section>

        {/* 不同尺寸 */}
        <section className="bg-cyber-muted/10 border border-cyber-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">不同尺寸</h2>
          <p className="text-cyber-muted mb-6">支持 sm、md、lg 三种尺寸</p>

          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <p className="text-xs text-cyber-muted mb-2">Small</p>
              <LikeButtonEnhanced
                targetType={LikeTargetType.POST}
                targetId="size-sm"
                size="sm"
                initialCount={10}
              />
            </div>

            <div>
              <p className="text-xs text-cyber-muted mb-2">Medium</p>
              <LikeButtonEnhanced
                targetType={LikeTargetType.POST}
                targetId="size-md"
                size="md"
                initialCount={20}
              />
            </div>

            <div>
              <p className="text-xs text-cyber-muted mb-2">Large</p>
              <LikeButtonEnhanced
                targetType={LikeTargetType.POST}
                targetId="size-lg"
                size="lg"
                initialCount={30}
              />
            </div>
          </div>
        </section>

        {/* 不同变体 */}
        <section className="bg-cyber-muted/10 border border-cyber-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">不同变体</h2>
          <p className="text-cyber-muted mb-6">支持 default、outline、ghost 三种样式</p>

          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-xs text-cyber-muted mb-2">Default</p>
              <LikeButtonEnhanced
                targetType={LikeTargetType.POST}
                targetId="variant-default"
                variant="default"
                initialLiked
                initialCount={15}
              />
            </div>

            <div>
              <p className="text-xs text-cyber-muted mb-2">Outline</p>
              <LikeButtonEnhanced
                targetType={LikeTargetType.POST}
                targetId="variant-outline"
                variant="outline"
                initialLiked
                initialCount={25}
              />
            </div>

            <div>
              <p className="text-xs text-cyber-muted mb-2">Ghost</p>
              <LikeButtonEnhanced
                targetType={LikeTargetType.POST}
                targetId="variant-ghost"
                variant="ghost"
                initialLiked
                initialCount={35}
              />
            </div>
          </div>
        </section>

        {/* 不同目标类型 */}
        <section className="bg-cyber-muted/10 border border-cyber-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">不同目标类型</h2>
          <p className="text-cyber-muted mb-6">可以为文章、评论、项目等不同类型点赞</p>

          <div className="space-y-4">
            {/* 文章 */}
            <div className="flex items-center justify-between">
              <span className="text-white">文章点赞:</span>
              <LikeButtonEnhanced
                targetType={LikeTargetType.POST}
                targetId="post-123"
                initialCount={45}
              />
            </div>

            {/* 评论 */}
            <div className="flex items-center justify-between">
              <span className="text-white">评论点赞:</span>
              <LikeButtonEnhanced
                targetType={LikeTargetType.COMMENT}
                targetId="comment-456"
                initialCount={12}
              />
            </div>

            {/* 项目 */}
            <div className="flex items-center justify-between">
              <span className="text-white">项目点赞:</span>
              <LikeButtonEnhanced
                targetType={LikeTargetType.PROJECT}
                targetId="project-789"
                initialCount={89}
              />
            </div>
          </div>
        </section>

        {/* 收藏功能 */}
        <section className="bg-cyber-muted/10 border border-cyber-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">收藏功能</h2>
          <p className="text-cyber-muted mb-6">支持添加收藏备注</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">收藏文章（无备注）:</span>
              <BookmarkButtonEnhanced
                targetType={BookmarkTargetType.POST}
                targetId="post-123"
                allowNotes={false}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white">收藏文章（带备注）:</span>
              <BookmarkButtonEnhanced
                targetType={BookmarkTargetType.POST}
                targetId="post-456"
                allowNotes={true}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white">收藏项目:</span>
              <BookmarkButtonEnhanced
                targetType={BookmarkTargetType.PROJECT}
                targetId="project-789"
                allowNotes={true}
              />
            </div>
          </div>
        </section>

        {/* 带回调的示例 */}
        <section className="bg-cyber-muted/10 border border-cyber-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">事件回调</h2>
          <p className="text-cyber-muted mb-6">监听点赞/收藏状态变化</p>

          <div className="flex gap-4">
            <LikeButtonEnhanced
              targetType={LikeTargetType.POST}
              targetId="callback-example"
              initialLiked={false}
              initialCount={100}
              onLikeChange={(liked) => {
                console.log('点赞状态变化:', liked);
                // 这里可以触发其他操作，比如发送通知、更新UI等
              }}
            />

            <BookmarkButtonEnhanced
              targetType={BookmarkTargetType.POST}
              targetId="callback-example"
              onBookmarkChange={(bookmarked) => {
                console.log('收藏状态变化:', bookmarked);
                // 这里可以触发其他操作
              }}
            />
          </div>

          <p className="text-sm text-cyber-muted mt-4">
            打开浏览器控制台可以看到回调输出的日志
          </p>
        </section>

        {/* 文章卡片示例 */}
        <section className="bg-cyber-muted/10 border border-cyber-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">实际应用场景</h2>
          <p className="text-cyber-muted mb-6">在文章卡片中使用点赞和收藏</p>

          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-2">
              如何在 Next.js 中使用 Tailwind CSS
            </h3>
            <p className="text-cyber-muted mb-4">
              Tailwind CSS 是一个功能类优先的 CSS 框架，可以快速构建现代网站...
            </p>

            <div className="flex items-center gap-4">
              <LikeButtonEnhanced
                targetType={LikeTargetType.POST}
                targetId="article-1"
                initialLiked={false}
                initialCount={234}
                size="sm"
              />

              <BookmarkButtonEnhanced
                targetType={BookmarkTargetType.POST}
                targetId="article-1"
                initialBookmarked={false}
                size="sm"
              />

              <span className="text-sm text-cyber-muted ml-auto">
                2026-03-06
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
