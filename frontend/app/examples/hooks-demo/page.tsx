'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  useFullscreen,
  useDownload,
  useSpeech,
  useNetworkStatus,
} from '@/hooks';
import { MainLayout, Section, SectionHeader, Container } from '@/components/layout';
import { Button, Card } from '@/components/ui';

export default function HooksDemo() {
  // 全屏 Hook
  const {
    isFullscreen,
    enter: enterFullscreen,
    exit: exitFullscreen,
    toggle: toggleFullscreen,
    isEnabled: fullscreenEnabled,
  } = useFullscreen({
    onEnter: () => console.log('进入全屏'),
    onExit: () => console.log('退出全屏'),
  });

  // 下载 Hook
  const { downloadText, downloadFromUrl, isDownloading } = useDownload({
    onDownloadStart: () => console.log('开始下载'),
    onDownloadEnd: () => console.log('下载完成'),
  });

  // 语音合成 Hook
  const {
    speak,
    cancel: cancelSpeech,
    isSpeaking,
    isPaused,
    isSupported: speechSupported,
    voices,
    rate,
    pitch,
    volume,
    setRate,
    setPitch,
    setVolume,
  } = useSpeech({
    lang: 'zh-CN',
    onStart: () => console.log('开始说话'),
    onEnd: () => console.log('结束说话'),
  });

  // 网络状态 Hook
  const { isOnline, connection, lastOnline, isSupported: networkSupported } = useNetworkStatus();

  // 本地状态
  const [textToSpeak, setTextToSpeak] = useState('你好，欢迎使用 CyberPress 平台！');
  const [downloadUrl, setDownloadUrl] = useState('https://example.com/file.pdf');

  return (
    <MainLayout>
      <Container size="lg">
        <Section variant="cyber" padding="lg">
          <SectionHeader
            title="Hooks 示例"
            badge="Hooks"
            description="展示各种自定义 Hooks 的使用方法"
          />
        </Section>

        {/* 全屏 Hook */}
        <Section variant="neon" padding="md" className="mt-8">
          <h3 className="text-xl font-bold text-cyber-cyan mb-4">全屏 Hook (useFullscreen)</h3>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-400">支持全屏:</span>
                <span className={fullscreenEnabled ? 'text-cyber-green' : 'text-cyber-pink'}>
                  {fullscreenEnabled ? '是' : '否'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gray-400">当前状态:</span>
                <span className={isFullscreen ? 'text-cyber-green' : 'text-gray-300'}>
                  {isFullscreen ? '全屏中' : '普通模式'}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={toggleFullscreen} variant="primary">
                  切换全屏
                </Button>
                <Button onClick={enterFullscreen} variant="secondary">
                  进入全屏
                </Button>
                {isFullscreen && (
                  <Button onClick={exitFullscreen} variant="ghost">
                    退出全屏
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </Section>

        {/* 下载 Hook */}
        <Section variant="holographic" padding="md" className="mt-8">
          <h3 className="text-xl font-bold text-cyber-cyan mb-4">下载 Hook (useDownload)</h3>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-400">下载状态:</span>
                <span className={isDownloading ? 'text-cyber-cyan' : 'text-gray-300'}>
                  {isDownloading ? '下载中...' : '空闲'}
                </span>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">下载文本</label>
                <Button
                  onClick={() => downloadText('这是测试文本内容\n换行内容', 'test.txt')}
                  variant="primary"
                  disabled={isDownloading}
                >
                  下载文本文件
                </Button>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">下载 JSON</label>
                <Button
                  onClick={() => {
                    const data = { name: 'CyberPress', version: '1.0.0', features: ['博客', '作品集'] };
                    downloadText(JSON.stringify(data, null, 2), 'data.json');
                  }}
                  variant="secondary"
                  disabled={isDownloading}
                >
                  下载 JSON 文件
                </Button>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">从 URL 下载</label>
                <input
                  type="text"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-cyber-darker border border-cyber-border rounded-lg text-gray-300 focus:border-cyber-cyan focus:outline-none"
                  placeholder="输入文件 URL"
                />
                <Button
                  onClick={() => downloadFromUrl(downloadUrl)}
                  variant="ghost"
                  disabled={isDownloading}
                  className="mt-2"
                >
                  从 URL 下载
                </Button>
              </div>
            </div>
          </Card>
        </Section>

        {/* 语音合成 Hook */}
        <Section variant="cyber" padding="md" className="mt-8">
          <h3 className="text-xl font-bold text-cyber-cyan mb-4">语音合成 Hook (useSpeech)</h3>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-400">支持语音:</span>
                <span className={speechSupported ? 'text-cyber-green' : 'text-cyber-pink'}>
                  {speechSupported ? '是' : '否'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gray-400">状态:</span>
                {isSpeaking && <span className="text-cyber-cyan">正在说话</span>}
                {isPaused && <span className="text-cyber-yellow">已暂停</span>}
                {!isSpeaking && !isPaused && <span className="text-gray-300">空闲</span>}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">要说的文本</label>
                <textarea
                  value={textToSpeak}
                  onChange={(e) => setTextToSpeak(e.target.value)}
                  className="w-full px-4 py-2 bg-cyber-darker border border-cyber-border rounded-lg text-gray-300 focus:border-cyber-cyan focus:outline-none resize-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    语速: {rate.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    音调: {pitch.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    音量: {volume.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => speak(textToSpeak)}
                  variant="primary"
                  disabled={isSpeaking}
                >
                  说话
                </Button>
                {isPaused ? (
                  <Button
                    onClick={() => window.speechSynthesis?.resume()}
                    variant="secondary"
                  >
                    继续
                  </Button>
                ) : (
                  <Button
                    onClick={() => window.speechSynthesis?.pause()}
                    variant="secondary"
                    disabled={!isSpeaking}
                  >
                    暂停
                  </Button>
                )}
                <Button
                  onClick={cancelSpeech}
                  variant="ghost"
                  disabled={!isSpeaking && !isPaused}
                >
                  停止
                </Button>
              </div>

              {voices.length > 0 && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    可用声音 ({voices.length})
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-cyber-darker border border-cyber-border rounded-lg text-gray-300 focus:border-cyber-cyan focus:outline-none"
                    onChange={(e) => console.log('选择声音:', e.target.value)}
                  >
                    {voices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </Card>
        </Section>

        {/* 网络状态 Hook */}
        <Section variant="neon" padding="md" className="mt-8">
          <h3 className="text-xl font-bold text-cyber-cyan mb-4">网络状态 Hook (useNetworkStatus)</h3>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-400">支持网络检测:</span>
                <span className={networkSupported ? 'text-cyber-green' : 'text-cyber-pink'}>
                  {networkSupported ? '是' : '否'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gray-400">在线状态:</span>
                <span className={isOnline ? 'text-cyber-green' : 'text-cyber-pink'}>
                  {isOnline ? '在线' : '离线'}
                </span>
              </div>

              {lastOnline && (
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">上次在线:</span>
                  <span className="text-gray-300">
                    {new Date(lastOnline).toLocaleString()}
                  </span>
                </div>
              )}

              {connection && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-cyber-darker rounded-lg">
                    <div className="text-sm text-gray-400">连接类型</div>
                    <div className="text-lg font-semibold text-cyber-cyan">
                      {connection.effectiveType || 'unknown'}
                    </div>
                  </div>
                  <div className="p-3 bg-cyber-darker rounded-lg">
                    <div className="text-sm text-gray-400">下行速度</div>
                    <div className="text-lg font-semibold text-cyber-cyan">
                      {connection.downlink} Mbps
                    </div>
                  </div>
                  <div className="p-3 bg-cyber-darker rounded-lg">
                    <div className="text-sm text-gray-400">往返延迟</div>
                    <div className="text-lg font-semibold text-cyber-cyan">
                      {connection.rtt} ms
                    </div>
                  </div>
                  <div className="p-3 bg-cyber-darker rounded-lg">
                    <div className="text-sm text-gray-400">省流量模式</div>
                    <div className="text-lg font-semibold text-cyber-cyan">
                      {connection.saveData ? '是' : '否'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Section>
      </Container>
    </MainLayout>
  );
}
