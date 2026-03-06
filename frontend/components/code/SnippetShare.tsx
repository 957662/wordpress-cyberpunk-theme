'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Download, Share2, Heart } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-go';

interface SnippetShareProps {
  code: string;
  language?: string;
  filename?: string;
  title?: string;
  description?: string;
  author?: {
    name: string;
    avatar?: string;
    url?: string;
  };
  onLike?: () => void;
  likes?: number;
  isLiked?: boolean;
}

export default function SnippetShare({
  code,
  language = 'typescript',
  filename = 'snippet.ts',
  title = 'Code Snippet',
  description,
  author,
  onLike,
  likes = 0,
  isLiked = false
}: SnippetShareProps) {
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const highlightedCode = Prism.highlight(code, Prism.languages[language] || Prism.languages.javascript, language);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-cyber-dark border border-cyber-cyan/20 rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-cyber-cyan/5 border-b border-cyber-cyan/20">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-cyber-cyan">{title}</h3>
            {filename && (
              <p className="text-xs text-gray-500">{filename}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLike}
            className={`p-2 rounded-lg transition-colors ${
              isLiked
                ? 'text-red-500 bg-red-500/10'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
            }`}
          >
            <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="p-2 rounded-lg text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-colors"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <Check key="check" className="w-4 h-4 text-green-500" />
              ) : (
                <Copy key="copy" className="w-4 h-4" />
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="p-2 rounded-lg text-gray-400 hover:text-cyber-purple hover:bg-cyber-purple/10 transition-colors"
          >
            <Download className="w-4 h-4" />
          </motion.button>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShare(!showShare)}
              className="p-2 rounded-lg text-gray-400 hover:text-cyber-pink hover:bg-cyber-pink/10 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>

            <AnimatePresence>
              {showShare && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-900 border border-cyber-cyan/20 rounded-lg shadow-xl z-50"
                >
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setShowShare(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-cyber-cyan/10 rounded-lg transition-colors"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={() => {
                        const text = `${title}\n\n${code}`;
                        navigator.clipboard.writeText(text);
                        setShowShare(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-cyber-cyan/10 rounded-lg transition-colors"
                    >
                      Copy with Title
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="px-4 py-2 bg-gray-900/50 border-b border-gray-800">
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      )}

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="!bg-gray-900 !m-0 !p-4 text-sm">
          <code
            className="language-typescript"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-t border-gray-800">
        {author && (
          <div className="flex items-center gap-2">
            {author.avatar && (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-6 h-6 rounded-full"
              />
            )}
            <span className="text-xs text-gray-400">{author.name}</span>
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>{code.split('\n').length} lines</span>
          <span>{likes} likes</span>
        </div>
      </div>
    </motion.div>
  );
}

// 预设配置
export const SnippetPresets = {
  typescript: {
    language: 'typescript' as const,
    filename: 'snippet.ts',
  },
  javascript: {
    language: 'javascript' as const,
    filename: 'snippet.js',
  },
  python: {
    language: 'python' as const,
    filename: 'snippet.py',
  },
  java: {
    language: 'java' as const,
    filename: 'Snippet.java',
  },
  go: {
    language: 'go' as const,
    filename: 'snippet.go',
  },
};
