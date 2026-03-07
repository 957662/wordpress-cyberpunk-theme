'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Plus, X, Pencil, Trash2, Check } from 'lucide-react';
import { TagBadge } from './TagBadge';
import { TagInput } from './TagInput';

interface Tag {
  id: number;
  name: string;
  slug: string;
  color?: string;
  count?: number;
}

interface TagManagerProps {
  tags: Tag[];
  onAdd?: (name: string) => Promise<Tag>;
  onUpdate?: (id: number, name: string) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  editable?: boolean;
  selectable?: boolean;
  maxTags?: number;
}

export const TagManager: React.FC<TagManagerProps> = ({
  tags,
  onAdd,
  onUpdate,
  onDelete,
  editable = true,
  selectable = false,
  maxTags = 20,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());

  const handleStartEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditValue(tag.name);
  };

  const handleSaveEdit = async () => {
    if (editingId && onUpdate && editValue.trim()) {
      await onUpdate(editingId, editValue.trim());
      setEditingId(null);
      setEditValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleDelete = async (id: number) => {
    if (onDelete && window.confirm('确定要删除这个标签吗？')) {
      await onDelete(id);
    }
  };

  const handleAddTag = async (name: string) => {
    if (onAdd && name.trim()) {
      await onAdd(name.trim());
      setIsAdding(false);
    }
  };

  const handleToggleSelect = (id: number) => {
    const newSelected = new Set(selectedTags);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTags(newSelected);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-violet-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            标签管理
          </h3>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
            {tags.length}/{maxTags}
          </span>
        </div>

        {editable && onAdd && tags.length < maxTags && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all shadow-lg shadow-violet-500/30"
          >
            <Plus className="w-4 h-4" />
            <span>新建标签</span>
          </motion.button>
        )}
      </div>

      {/* Add Tag Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <TagInput
                tags={tags.map(t => t.name)}
                onAddTag={handleAddTag}
                placeholder="输入标签名称后按回车..."
              />
              <button
                onClick={() => setIsAdding(false)}
                className="mt-3 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                取消
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tags List */}
      <div className="p-6 space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {/* Select Checkbox */}
              {selectable && (
                <button
                  onClick={() => handleToggleSelect(tag.id)}
                  className={`
                    flex-shrink-0 w-5 h-5 rounded border-2 transition-all
                    ${
                      selectedTags.has(tag.id)
                        ? 'bg-violet-500 border-violet-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-violet-500'
                    }
                  `}
                >
                  {selectedTags.has(tag.id) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </button>
              )}

              {/* Tag Badge */}
              <div className="flex-1 min-w-0">
                {editingId === tag.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-violet-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
                      autoFocus
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleSaveEdit}
                      className="p-2 text-green-600 hover:text-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCancelEdit}
                      className="p-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <TagBadge
                      tag={tag}
                      size="md"
                      variant="default"
                      clickable={false}
                    />
                    {tag.count !== undefined && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {tag.count} 篇文章
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              {editingId !== tag.id && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {editable && onUpdate && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleStartEdit(tag)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </motion.button>
                  )}
                  {editable && onDelete && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(tag.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {tags.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Tag className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium mb-1">还没有标签</p>
            <p className="text-sm">点击上方按钮创建第一个标签</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {selectable && selectedTags.size > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            已选择 <span className="font-semibold text-violet-600 dark:text-violet-400">{selectedTags.size}</span> 个标签
          </p>
        </div>
      )}
    </div>
  );
};

export default TagManager;
