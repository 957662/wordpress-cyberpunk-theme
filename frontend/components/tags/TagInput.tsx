'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Tag {
  id: string;
  label: string;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'gray';
}

export interface TagInputProps {
  tags: Tag[];
  onAddTag: (label: string) => void;
  onRemoveTag: (id: string) => void;
  placeholder?: string;
  maxTags?: number;
  maxLength?: number;
  allowDuplicates?: boolean;
  className?: string;
}

const colorClasses = {
  cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  pink: 'bg-pink-500/20 text-pink-400 border-pink-500/50',
  green: 'bg-green-500/20 text-green-400 border-green-500/50',
  yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  gray: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
};

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
  placeholder = 'Type and press Enter...',
  maxTags = 10,
  maxLength = 30,
  allowDuplicates = false,
  className,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onRemoveTag(tags[tags.length - 1].id);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) return;

    if (tags.length >= maxTags) {
      console.warn(`Maximum ${maxTags} tags allowed`);
      return;
    }

    if (!allowDuplicates && tags.some(tag => tag.label.toLowerCase() === trimmedValue.toLowerCase())) {
      console.warn('Tag already exists');
      return;
    }

    if (trimmedValue.length > maxLength) {
      console.warn(`Tag must be ${maxLength} characters or less`);
      return;
    }

    const colors: Array<'cyan' | 'purple' | 'pink' | 'green' | 'yellow'> = ['cyan', 'purple', 'pink', 'green', 'yellow'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    onAddTag(trimmedValue);
    setInputValue('');
    inputRef.current?.focus();
  };

  return (
    <motion.div
      className={cn(
        'relative bg-gray-800/50 backdrop-blur-sm rounded-lg border',
        'transition-all duration-300',
        'hover:border-cyan-500/50',
        isFocused && 'border-cyan-500 shadow-lg shadow-cyan-500/20',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Tags Container */}
      <div className="flex flex-wrap gap-2 p-3">
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                'border text-sm font-medium',
                colorClasses[tag.color || 'gray']
              )}
            >
              <Tag className="w-3 h-3" />
              <span>{tag.label}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemoveTag(tag.id)}
                className="ml-1 hover:bg-white/10 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={tags.length === 0 ? placeholder : ''}
          maxLength={maxLength}
          disabled={tags.length >= maxTags}
          className={cn(
            'flex-1 min-w-[120px] bg-transparent border-none outline-none',
            'text-white placeholder-gray-500',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />
      </div>

      {/* Tag Count */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-500">
        {tags.length}/{maxTags}
      </div>

      {/* Focus Indicator */}
      {isFocused && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Corner Accents */}
      {isFocused && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-purple-400" />
        </>
      )}
    </motion.div>
  );
};

export default TagInput;
