'use client';

import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import {
  Search,
  Upload,
  Grid,
  List,
  Image as ImageIcon,
  Film,
  Music,
  FileText,
  Archive,
  Trash2,
  Download,
  Eye,
  Edit2,
  Folder,
  X,
  Check,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { toast } from 'react-hot-toast';

interface MediaItem {
  id: string;
  title: string;
  filename: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  description?: string;
  uploaded: string;
  modified: string;
  author: {
    id: string;
    name: string;
  };
}

interface MediaFolder {
  id: string;
  name: string;
  count: number;
}

const typeIcons = {
  image: ImageIcon,
  video: Film,
  audio: Music,
  document: FileText,
  other: Archive,
};

const typeColors = {
  image: 'text-cyber-cyan',
  video: 'text-cyber-purple',
  audio: 'text-cyber-pink',
  document: 'text-cyber-yellow',
  other: 'text-gray-400',
};

export default function MediaLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const queryClient = useQueryClient();

  const { data: mediaItems, isLoading } = useQuery<MediaItem[]>({
    queryKey: ['admin', 'media', selectedType, selectedFolder, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(selectedType !== 'all' && { type: selectedType }),
        ...(selectedFolder && { folder: selectedFolder }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await apiClient.get(`/admin/media?${params}`);
      return response.data;
    },
  });

  const { data: folders } = useQuery<MediaFolder[]>({
    queryKey: ['admin', 'media', 'folders'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/media/folders');
      return response.data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const response = await apiClient.post('/admin/media/upload', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            files.forEach(file => {
              setUploadProgress(prev => ({ ...prev, [file.name]: percentCompleted }));
            });
          }
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('文件上传成功');
      queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
      setUploadProgress({});
    },
    onError: () => {
      toast.error('上传失败');
      setUploadProgress({});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (itemIds: string[]) => {
      await Promise.all(itemIds.map(id => apiClient.delete(`/admin/media/${id}`)));
    },
    onSuccess: () => {
      toast.success('删除成功');
      setSelectedItems(new Set());
      queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
    },
  });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadMutation.mutate(files);
    }
  }, [uploadMutation]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      uploadMutation.mutate(files);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (item: MediaItem) => {
    const Icon = typeIcons[item.type] || typeIcons.other;
    return <Icon className={`w-8 h-8 ${typeColors[item.type]}`} />;
  };

  return (
    <div className="min-h-screen bg-cyber-dark p-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-glow-cyan text-cyber-cyan mb-2">
            媒体库
          </h1>
          <p className="text-gray-400">管理您的图片、视频和其他媒体文件</p>
        </div>

        <div className="flex gap-3">
          <label className="px-6 py-2 rounded-lg bg-cyber-cyan text-cyber-dark font-medium hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            上传文件
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      </motion.div>

      {/* 拖放上传区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`cyber-card p-8 rounded-lg mb-6 border-2 border-dashed transition-all ${
          isDragging
            ? 'border-cyber-cyan bg-cyber-cyan/5'
            : 'border-gray-700 hover:border-gray-600'
        }`}
      >
        <div className="text-center">
          <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-cyber-cyan' : 'text-gray-600'}`} />
          <p className="text-lg text-white mb-2">
            {isDragging ? '释放以上传文件' : '拖放文件到这里上传'}
          </p>
          <p className="text-sm text-gray-500">或点击上方按钮选择文件</p>
          <p className="text-xs text-gray-600 mt-2">支持: 图片、视频、音频、PDF、文档</p>
        </div>

        {/* 上传进度 */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="mt-6 space-y-3">
            {Object.entries(uploadProgress).map(([filename, progress]) => (
              <div key={filename} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{filename}</span>
                    <span className="text-cyber-cyan">{progress}%</span>
                  </div>
                  <div className="w-full bg-cyber-dark rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                      className="bg-cyber-cyan h-2 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* 工具栏 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="cyber-card p-6 rounded-lg mb-6"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-1">
            {/* 搜索 */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="搜索媒体文件..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-cyber-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan outline-none transition-all"
              />
            </div>

            {/* 类型筛选 */}
            <div className="flex gap-2 flex-wrap">
              {(['all', 'image', 'video', 'audio', 'document'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedType === type
                      ? 'bg-cyber-cyan text-cyber-dark'
                      : 'bg-cyber-muted text-gray-400 hover:bg-cyber-muted/80'
                  }`}
                >
                  {type === 'all' ? '全部' : type === 'image' ? '图片' : type === 'video' ? '视频' : type === 'audio' ? '音频' : '文档'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 items-center">
            {/* 文件夹 */}
            <select
              value={selectedFolder || 'all'}
              onChange={(e) => setSelectedFolder(e.target.value === 'all' ? null : e.target.value)}
              className="px-4 py-2 bg-cyber-dark border border-gray-700 rounded-lg text-white focus:border-cyber-cyan outline-none"
            >
              <option value="all">所有文件夹</option>
              {folders?.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  📁 {folder.name} ({folder.count})
                </option>
              ))}
            </select>

            {/* 视图切换 */}
            <div className="flex gap-2 bg-cyber-dark rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'grid'
                    ? 'bg-cyber-cyan text-cyber-dark'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'list'
                    ? 'bg-cyber-cyan text-cyber-dark'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 批量操作 */}
        {selectedItems.size > 0 && (
          <div className="mt-4 flex items-center gap-4 p-3 bg-cyber-cyan/10 rounded-lg border border-cyber-cyan/30">
            <span className="text-sm text-cyber-cyan">
              已选择 {selectedItems.size} 个文件
            </span>
            <button
              onClick={() => {
                if (confirm(`确定要删除选中的 ${selectedItems.size} 个文件吗？`)) {
                  deleteMutation.mutate(Array.from(selectedItems));
                }
              }}
              className="px-4 py-2 rounded bg-cyber-pink text-white hover:bg-cyber-pink/80 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              删除
            </button>
            <button
              onClick={() => setSelectedItems(new Set())}
              className="text-sm text-gray-400 hover:text-white transition-all"
            >
              取消选择
            </button>
          </div>
        )}
      </motion.div>

      {/* 媒体列表 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-cyan"></div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaItems?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`cyber-card rounded-lg overflow-hidden group cursor-pointer transition-all ${
                selectedItems.has(item.id) ? 'ring-2 ring-cyber-cyan' : ''
              }`}
              onClick={() => {
                if (!selectedItems.has(item.id)) {
                  setPreviewItem(item);
                }
              }}
            >
              <div className="relative aspect-square bg-cyber-muted">
                {/* 选中复选框 */}
                <div
                  className="absolute top-2 left-2 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItemSelection(item.id);
                  }}
                >
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    selectedItems.has(item.id)
                      ? 'bg-cyber-cyan border-cyber-cyan'
                      : 'bg-black/50 border-gray-400'
                  }`}>
                    {selectedItems.has(item.id) && <Check className="w-4 h-4 text-cyber-dark" />}
                  </div>
                </div>

                {/* 预览图片 */}
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.alt || item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getFileIcon(item)}
                  </div>
                )}

                {/* 悬停操作 */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewItem(item);
                    }}
                    className="p-2 rounded bg-cyber-cyan text-cyber-dark hover:scale-110 transition-all"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItemSelection(item.id);
                    }}
                    className="p-2 rounded bg-cyber-purple text-white hover:scale-110 transition-all"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>

                {/* 类型标签 */}
                <div className="absolute bottom-2 right-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.type === 'image' ? 'bg-cyber-cyan/80' :
                    item.type === 'video' ? 'bg-cyber-purple/80' :
                    item.type === 'audio' ? 'bg-cyber-pink/80' :
                    'bg-cyber-yellow/80'
                  } text-white`}>
                    {item.type === 'image' ? '图片' : item.type === 'video' ? '视频' : item.type === 'audio' ? '音频' : '文档'}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <p className="text-sm text-white line-clamp-1 mb-1">{item.title}</p>
                <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="cyber-card rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-cyber-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">文件</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">类型</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">大小</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">尺寸</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">作者</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">上传日期</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {mediaItems?.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-cyber-muted/30 transition-all ${
                    selectedItems.has(item.id) ? 'bg-cyber-cyan/10' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="w-4 h-4 rounded border-gray-600 text-cyber-cyan focus:ring-cyber-cyan"
                      />
                      {item.type === 'image' ? (
                        <img src={item.url} alt={item.title} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center">
                          {getFileIcon(item)}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium line-clamp-1">{item.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{item.filename}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.type === 'image' ? 'bg-cyber-cyan/20 text-cyber-cyan' :
                      item.type === 'video' ? 'bg-cyber-purple/20 text-cyber-purple' :
                      item.type === 'audio' ? 'bg-cyber-pink/20 text-cyber-pink' :
                      'bg-cyber-yellow/20 text-cyber-yellow'
                    }`}>
                      {item.type === 'image' ? '图片' : item.type === 'video' ? '视频' : item.type === 'audio' ? '音频' : '文档'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{formatFileSize(item.size)}</td>
                  <td className="px-6 py-4 text-gray-300">
                    {item.width && item.height ? `${item.width} × ${item.height}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{item.author.name}</td>
                  <td className="px-6 py-4 text-gray-300">{new Date(item.uploaded).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="p-2 rounded hover:bg-cyber-cyan/20 text-gray-400 hover:text-cyber-cyan transition-all"
                        title="预览"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={item.url}
                        download
                        className="p-2 rounded hover:bg-cyber-green/20 text-gray-400 hover:text-cyber-green transition-all"
                        title="下载"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => {
                          if (confirm('确定要删除这个文件吗？')) {
                            deleteMutation.mutate([item.id]);
                          }
                        }}
                        className="p-2 rounded hover:bg-cyber-pink/20 text-gray-400 hover:text-cyber-pink transition-all"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 预览弹窗 */}
      {previewItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="cyber-card rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{previewItem.title}</h3>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-2 rounded hover:bg-cyber-muted text-gray-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {previewItem.type === 'image' ? (
                <img src={previewItem.url} alt={previewItem.title} className="w-full rounded" />
              ) : (
                <div className="flex items-center justify-center py-20">
                  {getFileIcon(previewItem)}
                </div>
              )}

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">文件名</p>
                  <p className="text-white">{previewItem.filename}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">大小</p>
                    <p className="text-white">{formatFileSize(previewItem.size)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">尺寸</p>
                    <p className="text-white">
                      {previewItem.width && previewItem.height
                        ? `${previewItem.width} × ${previewItem.height}`
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">类型</p>
                    <p className="text-white">{previewItem.mimeType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">上传日期</p>
                    <p className="text-white">{new Date(previewItem.uploaded).toLocaleDateString()}</p>
                  </div>
                </div>
                {previewItem.description && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">描述</p>
                    <p className="text-white">{previewItem.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
              <a
                href={previewItem.url}
                download
                className="px-4 py-2 rounded bg-cyber-green text-cyber-dark hover:bg-cyber-green/80 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                下载
              </a>
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 rounded bg-cyber-muted text-gray-300 hover:bg-cyber-muted/80 transition-all"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
