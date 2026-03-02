'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { CyberCard } from '@/components/ui/CyberCard';
import { Alert } from '@/components/ui/Alert';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Grid,
  List,
  Trash2,
  Download,
  Edit,
  Folder,
  X
} from 'lucide-react';

type MediaType = 'image' | 'video' | 'audio' | 'document';

type MediaItem = {
  id: string;
  type: MediaType;
  title: string;
  url: string;
  thumbnail?: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  alt?: string;
  createdAt: string;
};

export default function AdminMediaPage() {
  const { user } = useAuthStore();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<MediaType | 'all'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredItems = mediaItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          setMediaItems([...mediaItems, ...result.files]);
          setMessage({ type: 'success', text: '文件上传成功' });
          setIsUploading(false);
          setUploadProgress(0);
        }
      });

      xhr.addEventListener('error', () => {
        setMessage({ type: 'error', text: '文件上传失败' });
        setIsUploading(false);
        setUploadProgress(0);
      });

      xhr.open('POST', '/api/admin/media/upload');
      xhr.send(formData);
    } catch (err) {
      setMessage({ type: 'error', text: '文件上传失败' });
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [mediaItems]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('确定要删除这个文件吗？')) return;

    try {
      await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      setMediaItems(mediaItems.filter((item) => item.id !== id));
      setSelectedItems(new Set([...selectedItems].filter((itemId) => itemId !== id)));
      setMessage({ type: 'success', text: '文件已删除' });
    } catch (err) {
      setMessage({ type: 'error', text: '删除失败' });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedItems.size} 个文件吗？`)) return;

    try {
      await fetch('/api/admin/media/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedItems) }),
      });
      setMediaItems(mediaItems.filter((item) => !selectedItems.has(item.id)));
      setSelectedItems(new Set());
      setMessage({ type: 'success', text: '批量删除成功' });
    } catch (err) {
      setMessage({ type: 'error', text: '批量删除失败' });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getTypeIcon = (type: MediaType) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-cyber-cyan" />;
      case 'video':
        return <video className="w-5 h-5 text-cyber-purple" />;
      case 'audio':
        return <audio className="w-5 h-5 text-cyber-pink" />;
      case 'document':
        return <Folder className="w-5 h-5 text-cyber-green" />;
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <p className="text-gray-400">权限不足</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark py-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* 页面标题 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-8 h-8 text-cyber-purple" />
                媒体库
              </h1>
              <p className="text-gray-400 mt-1">管理所有媒体文件</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-cyber-cyan text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-cyber-cyan text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 消息提示 */}
          {message && (
            <Alert
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
            />
          )}

          {/* 上传区域 */}
          <CyberCard
            className="p-8 border-2 border-dashed border-gray-700 hover:border-cyber-cyan transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <input
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-white text-lg mb-2">拖放文件到此处，或点击选择文件</p>
                <p className="text-gray-400 text-sm">支持图片、视频、音频和文档</p>
              </label>
              {isUploading && (
                <div className="mt-4">
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyber-cyan to-cyber-purple h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-2">上传中... {uploadProgress}%</p>
                </div>
              )}
            </div>
          </CyberCard>

          {/* 搜索和过滤 */}
          <CyberCard className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索媒体文件..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
                />
              </div>
              <div className="flex gap-2">
                {(
                  [
                    { value: 'all', label: '全部' },
                    { value: 'image', label: '图片' },
                    { value: 'video', label: '视频' },
                    { value: 'audio', label: '音频' },
                    { value: 'document', label: '文档' },
                  ] as const
                ).map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFilterType(type.value as MediaType | 'all')}
                    className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                      filterType === type.value
                        ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </CyberCard>

          {/* 批量操作 */}
          {selectedItems.size > 0 && (
            <CyberCard className="p-4 border-cyber-cyan">
              <div className="flex items-center justify-between">
                <span className="text-white">已选择 {selectedItems.size} 个文件</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedItems(new Set())}
                    variant="secondary"
                  >
                    取消选择
                  </Button>
                  <Button
                    onClick={handleBulkDelete}
                    variant="danger"
                    className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    批量删除
                  </Button>
                </div>
              </div>
            </CyberCard>
          )}

          {/* 媒体列表 */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredItems.length === 0 ? (
            <CyberCard className="p-12 text-center">
              <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">暂无媒体文件</p>
            </CyberCard>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                  : 'space-y-2'
              }
            >
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <CyberCard
                    className={`overflow-hidden ${
                      selectedItems.has(item.id) ? 'border-cyber-cyan' : ''
                    }`}
                  >
                    {viewMode === 'grid' ? (
                      // 网格视图
                      <div>
                        <div className="relative aspect-square bg-gray-800">
                          {item.type === 'image' ? (
                            <img
                              src={item.thumbnail || item.url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              {getTypeIcon(item.type)}
                            </div>
                          )}
                          {/* 选中复选框 */}
                          <div className="absolute top-2 left-2">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item.id)}
                              onChange={(e) => {
                                const newSelected = new Set(selectedItems);
                                if (e.target.checked) {
                                  newSelected.add(item.id);
                                } else {
                                  newSelected.delete(item.id);
                                }
                                setSelectedItems(newSelected);
                              }}
                              className="w-4 h-4 rounded border-gray-600 bg-gray-700"
                            />
                          </div>
                          {/* 操作按钮 */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="p-1 bg-gray-900/80 hover:bg-gray-800"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteItem(item.id)}
                              size="sm"
                              variant="danger"
                              className="p-1 bg-red-600/80 hover:bg-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-white text-sm truncate">{item.title}</p>
                          <p className="text-gray-400 text-xs mt-1">
                            {formatFileSize(item.size)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      // 列表视图
                      <div className="flex items-center gap-4 p-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedItems);
                            if (e.target.checked) {
                              newSelected.add(item.id);
                            } else {
                              newSelected.delete(item.id);
                            }
                            setSelectedItems(newSelected);
                          }}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700"
                        />
                        <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white truncate">{item.title}</p>
                          <p className="text-gray-400 text-sm">
                            {formatFileSize(item.size)} • {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" className="p-2">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteItem(item.id)}
                            size="sm"
                            variant="ghost"
                            className="p-2 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CyberCard>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
