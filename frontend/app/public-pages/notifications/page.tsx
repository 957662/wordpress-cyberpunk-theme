import { Metadata } from 'next';
import { NotificationCenter } from '@/components/notifications';

export const metadata: Metadata = {
  title: 'Notifications - CyberPress',
  description: 'View your notifications and stay updated with the latest activity.',
};

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <div className="border-b border-cyber-cyan/20 bg-cyber-dark/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-gray-400">Stay updated with your latest activity</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-cyber-dark/50 backdrop-blur-sm border border-cyber-cyan/30 rounded-xl p-8">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Notifications Center</h2>
              <p className="text-gray-400 mb-6">
                Use the notification bell in the header to view your notifications
              </p>
            </div>

            {/* Info Section */}
            <div className="mt-12 p-6 bg-cyber-cyan/5 border border-cyber-cyan/20 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">About Notifications</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan mt-1">•</span>
                  <span>Get notified when someone comments on your posts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan mt-1">•</span>
                  <span>Receive alerts for new followers and likes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan mt-1">•</span>
                  <span>Stay updated with mentions and system updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan mt-1">•</span>
                  <span>Customize your notification preferences in settings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
