'use client';

import React, { useState, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
  disabled?: boolean;
  delimiter?: string[];
  validateTag?: (tag: string) => boolean;
  duplicateErrorMessage?: string;
}

/**
 * TagInput - 标签输入组件
 * 用于输入和管理标签
 */
export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = '输入标签...',
  maxTags = 10,
  className,
  disabled = false,
  delimiter = ['Enter', ','],
  validateTag,
  duplicateErrorMessage = '标签已存在',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (delimiter.includes(e.key)) {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) return;

    // 检查最大标签数
    if (tags.length >= maxTags) {
      setError(`最多只能添加 ${maxTags} 个标签`);
      return;
    }

    // 检查重复
    if (tags.includes(trimmedValue)) {
      setError(duplicateErrorMessage);
      return;
    }

    // 自定义验证
    if (validateTag && !validateTag(trimmedValue)) {
      setError('标签格式不正确');
      return;
    }

    onChange([...tags, trimmedValue]);
    setInputValue('');
    setError(null);
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags);
    setError(null);
  };

  return (
    <div className={className}>
      <div
        className={cn(
          'flex flex-wrap gap-2 p-2',
          'bg-gray-900 border border-gray-800 rounded-lg',
          'focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500',
          disabled && 'opacity-50 cursor-not-allowed',
          'transition-all'
        )}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className={cn(
              'inline-flex items-center space-x-1 px-2 py-1',
              'bg-cyan-500/20 text-cyan-500 rounded',
              'text-sm'
            )}
          >
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="hover:text-cyan-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}

        {!disabled && tags.length < maxTags && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            className={cn(
              'flex-1 min-w-[120px] bg-transparent border-none outline-none',
              'text-gray-100 placeholder-gray-500',
              'text-sm'
            )}
          />
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}

      {!disabled && tags.length < maxTags && (
        <p className="text-xs text-gray-600 mt-1">
          按 {delimiter.join(' 或 ')} 添加标签，最多 {maxTags} 个
        </p>
      )}
    </div>
  );
};

export default TagInput;
