/**
 * AI组件示例页面
 */

'use client';

import React from 'react';
import { ChatInterface } from '@/components/ai/ChatInterface';
import { CodeSandbox } from '@/components/ai/CodeSandbox';
import { VoiceAssistant } from '@/components/ai/VoiceAssistant';
import { Card } from '@/components/ui/Card';

export default function AIExamplesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-cyber-cyan mb-2">
          AI 组件示例
        </h1>
        <p className="text-cyber-muted">
          体验最新的AI交互组件
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* AI聊天 */}
        <Card className="lg:col-span-2">
          <div className="p-6 border-b border-cyber-border">
            <h2 className="text-2xl font-bold text-cyber-cyan">AI 聊天助手</h2>
            <p className="text-sm text-cyber-muted mt-1">
              支持流式响应、Markdown渲染、代码高亮
            </p>
          </div>
          <div className="h-[600px]">
            <ChatInterface
              messages={[
                {
                  id: '1',
                  role: 'assistant',
                  content: '你好！我是AI助手，有什么可以帮助你的吗？',
                  timestamp: new Date()
                }
              ]}
              onSendMessage={async (content) => {
                // 模拟AI响应
                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve(`这是对"${content}"的模拟回复。在实际应用中，这里会调用真实的AI API。`);
                  }, 1000);
                });
              }}
              onClearHistory={() => console.log('清除历史')}
              onExportChat={() => console.log('导出对话')}
            />
          </div>
        </Card>

        {/* 代码沙盒 */}
        <Card>
          <div className="p-6 border-b border-cyber-border">
            <h2 className="text-2xl font-bold text-cyber-cyan">代码沙盒</h2>
            <p className="text-sm text-cyber-muted mt-1">
              实时代码编辑和预览
            </p>
          </div>
          <div className="h-[500px]">
            <CodeSandbox
              language="html"
              autoRun={true}
              onCodeChange={(code) => console.log('代码变更:', code)}
            />
          </div>
        </Card>

        {/* 语音助手 */}
        <Card>
          <div className="p-6 border-b border-cyber-border">
            <h2 className="text-2xl font-bold text-cyber-cyan">语音助手</h2>
            <p className="text-sm text-cyber-muted mt-1">
              语音识别和语音合成
            </p>
          </div>
          <div className="p-6">
            <VoiceAssistant
              onTranscript={(text) => console.log('识别结果:', text)}
              onSpeak={(text) => console.log('朗读文本:', text)}
              autoListen={false}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
