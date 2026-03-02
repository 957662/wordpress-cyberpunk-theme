/**
 * 标签管理器组件
 * 支持添加、删除、编辑标签，标签搜索和过滤
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Tag {
  id: string;
  name: string;
  color?: string;
  count?: number;
}

export interface TagManagerProps {
  tags: Tag[];
  onAdd?: (name: string, color?: string) => void;
  onRemove?: (id: string) => void;
  onUpdate?: (id: string, name: string, color?: string) => void;
  selectedTags?: string[];
  onToggle?: (id: string) => void;
  allowSelection?: boolean;
  allowEditing?: boolean;
  allowCreating?: boolean;
  showCounts?: boolean;
  maxTags?: number;
  className?: string;
}

const defaultColors = [
  'bg-cyber-cyan',
  'bg-cyber-purple',
  'bg-cyber-pink',
  'bg-cyber-green',
  'bg-cyber-yellow',
  'bg-red-500',
  'bg-blue-500',
  'bg-orange-500',
];

export function TagManager({
  tags,
  onAdd,
  onRemove,
  onUpdate,
  selectedTags = [],
  onToggle,
  allowSelection = false,
  allowEditing = false,
  allowCreating = false,
  showCounts = false,
  maxTags,
  className,
}: TagManagerProps) {
  const [newTagInput, setNewTagInput] = useState('');
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingColor, setEditingColor] = useState('');
  const [filterText, setFilterText] = useState('');

  const filteredTags = useMemo(() => {
    if (!filterText) return tags;
    return tags.filter(tag =>
      tag.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [tags, filterText]);

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;

    const exists = tags.some(tag => tag.name.toLowerCase() === newTagInput.toLowerCase());
    if (exists) {
      alert('标签已存在');
      return;
    }

    if (maxTags && tags.length >= maxTags) {
      alert(`最多只能添加 ${maxTags} 个标签`);
      return;
    }

    const randomColor = defaultColors[Math.floor(Math.random() * defaultColors.length)];
    onAdd?.(newTagInput.trim(), randomColor);
    setNewTagInput('');
  };

  const handleStartEdit = (tag: Tag) => {
    setEditingTag(tag.id);
    setEditingName(tag.name);
    setEditingColor(tag.color || defaultColors[0]);
  };

  const handleSaveEdit = () => {
    if (editingTag && editingName.trim()) {
      onUpdate?.(editingTag, editingName.trim(), editingColor);
      setEditingTag(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setEditingName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editingTag) {
        handleSaveEdit();
      } else {
        handleAddTag();
      }
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* 搜索和创建 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="搜索标签..."
          className="flex-1 px-4 py-2 bg-cyber-dark border-2 border-cyber-purple/30 rounded-lg focus:border-cyber-cyan focus:outline-none"
        />

        {allowCreating && (
          <input
            type="text"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="新建标签..."
            className="flex-1 px-4 py-2 bg-cyber-dark border-2 border-cyber-purple/30 rounded-lg focus:border-cyber-cyan focus:outline-none"
          />
        )}

        {allowCreating && (
          <button
            onClick={handleAddTag}
            className="px-4 py-2 bg-cyber-cyan text-cyber-dark rounded-lg hover:bg-cyber-cyan/90 transition-colors"
          >
            添加
          </button>
        )}
      </div>

      {/* 标签列表 */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {filteredTags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            const isEditing = editingTag === tag.id;

            return (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {isEditing ? (
                  <div className="flex items-center gap-2 p-2 rounded-lg border-2 border-cyber-purple bg-cyber-purple/10">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="px-2 py-1 bg-cyber-dark rounded focus:outline-none"
                      autoFocus
                    />

                    <div className="flex gap-1">
                      {defaultColors.map(color => (
                        <button
                          key={color}
                          onClick={() => setEditingColor(color)}
                          className={cn(
                            'w-6 h-6 rounded-full transition-all',
                            color,
                            editingColor === color && 'ring-2 ring-white'
                          )}
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleSaveEdit}
                      className="p-1 text-cyber-green hover:bg-cyber-green/10 rounded"
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 text-cyber-pink hover:bg-cyber-pink/10 rounded"
                    >
                      ✗
                    </button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (allowSelection) {
                        onToggle?.(tag.id);
                      }
                    }}
                    className={cn(
                      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all',
                      'hover:shadow-lg',
                      isSelected
                        ? 'border-cyber-cyan bg-cyber-cyan/20'
                        : 'border-cyber-purple/30 bg-cyber-purple/5 hover:border-cyber-purple/50'
                    )}
                  >
                    <span
                      className={cn(
                        'w-3 h-3 rounded-full',
                        tag.color || defaultColors[0]
                      )}
                    />
                    <span className="text-sm font-medium">{tag.name}</span>
                    {showCounts && tag.count !== undefined && (
                      <span className="text-xs text-gray-400">({tag.count})</span>
                    )}
                    {isSelected && (
                      <span className="text-cyber-cyan">✓</span>
                    )}

                    {/* 操作按钮 */}
                    {(allowEditing || allowSelection) && (
                      <div className="flex gap-1 ml-1">
                        {allowEditing && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(tag);
                            }}
                            className="p-0.5 text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 rounded"
                          >
                            ✎
                          </button>
                        )}
                        {allowSelection && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemove?.(tag.id);
                            }}
                            className="p-0.5 text-gray-400 hover:text-cyber-pink hover:bg-cyber-pink/10 rounded"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    )}
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredTags.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          {filterText ? '没有找到匹配的标签' : '暂无标签'}
        </div>
      )}

      {/* 统计信息 */}
      {maxTags && (
        <div className="text-sm text-gray-400">
          {tags.length} / {maxTags} 个标签
        </div>
      )}
    </div>
  );
}

