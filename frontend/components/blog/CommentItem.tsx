'use client';

import React from 'react';
import { User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';

export interface CommentItemProps {
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  className?: string;
}

export function CommentItem({ author, content, createdAt, className }: CommentItemProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;

    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className={cn('flex gap-3 p-4 bg-cyber-dark/50 rounded-lg', className)}>
      <Avatar
        src={author.avatar}
        alt={author.name}
        className="w-10 h-10 border-2 border-cyber-cyan/50 flex-shrink-0"
        fallback={<User className="w-5 h-5" />}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-bold text-cyber-cyan">{author.name}</h4>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {formatTime(createdAt)}
          </div>
        </div>

        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
  );
}
