'use client';

import { useState } from 'react';
import { MarkdownEditor, ImageUploader } from '@/components/editor';
import { motion } from 'framer-motion';
import { FileText, Image as ImageIcon } from 'lucide-react';

export default function EditorDemoPage() {
  const [markdown, setMarkdown] = useState(`# 欢迎使用 Markdown 编辑器

这是一个功能强大的 **Markdown** 编辑器,支持实时预览和语法高亮。

## 功能特性

- ✨ 实时预览
- 🎨 语法高亮
- 📝 代码块支持
- 🔗 链接和图片
- 📋 列表和引用

## 代码示例

\`\`\`javascript
function helloWorld() {
  console.log('Hello, CyberPress!');
}
\`\`\`

## 列表示例

### 无序列表
- 第一项
- 第二项
- 第三项

### 有序列表
1. 第一步
2. 第二步
3. 第三步

## 引用

> 这是一个引用示例。
> 可以有多行。

## 链接

访问 [CyberPress](https://cyberpress.dev) 了解更多。

开始你的创作吧! 🚀
`);

  const [activeTab, setActiveTab] = useState<'markdown' | 'image'>('markdown');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleSave = (content: string) => {
    console.log('保存内容:', content);
    // 这里可以添加保存逻辑
  };

  const handleImageUpload = (urls: string[]) => {
    setUploadedImages([...uploadedImages, ...urls]);
    // 将图片链接插入到编辑器中
    const imageMarkdown = urls.map(url => `![Image](${url})`).join('\n');
    setMarkdown(prev => prev + '\n\n' + imageMarkdown);
  };

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink bg-clip-text text-transparent">
            Markdown 编辑器演示
          </h1>
          <p className="text-cyber-muted/70">
            功能强大的 Markdown 编辑器,支持实时预览和图片上传
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-lg border border-cyber-purple/30 bg-cyber-muted/5 p-1">
            <button
              onClick={() => setActiveTab('markdown')}
              className={`flex items-center gap-2 rounded-lg px-6 py-2 transition-all ${
                activeTab === 'markdown'
                  ? 'bg-gradient-to-r from-cyber-purple to-cyber-pink text-white'
                  : 'text-cyber-muted hover:text-cyber-cyan'
              }`}
            >
              <FileText size={18} />
              Markdown 编辑器
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 rounded-lg px-6 py-2 transition-all ${
                activeTab === 'image'
                  ? 'bg-gradient-to-r from-cyber-purple to-cyber-pink text-white'
                  : 'text-cyber-muted hover:text-cyber-cyan'
              }`}
            >
              <ImageIcon size={18} />
              图片上传
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'markdown' && (
            <motion.div
              key="markdown"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <MarkdownEditor
                value={markdown}
                onChange={setMarkdown}
                onSave={handleSave}
                placeholder="开始写作..."
                height="600px"
                showPreview={true}
              />
            </motion.div>
          )}

          {activeTab === 'image' && (
            <motion.div
              key="image"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-xl border border-cyber-purple/30 bg-cyber-muted/5 p-6">
                <h2 className="mb-6 text-2xl font-bold text-cyber-cyan">
                  上传图片
                </h2>
                <ImageUploader
                  onUpload={handleImageUpload}
                  maxFiles={10}
                  maxFileSize={5}
                  multiple={true}
                />

                {/* Uploaded Images */}
                {uploadedImages.length > 0 && (
                  <div className="mt-8">
                    <h3 className="mb-4 text-xl font-semibold text-white">
                      已上传的图片
                    </h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                      {uploadedImages.map((url, index) => (
                        <div
                          key={index}
                          className="group relative aspect-square overflow-hidden rounded-lg border border-cyber-purple/20"
                        >
                          <img
                            src={url}
                            alt={`Uploaded ${index + 1}`}
                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 rounded-lg border border-cyber-purple/20 bg-cyber-muted/5 p-6"
        >
          <h3 className="mb-3 text-lg font-semibold text-cyber-cyan">
            使用提示
          </h3>
          <ul className="space-y-2 text-sm text-cyber-muted/70">
            <li>• 使用 <kbd className="rounded bg-cyber-purple/20 px-2 py-1 text-cyber-cyan">Ctrl + S</kbd> 保存内容</li>
            <li>• 点击工具栏按钮快速插入 Markdown 语法</li>
            <li>• 拖拽图片到上传区域即可上传</li>
            <li>• 支持多种图片格式: JPG, PNG, GIF, WebP</li>
            <li>• 实时预览支持代码语法高亮</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}

// AnimatePresence import
import { AnimatePresence } from 'framer-motion';
