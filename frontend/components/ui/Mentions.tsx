'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { At, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MentionUser {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

export interface MentionsProps {
  users: MentionUser[];
  onMention?: (user: MentionUser) => void;
  placeholder?: string;
  className?: string;
  trigger?: string;
  maxSuggestions?: number;
}

export function Mentions({
  users,
  onMention,
  placeholder = '输入 @ 提及用户...',
  className,
  trigger = '@',
  maxSuggestions = 8
}: MentionsProps) {
  const [text, setText] = useState('');
  const [mentionQuery, setMentionQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 过滤用户
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(mentionQuery.toLowerCase())
  ).slice(0, maxSuggestions);

  // 检测是否输入了触发字符
  useEffect(() => {
    const textBeforeCursor = text.slice(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf(trigger);
    
    if (lastAtIndex !== -1) {
      const textAfterTrigger = textBeforeCursor.slice(lastAtIndex + 1);
      const hasSpaceAfterTrigger = textAfterTrigger.includes(' ');
      
      if (!hasSpaceAfterTrigger) {
        setMentionQuery(textAfterTrigger);
        setShowSuggestions(true);
        setSelectedIndex(0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [text, cursorPosition, trigger]);

  // 插入提及
  const insertMention = (user: MentionUser) => {
    const textBeforeCursor = text.slice(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf(trigger);
    
    const before = text.slice(0, lastAtIndex);
    const after = text.slice(cursorPosition);
    const mention = `${trigger}[${user.name}](user:${user.id}) `;
    
    const newText = before + mention + after;
    const newPosition = lastAtIndex + mention.length;
    
    setText(newText);
    setShowSuggestions(false);
    
    // 设置光标位置
    setTimeout(() => {
      textareaRef.current?.setSelectionRange(newPosition, newPosition);
      textareaRef.current?.focus();
    }, 0);
    
    onMention?.(user);
  };

  // 处理键盘事件
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < filteredUsers.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev > 0 ? prev - 1 : filteredUsers.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (filteredUsers[selectedIndex]) {
          insertMention(filteredUsers[selectedIndex]);
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        break;
    }
  };

  // 处理文本变化
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  // 处理点击
  const handleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart);
  };

  // 高亮显示提及
  const highlightMentions = (text: string) => {
    const mentionRegex = /\$\[([^\]]+)\]\(user:([^\)]+)\)/g;
    const parts = text.split(mentionRegex);
    
    return parts.map((part, index) => {
      if (index % 3 === 1) {
        // 这是用户名
        return (
          <span key={index} className="text-cyan-400 font-medium">
            {trigger}{part}
          </span>
        );
      } else if (index % 3 === 2) {
        // 这是用户 ID，不显示
        return null;
      }
      return part;
    });
  };

  // 获取建议框位置
  const getSuggestionPosition = () => {
    if (!textareaRef.current) return {};
    
    const textarea = textareaRef.current;
    const textBeforeCursor = text.slice(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf(trigger);
    
    // 简单的位置计算（实际项目中可能需要更精确的计算）
    return {
      left: 0,
      top: '100%'
    };
  };

  return (
    <div className={cn('relative', className)}>
      {/* 输入区域 */}
      <div className="relative">
        <div className="absolute left-3 top-3 text-gray-400">
          <At size={18} />
        </div>
        
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full min-h-[120px] pl-10 pr-4 py-3',
            'bg-gray-900/50 border-2 border-cyan-500/30 rounded-lg',
            'text-white placeholder-gray-500',
            'focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20',
            'transition-all duration-200',
            'resize-none'
          )}
        />
        
        {/* 提及预览 */}
        {text && (
          <div className="absolute inset-0 pl-10 pr-4 py-3 pointer-events-none whitespace-pre-wrap break-words opacity-50">
            {highlightMentions(text)}
          </div>
        )}
      </div>

      {/* 建议下拉框 */}
      <AnimatePresence>
        {showSuggestions && filteredUsers.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-gray-900 border border-cyan-500/30 rounded-lg shadow-xl shadow-cyan-500/20 overflow-hidden"
          >
            <div className="p-2">
              {filteredUsers.map((user, index) => (
                <motion.button
                  key={user.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => insertMention(user)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
                    'transition-all duration-200',
                    index === selectedIndex
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'hover:bg-gray-800 text-gray-300'
                  )}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <div className="flex-1 text-left">
                    <div className="font-medium">{user.name}</div>
                    {user.email && (
                      <div className="text-xs text-gray-500">{user.email}</div>
                    )}
                  </div>
                  
                  {index === selectedIndex && (
                    <div className="text-cyan-400">
                      <kbd className="px-2 py-1 text-xs bg-cyan-500/20 rounded">↵</kbd>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
            
            {/* 键盘提示 */}
            <div className="px-3 py-2 bg-gray-800/50 border-t border-gray-700 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">↑↓</kbd>
                导航
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">↵</kbd>
                选择
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">esc</kbd>
                关闭
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 无结果提示 */}
      <AnimatePresence>
        {showSuggestions && filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 p-4 bg-gray-900 border border-cyan-500/30 rounded-lg text-center text-gray-400"
          >
            未找到匹配的用户
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 提及列表显示组件
export interface MentionListProps {
  mentions: MentionUser[];
  onRemove?: (userId: string) => void;
  className?: string;
}

export function MentionList({ mentions, onRemove, className }: MentionListProps) {
  if (mentions.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {mentions.map((user) => (
        <motion.div
          key={user.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400"
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-5 h-5 rounded-full object-cover"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          <span className="text-sm font-medium">{user.name}</span>
          
          {onRemove && (
            <button
              onClick={() => onRemove(user.id)}
              className="hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
}
