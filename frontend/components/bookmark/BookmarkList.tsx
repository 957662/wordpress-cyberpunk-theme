/**
 * Bookmark List Component
 * Display user's bookmarks with folders and filtering
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookmarkService } from '@/services/bookmark-service';
import type { BookmarkItem, BookmarkFolder } from '@/types/social.types';
import CyberCard from '@/components/ui/CyberCard';
import CyberButton from '@/components/ui/CyberButton';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface BookmarkListProps {
  userId?: string;
  className?: string;
}

export default function BookmarkList({ userId, className = '' }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    loadBookmarks();
    loadFolders();
  }, [selectedFolder, page]);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const response = await bookmarkService.getBookmarks({
        folderId: selectedFolder || undefined,
        page,
        pageSize: 20,
      });
      setBookmarks(response.items);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const response = await bookmarkService.getFolders();
      setFolders(response.items);
    } catch (error) {
      console.error('Failed to load folders:', error);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: string) => {
    try {
      await bookmarkService.removeBookmark(bookmarkId);
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  };

  const handleMoveBookmark = async (bookmarkId: string, folderId: string) => {
    try {
      await bookmarkService.moveBookmark(bookmarkId, folderId);
      loadBookmarks();
    } catch (error) {
      console.error('Failed to move bookmark:', error);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Folder Filter */}
      {folders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          <CyberButton
            variant={selectedFolder === null ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => { setSelectedFolder(null); setPage(1); }}
          >
            📚 All Bookmarks
          </CyberButton>
          {folders.map(folder => (
            <CyberButton
              key={folder.id}
              variant={selectedFolder === folder.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => { setSelectedFolder(folder.id); setPage(1); }}
            >
              {folder.icon || '📁'} {folder.name}
              <span className="ml-1 text-xs opacity-75">
                ({folder._count?.bookmarks || 0})
              </span>
            </CyberButton>
          ))}
        </motion.div>
      )}

      {/* Bookmarks Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : bookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-400"
          >
            <div className="text-4xl mb-4">🔖</div>
            <p>No bookmarks yet</p>
            <p className="text-sm mt-2">
              {selectedFolder ? 'This folder is empty' : 'Start bookmarking your favorite posts!'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map((bookmark, index) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <CyberCard className="h-full hover:shadow-lg hover:shadow-cyber-cyan/20 transition-shadow">
                  {/* Post or Comment Content */}
                  {bookmark.post ? (
                    <div className="space-y-3">
                      {/* Post Thumbnail */}
                      {bookmark.post.thumbnail && (
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                          <img
                            src={bookmark.post.thumbnail}
                            alt={bookmark.post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Post Info */}
                      <div>
                        <h3 className="font-semibold text-white mb-2 line-clamp-2">
                          {bookmark.post.title}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                          {bookmark.post.excerpt}
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-2 mb-3">
                          {bookmark.post.author.avatar && (
                            <img
                              src={bookmark.post.author.avatar}
                              alt={bookmark.post.author.displayName}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <span className="text-xs text-gray-500">
                            {bookmark.post.author.displayName}
                          </span>
                        </div>

                        {/* Notes */}
                        {bookmark.notes && (
                          <div className="bg-cyber-muted/50 rounded p-2 mb-3">
                            <p className="text-xs text-gray-400">{bookmark.notes}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {new Date(bookmark.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex gap-2">
                            <CyberButton
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveBookmark(bookmark.id)}
                            >
                              🗑️
                            </CyberButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : bookmark.comment ? (
                    <div className="space-y-3">
                      {/* Comment Content */}
                      <div className="bg-cyber-muted/30 rounded p-3">
                        <p className="text-sm text-gray-300 line-clamp-3">
                          {bookmark.comment.content}
                        </p>
                      </div>

                      {/* Comment Author */}
                      <div className="flex items-center gap-2">
                        {bookmark.comment.author.avatar && (
                          <img
                            src={bookmark.comment.author.avatar}
                            alt={bookmark.comment.author.displayName}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span className="text-xs text-gray-500">
                          {bookmark.comment.author.displayName}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(bookmark.createdAt).toLocaleDateString()}
                        </span>
                        <CyberButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveBookmark(bookmark.id)}
                        >
                          🗑️
                        </CyberButton>
                      </div>
                    </div>
                  ) : null}
                </CyberCard>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Load More */}
      {hasMore && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <CyberButton
            variant="outline"
            onClick={() => setPage(p => p + 1)}
          >
            Load More
          </CyberButton>
        </motion.div>
      )}
    </div>
  );
}