// 标签选择器（单选）
export interface TagSelectorProps {
  tags: Tag[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TagSelector({
  tags,
  value,
  onChange,
  placeholder = '选择标签...',
  className,
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredTags = useMemo(() => {
    if (!search) return tags;
    return tags.filter(tag =>
      tag.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [tags, search]);

  const selectedTag = tags.find(tag => tag.id === value);

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-4 py-2 text-left rounded-lg border-2 transition-all',
          'focus:outline-none focus:border-cyber-cyan',
          isOpen ? 'border-cyber-cyan' : 'border-cyber-purple/30 hover:border-cyber-purple/50',
          'bg-cyber-dark'
        )}
      >
        {selectedTag ? (
          <div className="flex items-center gap-2">
            <span className={cn('w-3 h-3 rounded-full', selectedTag.color || defaultColors[0])} />
            <span>{selectedTag.name}</span>
          </div>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-2 bg-cyber-dark border-2 border-cyber-purple/30 rounded-lg shadow-lg overflow-hidden"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索标签..."
              className="w-full px-4 py-2 bg-cyber-dark border-b border-cyber-purple/30 focus:outline-none"
              autoFocus
            />

            <div className="max-h-60 overflow-y-auto">
              {filteredTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => {
                    onChange?.(tag.id);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={cn(
                    'w-full px-4 py-2 text-left flex items-center gap-2',
                    'hover:bg-cyber-purple/10 transition-colors',
                    value === tag.id && 'bg-cyber-cyan/10'
                  )}
                >
                  <span className={cn('w-3 h-3 rounded-full', tag.color || defaultColors[0])} />
                  <span>{tag.name}</span>
                  {tag.count !== undefined && (
                    <span className="ml-auto text-xs text-gray-400">{tag.count}</span>
                  )}
                </button>
              ))}
            </div>

            {filteredTags.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-400">没有找到标签</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 标签云组件
export interface TagCloudProps {
  tags: Tag[];
  onTagClick?: (tag: Tag) => void;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

export function TagCloud({
  tags,
  onTagClick,
  minSize = 0.75,
  maxSize = 1.5,
  className,
}: TagCloudProps) {
  const maxCount = Math.max(...tags.map(tag => tag.count || 0));

  const getFontSize = (count: number = 0) => {
    if (maxCount === 0) return 1;
    const ratio = count / maxCount;
    return minSize + (maxSize - minSize) * ratio;
  };

  return (
    <div className={cn('flex flex-wrap gap-2 justify-center', className)}>
      {tags.map((tag) => (
        <motion.button
          key={tag.id}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onTagClick?.(tag)}
          className="relative group"
          style={{ fontSize: `${getFontSize(tag.count)}rem` }}
        >
          <span
            className={cn(
              'px-3 py-1.5 rounded-full border-2 transition-all',
              'hover:shadow-lg',
              'border-cyber-purple/30 bg-cyber-purple/5',
              'group-hover:border-cyber-cyan group-hover:bg-cyber-cyan/10'
            )}
          >
            <span
              className={cn('inline-block w-2 h-2 rounded-full mr-1', tag.color || defaultColors[0])}
            />
            {tag.name}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
