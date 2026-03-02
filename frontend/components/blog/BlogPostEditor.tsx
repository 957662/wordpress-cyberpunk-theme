/**
 * Blog Post Editor Component
 * 博客文章编辑器组件
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Save,
  Send,
  Eye,
  Image as ImageIcon,
  Tag,
  FolderOpen,
  Settings,
  Sparkles,
} from 'lucide-react';
import { cyberpressApi } from '@/lib/api';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

export default function BlogPostEditor({ postId }: { postId?: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // 文章数据
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    category_id: '',
    tags: [] as number[],
  });

  // 可选数据
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchCategories();
    fetchTags();
    if (postId) {
      fetchPost(postId);
    }
  }, [postId]);

  const fetchCategories = async () => {
    try {
      const data = await cyberpressApi.categories.list();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const data = await cyberpressApi.tags.list();
      setTags(data.data || []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const fetchPost = async (id: number) => {
    setLoading(true);
    try {
      const data = await cyberpressApi.posts.byId(id);
      setPostData({
        title: data.title || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        status: data.status || 'draft',
        category_id: data.category_id?.toString() || '',
        tags: data.tags?.map((t: Tag) => t.id) || [],
      });
      setSelectedTags(new Set(data.tags?.map((t: Tag) => t.id) || []));
    } catch (error) {
      toast.error('加载文章失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (status: string = 'draft') => {
    setSaving(true);
    try {
      const payload = {
        ...postData,
        status,
        category_id: postData.category_id ? parseInt(postData.category_id) : null,
        tags: Array.from(selectedTags),
      };

      if (postId) {
        await cyberpressApi.posts.update(postId, payload);
        toast.success('文章更新成功');
      } else {
        const result = await cyberpressApi.posts.create(payload);
        toast.success('文章创建成功');
        router.push(`/admin/posts/${result.data.id}/edit`);
      }
    } catch (error) {
      toast.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleTagToggle = (tagId: number) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tagId)) {
      newTags.delete(tagId);
    } else {
      newTags.add(tagId);
    }
    setSelectedTags(newTags);
  };

  const handleAIAssist = async () => {
    // AI 辅助写作功能
    toast.success('AI 辅助功能开发中...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {postId ? '编辑文章' : '创建新文章'}
            </h1>
            <p className="text-gray-400">
              {postId ? '修改文章内容和设置' : '撰写并发布您的文章'}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              预览
            </Button>
            <Button
              onClick={() => handleSave('draft')}
              disabled={saving}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? '保存中...' : '保存草稿'}
            </Button>
            <Button
              onClick={() => handleSave('published')}
              disabled={saving}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Send className="w-4 h-4 mr-2" />
              {saving ? '发布中...' : '发布文章'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主编辑区 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 标题输入 */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <Input
                  placeholder="文章标题..."
                  value={postData.title}
                  onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                  className="text-3xl font-bold bg-transparent border-none focus-visible:ring-0 text-white placeholder-gray-500 px-0"
                />
              </CardContent>
            </Card>

            {/* 内容编辑器 */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                {previewMode ? (
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: postData.content }}
                  />
                ) : (
                  <Textarea
                    placeholder="开始撰写您的内容..."
                    value={postData.content}
                    onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                    rows={20}
                    className="bg-transparent border-none focus-visible:ring-0 text-white placeholder-gray-500 resize-none"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 发布设置 */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  发布设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300 mb-2 block">状态</Label>
                  <select
                    value={postData.status}
                    onChange={(e) => setPostData({ ...postData, status: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="draft">草稿</option>
                    <option value="published">已发布</option>
                    <option value="pending">待审核</option>
                  </select>
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">分类</Label>
                  <select
                    value={postData.category_id}
                    onChange={(e) => setPostData({ ...postData, category_id: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="">选择分类</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    标签
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleTagToggle(tag.id)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedTags.has(tag.id)
                            ? 'bg-cyan-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 摘要 */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">文章摘要</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="简短描述文章内容..."
                  value={postData.excerpt}
                  onChange={(e) => setPostData({ ...postData, excerpt: e.target.value })}
                  rows={4}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {postData.excerpt.length}/200 字符
                </p>
              </CardContent>
            </Card>

            {/* AI 辅助 */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI 写作助手
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">
                  使用 AI 帮助您优化内容、生成摘要、校对语法等
                </p>
                <Button
                  onClick={handleAIAssist}
                  variant="outline"
                  className="w-full border-purple-500 text-white hover:bg-purple-600/20"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  开始 AI 辅助
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
