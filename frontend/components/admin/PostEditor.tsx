/**
 * 文章编辑器组件
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Eye, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CodeBlock } from '@/components/ui/CodeBlock';

// 表单验证 Schema
const postSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  slug: z.string().min(1, '链接不能为空'),
  content: z.string().min(1, '内容不能为空'),
  excerpt: z.string().optional(),
  categories: z.array(z.number()).optional(),
  tags: z.array(z.number()).optional(),
  featured_media: z.number().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostEditorProps {
  initialData?: Partial<PostFormData>;
  onSave?: (data: PostFormData) => Promise<void>;
  categories?: { id: number; name: string }[];
  tags?: { id: number; name: string }[];
}

export function PostEditor({
  initialData,
  onSave,
  categories = [],
  tags = [],
}: PostEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: initialData,
  });

  const content = watch('content', '');

  const handleSave = async (data: PostFormData) => {
    setIsSaving(true);
    try {
      await onSave?.(data);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? '编辑' : '预览'}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 主编辑区 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 标题 */}
          <Card className="p-6 border-cyber-cyan/30 bg-cyber-dark/50">
            <Input
              label="文章标题"
              placeholder="请输入文章标题"
              error={errors.title?.message}
              {...register('title')}
              className="text-2xl font-bold"
            />
          </Card>

          {/* 链接 */}
          <Card className="p-6 border-cyber-cyan/30 bg-cyber-dark/50">
            <Input
              label="永久链接"
              placeholder="post-slug"
              error={errors.slug?.message}
              {...register('slug')}
              prefix="/blog/"
            />
          </Card>

          {/* 内容 */}
          {previewMode ? (
            <Card className="p-6 border-cyber-cyan/30 bg-cyber-dark/50">
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </Card>
          ) : (
            <Card className="p-6 border-cyber-cyan/30 bg-cyber-dark/50">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                文章内容
              </label>
              <textarea
                {...register('content')}
                rows={20}
                className={cn(
                  'w-full px-4 py-3 rounded-lg border transition-all',
                  'bg-cyber-dark/50 font-mono text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
                  errors.content
                    ? 'border-cyber-pink'
                    : 'border-cyber-cyan/30 focus:border-cyber-cyan'
                )}
                placeholder="支持 Markdown 格式..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-cyber-pink">
                  {errors.content.message}
                </p>
              )}
            </Card>
          )}

          {/* 摘要 */}
          <Card className="p-6 border-cyber-cyan/30 bg-cyber-dark/50">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              文章摘要（可选）
            </label>
            <textarea
              {...register('excerpt')}
              rows={3}
              className={cn(
                'w-full px-4 py-3 rounded-lg border transition-all',
                'bg-cyber-dark/50 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
                'border-cyber-cyan/30 focus:border-cyber-cyan'
              )}
              placeholder="简短描述文章内容..."
            />
          </Card>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 发布设置 */}
          <Card className="p-6 border-cyber-cyan/30 bg-cyber-dark/50" title="发布设置">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  状态
                </label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-cyber-cyan/30 bg-cyber-dark/50 text-gray-200"
                >
                  <option value="draft">草稿</option>
                  <option value="publish">已发布</option>
                  <option value="pending">待审核</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  发布时间
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 rounded-lg border border-cyber-cyan/30 bg-cyber-dark/50 text-gray-200"
                />
              </div>
            </div>
          </Card>

          {/* 分类 */}
          <Card className="p-6 border-cyber-cyan/30 bg-cyber-dark/50" title="分类">
            <div className="space-y-2">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={cat.id}
                    className="rounded border-cyber-cyan/30 bg-cyber-dark/50"
                  />
                  <span className="text-gray-300">{cat.name}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* 标签 */}
          <Card className="p-6 border-cyber-cyan/30 bg-cyber-dark/50" title="标签">
            <input
              type="text"
              placeholder="输入标签，按回车添加"
              className="w-full px-4 py-2 rounded-lg border border-cyber-cyan/30 bg-cyber-dark/50 text-gray-200"
            />
          </Card>

          {/* 特色图片 */}
          <Card className="p-6 border-cyber-cyan/30 bg-cyber-dark/50" title="特色图片">
            <div className="border-2 border-dashed border-cyber-cyan/30 rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-cyber-cyan mx-auto mb-2" />
              <p className="text-sm text-gray-400 mb-2">
                拖拽图片到此处或点击上传
              </p>
              <Button size="sm" variant="outline">
                选择文件
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}

// 导入 cn 工具
import { cn } from '@/lib/utils';

export default PostEditor;
