import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '通知中心',
  description: '查看所有通知',
};

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-cyber-cyan">通知中心</h1>
        <div className="rounded-lg border border-cyber-purple/20 bg-cyber-muted/5 p-12 text-center">
          <p className="text-cyber-muted">通知内容将在这里显示</p>
        </div>
      </div>
    </div>
  );
}
