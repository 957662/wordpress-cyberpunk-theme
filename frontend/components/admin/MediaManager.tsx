/**
 * 媒体管理器
 * 管理上传的图片、视频等媒体文件
 */

'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Image as ImageIcon,
  Video,
  Music,
  File,
  Trash2,
  Search,
  Grid,
  List,
  Folder,
  X,
  Check,
  Download,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio' | 'file';
  name: string;
  url: string;
  size: number;
  createdAt: string;
  selected?: boolean;
}

export interface MediaManagerProps {
  onUpload?: (files: File[]) => Promise<MediaItem[]>;
  onDelete?: (ids: string[]) => Promise<void>;
  onSelect?: (items: MediaItem[]) => void;
  multiple?: boolean;
  maxSelection?: number;
}

export function MediaManager({
  onUpload,
  onDelete,
  onSelect,
  multiple = false,
  maxSelection,
}: MediaManagerProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      type: 'image',
      name: 'hero-banner.jpg',
      url: '/images/hero-banner.jpg',
      size: 245678,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      type: 'image',
      name: 'about-photo.png',
      url: '/images/about-photo.png',
      size: 156789,
      createdAt: '2024-01-14',
    },
    {
      id: '3',
      type: 'video',
      name: 'demo-video.mp4',
      url: '/videos/demo-video.mp4',
      size: 5678901,
      createdAt: '2024-01-13',
    },
  ]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const filteredItems = mediaItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleUpload = async (files: File[]) => {
    if (!onUpload) return;
    setIsUploading(true);
    try {
      const newItems = await onUpload(files);
      setMediaItems((prev) => [...newItems, ...prev]);
      setShowUploadModal(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelect = (item: MediaItem) => {
    if (!multiple) {
      setSelectedItems(new Set([item.id]));
      onSelect?.([item]);
      return;
    }

    const newSelected = new Set(selectedItems);
    if (newSelected.has(item.id)) {
      newSelected.delete(item.id);
    } else {
      if (maxSelection && newSelected.size >= maxSelection) {
        return;
      }
      newSelected.add(item.id);
    }
    setSelectedItems(newSelected);

    const selected = mediaItems.filter((i) => newSelected.has(i.id));
    onSelect?.(selected);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsUploading(true);
    try {
      await onDelete(Array.from(selectedItems));
      setMediaItems((prev) => prev.filter((i) => !selectedItems.has(i.id)));
      setSelectedItems(new Set());
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (type: MediaItem['type']) => {
    switch (type) {
      case 'image':
        return ImageIcon;
      case 'video':
        return Video;
      case 'audio':
        return Music;
      default:
        return File;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* 工具栏 */}
      <Card variant="glass" className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {/* 搜索 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索媒体..."
                className="pl-10 w-64"
              />
            </div>

            {/* 视图切换 */}
            <div className="flex border border-cyber-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid'
                    ? 'bg-cyber-cyan/20 text-cyber-cyan'
                    : 'hover:bg-cyber-muted'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list'
                    ? 'bg-cyber-cyan/20 text-cyber-cyan'
                    : 'hover:bg-cyber-muted'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 批量删除 */}
            {selectedItems.size > 0 && (
              <>
                <Badge variant="outline">{selectedItems.size} 已选择</Badge>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  size="sm"
                  disabled={isUploading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除
                </Button>
              </>
            )}

            {/* 上传按钮 */}
            <Button
              onClick={() => setShowUploadModal(true)}
              className="cyber-button"
            >
              <Upload className="w-4 h-4 mr-2" />
              上传文件
            </Button>
          </div>
        </div>
      </Card>

      {/* 媒体网格/列表 */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
            : 'space-y-2'
        }
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <AnimatePresence>
          {filteredItems.map((item) => {
            const isSelected = selectedItems.has(item.id);
            const Icon = getFileIcon(item.type);

            if (viewMode === 'grid') {
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  onClick={() => handleSelect(item)}
                  className="relative group cursor-pointer"
                >
                  <Card
                    className={`overflow-hidden transition-all ${
                      isSelected
                        ? 'ring-2 ring-cyber-cyan'
                        : 'hover:ring-2 hover:ring-cyber-cyan/50'
                    }`}
                  >
                    {/* 媒体预览 */}
                    <div className="aspect-square bg-cyber-muted relative">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon className="w-12 h-12 text-gray-600" />
                        </div>
                      )}

                      {/* 选择标记 */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-cyber-cyan rounded-full p-1">
                          <Check className="w-4 h-4 text-cyber-dark" />
                        </div>
                      )}

                      {/* 悬停覆盖层 */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Download className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* 信息 */}
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(item.size)}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            } else {
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => handleSelect(item)}
                  className="cursor-pointer"
                >
                  <Card
                    className={`p-4 transition-all ${
                      isSelected
                        ? 'ring-2 ring-cyber-cyan'
                        : 'hover:ring-2 hover:ring-cyber-cyan/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyber-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(item.size)} · {item.createdAt}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-cyber-cyan" />
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            }
          })}
        </AnimatePresence>
      </div>

      {/* 上传模态框 */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-cyber-card rounded-lg p-6 max-w-lg w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold">上传文件</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 hover:bg-cyber-muted rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleUpload(Array.from(e.dataTransfer.files));
                    setShowUploadModal(false);
                  }
                }}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-cyber-cyan bg-cyber-cyan/10'
                    : 'border-cyber-border hover:border-cyber-cyan/50'
                }`}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-cyber-cyan" />
                <p className="text-lg mb-2">拖放文件到这里</p>
                <p className="text-sm text-gray-400 mb-4">或者</p>
                <label className="inline-block">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleUpload(Array.from(e.target.files));
                        setShowUploadModal(false);
                      }
                    }}
                  />
                  <span className="cyber-button cursor-pointer">选择文件</span>
                </label>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 拖放提示 */}
      {dragActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-cyber-cyan/10 border-4 border-cyber-cyan border-dashed z-40 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-cyber-card px-8 py-4 rounded-lg">
            <p className="text-xl font-display font-bold text-cyber-cyan">
              释放以上传文件
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default MediaManager;
