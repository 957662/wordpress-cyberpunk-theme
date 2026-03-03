'use client';

import React from 'react';
import {
  Clock,
  Tag,
  Copy,
  Check,
  Eye,
  Code2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeSnippetCardProps {
  snippet: {
    id: string;
    title: string;
    description: string;
    code: string;
    language: string;
    tags: string[];
    createdAt: Date;
  };
  onView?: (id: string) => void;
  className?: string;
}

export const CodeSnippetCard: React.FC<CodeSnippetCardProps> = ({
  snippet,
  onView,
  className = '',
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-gray-900/50 border border-gray-800 rounded-lg p-5 hover:border-cyber-cyan/50 transition-all cursor-pointer ${className}`}
      onClick={() => onView?.(snippet.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Code2 className="w-5 h-5 text-cyber-cyan flex-shrink-0" />
          <h3 className="text-lg font-semibold text-gray-100 truncate">
            {snippet.title}
          </h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="p-1.5 hover:bg-gray-800 rounded-md transition-colors flex-shrink-0"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </motion.button>
      </div>

      {/* Description */}
      {snippet.description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {snippet.description}
        </p>
      )}

      {/* Code Preview */}
      <div className="mb-3">
        <pre className="bg-gray-800/50 rounded-md p-3 overflow-x-auto">
          <code className={`language-${snippet.language} text-xs`}>
            {snippet.code.split('\n').slice(0, 5).join('\n')}
            {snippet.code.split('\n').length > 5 && '\n...'}
          </code>
        </pre>
      </div>

      {/* Tags */}
      {snippet.tags.length > 0 && (
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Tag className="w-4 h-4 text-gray-500" />
          {snippet.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-cyber-purple/20 text-cyber-purple rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
          {snippet.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{snippet.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{formatDate(snippet.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 capitalize">
            {snippet.language}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onView?.(snippet.id);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-cyber-cyan/20 hover:bg-cyber-cyan/30 text-cyber-cyan rounded-md transition-colors text-xs"
          >
            <Eye className="w-3 h-3" />
            View
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CodeSnippetCard;
