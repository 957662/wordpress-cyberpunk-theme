'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  VoiceInput,
  VoiceCommands,
  useCommonVoiceCommands,
} from '@/components/voice';
import {
  CursorTracker,
  MockCursorTracker,
  PresenceIndicator,
} from '@/components/collaborative';
import {
  SearchHighlight,
  TextSearch,
} from '@/components/search';
import { DocumentDiff } from '@/components/editor';
import {
  LazyImage,
  Skeleton,
  CardSkeleton,
  ListSkeleton,
  ImageCardSkeleton,
  SkeletonWrapper,
} from '@/components/utility';
import { CommandPalette } from '@/components/keyboard';
import type { UserPresence } from '@/components/collaborative';

export default function NewFeaturesShowcasePage() {
  // 语音命令状态
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const commonVoiceCommands = useCommonVoiceCommands();

  // 协作功能状态
  const [mockUsers] = useState<UserPresence[]>([
    {
      userId: '1',
      userName: 'Alice Chen',
      status: 'online',
      color: '#00f0ff',
    },
    {
      userId: '2',
      userName: 'Bob Smith',
      status: 'online',
      color: '#9d00ff',
    },
    {
      userId: '3',
      userName: 'Charlie Wang',
      status: 'away',
      color: '#ff0080',
    },
    {
      userId: '4',
      userName: 'Diana Jones',
      status: 'offline',
      color: '#f0ff00',
      lastSeen: new Date(Date.now() - 3600000),
    },
  ]);

  // 搜索状态
  const [searchQuery, setSearchQuery] = useState('');
  const sampleText = `CyberPress Platform 是一个现代化的赛博朋克风格博客平台。
它融合了未来科技感与极致用户体验，提供了丰富的功能和组件。

本平台支持语音识别、实时协作、智能搜索等先进功能。
您可以使用语音命令来控制页面，也可以实时看到其他用户的操作。

搜索功能支持高亮显示匹配内容，让您快速定位需要的信息。
文档对比功能可以帮助您查看内容的修改历史。`;

  // 命令面板命令
  const [commands] = useState([
    {
      id: 'voice-demo',
      label: '语音输入演示',
      icon: '🎤',
      shortcut: ['⌘', 'V'],
      action: () => console.log('Voice demo'),
    },
    {
      id: 'search-demo',
      label: '搜索功能演示',
      icon: '🔍',
      shortcut: ['⌘', 'S'],
      action: () => console.log('Search demo'),
    },
    {
      id: 'collab-demo',
      label: '协作功能演示',
      icon: '👥',
      shortcut: ['⌘', 'C'],
      action: () => console.log('Collab demo'),
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* 命令面板 */}
      <CommandPalette commands={commands} />

      {/* 协作功能演示 */}
      <MockCursorTracker isEnabled />
      <PresenceIndicator
        users={mockUsers}
        showStatus
        showAvatars
        position="bottom-right"
      />

      {/* 语音命令演示 */}
      <VoiceCommands
        commands={commonVoiceCommands}
        language="zh-CN"
        showCommands
        position="bottom-left"
      />

      <div className="container mx-auto px-4 py-8">
        {/* 页头 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
            新功能展示
          </h1>
          <p className="text-gray-400">
            探索最新的组件和功能特性
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <kbd className="px-2 py-1 bg-gray-800 rounded">⌘K</kbd>
            <span>打开命令面板</span>
          </div>
        </motion.div>

        {/* 功能选项卡 */}
        <Tabs defaultValue="voice" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="voice" className="data-[state=active]:bg-cyan-500/20">
              🎤 语音功能
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="data-[state=active]:bg-cyan-500/20">
              👥 协作功能
            </TabsTrigger>
            <TabsTrigger value="search" className="data-[state=active]:bg-cyan-500/20">
              🔍 搜索功能
            </TabsTrigger>
            <TabsTrigger value="editor" className="data-[state=active]:bg-cyan-500/20">
              📝 编辑器
            </TabsTrigger>
            <TabsTrigger value="utility" className="data-[state=active]:bg-cyan-500/20">
              🛠️ 实用工具
            </TabsTrigger>
          </TabsList>

          {/* 语音功能 */}
          <TabsContent value="voice" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 语音输入 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  🎤 语音输入
                </h3>
                <VoiceInput
                  onTranscript={setVoiceTranscript}
                  language="zh-CN"
                  placeholder="点击麦克风开始说话..."
                  showInterim
                />
                {voiceTranscript && (
                  <div className="mt-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                    <p className="text-sm text-gray-400 mb-1">识别结果：</p>
                    <p className="text-white">{voiceTranscript}</p>
                  </div>
                )}
              </motion.div>

              {/* 语音命令说明 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  💡 可用语音命令
                </h3>
                <div className="space-y-2">
                  {commonVoiceCommands.map((cmd, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-gray-700/30 border border-gray-600"
                    >
                      <div className="flex items-center gap-2 text-cyan-400 font-medium">
                        <span className="text-lg">🎯</span>
                        <span>{cmd.trigger}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{cmd.description}</p>
                      {cmd.aliases && cmd.aliases.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {cmd.aliases.map((alias, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-xs bg-gray-600 text-gray-300 rounded"
                            >
                              {alias}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* 协作功能 */}
          <TabsContent value="collaboration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 用户状态 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  👥 用户状态
                </h3>
                <div className="space-y-3">
                  {mockUsers.map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.userName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{user.userName}</p>
                        <p className="text-sm text-gray-400">
                          {user.status === 'online' && '在线'}
                          {user.status === 'away' && '离开'}
                          {user.status === 'offline' && '离线'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 光标跟踪说明 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  🖱️ 光标跟踪
                </h3>
                <p className="text-gray-400 mb-4">
                  页面上的彩色光标模拟其他用户的光标位置。在实时协作场景中，
                  您可以看到团队成员正在查看或编辑的内容。
                </p>
                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <p className="text-sm text-cyan-400">
                    💡 提示：查看页面上的模拟光标，它们会自动移动。
                  </p>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* 搜索功能 */}
          <TabsContent value="search" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 搜索高亮 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  🔍 搜索高亮
                </h3>
                <SearchHighlight
                  content={sampleText}
                  searchQuery={searchQuery}
                  onMatchFound={(matches) => console.log(`找到 ${matches} 个匹配`)}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="输入搜索关键词..."
                  className="w-full mt-4 px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </motion.div>

              {/* 文本搜索 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  📄 文本搜索
                </h3>
                <TextSearch
                  texts={[
                    'CyberPress Platform',
                    '语音识别功能',
                    '实时协作',
                    '智能搜索',
                    '文档对比',
                  ]}
                  placeholder="搜索功能..."
                />
              </motion.div>
            </div>
          </TabsContent>

          {/* 编辑器功能 */}
          <TabsContent value="editor" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                📝 文档对比
              </h3>
              <DocumentDiff
                originalContent="这是原始内容。\n包含第一行。\n包含第二行。\n包含第三行。"
                modifiedContent="这是修改后的内容。\n包含第一行。\n这是新增的第二行。\n包含修改后的第三行。\n新增了第四行。"
                fileName="示例文档.txt"
                showLineNumbers
                showStats
              />
            </motion.div>
          </TabsContent>

          {/* 实用工具 */}
          <TabsContent value="utility" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 骨架屏加载 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  ⏳ 骨架屏加载
                </h3>
                <div className="space-y-4">
                  <Skeleton variant="rectangular" width="100%" height={200} />
                  <div className="grid grid-cols-3 gap-4">
                    <ImageCardSkeleton aspectRatio="16:9" />
                    <ImageCardSkeleton aspectRatio="16:9" />
                    <ImageCardSkeleton aspectRatio="16:9" />
                  </div>
                  <ListSkeleton items={3} showAvatar />
                </div>
              </motion.div>

              {/* 懒加载图片 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  🖼️ 懒加载图片
                </h3>
                <div className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-700">
                    <LazyImage
                      src="/api/placeholder/800/450"
                      alt="示例图片"
                      width="100%"
                      height="100%"
                      showLoader
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
