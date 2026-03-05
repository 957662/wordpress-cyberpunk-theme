'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid3x3, List, FolderPlus, Trash2, Edit2, FolderOpen, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface BookmarkItem {
  id: string;
  targetType: 'post' | 'comment';
  targetId: string;
  createdAt: string;
  folder: {
    id: string;
    name: string;
  } | null;
  post?: {
    id: string;
    title: string;
    excerpt: string;
    thumbnail?: string;
    author: {
      id: string;
      username: string;
      displayName: string;
      avatar?: string;
    };
  };
  comment?: {
    id: string;
    content: string;
    author: {
      id: string;
      username: string;
      displayName: string;
      avatar?: string;
    };
  };
}

interface Folder {
  id: string;
  name: string;
  icon?: string;
  _count: {
    bookmarks: number;
  };
}

interface BookmarksClientProps {
  initialBookmarks: BookmarkItem[];
  initialFolders: Folder[];
}

export default function BookmarksClient({
  initialBookmarks,
  initialFolders,
}: BookmarksClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [folders, setFolders] = useState<Folder[]>(initialFolders);

  const filteredBookmarks = initialBookmarks.filter((bookmark) => {
    const matchesSearch =
      searchQuery === '' ||
      (bookmark.post?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (bookmark.comment?.content?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesFolder =
      !selectedFolder || bookmark.folder?.id === selectedFolder;

    return matchesSearch && matchesFolder;
  });

  const handleCreateFolder = async () => {
    const name = prompt('请输入收藏夹名称：');
    if (name) {
      // TODO: Implement folder creation
      console.log('Create folder:', name);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (confirm('确定要删除这个收藏夹吗？收藏的内容将被移至默认收藏夹。')) {
      // TODO: Implement folder deletion
      console.log('Delete folder:', folderId);
    }
  };

  return (
    <div className="flex gap-8">
      {/* Sidebar - Folders */}
      <aside className="w-64 shrink-0">
        <div className="sticky top-8 space-y-6">
          {/* Folders */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-cyber-text-primary">收藏夹</h2>
              <button
                onClick={handleCreateFolder}
                className="p-1 rounded hover:bg-slate-800 text-cyber-text-secondary hover:text-cyber-primary transition-colors"
                title="新建收藏夹"
              >
                <FolderPlus size={16} />
              </button>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedFolder(null)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg transition-colors duration-200',
                  'flex items-center justify-between group',
                  selectedFolder === null
                    ? 'bg-cyber-primary/20 text-cyber-primary'
                    : 'hover:bg-slate-800/50 text-cyber-text-secondary hover:text-cyber-text-primary'
                )}
              >
                <span className="flex items-center gap-2">
                  <FolderOpen size={16} />
                  全部收藏
                </span>
                <span className="text-sm opacity-60">
                  {initialBookmarks.length}
                </span>
              </button>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg transition-colors duration-200',
                    'flex items-center justify-between group',
                    selectedFolder === folder.id
                      ? 'bg-cyber-primary/20 text-cyber-primary'
                      : 'hover:bg-slate-800/50 text-cyber-text-secondary hover:text-cyber-text-primary'
                  )}
                >
                  <span className="flex items-center gap-2 truncate flex-1">
                    {folder.icon && <span>{folder.icon}</span>}
                    <span className="truncate">{folder.name}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm opacity-60">
                      {folder._count.bookmarks}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id);
                      }}
                      className="p-1 rounded hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-text-secondary"
              size={20}
            />
            <input
              type="text"
              placeholder="搜索收藏..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg
                       text-cyber-text-primary placeholder-cyber-text-secondary
                       focus:outline-none focus:ring-2 focus:ring-cyber-primary focus:border-transparent
                       transition-all duration-200"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded transition-colors duration-200',
                viewMode === 'list'
                  ? 'bg-cyber-primary text-white'
                  : 'text-cyber-text-secondary hover:text-cyber-text-primary'
              )}
              title="列表视图"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded transition-colors duration-200',
                viewMode === 'grid'
                  ? 'bg-cyber-primary text-white'
                  : 'text-cyber-text-secondary hover:text-cyber-text-primary'
              )}
              title="网格视图"
            >
              <Grid3x3 size={18} />
            </button>
          </div>
        </div>

        {/* Bookmarks List */}
        {filteredBookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-cyber-text-secondary">
            <Bookmark size={64} className="mb-4 opacity-50" />
            <p className="text-lg mb-2">
              {searchQuery ? '没有找到匹配的收藏' : '还没有收藏'}
            </p>
            <p className="text-sm">
              {searchQuery ? '尝试其他搜索关键词' : '收藏您喜欢的文章和评论吧'}
            </p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-3">
            {filteredBookmarks.map((bookmark) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg
                         hover:border-cyber-primary/50 hover:bg-slate-800/50
                         transition-all duration-200 group"
              >
                {bookmark.targetType === 'post' && bookmark.post && (
                  <Link href={`/blog/${bookmark.post.id}`}>
                    <div className="flex gap-4">
                      {bookmark.post.thumbnail && (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={bookmark.post.thumbnail}
                            alt={bookmark.post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-cyber-text-primary group-hover:text-cyber-primary transition-colors line-clamp-1">
                          {bookmark.post.title}
                        </h3>
                        <p className="text-sm text-cyber-text-secondary mt-1 line-clamp-2">
                          {bookmark.post.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-cyber-text-secondary">
                          <span>
                            作者: {bookmark.post.author.displayName || bookmark.post.author.username}
                          </span>
                          <span>·</span>
                          <span>
                            {formatDistanceToNow(new Date(bookmark.createdAt), {
                              addSuffix: true,
                              locale: zhCN,
                            })}
                          </span>
                          {bookmark.folder && (
                            <>
                              <span>·</span>
                              <span className="text-amber-500">{bookmark.folder.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {bookmark.targetType === 'comment' && bookmark.comment && (
                  <div>
                    <div className="flex items-start gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                        {bookmark.comment.author.avatar ? (
                          <Image
                            src={bookmark.comment.author.avatar}
                            alt={bookmark.comment.author.displayName || bookmark.comment.author.username}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-cyber-primary to-cyber-accent flex items-center justify-center text-white font-bold">
                            {(bookmark.comment.author.displayName || bookmark.comment.author.username).charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-cyber-text-primary">
                          {bookmark.comment.author.displayName || bookmark.comment.author.username}
                        </p>
                        <p className="text-sm text-cyber-text-secondary mt-1 line-clamp-3">
                          {bookmark.comment.content}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-cyber-text-secondary">
                          <span>
                            {formatDistanceToNow(new Date(bookmark.createdAt), {
                              addSuffix: true,
                              locale: zhCN,
                            })}
                          </span>
                          {bookmark.folder && (
                            <>
                              <span>·</span>
                              <span className="text-amber-500">{bookmark.folder.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBookmarks.map((bookmark) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg
                         hover:border-cyber-primary/50 hover:bg-slate-800/50
                         transition-all duration-200 group"
              >
                {bookmark.targetType === 'post' && bookmark.post && (
                  <Link href={`/blog/${bookmark.post.id}`}>
                    {bookmark.post.thumbnail && (
                      <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3">
                        <Image
                          src={bookmark.post.thumbnail}
                          alt={bookmark.post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-cyber-text-primary group-hover:text-cyber-primary transition-colors line-clamp-2">
                      {bookmark.post.title}
                    </h3>
                  </Link>
                )}

                {bookmark.targetType === 'comment' && bookmark.comment && (
                  <p className="text-sm text-cyber-text-secondary line-clamp-4">
                    {bookmark.comment.content}
                  </p>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
                  <span className="text-xs text-cyber-text-secondary">
                    {formatDistanceToNow(new Date(bookmark.createdAt), {
                      addSuffix: true,
                      locale: zhCN,
                    })}
                  </span>
                  {bookmark.folder && (
                    <span className="text-xs text-amber-500">{bookmark.folder.name}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
