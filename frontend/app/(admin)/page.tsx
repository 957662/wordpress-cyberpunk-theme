/**
 * 管理后台首页 - 仪表盘
 */

'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { usePosts, useComments } from '@/lib/wordpress/queries';
import {
  FileText,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  Eye,
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: postsData } = usePosts({ per_page: 5 });
  const { data: commentsData } = useComments();

  // 统计数据
  const stats = [
    {
      name: '总文章数',
      value: '128',
      change: '+12%',
      icon: FileText,
      color: 'text-cyber-cyan',
    },
    {
      name: '总页面数',
      value: '24',
      change: '+3%',
      icon: FileText,
      color: 'text-cyber-purple',
    },
    {
      name: '评论数',
      value: '1,234',
      change: '+18%',
      icon: MessageSquare,
      color: 'text-cyber-pink',
    },
    {
      name: '用户数',
      value: '856',
      change: '+8%',
      icon: Users,
      color: 'text-cyber-green',
    },
  ];

  // 文章列表列
  const postColumns = [
    {
      key: 'title',
      title: '标题',
      render: (value: any, record: any) => (
        <div>
          <div className="font-medium text-gray-200">{value}</div>
          <div className="text-sm text-gray-500">{record.slug}</div>
        </div>
      ),
    },
    {
      key: 'status',
      title: '状态',
      render: (value: string) => {
        const statusMap: Record<string, { text: string; class: string }> = {
          publish: { text: '已发布', class: 'text-cyber-green' },
          draft: { text: '草稿', class: 'text-cyber-yellow' },
          pending: { text: '待审核', class: 'text-cyber-pink' },
        };
        const status = statusMap[value] || { text: value, class: 'text-gray-400' };
        return <span className={status.class}>{status.text}</span>;
      },
    },
    {
      key: 'date',
      title: '发布日期',
      render: (value: string) => new Date(value).toLocaleDateString('zh-CN'),
    },
    {
      key: 'actions',
      title: '操作',
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            编辑
          </Button>
          <Button size="sm" variant="ghost">
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-200">仪表盘</h1>
        <Button>新建文章</Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.name}
            className="p-6 border-cyber-cyan/30 bg-cyber-dark/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-200 mt-2">{stat.value}</p>
                <p className="text-sm text-cyber-green mt-2">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg bg-cyber-cyan/10 ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 最新文章 */}
        <Card
          className="border-cyber-cyan/30 bg-cyber-dark/50"
          title="最新文章"
        >
          <Table
            columns={postColumns}
            data={postsData?.data || []}
            pagination={undefined}
          />
          <div className="mt-4 pt-4 border-t border-cyber-cyan/30">
            <Button variant="outline" className="w-full">
              查看全部文章
            </Button>
          </div>
        </Card>

        {/* 最新评论 */}
        <Card
          className="border-cyber-cyan/30 bg-cyber-dark/50"
          title="最新评论"
        >
          <div className="space-y-4">
            {[
              {
                author: '张三',
                content: '这是一篇很棒的文章！',
                post: '如何使用 Next.js',
                date: '2 小时前',
              },
              {
                author: '李四',
                content: '非常有用的教程，感谢分享！',
                post: 'React Hooks 最佳实践',
                date: '5 小时前',
              },
              {
                author: '王五',
                content: '期待更多这样的内容。',
                post: 'TypeScript 高级技巧',
                date: '1 天前',
              },
            ].map((comment, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-cyber-cyan/20 hover:border-cyber-cyan/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-200">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        评论于《{comment.post}》
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{comment.content}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {comment.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-cyber-cyan/30">
            <Button variant="outline" className="w-full">
              查看全部评论
            </Button>
          </div>
        </Card>
      </div>

      {/* 快速操作 */}
      <Card className="border-cyber-cyan/30 bg-cyber-dark/50" title="快速操作">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: '新建文章', icon: '📝', href: '/admin/posts/new' },
            { name: '新建页面', icon: '📄', href: '/admin/pages/new' },
            { name: '上传媒体', icon: '🖼️', href: '/admin/media/upload' },
            { name: '管理用户', icon: '👥', href: '/admin/users' },
          ].map((action) => (
            <a
              key={action.name}
              href={action.href}
              className="flex flex-col items-center gap-2 p-6 rounded-lg border border-cyber-cyan/30 hover:border-cyber-cyan hover:bg-cyber-cyan/10 transition-all cursor-pointer group"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <span className="text-sm font-medium text-gray-300 group-hover:text-cyber-cyan">
                {action.name}
              </span>
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
