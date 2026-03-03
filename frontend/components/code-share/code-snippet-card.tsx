'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Copy,
  Check,
  Share2,
  Heart,
  Bookmark,
  MoreVertical,
  Download,
  ExternalLink
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

export type Language =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'cpp'
  | 'rust'
  | 'go'
  | 'php'
  | 'ruby'
  | 'swift'
  | 'kotlin'
  | 'html'
  | 'css'
  | 'json'
  | 'sql'
  | 'bash'
  | 'markdown';

interface CodeSnippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: Language;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  likes: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  tags?: string[];
}

interface CodeSnippetCardProps {
  snippet: CodeSnippet;
  className?: string;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onShare?: (snippet: CodeSnippet) => void;
  showActions?: boolean;
}

const LANGUAGE_COLORS: Record<Language, string> = {
  javascript: '#f7df1e',
  typescript: '#3178c6',
  python: '#3776ab',
  java: '#b07219',
  cpp: '#00599c',
  rust: '#dea584',
  go: '#00add8',
  php: '#777bb4',
  ruby: '#cc342d',
  swift: '#f05138',
  kotlin: '#a97bff',
  html: '#e34c26',
  css: '#264de4',
  json: '#292929',
  sql: '#cc2927',
  bash: '#4eaa25',
  markdown: '#083fa1'
};

export function CodeSnippetCard({
  snippet,
  className,
  onLike,
  onBookmark,
  onShare,
  showActions = true
}: CodeSnippetCardProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    onLike?.(snippet.id);
  };

  const handleBookmark = () => {
    onBookmark?.(snippet.id);
  };

  const handleShare = () => {
    onShare?.(snippet);
  };

  const handleDownload = () => {
    const extensions: Record<Language, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      rust: 'rs',
      go: 'go',
      php: 'php',
      ruby: 'rb',
      swift: 'swift',
      kotlin: 'kt',
      html: 'html',
      css: 'css',
      json: 'json',
      sql: 'sql',
      bash: 'sh',
      markdown: 'md'
    };

    const blob = new Blob([snippet.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${snippet.title}.${extensions[snippet.language]}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group bg-black/50 backdrop-blur-xl rounded-2xl border border-cyan-500/30 overflow-hidden',
        'shadow-[0_0_40px_rgba(0,240,255,0.1)]',
        'hover:shadow-[0_0_60px_rgba(0,240,255,0.2)]',
        'transition-all duration-300',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 to-purple-950/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Code2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <h3 className="text-lg font-bold text-white truncate">{snippet.title}</h3>
            </div>
            {snippet.description && (
              <p className="text-sm text-gray-400 line-clamp-2">{snippet.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2">
                {snippet.author.avatar ? (
                  <img
                    src={snippet.author.avatar}
                    alt={snippet.author.name}
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">
                      {snippet.author.name[0]}
                    </span>
                  </div>
                )}
                <span className="text-xs text-gray-400">{snippet.author.name}</span>
              </div>
              <span className="text-xs text-gray-500">
                {snippet.createdAt.toLocaleDateString()}
              </span>
              <div
                className="px-2 py-0.5 rounded text-xs font-medium text-white"
                style={{ backgroundColor: LANGUAGE_COLORS[snippet.language] }}
              >
                {snippet.language}
              </div>
            </div>
            {snippet.tags && snippet.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {snippet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-xs bg-cyan-500/10 text-cyan-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-all duration-300"
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 mt-2 w-48 bg-gray-900 border border-cyan-500/30 rounded-xl shadow-xl z-50"
              >
                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 flex items-center gap-2 rounded-t-xl transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  下载代码
                </button>
                <button
                  onClick={handleShare}
                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 flex items-center gap-2 transition-all duration-300"
                >
                  <Share2 className="w-4 h-4" />
                  分享
                </button>
                <button
                  onClick={() => {
                    handleCopy();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 flex items-center gap-2 rounded-b-xl transition-all duration-300"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      复制代码
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Code */}
      <div className="relative">
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className="p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg text-gray-400 hover:text-cyan-400 transition-all duration-300"
            title="复制代码"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </motion.button>
        </div>

        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={snippet.language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              borderRadius: 0,
              fontSize: '0.875rem',
              background: 'rgba(17, 24, 39, 0.5)',
              minHeight: '200px'
            }}
            wrapLongLines
            showLineNumbers
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="p-4 border-t border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300',
                snippet.isLiked
                  ? 'bg-pink-500/20 text-pink-400'
                  : 'hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400'
              )}
            >
              <Heart
                className={cn('w-4 h-4', snippet.isLiked && 'fill-current')}
              />
              <span className="text-sm font-medium">{snippet.likes}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookmark}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300',
                snippet.isBookmarked
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400'
              )}
            >
              <Bookmark
                className={cn('w-4 h-4', snippet.isBookmarked && 'fill-current')}
              />
              <span className="text-sm font-medium">
                {snippet.isBookmarked ? '已收藏' : '收藏'}
              </span>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-medium hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-300"
          >
            <Share2 className="w-4 h-4" />
            <span>分享</span>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
