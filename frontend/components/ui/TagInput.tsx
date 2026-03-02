'use client';

import { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

export default function TagInput({
  tags,
  onTagsChange,
  placeholder = '输入标签后按回车添加...',
  maxTags = 20,
  className = '',
}: TagInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmed = input.trim();
    if (
      trimmed &&
      !tags.includes(trimmed) &&
      tags.length < maxTags
    ) {
      onTagsChange([...tags, trimmed]);
      setInput('');
    }
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 p-3 bg-cyber-darker border border-cyber-cyan/30 rounded-lg min-h-[48px] focus-within:border-cyber-cyan transition-colors ${className}`}>
      <AnimatePresence>
        {tags.map((tag, index) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-sm"
          >
            {tag}
            <button
              onClick={() => removeTag(index)}
              className="hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-white placeholder-gray-500"
      />

      {tags.length >= maxTags && (
        <span className="text-xs text-gray-500">
          已达到最大标签数 ({maxTags})
        </span>
      )}
    </div>
  );
}
