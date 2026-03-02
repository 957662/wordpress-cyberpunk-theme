'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '@/components/notifications';
import { NotificationCenter } from '@/components/notifications';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, XCircle, AlertTriangle, Info, Heart, UserPlus, Calendar } from 'lucide-react';

export default function NotificationsExamplePage() {
  const { notifications, show, close, markAllRead, clearAll, unreadCount } = useNotifications({
    defaultDuration: 5000,
    maxNotifications: 5,
  });

  const [notificationCount, setNotificationCount] = useState(0);

  const handleShowNotification = (type: any) => {
    const titles = {
      success: 'Success!',
      error: 'Error!',
      warning: 'Warning!',
      info: 'Info',
      comment: 'New Comment',
      like: 'New Like',
      follow: 'New Follower',
      mention: 'You were mentioned',
      system: 'System Update',
      reminder: 'Reminder',
    };

    const messages = {
      success: 'Your changes have been saved successfully.',
      error: 'Failed to save changes. Please try again.',
      warning: 'Your session will expire in 5 minutes.',
      info: 'New features are available. Check them out!',
      comment: 'John Doe commented on your post.',
      like: 'Jane Smith liked your post.',
      follow: 'Alex Johnson started following you.',
      mention: 'Sarah Wilson mentioned you in a comment.',
      system: 'System maintenance scheduled for tonight.',
      reminder: 'Don\'t forget your meeting at 3 PM.',
    };

    setNotificationCount((prev) => prev + 1);

    show(
      type,
      titles[type as keyof typeof titles],
      `${messages[type as keyof typeof messages]} (Notification #${notificationCount + 1})`,
      {
        action: type === 'success' ? {
          label: 'View Details',
          onClick: () => console.log('Action clicked'),
        } : undefined,
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      {/* Header */}
      <div className="border-b border-cyan-500/20 bg-[#0a0a0f]/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-glow-cyan mb-2">
                Notifications Demo
              </h1>
              <p className="text-gray-400">
                Explore the notification system with various types and actions
              </p>
            </div>

            {/* Notification Center */}
            <NotificationCenter
              notifications={notifications}
              onClose={close}
              onMarkRead={(id) => console.log('Marked as read:', id)}
              onMarkAllRead={markAllRead}
              onClearAll={clearAll}
              colorScheme="cyan"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-lg border-2 border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">Total Notifications</h3>
            <p className="text-4xl font-bold text-cyan-400">{notifications.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-lg border-2 border-purple-500/30 bg-purple-500/10 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Unread</h3>
            <p className="text-4xl font-bold text-purple-400">{unreadCount}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-lg border-2 border-pink-500/30 bg-pink-500/10 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-pink-400 mb-2">Test Count</h3>
            <p className="text-4xl font-bold text-pink-400">{notificationCount}</p>
          </motion.div>
        </div>

        {/* Notification Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-glow-cyan mb-6">System Notifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => handleShowNotification('success')}
              className="bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Success
            </Button>
            <Button
              onClick={() => handleShowNotification('error')}
              className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Error
            </Button>
            <Button
              onClick={() => handleShowNotification('warning')}
              className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Warning
            </Button>
            <Button
              onClick={() => handleShowNotification('info')}
              className="bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
            >
              <Info className="w-4 h-4 mr-2" />
              Info
            </Button>
          </div>
        </div>

        {/* Social Notifications */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-glow-cyan mb-6">Social Notifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => handleShowNotification('comment')}
              className="bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
            >
              <Bell className="w-4 h-4 mr-2" />
              Comment
            </Button>
            <Button
              onClick={() => handleShowNotification('like')}
              className="bg-pink-500/20 border border-pink-500/30 text-pink-400 hover:bg-pink-500/30"
            >
              <Heart className="w-4 h-4 mr-2" />
              Like
            </Button>
            <Button
              onClick={() => handleShowNotification('follow')}
              className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Follow
            </Button>
            <Button
              onClick={() => handleShowNotification('mention')}
              className="bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30"
            >
              <Bell className="w-4 h-4 mr-2" />
              Mention
            </Button>
          </div>
        </div>

        {/* Other Notifications */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-glow-cyan mb-6">Other Notifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => handleShowNotification('system')}
              className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30"
            >
              <Bell className="w-4 h-4 mr-2" />
              System
            </Button>
            <Button
              onClick={() => handleShowNotification('reminder')}
              className="bg-teal-500/20 border border-teal-500/30 text-teal-400 hover:bg-teal-500/30"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Reminder
            </Button>
          </div>
        </div>

        {/* Notification List */}
        <div>
          <h2 className="text-2xl font-bold text-glow-cyan mb-6">Recent Notifications</h2>
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No notifications yet</p>
              <p className="text-sm mt-2">Click the buttons above to create notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg border-2 backdrop-blur-sm ${
                    notification.read ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-semibold ${!notification.read ? 'text-glow' : ''}`}>
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => close(notification.id)}
                      variant="ghost"
                      size="sm"
                    >
                      Dismiss
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
