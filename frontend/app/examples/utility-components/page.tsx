'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShareButton,
  ShareButtons,
  PrintButton,
  BookmarkButton,
  BookmarkList,
  FontSizeSelector,
  FontSizeQuickSelector,
} from '@/components/ui';
import { MainLayout, Section, SectionHeader, Container } from '@/components/layout';

export default function UtilityComponentsExample() {
  const [showBookmarkList, setShowBookmarkList] = useState(false);

  return (
    <MainLayout>
      <Container size="lg">
        <Section variant="cyber" padding="lg">
          <SectionHeader
            title="实用组件示例"
            badge="Components"
            description="展示各种实用组件的使用方法"
          />
        </Section>

        {/* 分享按钮 */}
        <Section variant="neon" padding="md" className="mt-8">
          <h3 className="text-xl font-bold text-cyber-cyan mb-4">分享按钮</h3>

          <div className="space-y-6">
            {/* 单个分享按钮 */}
            <div className="p-4 bg-cyber-card border border-cyber-border rounded-lg">
              <h4 className="text-sm text-gray-400 mb-2">单个分享按钮（下拉菜单）</h4>
              <ShareButton
                title="CyberPress - 赛博朋克博客平台"
                description="一个基于 WordPress + Next.js 的赛博朋克风格博客平台"
                variant="primary"
                size="md"
              />
            </div>

            {/* 水平分享按钮组 */}
            <div className="p-4 bg-cyber-card border border-cyber-border rounded-lg">
              <h4 className="text-sm text-gray-400 mb-2">水平分享按钮组</h4>
              <ShareButtons
                title="CyberPress - 赛博朋克博客平台"
                description="一个基于 WordPress + Next.js 的赛博朋克风格博客平台"
                platforms={['twitter', 'linkedin', 'facebook', 'copy']}
              />
            </div>

            {/* 不同变体 */}
            <div className="p-4 bg-cyber-card border border-cyber-border rounded-lg">
              <h4 className="text-sm text-gray-400 mb-3">不同变体</h4>
              <div className="flex flex-wrap gap-3">
                <ShareButton variant="primary" size="sm" />
                <ShareButton variant="secondary" size="md" />
                <ShareButton variant="ghost" size="lg" />
              </div>
            </div>
          </div>
        </Section>

        {/* 打印按钮 */}
        <Section variant="holographic" padding="md" className="mt-8">
          <h3 className="text-xl font-bold text-cyber-cyan mb-4">打印按钮</h3>

          <div className="space-y-6">
            {/* 不同变体 */}
            <div className="p-4 bg-cyber-card border border-cyber-border rounded-lg">
              <h4 className="text-sm text-gray-400 mb-3">不同变体</h4>
              <div className="flex flex-wrap gap-3">
                <PrintButton variant="primary" size="sm" />
                <PrintButton variant="secondary" size="md" />
                <PrintButton variant="ghost" size="lg" />
              </div>
            </div>

            {/* 打印特定区域 */}
            <div className="p-4 bg-cyber-card border border-cyber-border rounded-lg">
              <h4 className="text-sm text-gray-400 mb-3">打印特定区域</h4>
              <PrintButton
                target="#printable-content"
                variant="primary"
                onAfterPrint={() => console.log('打印完成')}
              />
              <div id="printable-content" className="mt-4 p-4 bg-cyber-darker rounded">
                <p className="text-gray-300">这段内容可以被打印</p>
              </div>
            </div>
          </div>
        </Section>

        {/* 收藏按钮 */}
        <Section variant="cyber" padding="md" className="mt-8">
          <h3 className="text-xl font-bold text-cyber-cyan mb-4">收藏按钮</h3>

          <div className="space-y-6">
            {/* 单个收藏按钮 */}
            <div className="p-4 bg-cyber-card border border-cyber-border rounded-lg">
              <h4 className="text-sm text-gray-400 mb-3">收藏这篇文章</h4>
              <BookmarkButton
                id="example-post-1"
                title="实用组件示例"
                url="/examples/utility-components"
                variant="primary"
                size="md"
                onBookmarkChange={(bookmarked) => {
                  console.log('收藏状态:', bookmarked);
                }}
              />
            </div>

            {/* 不同变体 */}
            <div className="p-4 bg-cyber-card border border-cyber-border rounded-lg">
              <h4 className="text-sm text-gray-400 mb-3">不同变体</h4>
              <div className="flex flex-wrap gap-3">
                <BookmarkButton variant="primary" size="sm" />
                <BookmarkButton variant="secondary" size="md" />
                <BookmarkButton variant="ghost" size="lg" />
              </div>
            </div>

            {/* 收藏列表 */}
            <div className="p-4 bg-cyber-card border border-cyber-border rounded-lg">
              <h4 className="text-sm text-gray-400 mb-3">收藏列表</h4>
              <button
                onClick={() => setShowBookmarkList(!showBookmarkList)}
                className="px-4 py-2 bg-cyber-muted text-gray-300 rounded-lg hover:bg-cyber-border hover:text-white transition-colors"
              >
                {showBookmarkList ? '隐藏' : '显示'}收藏列表
              </button>
              {showBookmarkList && (
                <div className="mt-4">
                  <BookmarkList />
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* 字体大小选择器 */}
        <Section variant="neon" padding="md" className="mt-8">
          <h3 className="text-xl font-bold text-cyber-cyan mb-4">字体大小选择器</h3>

          <div className="space-y-6">
            {/* 完整选择器 */}
            <div className="p-4 bg-cyber-card border border-cyber-border rounded-lg">
              <h4 className="text-sm text-gray-400 mb-3">完整选择器（带面板）</h4>
              <FontSizeSelector
                min={12}
                max={24}
                defaultSize={16}
                step={1}
                variant="primary"
                size="md"
                onFontSizeChange={(size) => {
                  console.log('字体大小:', size);
                }}
              />
              <p className="mt-4 text-gray-300">
                这段文字会随着字体大小变化而变化。试试点击上面的按钮来调整字体大小！
              </p>
            </div>

            {/* 快速选择器 */}
            <div className="p-4 bg-cyber-card border border-cyber-border rounded-lg">
              <h4 className="text-sm text-gray-400 mb-3">快速选择器（按钮组）</h4>
              <FontSizeQuickSelector
                min={14}
                max={20}
                step={2}
                defaultSize={16}
                applyToRoot={true}
              />
            </div>

            {/* 不同变体 */}
            <div className="p-4 bg-cyber-card border border-cyber-border rounded-lg">
              <h4 className="text-sm text-gray-400 mb-3">不同变体</h4>
              <div className="flex flex-wrap gap-3">
                <FontSizeSelector variant="primary" size="sm" />
                <FontSizeSelector variant="secondary" size="md" />
                <FontSizeSelector variant="ghost" size="lg" />
              </div>
            </div>
          </div>
        </Section>

        {/* 综合示例 */}
        <Section variant="holographic" padding="md" className="mt-8">
          <h3 className="text-xl font-bold text-cyber-cyan mb-4">综合示例</h3>

          <div className="p-6 bg-cyber-card border border-cyber-border rounded-lg">
            <div className="flex flex-wrap items-center gap-4">
              <ShareButton variant="primary" size="md" />
              <PrintButton variant="secondary" size="md" />
              <BookmarkButton variant="ghost" size="md" />
              <FontSizeSelector variant="ghost" size="md" />
            </div>
          </div>
        </Section>
      </Container>
    </MainLayout>
  );
}
