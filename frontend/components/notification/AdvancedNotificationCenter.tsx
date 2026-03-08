'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellRing,
  X,
  Check,
  Trash2,
  Settings,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  Archive,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Mail,
  MessageSquare,
  User,
  GitPullRequest,
  AlertOctagon,
  Zap,
  Award
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'message'
  | 'mention'
  | 'system'
  | 'update';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  archived: boolean;
  priority: NotificationPriority;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

export interface NotificationSettings {
  enableDesktop: boolean;
  enableSound: boolean;
  enablePreview: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  filters: {
    types: NotificationType[];
    priorities: NotificationPriority[];
  };
}

export interface AdvancedNotificationCenterProps {
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxVisible?: number;
  autoClose?: boolean;
  autoCloseDelay?: number;
  soundEnabled?: boolean;
  settings?: NotificationSettings;
  onNotificationClick?: (notification: Notification) => void;
  onNotificationRead?: (notificationId: string) => void;
  onNotificationDelete?: (notificationId: string) => void;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
}

// Notification Icon Component
const NotificationIcon: React.FC<{
  type: NotificationType;
  className?: string;
}> = ({ type, className }) => {
  const icons = {
    info: <Info className={className} />,
    success: <CheckCircle className={className} />,
    warning: <AlertTriangle className={className} />,
    error: <XCircle className={className} />,
    message: <MessageSquare className={className} />,
    mention: <User className={className} />,
    system: <Settings className={className} />,
    update: <Zap className={className} />
  };

  return icons[type] || icons.info;
};

// Priority Badge Component
const PriorityBadge: React.FC<{ priority: NotificationPriority }> = ({ priority }) => {
  const styles = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    urgent: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs border', styles[priority])}>
      {priority}
    </span>
  );
};

