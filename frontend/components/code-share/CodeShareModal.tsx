'use client';

/**
 * CodeShareModal - 代码分享模态框
 * 用于展示和分享代码片段
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Link as LinkIcon } from 'lucide-react';
import { CodeShare } from './CodeShare';

interface CodeShareModalProps {
  /** 是否显示 */
  isOpen: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 初始代码 */
  initialCode?: string;
  /** 初始语言 */
  initialLanguage?: string;
}

export function CodeShareModal({
  isOpen,
  onClose,
  initialCode = '',
  initialLanguage = 'typescript',
}: CodeShareModalProps) {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [filename, setFilename] = useState('example.ts');
  const [shareUrl, setShareUrl] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const languages = [
    'typescript',
    'javascript',
    'python',
    'java',
    'cpp',
    'go',
    'rust',
    'html',
    'css',
    'json',
    'markdown',
  ];

  const handleShare = async () => {
    setIsSharing(true);
    // 模拟生成分享链接
    setTimeout(() => {
      const mockUrl = `https://cyberpress.dev/share/${Math.random().toString(36).substring(7)}`;
      setShareUrl(mockUrl);
      setIsSharing(false);
    }, 1000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* 模态框 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="cyber-card w-full max-w-5xl max-h-[90vh] overflow-hidden"
            >
              {/* 头部 */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border">
                <h2 className="text-xl font-bold text-white">代码分享</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-cyber-cyan/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-cyber-cyan" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* 左侧：编辑区域 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        文件名
                      </label>
                      <input
                        type="text"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        className="w-full px-4 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none"
                        placeholder="example.ts"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        语言
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none"
                      >
                        {languages.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        代码
                      </label>
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-64 px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white font-mono text-sm focus:border-cyber-cyan focus:outline-none resize-none"
                        placeholder="在此输入代码..."
                      />
                    </div>

                    {/* 分享按钮 */}
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleShare}
                        disabled={isSharing || !code.trim()}
                        className="flex-1 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSharing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            生成中...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            生成分享链接
                          </>
                        )}
                      </motion.button>
                    </div>

                    {/* 分享结果 */}
                    {shareUrl && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <LinkIcon className="w-4 h-4 text-cyber-cyan" />
                          <span className="text-sm font-medium text-cyber-cyan">
                            分享链接已生成
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="flex-1 px-3 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-sm text-gray-300"
                          />
                          <button
                            onClick={handleCopyLink}
                            className="px-4 py-2 bg-cyber-cyan text-white rounded-lg hover:bg-cyber-cyan/80 transition-colors text-sm font-medium"
                          >
                            复制
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* 右侧：预览区域 */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-3">预览</h3>
                    {code ? (
                      <CodeShare
                        code={code}
                        language={language}
                        filename={filename}
                        showFilename
                      />
                    ) : (
                      <div className="cyber-card p-8 text-center text-gray-500">
                        输入代码后将在此显示预览
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CodeShareModal;
