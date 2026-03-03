/**
 * 社交功能演示页面
 * 展示关注、粉丝列表等社交功能
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FollowButton } from '@/components/social/follow-button';
import { FollowStatsCard } from '@/components/social/follow-stats-card';
import { FollowersList } from '@/components/social/followers-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SocialDemoPage() {
  const [activeTab, setActiveTab] = useState('follow-button');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">社交功能演示</h1>
        <p className="text-muted-foreground">
          展示关注、粉丝列表等社交功能组件
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="follow-button">关注按钮</TabsTrigger>
          <TabsTrigger value="follow-stats">关注统计</TabsTrigger>
          <TabsTrigger value="followers-list">粉丝列表</TabsTrigger>
        </TabsList>

        <TabsContent value="follow-button">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">关注按钮</h2>
              <p className="text-muted-foreground">
                不同变体和大小的关注按钮
              </p>

              <div className="flex flex-wrap items-center gap-4 rounded-lg border border-cyber-border bg-card/50 p-6">
                <FollowButton userId="1" username="用户A" />
                <FollowButton userId="2" username="用户B" variant="outline" />
                <FollowButton userId="3" username="用户C" variant="ghost" />
                <FollowButton userId="4" size="sm" />
                <FollowButton userId="5" size="lg" />
                <FollowButton userId="6" showIcon={false} />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">已关注状态</h2>
              <p className="text-muted-foreground">
                显示已关注状态的按钮
              </p>

              <div className="flex flex-wrap items-center gap-4 rounded-lg border border-cyber-border bg-card/50 p-6">
                <FollowButton userId="7" username="已关注用户" isFollowing />
                <FollowButton
                  userId="8"
                  username="已关注用户"
                  isFollowing
                  variant="outline"
                />
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="follow-stats">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">关注统计卡片</h2>
              <p className="text-muted-foreground">
                不同变体的关注统计卡片
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    默认样式
                  </h3>
                  <FollowStatsCard userId="1" />
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    紧凑样式
                  </h3>
                  <FollowStatsCard userId="2" variant="compact" />
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    最小样式
                  </h3>
                  <FollowStatsCard userId="3" variant="minimal" />
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="followers-list">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">粉丝/关注列表</h2>
              <p className="text-muted-foreground">
                显示用户的粉丝和关注列表
              </p>

              <div className="space-y-8">
                <FollowersList userId="1" type="followers" />
                <FollowersList userId="1" type="following" />
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
