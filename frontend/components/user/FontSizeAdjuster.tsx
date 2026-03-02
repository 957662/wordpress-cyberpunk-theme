'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, RotateCcw } from 'lucide-react';

interface FontSizeAdjusterProps {
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
  className?: string;
}

const colorSchemes = {
  cyan: {
    primary: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
  },
  purple: {
    primary: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  pink: {
    primary: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
  },
  green: {
    primary: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
  },
  orange: {
    primary: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
  },
  blue: {
    primary: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
};

const MIN_SIZE = 14;
const MAX_SIZE = 24;
const DEFAULT_SIZE = 16;

export const FontSizeAdjuster: React.FC<FontSizeAdjusterProps> = ({
  colorScheme = 'cyan',
  className = '',
}) => {
  const colors = colorSchemes[colorScheme];
  const [fontSize, setFontSize] = useState(DEFAULT_SIZE);

  // 从 LocalStorage 加载字体大小
  useEffect(() => {
    const saved = localStorage.getItem('fontSize');
    if (saved) {
      setFontSize(parseInt(saved));
    }
  }, []);

  // 应用字体大小到文章内容
  useEffect(() => {
    const article = document.querySelector('article');
    if (article) {
      article.style.fontSize = `${fontSize}px`;
    }
  }, [fontSize]);

  const increaseSize = () => {
    const newSize = Math.min(fontSize + 2, MAX_SIZE);
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize.toString());
  };

  const decreaseSize = () => {
    const newSize = Math.max(fontSize - 2, MIN_SIZE);
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize.toString());
  };

  const resetSize = () => {
    setFontSize(DEFAULT_SIZE);
    localStorage.setItem('fontSize', DEFAULT_SIZE.toString());
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-gray-400 text-sm mr-2">字体大小:</span>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={decreaseSize}
        disabled={fontSize <= MIN_SIZE}
        className={`p-2 rounded-lg ${colors.bg} ${colors.border} border ${colors.primary} disabled:opacity-50`}
        title="减小字体"
      >
        <Minus className="w-4 h-4" />
      </motion.button>

      <span className={`text-lg font-semibold ${colors.primary} min-w-[3rem] text-center`}>
        {fontSize}
      </span>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={increaseSize}
        disabled={fontSize >= MAX_SIZE}
        className={`p-2 rounded-lg ${colors.bg} ${colors.border} border ${colors.primary} disabled:opacity-50`}
        title="增大字体"
      >
        <Plus className="w-4 h-4" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={resetSize}
        disabled={fontSize === DEFAULT_SIZE}
        className={`p-2 rounded-lg ${colors.bg} ${colors.border} border ${colors.primary} disabled:opacity-50`}
        title="重置"
      >
        <RotateCcw className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

export default FontSizeAdjuster;
