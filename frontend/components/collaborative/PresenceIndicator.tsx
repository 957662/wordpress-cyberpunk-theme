'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, UserMinus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UserPresence {
  userId: string;
  userName: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
  color?: string;
}

export interface PresenceIndicatorProps {
  users: UserPresence[];
  maxVisible?: number;
  showStatus?: boolean;
  showAvatars?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  onUserClick?: (user: UserPresence) => void;
}

// 生成随机颜色
const getUserColor = (userId: string): string => {
  const colors = [
    '#00f0ff', '#9d00ff', '#ff0080', '#f0ff00',
    '#00ff88', '#ff6600', '#ff0066', '#6600ff'
  ];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// 获取用户头像（首字母）
const getUserAvatar = (userName: string): string => {
  return userName.charAt(0).toUpperCase();
};

export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  users,
  maxVisible = 5,
  showStatus = true,
  showAvatars = true,
  position = 'bottom-right',
  className,
  onUserClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>(users);

  // 更新用户列表
  useEffect(() => {
    setActiveUsers(users);
  }, [users]);

  // 过滤在线用户
  const onlineUsers = activeUsers.filter(user => user.status === 'online');
  const visibleUsers = onlineUsers.slice(0, maxVisible);
  const remainingCount = onlineUsers.length - maxVisible;

  // 位置样式
  const positionStyles: Record<string, string> = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  // 状态颜色
  const statusColors: Record<string, string> = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-500',
  };

  return (
    <div className={cn('fixed z-40', positionStyles[position], className)}>
      {/* 用户头像组 */}
      <motion.div
        className={cn(
          'flex items-center gap-2 p-2 rounded-xl backdrop-blur-md border-2',
          isExpanded
            ? 'bg-gray-900/90 border-cyan-500/50'
            : 'bg-gray-900/80 border-gray-700/50 hover:border-gray-600/50'
        )}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* 用户图标 */}
        <div className="flex items-center justify-center">
          <Users className="w-5 h-5 text-cyan-400" />
        </div>

        {/* 用户头像 */}
        <div className="flex items-center">
          {visibleUsers.map((user, index) => (
            <motion.div
              key={user.userId}
              className={cn(
                'relative -ml-2 first:ml-0',
                onUserClick && 'cursor-pointer'
              )}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onUserClick?.(user)}
              title={user.userName}
            >
              {/* 头像 */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2',
                  showAvatars
                    ? 'bg-gray-800 border-gray-900'
                    : 'bg-gradient-to-br from-cyan-500 to-purple-500 border-gray-900'
                )}
                style={{
                  borderColor: user.color || getUserColor(user.userId),
                  backgroundColor: showAvatars ? undefined : (user.color || getUserColor(user.userId)),
                }}
              >
                {showAvatars ? (
                  user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.userName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white">{getUserAvatar(user.userName)}</span>
                  )
                ) : (
                  <span className="text-white">{getUserAvatar(user.userName)}</span>
                )}
              </div>

              {/* 状态指示器 */}
              {showStatus && (
                <div
                  className={cn(
                    'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-gray-900',
                    statusColors[user.status]
                  )}
                />
              )}
            </motion.div>
          ))}

          {/* 剩余用户计数 */}
          {remainingCount > 0 && (
            <motion.div
              className="relative -ml-2 w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-xs font-medium text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              title={`+${remainingCount} 更多在线用户`}
            >
              +{remainingCount}
            </motion.div>
          )}
        </div>

        {/* 用户计数 */}
        <div className="px-2 text-sm text-gray-400">
          <span className="text-cyan-400 font-medium">{onlineUsers.length}</span>
          <span className="text-gray-500"> / {activeUsers.length}</span>
        </div>

        {/* 展开/收起按钮 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2 p-1 rounded-lg hover:bg-gray-700/50 transition-colors"
          aria-label={isExpanded ? '收起用户列表' : '展开用户列表'}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </button>
      </motion.div>

      {/* 展开的用户列表 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute mt-2 w-72 rounded-xl border-2 bg-gray-900/95 backdrop-blur-md shadow-2xl overflow-hidden',
              'border-gray-700'
            )}
            style={{
              [position.includes('right') ? 'right' : 'left']: 0,
            }}
          >
            {/* 头部 */}
            <div className="p-3 border-b border-gray-700 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-sm">在线用户</h3>
                <span className="text-xs text-gray-400">
                  {onlineUsers.length} / {activeUsers.length}
                </span>
              </div>
            </div>

            {/* 用户列表 */}
            <div className="p-2 max-h-80 overflow-y-auto">
              <div className="space-y-1">
                {activeUsers.map((user, index) => (
                  <motion.div
                    key={user.userId}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className={cn(
                      'flex items-center gap-3 p-2 rounded-lg transition-colors',
                      onUserClick && 'cursor-pointer hover:bg-gray-800/50',
                      user.status === 'online' && 'bg-gray-800/30'
                    )}
                    onClick={() => onUserClick?.(user)}
                  >
                    {/* 头像 */}
                    <div className="relative">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2"
                        style={{
                          backgroundColor: user.color || getUserColor(user.userId),
                          borderColor: user.color || getUserColor(user.userId),
                        }}
                      >
                        <span className="text-white">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.userName}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            getUserAvatar(user.userName)
                          )}
                        </span>
                      </div>

                      {/* 状态指示器 */}
                      {showStatus && (
                        <div
                          className={cn(
                            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900',
                            statusColors[user.status]
                          )}
                        />
                      )}
                    </div>

                    {/* 用户信息 */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user.userName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {user.status === 'online' && '在线'}
                        {user.status === 'away' && '离开'}
                        {user.status === 'offline' && user.lastSeen && `${user.lastSeen.toLocaleString()} 在线`}
                      </p>
                    </div>

                    {/* 添加/移除按钮 */}
                    {user.status === 'online' && (
                      <button
                        className="p-1 rounded hover:bg-gray-700/50 transition-colors"
                        aria-label="关注用户"
                      >
                        <UserPlus className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 底部操作 */}
            <div className="p-2 border-t border-gray-700 bg-gray-800/30">
              <button
                className="w-full px-3 py-2 text-sm text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
              >
                邀请更多用户
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PresenceIndicator;
