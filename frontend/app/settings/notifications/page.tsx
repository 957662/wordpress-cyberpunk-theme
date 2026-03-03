import { NotificationSettings } from '@/components/notifications';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '通知设置',
  description: '管理你的通知偏好设置',
};

export default function NotificationSettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <NotificationSettings />
      </div>
    </div>
  );
}
