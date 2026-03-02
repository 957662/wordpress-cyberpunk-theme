'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, User, MessageSquare } from 'lucide-react';
import CyberButton from '@/components/ui/CyberButton';
import CyberCard from '@/components/ui/CyberCard';
import { timeAgo } from '@/lib/utils';

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  avatar?: string;
  replies?: Comment[];
}

const mockComments: Comment[] = [
  {
    id: 1,
    author: 'CyberFan',
    content: '这款游戏确实经历了艰难的起步，但CDPR的坚持令人敬佩。现在的版本已经可以打8分了！',
    date: '2024-03-02T10:30:00',
    replies: [
      {
        id: 2,
        author: 'GameMaster',
        content: '同意！次世代版本的优化真的很棒，光线追踪效果太震撼了。',
        date: '2024-03-02T11:15:00',
      },
    ],
  },
  {
    id: 3,
    author: 'TechReviewer',
    content: '文章分析得很到位。特别是关于角色构建的部分，三种生命路径确实给了玩家很好的代入感。',
    date: '2024-03-02T14:20:00',
  },
  {
    id: 4,
    author: 'NightCityExplorer',
    content: '夜之城的设计简直是艺术品，每个街区都有独特的故事和氛围。强烈推荐大家多探索支线任务！',
    date: '2024-03-02T16:45:00',
  },
];

export default function CommentSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    setSubmitting(true);

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));

    const comment: Comment = {
      id: comments.length + 1,
      author: authorName,
      content: newComment,
      date: new Date().toISOString(),
    };

    setComments([comment, ...comments]);
    setNewComment('');
    setAuthorName('');
    setSubmitting(false);
  };

  return (
    <CyberCard>
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-cyber-cyan" />
          评论 ({comments.length})
        </h2>
        <p className="text-gray-400">分享你的想法和观点</p>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              昵称
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="输入你的昵称"
              className="w-full px-4 py-3 bg-cyber-darker border border-cyber-border rounded-lg focus:border-cyber-cyan focus:outline-none text-white placeholder-gray-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              邮箱（可选）
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-cyber-darker border border-cyber-border rounded-lg focus:border-cyber-cyan focus:outline-none text-white placeholder-gray-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            评论内容
          </label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的评论..."
            rows={4}
            className="w-full px-4 py-3 bg-cyber-darker border border-cyber-border rounded-lg focus:border-cyber-cyan focus:outline-none text-white placeholder-gray-500 resize-none"
            required
          />
        </div>

        <div className="flex justify-end">
          <CyberButton
            type="submit"
            disabled={submitting || !newComment.trim() || !authorName.trim()}
          >
            <Send className="w-4 h-4 mr-2" />
            {submitting ? '发送中...' : '发表评论'}
          </CyberButton>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b border-cyber-border pb-6 last:border-b-0 last:pb-0"
          >
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {comment.author.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Author & Date */}
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-white">
                    {comment.author}
                  </h4>
                  <span className="text-gray-500 text-sm">
                    {timeAgo(comment.date)}
                  </span>
                </div>

                {/* Comment Text */}
                <p className="text-gray-300 leading-relaxed mb-3">
                  {comment.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 text-sm">
                  <button className="text-cyber-cyan hover:underline">
                    回复
                  </button>
                  <button className="text-gray-400 hover:text-cyber-purple">
                    点赞
                  </button>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3 pl-4 border-l-2 border-cyber-cyan/30">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-pink flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {reply.author.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h5 className="font-medium text-white text-sm">
                              {reply.author}
                            </h5>
                            <span className="text-gray-500 text-xs">
                              {timeAgo(reply.date)}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      {comments.length >= 5 && (
        <div className="mt-6 text-center">
          <CyberButton variant="outline" size="sm">
            加载更多评论
          </CyberButton>
        </div>
      )}
    </CyberCard>
  );
}
