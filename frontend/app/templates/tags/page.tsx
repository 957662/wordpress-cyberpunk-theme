/**
 * 标签页面模板
 * 展示所有标签和对应文章
 */

import { PageHeader } from '@/components/layout';
import { TagIcon } from '@/components/icons';

export default function TagsPage() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="标签云"
        description="浏览所有标签"
        icon={<TagIcon className="w-8 h-8" />}
      />

      <div className="container mx-auto px-4 py-12">
        {/* TODO: 实现标签云逻辑 */}
        <div className="text-center text-cyber-muted">
          正在建设中...
        </div>
      </div>
    </div>
  );
}
