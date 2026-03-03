/**
 * 通知功能演示页面
 * 展示通知下拉、通知设置等功能
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { NotificationDropdown } from '@/components/notification/notification-dropdown';
import { NotificationSettings } from '@/components/notification/notification-settings';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NotificationDemoPage() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">通知功能演示</h1>
        <p className="text-muted-foreground">
          展示通知下拉、通知设置等功能组件
        </p>
      </div>

      <div className="space-y-8">
        {/* 通知下拉演示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold">通知下拉组件</h2>
          <p className="text-muted-foreground">
            点击右上角铃铛图标查看通知
          </p>

          <Card className="relative flex h-32 items-center justify-center border-cyber-border bg-card/50 p-6">
            <div className="absolute right-4 top-4">
              <NotificationDropdown />
            </div>
            <p className="text-muted-foreground">
              通知下拉组件位于右上角
            </p>
          </Card>
        </motion.div>

        {/* 通知设置演示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">通知设置</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? '隐藏' : '显示'}设置
            </Button>
          </div>

          {showSettings && (
            <Card className="border-cyber-border bg-card/50 p-6">
              <NotificationSettings />
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