// Notification Item Component
const NotificationItem: React.FC<{
  notification: Notification;
  onClick: () => void;
  onRead: () => void;
  onDelete: () => void;
  onToggleStar: () => void;
}> = ({ notification, onClick, onRead, onDelete, onToggleStar }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeStyles = {
    info: 'border-cyber-cyan/30 bg-cyber-cyan/5',
    success: 'border-green-500/30 bg-green-500/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    error: 'border-red-500/30 bg-red-500/5',
    message: 'border-cyber-purple/30 bg-cyber-purple/5',
    mention: 'border-cyber-pink/30 bg-cyber-pink/5',
    system: 'border-gray-500/30 bg-gray-500/5',
    update: 'border-cyber-green/30 bg-cyber-green/5'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative p-4 rounded-lg border transition-all cursor-pointer hover:shadow-lg',
        typeStyles[notification.type],
        !notification.read && 'border-l-4 border-l-cyber-cyan'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(
          'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
          notification.type === 'success' && 'bg-green-500/20',
          notification.type === 'error' && 'bg-red-500/20',
          notification.type === 'warning' && 'bg-yellow-500/20',
          notification.type === 'info' && 'bg-cyber-cyan/20'
        )}>
          <NotificationIcon
            type={notification.type}
            className={cn(
              'w-5 h-5',
              notification.type === 'success' && 'text-green-400',
              notification.type === 'error' && 'text-red-400',
              notification.type === 'warning' && 'text-yellow-400',
              notification.type === 'info' && 'text-cyber-cyan'
            )}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className={cn(
              'text-sm font-semibold truncate',
              notification.read ? 'text-gray-400' : 'text-white'
            )}>
              {notification.title}
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar();
              }}
              className="flex-shrink-0 ml-2"
            >
              <Star className={cn(
                'w-4 h-4 transition-colors',
                notification.starred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'
              )} />
            </button>
          </div>

          <p className={cn(
            'text-xs mb-2 line-clamp-2',
            isExpanded ? 'line-clamp-none' : 'line-clamp-2',
            notification.read ? 'text-gray-500' : 'text-gray-300'
          )}>
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PriorityBadge priority={notification.priority} />
              <span className="text-xs text-gray-500">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {!notification.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRead();
                  }}
                  className="p-1.5 rounded-lg hover:bg-cyber-cyan/20 transition-all"
                  title="Mark as read"
                >
                  <Check className="w-3.5 h-3.5 text-cyber-cyan" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="p-1.5 rounded-lg hover:bg-cyber-cyan/20 transition-all"
              >
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1.5 rounded-lg hover:bg-red-500/20 transition-all"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </button>
            </div>
          </div>

          {notification.actionUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(notification.actionUrl, '_blank');
              }}
              className="mt-2 w-full py-2 px-3 bg-cyber-cyan/20 hover:bg-cyber-cyan/30 rounded-lg text-xs text-cyber-cyan font-semibold transition-all"
            >
              {notification.actionLabel || 'View Details'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Settings Panel Component
const SettingsPanel: React.FC<{
  settings: NotificationSettings;
  onUpdate: (settings: NotificationSettings) => void;
  onClose: () => void;
}> = ({ settings, onUpdate, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-cyber-card border border-cyber-cyan/30 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Notification Settings</h3>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-cyber-cyan/10 transition-all"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Enable Desktop Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Desktop Notifications</p>
            <p className="text-xs text-gray-500">Show browser notifications</p>
          </div>
          <button
            onClick={() => onUpdate({
              ...settings,
              enableDesktop: !settings.enableDesktop
            })}
            className={cn(
              'w-12 h-6 rounded-full transition-all relative',
              settings.enableDesktop ? 'bg-cyber-cyan' : 'bg-gray-700'
            )}
          >
            <motion.div
              className="absolute top-1 w-4 h-4 bg-white rounded-full"
              animate={{
                left: settings.enableDesktop ? 'calc(100% - 20px)' : '4px'
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Enable Sound */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Sound</p>
            <p className="text-xs text-gray-500">Play notification sound</p>
          </div>
          <button
            onClick={() => onUpdate({
              ...settings,
              enableSound: !settings.enableSound
            })}
            className={cn(
              'w-12 h-6 rounded-full transition-all relative',
              settings.enableSound ? 'bg-cyber-cyan' : 'bg-gray-700'
            )}
          >
            <motion.div
              className="absolute top-1 w-4 h-4 bg-white rounded-full"
              animate={{
                left: settings.enableSound ? 'calc(100% - 20px)' : '4px'
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Quiet Hours */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-white">Quiet Hours</p>
              <p className="text-xs text-gray-500">Disable notifications during specific hours</p>
            </div>
            <button
              onClick={() => onUpdate({
                ...settings,
                quietHours: {
                  ...settings.quietHours,
                  enabled: !settings.quietHours.enabled
                }
              })}
              className={cn(
                'w-12 h-6 rounded-full transition-all relative',
                settings.quietHours.enabled ? 'bg-cyber-cyan' : 'bg-gray-700'
              )}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 bg-white rounded-full"
                animate={{
                  left: settings.quietHours.enabled ? 'calc(100% - 20px)' : '4px'
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {settings.quietHours.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 gap-3"
            >
              <div>
                <label className="block text-xs text-gray-400 mb-1">Start Time</label>
                <input
                  type="time"
                  value={settings.quietHours.start}
                  onChange={(e) => onUpdate({
                    ...settings,
                    quietHours: {
                      ...settings.quietHours,
                      start: e.target.value
                    }
                  })}
                  className="w-full bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">End Time</label>
                <input
                  type="time"
                  value={settings.quietHours.end}
                  onChange={(e) => onUpdate({
                    ...settings,
                    quietHours: {
                      ...settings.quietHours,
                      end: e.target.value
                    }
                  })}
                  className="w-full bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Notification Filters */}
        <div>
          <p className="text-sm font-semibold text-white mb-3">Filter by Type</p>
          <div className="flex flex-wrap gap-2">
            {(
              ['info', 'success', 'warning', 'error', 'message', 'mention', 'system', 'update'] as NotificationType[]
            ).map(type => (
              <button
                key={type}
                onClick={() => {
                  const newTypes = settings.filters.types.includes(type)
                    ? settings.filters.types.filter(t => t !== type)
                    : [...settings.filters.types, type];
                  onUpdate({
                    ...settings,
                    filters: {
                      ...settings.filters,
                      types: newTypes
                    }
                  });
                }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs capitalize transition-all',
                  settings.filters.types.includes(type)
                    ? 'bg-cyber-cyan text-cyber-dark font-semibold'
                    : 'bg-gray-700 text-gray-400'
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
export const AdvancedNotificationCenter: React.FC<AdvancedNotificationCenterProps> = ({
  className,
  position = 'top-right',
  maxVisible = 5,
  autoClose = false,
  autoCloseDelay = 5000,
  soundEnabled = false,
  settings: initialSettings,
  onNotificationClick,
  onNotificationRead,
  onNotificationDelete,
  onMarkAllRead,
  onClearAll
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<NotificationSettings>(initialSettings || {
    enableDesktop: false,
    enableSound: soundEnabled,
    enablePreview: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    filters: {
      types: ['info', 'success', 'warning', 'error', 'message', 'mention', 'system', 'update'],
      priorities: ['low', 'medium', 'high', 'urgent']
    }
  });

  // Generate mock notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Deployment Successful',
        message: 'Your application has been deployed to production successfully.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false,
        starred: false,
        archived: false,
        priority: 'high',
        actionUrl: '#',
        actionLabel: 'View Deployment'
      },
      {
        id: '2',
        type: 'warning',
        title: 'High CPU Usage',
        message: 'Server CPU usage has exceeded 80% for the last 5 minutes.',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        read: false,
        starred: true,
        archived: false,
        priority: 'urgent',
        actionUrl: '#',
        actionLabel: 'View Metrics'
      },
      {
        id: '3',
        type: 'message',
        title: 'New Comment',
        message: 'John Doe commented on your pull request: "Looks good to me!"',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: true,
        starred: false,
        archived: false,
        priority: 'medium',
        actionUrl: '#',
        actionLabel: 'View Comment'
      },
      {
        id: '4',
        type: 'error',
        title: 'Build Failed',
        message: 'The latest build failed with 3 errors. Check the logs for details.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: false,
        starred: false,
        archived: false,
        priority: 'high',
        actionUrl: '#',
        actionLabel: 'View Logs'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  // Auto-close notifications
  useEffect(() => {
    if (!autoClose) return;

    const timer = setTimeout(() => {
      notifications.forEach(notification => {
        if (!notification.read) {
          handleMarkAsRead(notification.id);
        }
      });
    }, autoCloseDelay);

    return () => clearTimeout(timer);
  }, [notifications, autoClose, autoCloseDelay]);

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = settings.filters.types.includes(notification.type);
    const matchesArchived = !notification.archived;
    return matchesType && matchesSearch && matchesFilter && matchesArchived;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    onNotificationRead?.(notificationId);
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    onNotificationDelete?.(notificationId);
  };

  const handleToggleStar = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, starred: !n.starred } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
    onMarkAllRead?.();
  };

  const handleClearAll = () => {
    setNotifications([]);
    onClearAll?.();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    onNotificationClick?.(notification);
  };

  return (
    <div className={cn('relative', className)}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-xl bg-cyber-card border border-cyber-cyan/30 hover:border-cyber-cyan/60 transition-all"
      >
        {unreadCount > 0 ? (
          <BellRing className="w-5 h-5 text-cyber-cyan animate-pulse" />
        ) : (
          <Bell className="w-5 h-5 text-gray-400" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-semibold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute w-96 max-h-[600px] bg-cyber-card border border-cyber-cyan/30 rounded-xl shadow-2xl overflow-hidden z-50',
              position === 'top-right' && 'right-0 top-full mt-2',
              position === 'top-left' && 'left-0 top-full mt-2',
              position === 'bottom-right' && 'right-0 bottom-full mb-2',
              position === 'bottom-left' && 'left-0 bottom-full mb-2'
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-cyber-cyan/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-lg hover:bg-cyber-cyan/10 transition-all"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-cyber-cyan/10 transition-all"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notifications..."
                    className="w-full bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg pl-10 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan"
                >
                  <option value="all">All Types</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="message">Messages</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {unreadCount} unread notifications
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-cyber-cyan hover:text-cyber-purple transition-colors"
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings ? (
                <div className="p-4 border-b border-cyber-cyan/30">
                  <SettingsPanel
                    settings={settings}
                    onUpdate={setSettings}
                    onClose={() => setShowSettings(false)}
                  />
                </div>
              ) : (
                /* Notifications List */
                <div className="overflow-y-auto max-h-[400px] p-4 space-y-3">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No notifications</p>
                    </div>
                  ) : (
                    filteredNotifications.slice(0, maxVisible).map(notification => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClick={() => handleNotificationClick(notification)}
                        onRead={() => handleMarkAsRead(notification.id)}
                        onDelete={() => handleDeleteNotification(notification.id)}
                        onToggleStar={() => handleToggleStar(notification.id)}
                      />
                    ))
                  )}
                </div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="p-3 border-t border-cyber-cyan/30 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {filteredNotifications.length} notifications
              </span>
              <button className="text-xs text-cyber-cyan hover:text-cyber-purple transition-colors">
                View All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedNotificationCenter;
