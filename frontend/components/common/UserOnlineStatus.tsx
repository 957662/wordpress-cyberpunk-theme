'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserOnlineStatusProps {
  userId?: string;
  showCount?: boolean;
  showTooltip?: boolean;
  variant?: 'dot' | 'badge' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface OnlineUsersResponse {
  online: number;
  total: number;
  users?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
}

export const UserOnlineStatus: React.FC<UserOnlineStatusProps> = ({
  userId,
  showCount = true,
  showTooltip = true,
  variant = 'dot',
  size = 'md',
  className,
}) => {
  const [isOnline, setIsOnline] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [showUserList, setShowUserList] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Array<{ id: string; name: string; avatar?: string }>>([]);

  // Simulate real-time online status updates
  useEffect(() => {
    // Initial fetch
    fetchOnlineStatus();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchOnlineStatus, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  // Simulate random online users
  useEffect(() => {
    const randomCount = Math.floor(Math.random() * 50) + 10;
    setOnlineCount(randomCount);

    const users = Array.from({ length: Math.min(randomCount, 8) }, (_, i) => ({
      id: `user-${i}`,
      name: `用户 ${i + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    }));
    setOnlineUsers(users);

    if (userId) {
      // Randomly set current user as online or offline
      setIsOnline(Math.random() > 0.3);
    }
  }, [userId]);

  const fetchOnlineStatus = async () => {
    try {
      // In production, this would be a real API call
      // const response = await fetch('/api/online-status');
      // const data: OnlineUsersResponse = await response.json();

      // Simulated response
      const randomCount = Math.floor(Math.random() * 50) + 10;
      setOnlineCount(randomCount);

      const users = Array.from({ length: Math.min(randomCount, 8) }, (_, i) => ({
        id: `user-${i}`,
        name: `用户 ${i + 1}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      }));
      setOnlineUsers(users);

      if (userId) {
        setIsOnline(Math.random() > 0.3);
      }
    } catch (error) {
      console.error('Failed to fetch online status:', error);
    }
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const renderDot = () => (
    <motion.div
      className={cn('relative', className)}
      onMouseEnter={() => showTooltip && setShowUserList(true)}
      onMouseLeave={() => setShowUserList(false)}
    >
      <motion.div
        className={cn('rounded-full', sizeClasses[size])}
        style={{
          backgroundColor: isOnline ? '#00ff88' : '#6b7280',
          boxShadow: isOnline ? '0 0 10px rgba(0, 255, 136, 0.8)' : 'none',
        }}
        animate={isOnline ? {
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 1],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
      {showCount && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-cyan text-[8px] items-center justify-center text-cyber-dark font-bold">
            {onlineCount}
          </span>
        </span>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {showUserList && showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-cyber-dark/95 backdrop-blur-sm border border-cyber-cyan/30 rounded-lg shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-cyber-cyan/20">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-cyber-cyan" />
                <span className="text-cyber-white font-semibold">
                  {onlineCount} 人在线
                </span>
              </div>
            </div>

            {/* User List */}
            <div className="max-h-48 overflow-y-auto">
              {onlineUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-cyber-cyan/10 transition-colors"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-cyber-gray">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-cyber-gray text-xs">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-cyber-dark" />
                  </div>
                  <span className="text-sm text-cyber-gray truncate">{user.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderBadge = () => (
    <motion.div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full border',
        isOnline ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-500/10 border-gray-500/30',
        className
      )}
      onMouseEnter={() => showTooltip && setShowUserList(true)}
      onMouseLeave={() => setShowUserList(false)}
    >
      <Circle
        className={cn(sizeClasses[size], 'rounded-full')}
        style={{
          backgroundColor: isOnline ? '#00ff88' : '#6b7280',
          boxShadow: isOnline ? '0 0 10px rgba(0, 255, 136, 0.8)' : 'none',
        }}
      />
      <span className="text-xs font-medium" style={{ color: isOnline ? '#00ff88' : '#6b7280' }}>
        {isOnline ? '在线' : '离线'}
      </span>
      {showCount && (
        <span className="text-xs text-cyber-gray">({onlineCount})</span>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {showUserList && showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 w-64 bg-cyber-dark/95 backdrop-blur-sm border border-cyber-cyan/30 rounded-lg shadow-xl"
          >
            <div className="px-4 py-3 border-b border-cyber-cyan/20">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-cyber-cyan" />
                <span className="text-cyber-white font-semibold">
                  {onlineCount} 人在线
                </span>
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto p-2">
              {onlineUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 px-2 py-1 hover:bg-cyber-cyan/10 rounded transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-cyber-gray/20" />
                  <span className="text-xs text-cyber-gray">{user.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderText = () => (
    <div className={cn('flex items-center gap-2', className)}>
      <Circle
        className={cn(sizeClasses[size], 'rounded-full')}
        style={{
          backgroundColor: isOnline ? '#00ff88' : '#6b7280',
          boxShadow: isOnline ? '0 0 10px rgba(0, 255, 136, 0.8)' : 'none',
        }}
      />
      <span className="text-sm" style={{ color: isOnline ? '#00ff88' : '#6b7280' }}>
        {isOnline ? '在线' : '离线'}
      </span>
      {showCount && (
        <span className="text-sm text-cyber-gray">· {onlineCount} 人在线</span>
      )}
    </div>
  );

  switch (variant) {
    case 'badge':
      return renderBadge();
    case 'text':
      return renderText();
    case 'dot':
    default:
      return renderDot();
  }
};

export default UserOnlineStatus;
