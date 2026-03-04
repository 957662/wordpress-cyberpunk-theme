'use client';

/**
 * Clipboard Manager Component
 * Advanced clipboard management with history and formatting
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Trash2, Clipboard as ClipboardIcon, X } from 'lucide-react';

interface ClipboardItem {
  id: string;
  content: string;
  timestamp: number;
  type: 'text' | 'code' | 'link';
}

interface ClipboardManagerProps {
  maxItems?: number;
  onCopy?: (content: string) => void;
  className?: string;
}

export function ClipboardManager({
  maxItems = 10,
  onCopy,
  className = '',
}: ClipboardManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [clipboardHistory, setClipboardHistory] = useState<ClipboardItem[]>([]);
  const [currentContent, setCurrentContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('clipboard_history');
    if (saved) {
      try {
        setClipboardHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load clipboard history:', e);
      }
    }
  }, []);

  // Save to localStorage when history changes
  useEffect(() => {
    if (clipboardHistory.length > 0) {
      localStorage.setItem('clipboard_history', JSON.stringify(clipboardHistory));
    }
  }, [clipboardHistory]);

  // Detect content type
  const detectContentType = useCallback((content: string): ClipboardItem['type'] => {
    if (content.match(/^https?:\/\//)) return 'link';
    if (content.includes('\n') || content.includes('function') || content.includes('=>')) {
      return 'code';
    }
    return 'text';
  }, []);

  // Copy to clipboard
  const copyToClipboard = useCallback(
    async (content: string, id?: string) => {
      try {
        await navigator.clipboard.writeText(content);
        setCurrentContent(content);

        if (id) {
          setCopiedId(id);
          setTimeout(() => setCopiedId(null), 2000);
        }

        // Add to history
        const newItem: ClipboardItem = {
          id: Date.now().toString(),
          content,
          timestamp: Date.now(),
          type: detectContentType(content),
        };

        setClipboardHistory((prev) => {
          const filtered = prev.filter((item) => item.content !== content);
          const updated = [newItem, ...filtered].slice(0, maxItems);
          return updated;
        });

        onCopy?.(content);

        return true;
      } catch (error) {
        console.error('Failed to copy:', error);
        return false;
      }
    },
    [maxItems, onCopy, detectContentType]
  );

  // Copy from history
  const copyFromHistory = useCallback(
    async (item: ClipboardItem) => {
      await copyToClipboard(item.content, item.id);
    },
    [copyToClipboard]
  );

  // Delete from history
  const deleteFromHistory = useCallback((id: string) => {
    setClipboardHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    setClipboardHistory([]);
    localStorage.removeItem('clipboard_history');
  }, []);

  // Format timestamp
  const formatTimestamp = useCallback((timestamp: number) => {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  }, []);

  // Truncate content
  const truncateContent = useCallback((content: string, maxLength = 50) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 rounded-lg transition-all duration-200 relative"
        title="Clipboard Manager"
      >
        <ClipboardIcon className="w-5 h-5 text-cyber-cyan" />
        {clipboardHistory.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-pink text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {clipboardHistory.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-[#0a0a0f] border border-cyber-cyan/30 rounded-lg shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-cyan/20 bg-[#16162a]">
              <div className="flex items-center gap-2">
                <ClipboardIcon className="w-5 h-5 text-cyber-cyan" />
                <h3 className="text-white font-semibold">Clipboard History</h3>
              </div>
              <div className="flex items-center gap-2">
                {clipboardHistory.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                    title="Clear all"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-cyber-cyan/10 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
              {clipboardHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <ClipboardIcon className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-gray-400 text-sm text-center">No clipboard history</p>
                  <p className="text-gray-500 text-xs mt-1">Copy items to see them here</p>
                </div>
              ) : (
                <div className="divide-y divide-cyber-cyan/10">
                  {clipboardHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 hover:bg-cyber-cyan/5 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Type Icon */}
                        <div className="mt-1">
                          {item.type === 'link' ? (
                            <div className="w-8 h-8 rounded bg-cyber-purple/20 flex items-center justify-center">
                              <span className="text-cyber-purple text-xs">🔗</span>
                            </div>
                          ) : item.type === 'code' ? (
                            <div className="w-8 h-8 rounded bg-cyber-cyan/20 flex items-center justify-center">
                              <span className="text-cyber-cyan text-xs">{'</>'}</span>
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded bg-gray-700/20 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">T</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium break-all">
                            {truncateContent(item.content, 60)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-500 text-xs">
                              {formatTimestamp(item.timestamp)}
                            </span>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-500 text-xs capitalize">{item.type}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => copyFromHistory(item)}
                            className="p-2 hover:bg-cyber-cyan/20 rounded transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-cyber-cyan" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteFromHistory(item.id)}
                            className="p-2 hover:bg-red-500/20 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {clipboardHistory.length > 0 && (
              <div className="px-4 py-2 border-t border-cyber-cyan/20 bg-[#16162a]">
                <p className="text-gray-400 text-xs">
                  {clipboardHistory.length} {clipboardHistory.length === 1 ? 'item' : 'items'} in
                  history
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
