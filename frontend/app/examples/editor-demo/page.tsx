/**
 * 编辑器功能演示页面
 * 展示 Markdown 编辑器和相关组件
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MarkdownEditor } from '@/components/markdown-editor/markdown-editor';
import { CodeBlock } from '@/components/ui/code-block';
import { CopyButton } from '@/components/ui/copy-button';
import { Card } from '@/components/ui/card';

export default function EditorDemoPage() {
  const [markdown, setMarkdown] = useState(`# 欢迎使用 Markdown 编辑器

这是一个功能强大的 Markdown 编辑器，支持实时预览和语法高亮。

## 功能特性

- **实时预览**：左侧编辑，右侧实时预览
- **语法高亮**：支持多种编程语言的代码高亮
- **快捷键**：支持常用的 Markdown 快捷键
- **工具栏**：直观的工具栏按钮

## 代码示例

\`\`\`javascript
function hello() {
  console.log('Hello, CyberPress!');
}
\`\`\`

## 快捷键

- \`Ctrl/Cmd + B\`：粗体
- \`Ctrl/Cmd + I\`：斜体
- \`Ctrl/Cmd + K\`：插入链接
- \`Tab\`：插入两个空格

开始你的创作吧！✨
`);

  const codeExample = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 计算前 10 个斐波那契数
for (let i = 0; i < 10; i++) {
  console.log(\`fibonacci(\${i}) = \${fibonacci(i)}\`);
}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">编辑器功能演示</h1>
        <p className="text-muted-foreground">
          展示 Markdown 编辑器和相关增强组件
        </p>
      </div>

      <div className="space-y-8">
        {/* Markdown 编辑器 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold">Markdown 编辑器</h2>
          <p className="text-muted-foreground">
            支持实时预览、语法高亮、快捷键等功能
          </p>

          <MarkdownEditor
            value={markdown}
            onChange={setMarkdown}
            minHeight="400px"
            maxHeight="600px"
          />
        </motion.div>

        {/* 代码块组件 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold">代码块组件</h2>
          <p className="text-muted-foreground">
            带复制按钮和语法高亮的代码展示组件
          </p>

          <Card className="border-cyber-border bg-card/50 p-6">
            <CodeBlock
              code={codeExample}
              language="javascript"
              title="fibonacci.js"
              showLineNumbers
            />
          </Card>
        </motion.div>

        {/* 复制按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold">复制按钮</h2>
          <p className="text-muted-foreground">
            不同样式和大小的复制按钮
          </p>

          <Card className="flex flex-wrap items-center gap-4 border-cyber-border bg-card/50 p-6">
            <CopyButton text="要复制的文本" size="sm" />
            <CopyButton text="要复制的文本" />
            <CopyButton text="要复制的文本" size="lg" />
            <CopyButton text="要复制的文本" variant="button" label="复制代码" />
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
