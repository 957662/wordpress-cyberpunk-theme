/**
 * Markdown 编辑器页面
 * 提供强大的 Markdown 编辑功能，支持实时预览、语法高亮、拖拽上传等
 */

'use client';

import React, { useState } from 'react';
import { Metadata } from 'next';
import CyberEditor from '@/components/cyber/CyberEditor';
import { motion } from 'framer-motion';
import { Save, FolderOpen, Download, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditorPage() {
  const [content, setContent] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // 处理内容变化
  const handleContentChange = (value: string) => {
    setContent(value);
  };

  // 保存内容
  const handleSave = async (value: string) => {
    try {
      // 模拟保存到服务器
      await new Promise(resolve => setTimeout(resolve, 500));

      // 保存到本地存储
      localStorage.setItem('editor_content', value);
      setLastSaved(new Date());

      toast.success('保存成功！', {
        style: {
          background: '#1a1a2e',
          color: '#00f0ff',
          border: '1px solid #00f0ff',
        },
      });
    } catch (error) {
      toast.error('保存失败，请重试', {
        style: {
          background: '#1a1a2e',
          color: '#ff0080',
          border: '1px solid #ff0080',
        },
      });
    }
  };

  // 上传文件处理
  const handleUpload = async (file: File): Promise<string> => {
    try {
      // 模拟上传到服务器
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 返回模拟的URL
      return `/uploads/${file.name}`;
    } catch (error) {
      throw new Error('上传失败');
    }
  };

  // 打开文件
  const handleOpen = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.txt';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setContent(content);
          toast.success(`已加载: ${file.name}`);
        };
        reader.readAsText(file);
      }
    };

    input.click();
  };

  // 下载文件
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('下载成功');
  };

  // 加载上次保存的内容
  React.useEffect(() => {
    const savedContent = localStorage.getItem('editor_content');
    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  return (
    <div className="min-h-screen bg-cyber-dark py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              <span className="text-glow-cyan">Markdown</span> 编辑器
            </h1>
            <p className="text-gray-400">
              使用 Markdown 语法写作，支持实时预览和代码高亮
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* 打开按钮 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="flex items-center gap-2 px-4 py-2 bg-dark-bg/50 border border-cyber-cyan/30 rounded-lg text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan/50 transition-all"
              title="打开文件"
            >
              <FolderOpen className="w-4 h-4" />
              打开
            </motion.button>

            {/* 下载按钮 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              disabled={!content}
              className="flex items-center gap-2 px-4 py-2 bg-dark-bg/50 border border-cyber-cyan/30 rounded-lg text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="下载文件"
            >
              <Download className="w-4 h-4" />
              下载
            </motion.button>

            {/* 分享按钮 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('链接已复制到剪贴板');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-dark-bg/50 border border-cyber-cyan/30 rounded-lg text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan/50 transition-all"
              title="分享链接"
            >
              <Share2 className="w-4 h-4" />
              分享
            </motion.button>

            {lastSaved && (
              <div className="text-sm text-gray-500">
                上次保存: {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* 编辑器 */}
        <CyberEditor
          value={content}
          onChange={handleContentChange}
          onSave={handleSave}
          uploadHandler={handleUpload}
          placeholder="# 开始写作

支持 Markdown 语法：

- **粗体**
- *斜体*
- # 标题
- [链接](url)
- `代码`

```javascript
console.log('Hello, CyberPress!');
```

拖拽图片到这里上传...
"
          minHeight="600px"
          showPreview={true}
          allowUpload={true}
        />

        {/* 使用提示 */}
        <div className="mt-8 p-6 bg-dark-bg/30 border border-cyber-cyan/20 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">快捷键</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">保存</span>
                <kbd className="px-2 py-1 bg-dark-bg border border-gray-700 rounded text-cyber-cyan">⌘ S</kbd>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">撤销</span>
                <kbd className="px-2 py-1 bg-dark-bg border border-gray-700 rounded text-cyber-cyan">⌘ Z</kbd>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">重做</span>
                <kbd className="px-2 py-1 bg-dark-bg border border-gray-700 rounded text-cyber-cyan">⌘ ⇧ Z</kbd>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">粗体</span>
                <kbd className="px-2 py-1 bg-dark-bg border border-gray-700 rounded text-cyber-cyan">⌘ B</kbd>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">斜体</span>
                <kbd className="px-2 py-1 bg-dark-bg border border-gray-700 rounded text-cyber-cyan">⌘ I</kbd>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">插入链接</span>
                <kbd className="px-2 py-1 bg-dark-bg border border-gray-700 rounded text-cyber-cyan">⌘ L</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Markdown 语法示例 */}
        <div className="mt-8 p-6 bg-dark-bg/30 border border-cyber-cyan/20 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Markdown 语法示例</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-cyber-cyan font-medium mb-2">输入</h4>
              <pre className="bg-dark-bg p-4 rounded text-sm text-gray-400 overflow-x-auto">
{`# 一级标题
## 二级标题

**粗体文本**
*斜体文本*

- 列表项 1
- 列表项 2

[链接文本](https://example.com)

\`\`\`javascript
const hello = 'world';
console.log(hello);
\`\`\`

> 引用文本`}
              </pre>
            </div>

            <div>
              <h4 className="text-cyber-cyan font-medium mb-2">预览</h4>
              <div className="bg-dark-bg p-4 rounded text-sm">
                <h1 className="text-2xl font-bold text-white mb-2">一级标题</h1>
                <h2 className="text-xl font-bold text-white mb-2">二级标题</h2>
                <p className="mb-2"><strong className="text-white">粗体文本</strong></p>
                <p className="mb-2"><em className="text-gray-300">斜体文本</em></p>
                <ul className="list-disc list-inside mb-2 text-gray-300">
                  <li>列表项 1</li>
                  <li>列表项 2</li>
                </ul>
                <p className="mb-2">
                  <a href="#" className="text-cyber-cyan hover:underline">链接文本</a>
                </p>
                <pre className="bg-dark-bg/50 p-2 rounded text-xs text-cyber-cyan mb-2">
                  <code>const hello = 'world';</code>
                </pre>
                <blockquote className="border-l-4 border-cyber-cyan pl-4 text-gray-400 italic">
                  引用文本
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
