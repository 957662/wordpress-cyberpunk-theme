'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  Download,
  Share2,
  Code2,
  FileJson,
  FileCode,
  Lightbulb,
} from 'lucide-react';

interface CodeShareProps {
  code: string;
  language?: string;
  filename?: string;
  title?: string;
  description?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export const CodeShare: React.FC<CodeShareProps> = ({
  code,
  language = 'typescript',
  filename = 'code.ts',
  title,
  description,
  showLineNumbers = true,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [code]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code, filename]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || filename,
          text: code,
        });
      } catch (err) {
        console.error('Failed to share:', err);
      }
    } else {
      setShowShare(!showShare);
    }
  }, [code, title, filename, showShare]);

  const lines = code.split('\n');
  const getFileIcon = () => {
    const ext = filename.split('.').pop();
    switch (ext) {
      case 'json':
        return <FileJson className="w-5 h-5" />;
      case 'ts':
      case 'tsx':
      case 'js':
      case 'jsx':
        return <FileCode className="w-5 h-5" />;
      default:
        return <Code2 className="w-5 h-5" />;
    }
  };

  return (
    <div className={`cyber-card overflow-hidden ${className}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 bg-cyber-dark/50 border-b border-cyber-cyan/30">
        <div className="flex items-center gap-3">
          <div className="text-cyber-cyan">{getFileIcon()}</div>
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-cyber-white">
                {title}
              </h3>
            )}
            <p className="text-xs text-cyber-gray">{filename}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 复制按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="p-2 rounded-lg bg-cyber-dark border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 transition-all"
            title={copied ? '已复制！' : '复制代码'}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </motion.button>

          {/* 下载按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="p-2 rounded-lg bg-cyber-dark border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 transition-all"
            title="下载代码"
          >
            <Download className="w-4 h-4" />
          </motion.button>

          {/* 分享按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="p-2 rounded-lg bg-cyber-dark border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 transition-all"
            title="分享代码"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* 描述 */}
      {description && (
        <div className="px-4 py-2 bg-cyber-purple/5 border-b border-cyber-purple/30">
          <p className="text-xs text-cyber-gray flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-cyber-purple" />
            {description}
          </p>
        </div>
      )}

      {/* 代码内容 */}
      <div className="relative overflow-x-auto">
        <pre className="p-4 text-sm font-mono">
          <code className={`language-${language}`}>
            {showLineNumbers ? (
              <div className="flex">
                <div className="mr-4 text-cyber-gray select-none">
                  {lines.map((_, i) => (
                    <div key={i} className="leading-6">
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="flex-1 text-cyber-cyan">
                  {lines.map((line, i) => (
                    <div key={i} className="leading-6">
                      {line || ' '}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-cyber-cyan">{code}</span>
            )}
          </code>
        </pre>
      </div>

      {/* 分享链接 */}
      {showShare && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 py-3 bg-cyber-dark/50 border-t border-cyber-cyan/30"
        >
          <p className="text-xs text-cyber-gray mb-2">复制链接分享：</p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={typeof window !== 'undefined' ? window.location.href : ''}
              className="flex-1 px-3 py-2 text-xs bg-cyber-dark border border-cyber-cyan/30 rounded text-cyber-gray"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="px-4 py-2 text-xs bg-cyber-cyan text-cyber-dark rounded font-medium hover:bg-cyber-cyan/80 transition-all"
            >
              复制
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// 代码片段集合组件
interface CodeSnippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  filename: string;
}

interface CodeSnippetCollectionProps {
  snippets: CodeSnippet[];
  className?: string;
}

export const CodeSnippetCollection: React.FC<CodeSnippetCollectionProps> = ({
  snippets,
  className = '',
}) => {
  const [activeSnippet, setActiveSnippet] = useState(0);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 选项卡 */}
      <div className="flex flex-wrap gap-2">
        {snippets.map((snippet, index) => (
          <motion.button
            key={snippet.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSnippet(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeSnippet === index
                ? 'bg-cyber-cyan text-cyber-dark'
                : 'bg-cyber-dark/50 text-cyber-cyan hover:bg-cyber-cyan/10'
            }`}
          >
            {snippet.title}
          </motion.button>
        ))}
      </div>

      {/* 当前代码片段 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSnippet}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <CodeShare {...snippets[activeSnippet]} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CodeShare;
