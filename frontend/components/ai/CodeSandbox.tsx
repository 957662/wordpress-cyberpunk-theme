/**
 * 代码沙盒组件
 * 支持实时预览、多语言、主题切换
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';
import {
  Play,
  RefreshCw,
  Copy,
  Check,
  Settings,
  Maximize2,
  Minimize2,
  Code,
  Eye
} from 'lucide-react';

export interface CodeFile {
  id: string;
  name: string;
  language: string;
  code: string;
}

export interface SandBoxProps {
  files?: CodeFile[];
  initialCode?: string;
  language?: string;
  theme?: 'light' | 'dark' | 'cyber';
  showPreview?: boolean;
  autoRun?: boolean;
  className?: string;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => void;
}

const DEFAULT_CODE = {
  html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: rgba(255,255,255,0.1);
      padding: 30px;
      border-radius: 10px;
      backdrop-filter: blur(10px);
    }
    h1 {
      text-align: center;
      margin-bottom: 20px;
    }
    .btn {
      display: block;
      width: 100%;
      padding: 12px;
      margin-top: 20px;
      background: white;
      color: #667eea;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      transition: transform 0.2s;
    }
    .btn:hover {
      transform: scale(1.02);
    }
    .result {
      margin-top: 20px;
      padding: 15px;
      background: rgba(0,0,0,0.2);
      border-radius: 5px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 代码沙盒</h1>
    <p>编辑代码并查看实时预览</p>
    <button class="btn" onclick="showMessage()">点击我</button>
    <div class="result" id="result">等待操作...</div>
  </div>

  <script>
    function showMessage() {
      const result = document.getElementById('result');
      result.textContent = '🎉 你点击了按钮！';
      result.style.background = 'rgba(0,255,0,0.2)';
    }
  </script>
</body>
</html>`,
  javascript: `// JavaScript 示例
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 生成斐波那契数列
const results = [];
for (let i = 0; i < 10; i++) {
  results.push(fibonacci(i));
}

console.log('斐波那契数列:', results);

// 绘制图表
const data = [12, 19, 3, 5, 2, 3];
console.log('数据:', data);`,
  css: `/* CSS 示例 */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  border-radius: 10px;
  color: white;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}`
};

export function CodeSandbox({
  files: initialFiles = [],
  initialCode = '',
  language = 'html',
  theme = 'cyber',
  showPreview = true,
  autoRun = true,
  className,
  onCodeChange,
  onRun
}: SandBoxProps) {
  const [files, setFiles] = useState<CodeFile[]>(
    initialFiles.length > 0
      ? initialFiles
      : [
          {
            id: '1',
            name: `index.${language}`,
            language,
            code: initialCode || DEFAULT_CODE[language as keyof typeof DEFAULT_CODE] || ''
          }
        ]
  );
  const [activeFileId, setActiveFileId] = useState(files[0]?.id);
  const [previewContent, setPreviewContent] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'code' | 'preview'>('split');

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  // 自动运行代码
  useEffect(() => {
    if (autoRun && activeFile?.language === 'html') {
      runCode();
    }
  }, [activeFile?.code, autoRun]);

  const runCode = useCallback(() => {
    setIsRunning(true);
    try {
      const htmlCode = activeFile?.code || '';
      setPreviewContent(htmlCode);

      if (onRun) {
        onRun(htmlCode);
      }

      setTimeout(() => setIsRunning(false), 500);
    } catch (error) {
      console.error('代码运行错误:', error);
      setIsRunning(false);
    }
  }, [activeFile?.code, onRun]);

  const handleCodeChange = (newCode: string) => {
    const updatedFiles = files.map(f =>
      f.id === activeFileId ? { ...f, code: newCode } : f
    );
    setFiles(updatedFiles);

    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeFile?.code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    runCode();
  };

  const getEditorClassName = () => {
    const base = 'font-mono text-sm w-full h-full resize-none outline-none';
    const themes = {
      light: 'bg-white text-gray-900',
      dark: 'bg-gray-900 text-gray-100',
      cyber: 'bg-cyber-dark text-cyber-cyan'
    };
    return cn(base, themes[theme]);
  };

  return (
    <div
      className={cn(
        'flex flex-col',
        isFullscreen && 'fixed inset-0 z-50 bg-cyber-dark',
        className
      )}
    >
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-3 bg-cyber-card border-b border-cyber-border">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-cyber-cyan" />
          <h3 className="font-display font-semibold text-cyber-cyan">
            代码沙盒
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* 视图切换 */}
          {showPreview && (
            <div className="flex items-center border border-cyber-border rounded-md overflow-hidden">
              <Button
                variant={viewMode === 'code' ? 'primary' : 'ghost'}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode('code')}
              >
                代码
              </Button>
              <Button
                variant={viewMode === 'split' ? 'primary' : 'ghost'}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode('split')}
              >
                分屏
              </Button>
              <Button
                variant={viewMode === 'preview' ? 'primary' : 'ghost'}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode('preview')}
              >
                预览
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            leftIcon={<RefreshCw className={cn('w-4 h-4', isRunning && 'animate-spin')} />}
          >
            运行
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? '已复制' : '复制'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            leftIcon={isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* 文件标签 */}
      {files.length > 1 && (
        <Tabs
          tabs={files.map(file => ({
            id: file.id,
            label: file.name,
            content: file.code
          }))}
          activeTab={activeFileId}
          onChange={setActiveFileId}
          className="px-3"
        />
      )}

      {/* 主内容区 */}
      <div
        className={cn(
          'flex-1 overflow-hidden',
          viewMode === 'split' && 'flex',
          viewMode === 'code' && 'block',
          viewMode === 'preview' && 'block'
        )}
      >
        {/* 代码编辑器 */}
        {(viewMode === 'code' || viewMode === 'split') && (
          <div
            className={cn(
              'bg-cyber-dark',
              viewMode === 'split' ? 'w-1/2 border-r border-cyber-border' : 'h-full'
            )}
          >
            <textarea
              value={activeFile?.code || ''}
              onChange={(e) => handleCodeChange(e.target.value)}
              className={getEditorClassName()}
              style={{
                padding: '16px',
                minHeight: '100%',
                lineHeight: '1.6'
              }}
              spellCheck={false}
              placeholder="输入代码..."
            />
          </div>
        )}

        {/* 预览区 */}
        {showPreview && (viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={cn(
              'bg-white',
              viewMode === 'split' ? 'w-1/2' : 'h-full'
            )}
          >
            {activeFile?.language === 'html' ? (
              <iframe
                srcDoc={previewContent}
                className="w-full h-full border-0"
                sandbox="allow-scripts"
                title="preview"
              />
            ) : (
              <div className="p-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {activeFile?.code || '// 在此输入代码'}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
