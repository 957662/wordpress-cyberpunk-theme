'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, FolderPlus, Tag, Trash2, Edit2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookmarkFolder {
  id: string;
  name: string;
  count: number;
  icon?: string;
}

interface BookmarkItem {
  id: number;
  postId: number;
  title: string;
  excerpt: string;
  slug: string;
  folderId: string;
  tags: string[];
  createdAt: string;
}

interface BookmarkManagerProps {
  postId: number;
  postTitle: string;
  postSlug: string;
  postExcerpt?: string;
  className?: string;
}

export function BookmarkManager({
  postId,
  postTitle,
  postSlug,
  postExcerpt,
  className
}: BookmarkManagerProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [folders, setFolders] = useState<BookmarkFolder[]>([
    { id: 'default', name: '默认收藏', count: 0 },
    { id: 'read-later', name: '稍后阅读', count: 0 },
    { id: 'favorites', name: '特别收藏', count: 0 }
  ]);
  const [selectedFolder, setSelectedFolder] = useState('default');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // 检查是否已收藏
  useEffect(() => {
    try {
      const bookmarks = localStorage.getItem('bookmarks');
      if (bookmarks) {
        const parsed: BookmarkItem[] = JSON.parse(bookmarks);
        const existing = parsed.find(b => b.postId === postId);
        if (existing) {
          setIsBookmarked(true);
          setSelectedFolder(existing.folderId);
          setTags(existing.tags);
        }
      }
    } catch (error) {
      console.error('加载书签失败:', error);
    }
  }, [postId]);

  // 添加/移除书签
  const toggleBookmark = async () => {
    if (isBookmarked) {
      // 移除书签
      try {
        const bookmarks = localStorage.getItem('bookmarks');
        if (bookmarks) {
          const parsed: BookmarkItem[] = JSON.parse(bookmarks);
          const updated = parsed.filter(b => b.postId !== postId);
          localStorage.setItem('bookmarks', JSON.stringify(updated));
        }
        setIsBookmarked(false);
        setShowMenu(false);
      } catch (error) {
        console.error('移除书签失败:', error);
      }
    } else {
      // 添加书签
      const bookmark: BookmarkItem = {
        id: Date.now(),
        postId,
        title: postTitle,
        excerpt: postExcerpt || '',
        slug: postSlug,
        folderId: selectedFolder,
        tags,
        createdAt: new Date().toISOString()
      };

      try {
        const bookmarks = localStorage.getItem('bookmarks');
        const existing: BookmarkItem[] = bookmarks ? JSON.parse(bookmarks) : [];
        const updated = [bookmark, ...existing];
        localStorage.setItem('bookmarks', JSON.stringify(updated));

        // 更新文件夹计数
        setFolders(prev => prev.map(f =>
          f.id === selectedFolder ? { ...f, count: f.count + 1 } : f
        ));

        setIsBookmarked(true);
      } catch (error) {
        console.error('添加书签失败:', error);
      }
    }
  };

  // 添加标签
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // 移除标签
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  // 创建新文件夹
  const createFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: BookmarkFolder = {
        id: `folder-${Date.now()}`,
        name: newFolderName.trim(),
        count: 0
      };
      setFolders([...folders, newFolder]);
      setSelectedFolder(newFolder.id);
      setNewFolderName('');
      setShowNewFolderInput(false);
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* 书签按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => isBookmarked ? setShowMenu(!showMenu) : toggleBookmark()}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
          isBookmarked
            ? 'bg-cyber-cyan text-cyber-dark'
            : 'bg-cyber-darker border border-cyber-border text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan'
        )}
      >
        {isBookmarked ? (
          <BookmarkCheck className="w-5 h-5" />
        ) : (
          <Bookmark className="w-5 h-5" />
        )}
        <span>{isBookmarked ? '已收藏' : '收藏'}</span>
      </motion.button>

      {/* 书签菜单 */}
      <AnimatePresence>
        {showMenu && isBookmarked && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 cyber-card overflow-hidden z-20"
            >
              <div className="p-4 space-y-4">
                {/* 标题 */}
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-white">收藏管理</h3>
                  <button
                    onClick={toggleBookmark}
                    className="p-1.5 rounded-lg hover:bg-cyber-pink/10 text-cyber-pink transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* 文件夹选择 */}
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    收藏到文件夹
                  </label>
                  <div className="space-y-2">
                    {folders.map((folder) => (
                      <button
                        key={folder.id}
                        onClick={() => setSelectedFolder(folder.id)}
                        className={cn(
                          'w-full px-3 py-2 rounded-lg text-left transition-colors flex items-center justify-between',
                          selectedFolder === folder.id
                            ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30'
                            : 'bg-cyber-darker text-gray-400 hover:text-gray-300 border border-transparent hover:border-cyber-border'
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <FolderPlus className="w-4 h-4" />
                          <span className="text-sm">{folder.name}</span>
                        </span>
                        <span className="text-xs opacity-60">{folder.count}</span>
                      </button>
                    ))}

                    {/* 新建文件夹 */}
                    {showNewFolderInput ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          placeholder="文件夹名称"
                          onKeyDown={(e) => e.key === 'Enter' && createFolder()}
                          autoFocus
                          className="flex-1 px-3 py-2 bg-cyber-darker border border-cyber-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan"
                        />
                        <button
                          onClick={createFolder}
                          className="px-3 py-2 bg-cyber-cyan text-cyber-dark rounded-lg hover:bg-cyber-cyan/90 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowNewFolderInput(true)}
                        className="w-full px-3 py-2 rounded-lg text-left text-sm text-gray-500 hover:text-cyber-cyan hover:bg-cyber-cyan/5 border border-dashed border-cyber-border transition-colors flex items-center gap-2"
                      >
                        <FolderPlus className="w-4 h-4" />
                        <span>新建文件夹</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 标签管理 */}
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    添加标签
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTag()}
                      placeholder="输入标签名称"
                      className="flex-1 px-3 py-2 bg-cyber-darker border border-cyber-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan"
                    />
                    <button
                      onClick={addTag}
                      className="px-3 py-2 bg-cyber-purple text-white rounded-lg hover:bg-cyber-purple/90 transition-colors text-sm font-medium"
                    >
                      添加
                    </button>
                  </div>

                  {/* 标签列表 */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyber-cyan/10 text-cyber-cyan text-xs border border-cyber-cyan/30"
                        >
                          <Tag className="w-3 h-3" />
                          <span>{tag}</span>
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-cyber-pink transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 保存按钮 */}
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full px-4 py-2 bg-cyber-cyan text-cyber-dark rounded-lg font-medium hover:bg-cyber-cyan/90 transition-colors"
                >
                  完成
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// 快速收藏按钮（内联样式）
export function QuickBookmark({
  postId,
  postTitle,
  postSlug,
  className
}: Omit<BookmarkManagerProps, 'postExcerpt'>) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    try {
      const bookmarks = localStorage.getItem('bookmarks');
      if (bookmarks) {
        const parsed: BookmarkItem[] = JSON.parse(bookmarks);
        setIsBookmarked(parsed.some(b => b.postId === postId));
      }
    } catch (error) {
      console.error('加载书签状态失败:', error);
    }
  }, [postId]);

  const toggleBookmark = async () => {
    try {
      const bookmarks = localStorage.getItem('bookmarks');
      const existing: BookmarkItem[] = bookmarks ? JSON.parse(bookmarks) : [];

      if (isBookmarked) {
        const updated = existing.filter(b => b.postId !== postId);
        localStorage.setItem('bookmarks', JSON.stringify(updated));
        setIsBookmarked(false);
      } else {
        const bookmark: BookmarkItem = {
          id: Date.now(),
          postId,
          title: postTitle,
          excerpt: '',
          slug: postSlug,
          folderId: 'default',
          tags: [],
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('bookmarks', JSON.stringify([bookmark, ...existing]));
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleBookmark}
      className={cn(
        'p-2 rounded-lg transition-colors',
        isBookmarked
          ? 'text-cyber-cyan bg-cyber-cyan/10'
          : 'text-gray-500 hover:text-cyber-cyan hover:bg-cyber-cyan/5',
        className
      )}
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-5 h-5" />
      ) : (
        <Bookmark className="w-5 h-5" />
      )}
    </motion.button>
  );
}
