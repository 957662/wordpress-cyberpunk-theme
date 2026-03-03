/**
 * Bookmark Folder Manager Component
 * Create and manage bookmark folders
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookmarkService } from '@/services/bookmark-service';
import type { BookmarkFolder } from '@/types/social.types';
import CyberCard from '@/components/ui/CyberCard';
import CyberButton from '@/components/ui/CyberButton';
import CyberInput from '@/components/ui/CyberInput';

const FOLDER_COLORS = [
  { name: 'Cyan', value: '#00f0ff' },
  { name: 'Purple', value: '#9d00ff' },
  { name: 'Pink', value: '#ff0080' },
  { name: 'Green', value: '#00ff88' },
  { name: 'Yellow', value: '#f0ff00' },
  { name: 'Blue', value: '#0066ff' },
];

const FOLDER_ICONS = ['📁', '📂', '🗂️', '📚', '📖', '🎯', '⭐', '💡'];

interface BookmarkFolderManagerProps {
  onFolderChange?: (folderId: string | null) => void;
  className?: string;
}

export default function BookmarkFolderManager({
  onFolderChange,
  className = ''
}: BookmarkFolderManagerProps) {
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingFolder, setEditingFolder] = useState<BookmarkFolder | null>(null);

  // Form state
  const [folderName, setFolderName] = useState('');
  const [folderIcon, setFolderIcon] = useState('📁');
  const [folderColor, setFolderColor] = useState('#00f0ff');
  const [folderDescription, setFolderDescription] = useState('');

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setLoading(true);
      const response = await bookmarkService.getFolders();
      setFolders(response.items);
    } catch (error) {
      console.error('Failed to load folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!folderName.trim()) return;

    try {
      await bookmarkService.createFolder({
        name: folderName,
        icon: folderIcon,
        color: folderColor,
        description: folderDescription || undefined,
      });

      // Reset form
      setFolderName('');
      setFolderIcon('📁');
      setFolderColor('#00f0ff');
      setFolderDescription('');
      setShowCreateForm(false);

      // Reload folders
      loadFolders();
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleUpdateFolder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingFolder || !folderName.trim()) return;

    try {
      await bookmarkService.updateFolder(editingFolder.id, {
        name: folderName,
        icon: folderIcon,
        color: folderColor,
        description: folderDescription || undefined,
      });

      // Reset form
      setEditingFolder(null);
      setFolderName('');
      setFolderIcon('📁');
      setFolderColor('#00f0ff');
      setFolderDescription('');

      // Reload folders
      loadFolders();
    } catch (error) {
      console.error('Failed to update folder:', error);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm('Are you sure? Bookmarks in this folder will be moved to All Bookmarks.')) {
      return;
    }

    try {
      await bookmarkService.deleteFolder(folderId);
      loadFolders();
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  };

  const startEdit = (folder: BookmarkFolder) => {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setFolderIcon(folder.icon || '📁');
    setFolderColor(folder.color || '#00f0ff');
    setFolderDescription(folder.description || '');
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingFolder(null);
    setFolderName('');
    setFolderIcon('📁');
    setFolderColor('#00f0ff');
    setFolderDescription('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Folders</h3>
        <CyberButton
          variant="outline"
          size="sm"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? '✕ Cancel' : '+ New Folder'}
        </CyberButton>
      </div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {(showCreateForm || editingFolder) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <CyberCard className="p-4">
              <form onSubmit={editingFolder ? handleUpdateFolder : handleCreateFolder} className="space-y-4">
                {/* Folder Name */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Folder Name</label>
                  <CyberInput
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="My favorites"
                    required
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {FOLDER_ICONS.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFolderIcon(icon)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          folderIcon === icon
                            ? 'border-cyber-cyan bg-cyber-cyan/20'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {FOLDER_COLORS.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFolderColor(color.value)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          folderColor === color.value
                            ? 'border-white scale-110'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description (optional)</label>
                  <CyberInput
                    value={folderDescription}
                    onChange={(e) => setFolderDescription(e.target.value)}
                    placeholder="What's in this folder?"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <CyberButton type="submit" variant="primary">
                    {editingFolder ? 'Update Folder' : 'Create Folder'}
                  </CyberButton>
                  {editingFolder && (
                    <CyberButton
                      type="button"
                      variant="ghost"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </CyberButton>
                  )}
                </div>
              </form>
            </CyberCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Folders List */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading folders...</div>
      ) : folders.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No folders yet</p>
          <p className="text-sm mt-2">Create folders to organize your bookmarks</p>
        </div>
      ) : (
        <div className="space-y-2">
          {folders.map(folder => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <CyberCard
                className="p-3 hover:shadow-lg hover:shadow-cyber-cyan/20 transition-shadow"
                style={{
                  borderLeftColor: folder.color,
                  borderLeftWidth: '4px',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${folder.color}20` }}
                    >
                      {folder.icon || '📁'}
                    </div>

                    {/* Info */}
                    <div>
                      <h4 className="font-semibold text-white">{folder.name}</h4>
                      <p className="text-xs text-gray-500">
                        {folder._count?.bookmarks || 0} bookmarks
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <CyberButton
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(folder)}
                    >
                      ✏️
                    </CyberButton>
                    {!folder.isDefault && (
                      <CyberButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFolder(folder.id)}
                      >
                        🗑️
                      </CyberButton>
                    )}
                  </div>
                </div>

                {/* Description */}
                {folder.description && (
                  <p className="text-sm text-gray-400 mt-2 ml-13">
                    {folder.description}
                  </p>
                )}
              </CyberCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
