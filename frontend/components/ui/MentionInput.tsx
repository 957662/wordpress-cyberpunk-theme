'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { At } from 'lucide-react';

export interface Mention {
  id: string;
  name: string;
  avatar?: string;
  username?: string;
}

export interface MentionInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  mentions?: Mention[];
  trigger?: string;
  rows?: number;
  maxRows?: number;
  disabled?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  showTrigger?: boolean;
  className?: string;
}

const colorClasses = {
  cyan: {
    border: 'border-cyan-500/30 focus:border-cyan-500',
    highlight: 'bg-cyan-500/20 text-cyan-400',
    item: 'hover:bg-cyan-500/20',
  },
  purple: {
    border: 'border-purple-500/30 focus:border-purple-500',
    highlight: 'bg-purple-500/20 text-purple-400',
    item: 'hover:bg-purple-500/20',
  },
  pink: {
    border: 'border-pink-500/30 focus:border-pink-500',
    highlight: 'bg-pink-500/20 text-pink-400',
    item: 'hover:bg-pink-500/20',
  },
  green: {
    border: 'border-green-500/30 focus:border-green-500',
    highlight: 'bg-green-500/20 text-green-400',
    item: 'hover:bg-green-500/20',
  },
};

const defaultMentions: Mention[] = [
  { id: '1', name: '管理员', username: '@admin' },
  { id: '2', name: '开发者', username: '@dev' },
  { id: '3', name: '设计师', username: '@designer' },
  { id: '4', name: '产品经理', username: '@pm' },
];

export function MentionInput({
  value: controlledValue,
  defaultValue = '',
  onChange,
  placeholder = '输入 @ 来提及用户...',
  mentions = defaultMentions,
  trigger = '@',
  rows = 3,
  maxRows = 10,
  disabled = false,
  color = 'cyan',
  showTrigger = true,
  className,
}: MentionInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const value = controlledValue ?? internalValue;
  const colors = colorClasses[color];

  // Parse mentions from value
  const extractMentions = (text: string): string[] => {
    const regex = new RegExp(`\\${trigger}\\w+`, 'g');
    const matches = text.match(regex) || [];
    return matches;
  };

  // Find current mention query
  const findMentionQuery = (text: string, position: number): string => {
    const beforeCursor = text.substring(0, position);
    const triggerIndex = beforeCursor.lastIndexOf(trigger);

    if (triggerIndex === -1) return '';

    // Check if there's a space after the trigger
    const afterTrigger = beforeCursor.substring(triggerIndex + 1);
    if (afterTrigger.includes(' ')) return '';

    return afterTrigger;
  };

  // Filter mentions based on query
  const filteredMentions = React.useMemo(() => {
    if (!query) return mentions;

    return mentions.filter(
      mention =>
        mention.name.toLowerCase().includes(query.toLowerCase()) ||
        mention.username?.toLowerCase().includes(query.toLowerCase())
    );
  }, [mentions, query]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newPosition = e.target.selectionStart;

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);

    setCursorPosition(newPosition);

    // Check if we should show suggestions
    const mentionQuery = findMentionQuery(newValue, newPosition);
    setQuery(mentionQuery);
    setShowSuggestions(mentionQuery.length > 0 || query.length > 0);
    setSelectedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev < filteredMentions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev > 0 ? prev - 1 : filteredMentions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      insertMention(filteredMentions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const insertMention = (mention: Mention) => {
    if (!textareaRef.current) return;

    const beforeCursor = value.substring(0, cursorPosition);
    const triggerIndex = beforeCursor.lastIndexOf(trigger);

    if (triggerIndex === -1) return;

    const newValue =
      value.substring(0, triggerIndex) +
      mention.username +
      ' ' +
      value.substring(cursorPosition);

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);

    setShowSuggestions(false);
    setQuery('');

    // Set cursor position after inserted mention
    const newPosition = triggerIndex + mention.username.length + 1;
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = 'auto';
    const scrollHeight = textareaRef.current.scrollHeight;
    const newHeight = Math.min(scrollHeight, maxRows * 24);
    textareaRef.current.style.height = `${newHeight}px`;
  }, [value, maxRows]);

  return (
    <div className={cn('relative', className)}>
      {/* Textarea */}
      <div className="relative">
        {showTrigger && (
          <div className="absolute left-3 top-3 text-gray-400 pointer-events-none">
            <At className="w-4 h-4" />
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={cn(
            'w-full px-4 py-3 rounded-xl border outline-none',
            'bg-gray-900/50 backdrop-blur-sm text-gray-100',
            'resize-none transition-all placeholder:text-gray-500',
            colors.border,
            showTrigger && 'pl-10',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{ minHeight: `${rows * 24}px` }}
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredMentions.length > 0 && (
        <div
          ref={suggestionsRef}
          className={cn(
            'absolute z-50 w-full mt-2 py-2 rounded-xl border shadow-xl',
            'bg-gray-900/95 backdrop-blur-sm',
            'animate-in fade-in slide-in-from-top-2 duration-200',
            colors.border,
            'max-h-60 overflow-y-auto custom-scrollbar'
          )}
        >
          {filteredMentions.map((mention, index) => (
            <button
              key={mention.id}
              type="button"
              onClick={() => insertMention(mention)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2 transition-all',
                index === selectedIndex && colors.highlight,
                index !== selectedIndex && colors.item,
                'hover:pl-6'
              )}
            >
              {mention.avatar ? (
                <img
                  src={mention.avatar}
                  alt={mention.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  colors.highlight
                )}>
                  {mention.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left">
                <div className="font-medium">{mention.name}</div>
                {mention.username && (
                  <div className="text-xs text-gray-400">{mention.username}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
