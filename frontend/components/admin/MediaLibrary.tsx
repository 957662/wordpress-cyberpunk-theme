/**
 * 媒体库组件
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid, List, Upload, Trash2, Edit } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface MediaItem {
  id: number;
  title: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: number;
  date: string;
}

export function MediaLibrary() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // 模拟数据
  const mediaItems: MediaItem[] = [
    {
      id: 1,
      title: 'featured-image-1.jpg',
      url: '/placeholder-image.jpg',
      type: 'image',
      size: 245800,
      date: '2024-03-01',
    },
    {
      id: 2,
      title: 'blog-post-banner.png',
      url: '/placeholder-image.jpg',
      type: 'image',
      size: 512000,
      date: '2024-03-02',
    },
    {
      id: 3,
      title: 'product-demo.mp4',
      url: '/placeholder-video.jpg',
      type: 'video',
      size: 15728640,
      date: '2024-03-03',
    },
  ];

  const filteredItems = mediaItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item.id));
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* 搜索 */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="搜索媒体..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 视图切换 */}
          <div className="flex border border-cyber-cyan/30 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-cyber-cyan/20 text-cyber-cyan'
                  : 'hover:bg-cyber-cyan/10'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-cyber-cyan/20 text-cyber-cyan'
                  : 'hover:bg-cyber-cyan/10'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedItems.length > 0 && (
            <>
              <Badge variant="default">{selectedItems.length} 已选</Badge>
              <Button size="sm" variant="danger">
                <Trash2 className="w-4 h-4 mr-2" />
                删除
              </Button>
            </>
          )}
          <Button size="sm" onClick={() => setUploadModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            上传
          </Button>
        </div>
      </div>

      {/* 媒体列表 */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setSelectedMedia(item);
                setDetailModalOpen(true);
              }}
              className={`relative group cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${
                selectedItems.includes(item.id)
                  ? 'border-cyber-cyan'
                  : 'border-cyber-cyan/30 hover:border-cyber-cyan'
              }`}
            >
              {/* 选择框 */}
              <div
                className="absolute top-2 left-2 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelect(item.id);
                }}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedItems.includes(item.id)
                      ? 'bg-cyber-cyan border-cyber-cyan'
                      : 'border-white/50 bg-black/30'
                  }`}
                >
                  {selectedItems.includes(item.id) && (
                    <div className="w-3 h-3 rounded-sm bg-white" />
                  )}
                </div>
              </div>

              {/* 预览 */}
              <div className="aspect-square bg-cyber-dark/50 flex items-center justify-center">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-4xl">{item.type === 'video' ? '🎬' : '🎵'}</div>
                )}
              </div>

              {/* 信息覆盖 */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <div className="text-white">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs opacity-70">{formatFileSize(item.size)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="border-cyber-cyan/30 bg-cyber-dark/50">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyber-cyan/30">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredItems.length}
                    onChange={toggleSelectAll}
                    className="rounded border-cyber-cyan/30"
                  />
                </th>
                <th className="px-4 py-3 text-left text-gray-400">文件名</th>
                <th className="px-4 py-3 text-left text-gray-400">类型</th>
                <th className="px-4 py-3 text-left text-gray-400">大小</th>
                <th className="px-4 py-3 text-left text-gray-400">日期</th>
                <th className="px-4 py-3 text-left text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-cyber-cyan/20 hover:bg-cyber-cyan/5 transition-colors ${
                    selectedItems.includes(item.id) ? 'bg-cyber-cyan/10' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="rounded border-cyber-cyan/30"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.type === 'image' && (
                        <img src={item.url} alt="" className="w-10 h-10 rounded object-cover" />
                      )}
                      <span className="text-gray-200">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{item.type}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {formatFileSize(item.size)}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{item.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* 上传模态框 */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="上传文件"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-cyber-cyan/30 rounded-lg p-12 text-center">
            <Upload className="w-12 h-12 text-cyber-cyan mx-auto mb-4" />
            <p className="text-gray-300 mb-2">拖拽文件到此处或点击选择</p>
            <p className="text-sm text-gray-500">
              支持 JPG, PNG, GIF, MP4, MP3 等格式
            </p>
          </div>
          <Button className="w-full">选择文件</Button>
        </div>
      </Modal>

      {/* 详情模态框 */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={selectedMedia?.title || '媒体详情'}
      >
        {selectedMedia && (
          <div className="space-y-4">
            <div className="aspect-video bg-cyber-dark/50 rounded-lg flex items-center justify-center">
              {selectedMedia.type === 'image' ? (
                <img src={selectedMedia.url} alt="" className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="text-6xl">
                  {selectedMedia.type === 'video' ? '🎬' : '🎵'}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">文件名：</span>
                <span className="text-gray-200 ml-2">{selectedMedia.title}</span>
              </div>
              <div>
                <span className="text-gray-400">类型：</span>
                <span className="text-gray-200 ml-2">{selectedMedia.type}</span>
              </div>
              <div>
                <span className="text-gray-400">大小：</span>
                <span className="text-gray-200 ml-2">
                  {formatFileSize(selectedMedia.size)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">日期：</span>
                <span className="text-gray-200 ml-2">{selectedMedia.date}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">
                <Edit className="w-4 h-4 mr-2" />
                编辑
              </Button>
              <Button variant="outline" className="flex-1">
                删除
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default MediaLibrary;
