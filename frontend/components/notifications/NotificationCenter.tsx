'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  Check,
  Trash2,
  Filter,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Search,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Notification, NotificationContainer, NotificationType } from './NotificationToast';

export interface NotificationCenterProps {
  notifications: Notification[];
  onClose: (id: string) => void;
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
  onActionClick?: (notification: Notification) => void;
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
}

const filterOptions: { label: string; types: NotificationType[] }[] = [
  { label: 'All', types: [] },
  { label: 'Unread', types: [] },
  { label: 'Social', types: ['comment', 'like', 'follow', 'mention'] },
  { label: 'System', types: ['success', 'error', 'warning', 'info', 'system'] },
  { label: 'Reminders', types: ['reminder'] },
];

export function NotificationCenter({
  notifications,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onClearAll,
  onActionClick,
  colorScheme = 'cyan',
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const filtered = notifications.filter((n) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!n.title.toLowerCase().includes(query) && !n.message.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Type filter
      if (selectedFilter === 1 && n.read) return false; // Unread
      if (selectedFilter === 2 && !['comment', 'like', 'follow', 'mention'].includes(n.type)) return false; // Social
      if (selectedFilter === 3 && !['success', 'error', 'warning', 'info', 'system'].includes(n.type)) return false; // System
      if (selectedFilter === 4 && n.type !== 'reminder') return false; // Reminders

      return true;
    });

    const groups: Record<string, Notification[]> = {
      today: [],
      yesterday: [],
      week: [],
      older: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const week = new Date(today);
    week.setDate(week.getDate() - 7);

    filtered.forEach((n) => {
      const date = new Date(n.timestamp);
      if (date >= today) {
        groups.today.push(n);
      } else if (date >= yesterday) {
        groups.yesterday.push(n);
      } else if (date >= week) {
        groups.week.push(n);
      } else {
        groups.older.push(n);
      }
    });

    return groups;
  }, [notifications, selectedFilter, searchQuery]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => {
    const colors = {
      success: 'bg-green-500/10 border-green-500/30 text-green-400',
      error: 'bg-red-500/10 border-red-500/30 text-red-400',
      warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
      info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      comment: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      like: 'bg-pink-500/10 border-pink-500/30 text-pink-400',
      follow: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      mention: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      system: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
      reminder: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
    };

    const colorClass = colors[notification.type];
    const icon = {
      success: CheckCircle,
      error: X,
      warning: AlertTriangle,
      info: Info,
      comment: Bell,
      like: Bell,
      follow: Bell,
      mention: Bell,
      system: Bell,
      reminder: Bell,
    }[notification.type];
    const Icon = icon;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className={`
          p-4 rounded-lg border-2 backdrop-blur-sm transition-all duration-300
          ${colorClass}
          ${!notification.read ? 'shadow-lg' : ''}
          hover:shadow-xl cursor-pointer
        `}
        onClick={() => {
          if (onMarkRead && !notification.read) {
            onMarkRead(notification.id);
          }
          if (notification.link) {
            window.open(notification.link, '_blank');
          }
        }}
      >
        <div className="flex gap-3">
          <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-gray-100 ${!notification.read ? 'text-glow' : ''}`}>
              {notification.title}
            </h4>
            <p className="text-sm text-gray-400 line-clamp-2 mt-1">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-2">
              {notification.timestamp.toLocaleString()}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(notification.id);
            }}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  };

  const NotificationGroup = ({
    label,
    notifications: groupNotifications,
  }: {
    label: string;
    notifications: Notification[];
  }) => {
    if (groupNotifications.length === 0) return null;

    const isExpanded = expandedGroups.has(label);

    return (
      <div className="mb-4">
        <button
          onClick={() => toggleGroup(label)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-200 transition-colors mb-2"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span>{label}</span>
          <span className="text-gray-500">({groupNotifications.length})</span>
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              {groupNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Bell Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-lg border-2 backdrop-blur-sm bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Center Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-4 right-4 w-96 max-h-[80vh] rounded-lg border-2 border-cyan-500/30 bg-[#0a0a0f]/95 backdrop-blur-md shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-100">Notifications</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {onMarkAllRead && (
                    <button
                      onClick={onMarkAllRead}
                      className="flex-1 py-2 px-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/20 transition-colors"
                    >
                      Mark All Read
                    </button>
                  )}
                  {onClearAll && (
                    <button
                      onClick={onClearAll}
                      className="flex-1 py-2 px-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex gap-2 mb-3 overflow-x-auto">
                  {filterOptions.map((option, index) => (
                    <button
                      key={option.label}
                      onClick={() => setSelectedFilter(index)}
                      className={`
                        px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap transition-colors
                        ${
                          selectedFilter === index
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Notifications List */}
              <div className="p-4 overflow-y-auto max-h-[50vh] custom-scrollbar">
                {Object.values(groupedNotifications).flat().length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No notifications found</p>
                  </div>
                ) : (
                  <>
                    <NotificationGroup label="Today" notifications={groupedNotifications.today} />
                    <NotificationGroup
                      label="Yesterday"
                      notifications={groupedNotifications.yesterday}
                    />
                    <NotificationGroup label="This Week" notifications={groupedNotifications.week} />
                    <NotificationGroup label="Older" notifications={groupedNotifications.older} />
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
