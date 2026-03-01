/**
 * 关于页面模板
 */

import { PageHeader } from '@/components/layout';
import { InfoIcon } from '@/components/icons';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="关于我们"
        description="了解更多关于我们的信息"
        icon={<InfoIcon className="w-8 h-8" />}
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-cyber-card border border-cyber-border rounded-lg p-8">
          {/* TODO: 实现关于页面内容 */}
          <div className="text-center text-cyber-muted">
            正在建设中...
          </div>
        </div>
      </div>
    </div>
  );
}
