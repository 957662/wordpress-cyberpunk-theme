'use client';

/**
 * SearchTrigger - 搜索触发器组件
 * 在导航栏中显示的搜索按钮
 */

import React, { useState, useRef, useEffect } from 'react';
import { Search, Command } from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchModal } from './SearchModal';

export const SearchTrigger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // 键盘快捷键 Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 px-4 py-2 bg-gray-900 border border-gray-700 rounded-full hover:border-cyan-500/50 transition-colors group"
      >
        <Search className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
        <span className="text-sm text-gray-400">搜索...</span>
        <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-xs text-gray-500">
          <Command className="w-3 h-3" />K
        </kbd>
      </motion.button>

      <SearchModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default SearchTrigger;
