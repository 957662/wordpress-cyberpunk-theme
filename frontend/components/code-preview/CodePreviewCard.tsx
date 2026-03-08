'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Eye, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodePreviewCardProps {
  title: string;
  description: string;
  code: string;
  language: string;
  preview?: React.ReactNode;
  onPreview?: () => void;
  className?: string;
}

export const CodePreviewCard: React.FC<CodePreviewCardProps> = ({
  title,
  description,
  code,
  language,
  preview,
  onPreview,
  className,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'group relative overflow-hidden rounded-lg',
        'border border-cyber-cyan/30 bg-deep-black/80 backdrop-blur-sm',
        'hover:border-cyber-cyan/60 transition-all duration-300',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-cyber-cyan/20">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30">
            <Code2 className="w-5 h-5 text-cyber-cyan" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-1 rounded bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30">
            {language}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 hover:bg-cyber-cyan/20 transition-colors"
            title="复制代码"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </motion.button>

          {onPreview && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPreview}
              className="p-2 rounded-lg bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/30 hover:bg-cyber-purple/20 transition-colors"
              title="预览"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Code Preview */}
      <div className="p-6 overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed">
          <code className="text-gray-100">{code}</code>
        </pre>
      </div>

      {/* Live Preview (if provided) */}
      {preview && (
        <div className="p-6 border-t border-cyber-cyan/20">
          <div className="mb-3 text-xs font-mono text-gray-500">Live Preview</div>
          <div className="rounded-lg border border-cyber-cyan/20 bg-deep-black/50 p-4">
            {preview}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 border-t border-cyber-cyan/20 bg-deep-black/40">
        <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
          <span>{code.split('\n').length} lines</span>
          <span>{code.length} characters</span>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyber-cyan to-cyber-purple group-hover:w-full transition-all duration-500" />

      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan/0 via-cyber-purple/0 to-cyber-pink/0 group-hover:from-cyber-cyan/10 group-hover:via-cyber-purple/10 group-hover:to-cyber-pink/10 rounded-lg blur-xl transition-all duration-500 -z-10" />
    </motion.div>
  );
};

export default CodePreviewCard;
