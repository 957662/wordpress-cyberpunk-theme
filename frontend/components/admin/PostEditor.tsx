'use client';

import React, { useState } from 'react';
import { Save, Eye, ImageIcon, Settings, X } from 'lucide-react';
import { CyberInput } from '../cyber/cyber-input';
import { CyberButton } from '../cyber/cyber-button';
import { CyberCard } from '../cyber/CyberCard';

interface Post {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'publish';
  category: string;
  tags: string[];
}

export function PostEditor() {
  const [post, setPost] = useState<Post>({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    category: '',
    tags: [],
  });

  const handleSave = async (status: Post['status']) => {
    console.log('Saving post:', { ...post, status });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-cyber-cyan">编辑文章</h1>
        <div className="flex space-x-2">
          <CyberButton onClick={() => handleSave('draft')} variant="outline">
            保存草稿
          </CyberButton>
          <CyberButton onClick={() => handleSave('publish')}>
            发布
          </CyberButton>
        </div>
      </div>

      <CyberCard className="p-6">
        <CyberInput
          placeholder="文章标题..."
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          className="text-2xl font-bold mb-4"
        />
        <textarea
          className="cyber-textarea w-full min-h-[400px]"
          placeholder="开始写作..."
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
        />
      </CyberCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CyberCard className="p-6">
          <h3 className="text-lg font-bold text-cyber-cyan mb-4">分类</h3>
          <CyberInput
            placeholder="文章分类..."
            value={post.category}
            onChange={(e) => setPost({ ...post, category: e.target.value })}
          />
        </CyberCard>

        <CyberCard className="p-6">
          <h3 className="text-lg font-bold text-cyber-cyan mb-4">标签</h3>
          <CyberInput
            placeholder="标签，用逗号分隔..."
            value={post.tags.join(', ')}
            onChange={(e) =>
              setPost({
                ...post,
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean),
              })
            }
          />
        </CyberCard>
      </div>
    </div>
  );
}
