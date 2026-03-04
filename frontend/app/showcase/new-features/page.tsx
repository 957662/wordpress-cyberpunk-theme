'use client';

/**
 * New Features Showcase Page
 * Demonstrates all the new features added to the platform:
 * - Real-time messaging
 * - Activity stream
 * - Performance monitoring
 * - Recommendations
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Activity, TrendingUp, Zap } from 'lucide-react';
import { MessageCenter } from '@/components/messages/message-center';
import { ActivityStream } from '@/components/activity/activity-stream';
import { PerformanceMonitor } from '@/components/performance/performance-monitor';

export default function NewFeaturesShowcase() {
  const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'messaging' | 'activity' | 'performance'>('messaging');

  // Mock current user
  const currentUser = {
    id: 1,
    username: 'demo_user',
    avatar: '/avatars/demo.png',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-cyber-cyan/20 bg-[#16162a]">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              ✨ New Features Showcase
            </h1>
            <p className="text-gray-400 text-lg">
              Explore the latest additions to CyberPress Platform
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab('messaging')}
            className={`p-6 rounded-lg border cursor-pointer transition-all ${
              activeTab === 'messaging'
                ? 'bg-cyber-cyan/20 border-cyber-cyan/50'
                : 'bg-[#16162a] border-cyber-cyan/20 hover:border-cyber-cyan/40'
            }`}
          >
            <MessageSquare className="w-12 h-12 text-cyber-cyan mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Real-time Messaging</h3>
            <p className="text-gray-400 text-sm">
              Private messaging with WebSocket support, typing indicators, and more.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab('activity')}
            className={`p-6 rounded-lg border cursor-pointer transition-all ${
              activeTab === 'activity'
                ? 'bg-cyber-purple/20 border-cyber-purple/50'
                : 'bg-[#16162a] border-cyber-purple/20 hover:border-cyber-purple/40'
            }`}
          >
            <Activity className="w-12 h-12 text-cyber-purple mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Activity Stream</h3>
            <p className="text-gray-400 text-sm">
              Real-time activity feed showing updates from your network.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab('performance')}
            className={`p-6 rounded-lg border cursor-pointer transition-all ${
              activeTab === 'performance'
                ? 'bg-cyber-pink/20 border-cyber-pink/50'
                : 'bg-[#16162a] border-cyber-pink/20 hover:border-cyber-pink/40'
            }`}
          >
            <Zap className="w-12 h-12 text-cyber-pink mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Performance Monitor</h3>
            <p className="text-gray-400 text-sm">
              Track FPS, memory usage, API response times, and more.
            </p>
          </motion.div>
        </div>

        {/* Feature Demo */}
        <div className="bg-[#16162a] border border-cyber-cyan/20 rounded-lg p-8">
          {activeTab === 'messaging' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">💬 Real-time Messaging</h2>

              <div className="space-y-6">
                <div className="bg-[#0a0a0f] border border-cyber-cyan/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-cyber-cyan mb-4">Features</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-cyan">✓</span>
                      Real-time message delivery via WebSocket
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-cyan">✓</span>
                      Typing indicators
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-cyan">✓</span>
                      Online/offline status
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-cyan">✓</span>
                      Read receipts
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-cyan">✓</span>
                      Message search and filtering
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-cyan">✓</span>
                      Conversation management
                    </li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setIsMessageCenterOpen(true)}
                    className="px-6 py-3 bg-cyber-cyan/20 hover:bg-cyber-cyan/30 border border-cyber-cyan/30 text-cyber-cyan font-semibold rounded-lg transition-colors"
                  >
                    Open Message Center
                  </button>

                  <button
                    onClick={() => {
                      // Open chat window directly
                      setIsMessageCenterOpen(true);
                    }}
                    className="px-6 py-3 bg-cyber-purple/20 hover:bg-cyber-purple/30 border border-cyber-purple/30 text-cyber-purple font-semibold rounded-lg transition-colors"
                  >
                    Start New Chat
                  </button>
                </div>

                <div className="bg-[#0a0a0f] border border-cyber-cyan/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-cyber-cyan mb-4">API Endpoints</h3>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="text-gray-300">
                      <span className="text-green-500">GET</span> /api/v1/messages/conversations
                    </div>
                    <div className="text-gray-300">
                      <span className="text-yellow-500">POST</span> /api/v1/messages/conversations
                    </div>
                    <div className="text-gray-300">
                      <span className="text-green-500">GET</span> /api/v1/messages/conversations/:id/messages
                    </div>
                    <div className="text-gray-300">
                      <span className="text-yellow-500">POST</span> /api/v1/messages/conversations/:id/messages
                    </div>
                    <div className="text-gray-300">
                      <span className="text-blue-500">PUT</span> /api/v1/messages/messages/:id/read
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">📊 Activity Stream</h2>

              <div className="space-y-6">
                <div className="bg-[#0a0a0f] border border-cyber-purple/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-cyber-purple mb-4">Features</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-purple">✓</span>
                      Real-time activity feed
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-purple">✓</span>
                      Personalized recommendations
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-purple">✓</span>
                      Trending content
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-purple">✓</span>
                      Activity notifications
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-purple">✓</span>
                      Infinite scroll
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-purple">✓</span>
                      Engagement tracking
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyber-purple mb-4">Live Demo</h3>
                  <ActivityStream userId={1} maxItems={10} showHeader />
                </div>

                <div className="bg-[#0a0a0f] border border-cyber-purple/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-cyber-purple mb-4">API Endpoints</h3>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="text-gray-300">
                      <span className="text-green-500">GET</span> /api/v1/activities/feed
                    </div>
                    <div className="text-gray-300">
                      <span className="text-green-500">GET</span> /api/v1/activities/notifications
                    </div>
                    <div className="text-gray-300">
                      <span className="text-green-500">GET</span> /api/v1/activities/stats
                    </div>
                    <div className="text-gray-300">
                      <span className="text-green-500">GET</span> /api/v1/activities/trending
                    </div>
                    <div className="text-gray-300">
                      <span className="text-yellow-500">POST</span> /api/v1/activities/:id/read
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">⚡ Performance Monitor</h2>

              <div className="space-y-6">
                <div className="bg-[#0a0a0f] border border-cyber-pink/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-cyber-pink mb-4">Features</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-pink">✓</span>
                      Real-time FPS monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-pink">✓</span>
                      Memory usage tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-pink">✓</span>
                      API response time tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-pink">✓</span>
                      Page load metrics
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-pink">✓</span>
                      Performance alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyber-pink">✓</span>
                      Network request tracking
                    </li>
                  </ul>
                </div>

                <div className="bg-[#0a0a0f] border border-cyber-pink/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-cyber-pink mb-4">How to Use</h3>
                  <p className="text-gray-300 mb-4">
                    Click the performance icon in the bottom-left corner to open the
                    performance monitor. It will display real-time metrics and alerts
                    when performance thresholds are exceeded.
                  </p>
                  <div className="bg-[#16162a] border border-cyber-pink/20 rounded p-4">
                    <code className="text-cyber-pink text-sm">
                      import {'{PerformanceMonitor}'} from '@/components/performance/performance-monitor';<br /><br />
                      {'<PerformanceMonitor sampleRate={1000} />'}
                    </code>
                  </div>
                </div>

                <div className="bg-[#0a0a0f] border border-cyber-pink/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-cyber-pink mb-4">Metrics Tracked</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-cyber-pink font-semibold mb-2">Navigation</h4>
                      <ul className="space-y-1 text-sm text-gray-400">
                        <li>• Page Load Time</li>
                        <li>• DOM Content Loaded</li>
                        <li>• First Contentful Paint</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-cyber-pink font-semibold mb-2">Runtime</h4>
                      <ul className="space-y-1 text-sm text-gray-400">
                        <li>• Frame Rate (FPS)</li>
                        <li>• Memory Usage</li>
                        <li>• API Response Time</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Floating Components */}
      <MessageCenter
        isOpen={isMessageCenterOpen}
        onClose={() => setIsMessageCenterOpen(false)}
        currentUser={currentUser}
      />

      <PerformanceMonitor sampleRate={1000} showDetails={false} />
    </div>
  );
}
