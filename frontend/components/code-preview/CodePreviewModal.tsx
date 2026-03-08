'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Download, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodePreviewModalProps {
  code: string;
  language: string;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CodePreviewModal: React.FC<CodePreviewModalProps> = ({
  code,
  language,
  title = 'Code Preview',
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const extension = language === 'javascript' ? 'js' : language;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-cyan/20 bg-deep-black/95">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30">
                    {language}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 hover:bg-cyber-cyan/20 transition-colors"
                    title="复制代码"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="p-2 rounded-lg bg-cyber-green/10 text-cyber-green border border-cyber-green/30 hover:bg-cyber-green/20 transition-colors"
                    title="下载代码"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="p-2 rounded-lg bg-cyber-pink/10 text-cyber-pink border border-cyber-pink/30 hover:bg-cyber-pink/20 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Code Content */}
              <div className="overflow-auto max-h-[calc(90vh-80px)] bg-deep-black/95">
                <pre className="p-6">
                  <code className={cn(
                    "text-sm font-mono leading-relaxed",
                    "text-gray-100"
                  )}>
                    {code}
                  </code>
                </pre>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-cyber-cyan/20 bg-deep-black/95">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{code.split('\n').length} lines</span>
                  <span>{code.length} characters</span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-cyber-cyan via-cyber-purple to-cyber-pink" />
              <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-cyber-cyan via-cyber-purple to-cyber-pink" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CodePreviewModal;
