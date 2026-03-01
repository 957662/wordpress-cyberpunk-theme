/**
 * 归档页面模板
 * 展示所有文章的归档页面
 */

import { BlogCard } from '@/components/blog';
import { PageHeader } from '@/components/layout';
import { CalendarIcon } from '@/components/icons';

export default function ArchivePage() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="文章归档"
        description="所有文章按时间归档"
        icon={<CalendarIcon className="w-8 h-8" />}
      />

      <div className="container mx-auto px-4 py-12">
        {/* TODO: 实现归档逻辑 */}
        <div className="text-center text-cyber-muted">
          正在建设中...
        </div>
      </div>
    </div>
  );
}
