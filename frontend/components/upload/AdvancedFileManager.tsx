/**
 * 高级文件管理器
 * 支持拖拽上传、批量操作、文件预览、进度跟踪
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  File,
  Folder,
  Image,
  Video,
  Music,
  Archive,
  FileText,
  Trash2,
  Download,
  Share2,
  Search,
  Grid3x3,
  List,
  SortAsc,
  Filter,
  X,
  Check,
  AlertCircle,
  Pause,
  Play,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type FileView = 'grid' | 'list';
export type SortBy = 'name' | 'date' | 'size' | 'type';
export type FilterType = 'all' | 'image' | 'video' | 'audio' | 'document' | 'archive';

export interface FileManagerFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnail?: string;
  createdAt: Date;
  modifiedAt: Date;
  selected?: boolean;
  uploading?: boolean;
  uploadProgress?: number;
  error?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  itemCount: number;
  createdAt: Date;
  path: string;
}

export interface FileManagerProps {
  files?: FileManagerFile[];
  folders?: FolderItem[];
  view?: FileView;
  maxFileSize?: number;
  allowedTypes?: string[];
  multiple?: boolean;
  onSelect?: (files: FileManagerFile[]) => void;
  onUpload?: (files: File[]) => Promise<FileManagerFile[]>;
  onDelete?: (fileIds: string[]) => Promise<void>;
  onDownload?: (files: FileManagerFile[]) => Promise<void>;
  onShare?: (files: FileManagerFile[]) => Promise<void>;
  onFolderCreate?: (name: string) => Promise<FolderItem>;
  className?: string;
}

export function AdvancedFileManager({
  files: initialFiles = [],
  folders = [],
  view: initialView = 'grid',
  maxFileSize = 100 * 1024 * 1024, // 100MB
  allowedTypes,
  multiple = true,
  onSelect,
  onUpload,
  onDelete,
  onDownload,
  onShare,
  onFolderCreate,
  className,
}: FileManagerProps) {
  const [files, setFiles] = useState<FileManagerFile[]>(initialFiles);
  const [view, setView] = useState<FileView>(initialView);
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadQueue, setUploadQueue] = useState<Map<string, number>>(new Map());

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // 获取文件图标
  const getFileIcon = (file: FileManagerFile) => {
    const type = file.type.toLowerCase();

    if (type.startsWith('image/')) return <Image size={24} className="text-purple-500" />;
    if (type.startsWith('video/')) return <Video size={24} className="text-red-500" />;
    if (type.startsWith('audio/')) return <Music size={24} className="text-pink-500" />;
    if (type.includes('pdf')) return <FileText size={24} className="text-red-600" />;
    if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return <Archive size={24} className="text-yellow-600" />;
    if (type.includes('text') || type.includes('document')) return <FileText size={24} className="text-blue-500" />;

    return <File size={24} className="text-gray-500" />;
  };

  // 过滤和排序文件
  const filteredFiles = files.filter((file) => {
    // 搜索过滤
    if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // 类型过滤
    if (filterType !== 'all') {
      const type = file.type.toLowerCase();
      switch (filterType) {
        case 'image':
          return type.startsWith('image/');
        case 'video':
          return type.startsWith('video/');
        case 'audio':
          return type.startsWith('audio/');
        case 'document':
          return type.includes('pdf') || type.includes('document') || type.includes('text');
        case 'archive':
          return type.includes('zip') || type.includes('rar') || type.includes('tar');
        default:
          return true;
      }
    }

    return true;
  }).sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = a.modifiedAt.getTime() - b.modifiedAt.getTime();
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // 选择文件
  const toggleFileSelection = useCallback((fileId: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  }, []);

  // 全选/取消全选
  const toggleSelectAll = useCallback(() => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredFiles.map(f => f.id)));
    }
  }, [selectedFiles.size, filteredFiles]);

  // 处理文件上传
  const handleFileUpload = useCallback(async (uploadedFiles: FileList | File[]) => {
    const fileArray = Array.from(uploadedFiles);

    // 验证文件
    const validFiles = fileArray.filter(file => {
      if (maxFileSize && file.size > maxFileSize) {
        alert(`File ${file.name} exceeds maximum size of ${formatFileSize(maxFileSize)}`);
        return false;
      }

      if (allowedTypes && !allowedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not allowed`);
        return false;
      }

      return true;
    });

    // 创建上传队列
    const queue = new Map<string, number>();
    validFiles.forEach(file => {
      queue.set(file.name, 0);
    });
    setUploadQueue(queue);

    // 模拟上传进度
    for (const file of validFiles) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        queue.set(file.name, progress);
        setUploadQueue(new Map(queue));

        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 200);
    }

    try {
      if (onUpload) {
        const uploadedFiles = await onUpload(validFiles);
        setFiles(prev => [...prev, ...uploadedFiles]);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploadQueue(new Map());
    }
  }, [maxFileSize, allowedTypes, onUpload]);

  // 拖拽处理
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  }, [handleFileUpload]);

  // 删除文件
  const handleDelete = useCallback(async () => {
    if (selectedFiles.size === 0) return;

    const confirmed = confirm(`Are you sure you want to delete ${selectedFiles.size} file(s)?`);
    if (!confirmed) return;

    try {
      if (onDelete) {
        await onDelete(Array.from(selectedFiles));
      }

      setFiles(prev => prev.filter(f => !selectedFiles.has(f.id)));
      setSelectedFiles(new Set());
    } catch (error) {
      console.error('Delete error:', error);
    }
  }, [selectedFiles, onDelete]);

  // 创建文件夹
  const handleCreateFolder = useCallback(async () => {
    if (!newFolderName.trim()) return;

    try {
      if (onFolderCreate) {
        await onFolderCreate(newFolderName);
      }
      setNewFolderName('');
      setShowCreateFolder(false);
    } catch (error) {
      console.error('Create folder error:', error);
    }
  }, [newFolderName, onFolderCreate]);

  return (
    <div className={cn('flex flex-col h-full bg-cyber-dark', className)}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-4 border-b border-cyber-cyan/30">
        <div className="flex items-center gap-4">
          {/* 上传按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-cyber-cyan text-cyber-dark rounded-lg font-medium hover:bg-cyber-cyan/80"
          >
            <Upload size={18} />
            Upload
          </motion.button>

          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />

          {/* 创建文件夹 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateFolder(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyber-purple text-white rounded-lg font-medium hover:bg-cyber-purple/80"
          >
            <Folder size={18} />
            New Folder
          </motion.button>

          {/* 选择操作 */}
          {selectedFiles.size > 0 && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                className="p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500 hover:bg-red-500/30"
                title="Delete"
              >
                <Trash2 size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDownload && onDownload(files.filter(f => selectedFiles.has(f.id)))}
                className="p-2 bg-cyber-cyan/20 border border-cyber-cyan/50 rounded-lg text-cyber-cyan hover:bg-cyber-cyan/30"
                title="Download"
              >
                <Download size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onShare && onShare(files.filter(f => selectedFiles.has(f.id)))}
                className="p-2 bg-cyber-purple/20 border border-cyber-purple/50 rounded-lg text-cyber-purple hover:bg-cyber-purple/30"
                title="Share"
              >
                <Share2 size={18} />
              </motion.button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 搜索 */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="pl-10 pr-4 py-2 bg-cyber-muted border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan w-64"
            />
          </div>

          {/* 视图切换 */}
          <div className="flex items-center gap-1 bg-cyber-muted rounded-lg p-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('grid')}
              className={cn(
                'p-2 rounded-md transition-all',
                view === 'grid' ? 'bg-cyber-cyan/20 text-cyber-cyan' : 'text-gray-400 hover:text-white'
              )}
            >
              <Grid3x3 size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('list')}
              className={cn(
                'p-2 rounded-md transition-all',
                view === 'list' ? 'bg-cyber-cyan/20 text-cyber-cyan' : 'text-gray-400 hover:text-white'
              )}
            >
              <List size={18} />
            </motion.button>
          </div>

          {/* 排序 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-3 py-2 bg-cyber-muted border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan"
          >
            <option value="name">Name</option>
            <option value="date">Date</option>
            <option value="size">Size</option>
            <option value="type">Type</option>
          </select>

          {/* 过滤 */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="px-3 py-2 bg-cyber-muted border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan"
          >
            <option value="all">All Files</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="document">Documents</option>
            <option value="archive">Archives</option>
          </select>
        </div>
      </div>

      {/* 文件区域 */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex-1 overflow-auto p-4',
          isDragging && 'bg-cyber-cyan/10'
        )}
      >
        {/* 文件夹列表 */}
        {folders.length > 0 && view === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {folders.map(folder => (
              <motion.div
                key={folder.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-cyber-muted/50 border border-cyber-cyan/30 rounded-lg hover:border-cyber-cyan/50 cursor-pointer"
              >
                <Folder size={48} className="text-cyber-purple mb-2" />
                <p className="text-sm font-medium truncate">{folder.name}</p>
                <p className="text-xs text-gray-400">{folder.itemCount} items</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* 文件列表 - 网格视图 */}
        {view === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map(file => (
              <motion.div
                key={file.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => toggleFileSelection(file.id)}
                className={cn(
                  'relative p-4 bg-cyber-muted/50 border rounded-lg cursor-pointer transition-all',
                  selectedFiles.has(file.id)
                    ? 'border-cyber-cyan bg-cyber-cyan/20'
                    : 'border-cyber-cyan/30 hover:border-cyber-cyan/50'
                )}
              >
                {selectedFiles.has(file.id) && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-cyber-cyan rounded-full flex items-center justify-center">
                    <Check size={14} className="text-cyber-dark" />
                  </div>
                )}

                {file.thumbnail ? (
                  <img src={file.thumbnail} alt={file.name} className="w-full h-32 object-cover rounded mb-2" />
                ) : (
                  <div className="flex items-center justify-center h-32 mb-2">
                    {getFileIcon(file)}
                  </div>
                )}

                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>

                {file.uploading && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <motion.div
                      className="h-full bg-cyber-cyan"
                      initial={{ width: 0 }}
                      animate={{ width: `${file.uploadProgress || 0}%` }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* 文件列表 - 列表视图 */}
        {view === 'list' && (
          <div className="space-y-2">
            {filteredFiles.map(file => (
              <motion.div
                key={file.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => toggleFileSelection(file.id)}
                className={cn(
                  'flex items-center gap-4 p-3 bg-cyber-muted/50 border rounded-lg cursor-pointer transition-all',
                  selectedFiles.has(file.id)
                    ? 'border-cyber-cyan bg-cyber-cyan/20'
                    : 'border-cyber-cyan/30 hover:border-cyber-cyan/50'
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.has(file.id)}
                  onChange={() => toggleFileSelection(file.id)}
                  className="w-4 h-4 accent-cyber-cyan"
                />

                <div className="flex-shrink-0">
                  {getFileIcon(file)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{formatFileSize(file.size)}</span>
                  <span>{file.modifiedAt.toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 空状态 */}
        {filteredFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <File size={64} className="mb-4 opacity-50" />
            <p className="text-lg">No files found</p>
            <p className="text-sm mt-2">Upload files or create a new folder</p>
          </div>
        )}
      </div>

      {/* 上传队列 */}
      <AnimatePresence>
        {uploadQueue.size > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-cyber-cyan/30 p-4 bg-cyber-muted/30"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Uploading {uploadQueue.size} file(s)...</span>
              <span className="text-xs text-gray-400">Please wait</span>
            </div>
            <div className="space-y-2">
              {Array.from(uploadQueue.entries()).map(([name, progress]) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="text-xs flex-1 truncate">{name}</span>
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-cyber-cyan"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{progress}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 创建文件夹对话框 */}
      <AnimatePresence>
        {showCreateFolder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowCreateFolder(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-cyber-dark border border-cyber-purple/50 rounded-lg p-6 w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">Create New Folder</h3>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="w-full px-4 py-2 bg-cyber-muted border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan mb-4"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateFolder}
                  className="flex-1 px-4 py-2 bg-cyber-purple text-white rounded-lg font-medium hover:bg-cyber-purple/80"
                >
                  Create
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateFolder(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdvancedFileManager;
