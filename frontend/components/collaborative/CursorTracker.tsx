'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface RemoteCursor {
  id: string;
  userId: string;
  userName: string;
  x: number;
  y: number;
  color: string;
}

export interface CursorTrackerProps {
  isEnabled?: boolean;
  showNames?: boolean;
  updateInterval?: number;
  cursorSize?: number;
  className?: string;
  onCursorMove?: (cursor: RemoteCursor) => void;
  onUserLeave?: (userId: string) => void;
}

// 预定义的颜色方案
const CURSOR_COLORS = [
  '#00f0ff', // 赛博青
  '#9d00ff', // 赛博紫
  '#ff0080', // 激光粉
  '#f0ff00', // 电压黄
  '#00ff88', // 霓虹绿
  '#ff6600', // 橙色
  '#ff0066', // 玫红
  '#6600ff', // 靛蓝
];

// 获取随机颜色
const getRandomColor = (userId: string): string => {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
};

export const CursorTracker: React.FC<CursorTrackerProps> = ({
  isEnabled = true,
  showNames = true,
  updateInterval = 50,
  cursorSize = 24,
  className,
  onCursorMove,
  onUserLeave,
}) => {
  const [localPosition, setLocalPosition] = useState({ x: 0, y: 0 });
  const [remoteCursors, setRemoteCursors] = useState<Map<string, RemoteCursor>>(new Map());

  // 更新本地光标位置
  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setLocalPosition({ x: e.clientX, y: e.clientY });

      // 发送本地光标位置到服务器
      // 这里需要根据实际的后端 API 实现
      // socket.emit('cursor-move', { x: e.clientX, y: e.clientY });
    };

    const throttledHandler = throttle(handleMouseMove, updateInterval);
    window.addEventListener('mousemove', throttledHandler);

    return () => {
      window.removeEventListener('mousemove', throttledHandler);
    };
  }, [isEnabled, updateInterval]);

  // 接收远程光标位置
  // 这需要根据实际的后端 API 实现
  /*
  useEffect(() => {
    socket.on('cursor-update', (cursor: RemoteCursor) => {
      setRemoteCursors(prev => new Map(prev).set(cursor.userId, cursor));
      onCursorMove?.(cursor);
    });

    socket.on('user-left', (userId: string) => {
      setRemoteCursors(prev => {
        const newMap = new Map(prev);
        newMap.delete(userId);
        return newMap;
      });
      onUserLeave?.(userId);
    });

    return () => {
      socket.off('cursor-update');
      socket.off('user-left');
    };
  }, [onCursorMove, onUserLeave]);
  */

  // 节流函数
  function throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  }

  return (
    <div className={cn('fixed inset-0 pointer-events-none z-50', className)}>
      {/* 远程光标 */}
      <AnimatePresence>
        {Array.from(remoteCursors.values()).map((cursor) => (
          <motion.div
            key={cursor.userId}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              left: cursor.x,
              top: cursor.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* 光标图标 */}
            <svg
              width={cursorSize}
              height={cursorSize}
              viewBox="0 0 24 24"
              fill={cursor.color}
              style={{
                filter: `drop-shadow(0 0 4px ${cursor.color})`,
              }}
            >
              <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19169L11.7841 12.3673H5.65376Z" />
            </svg>

            {/* 用户名称 */}
            {showNames && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-6 top-4 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
                style={{
                  backgroundColor: cursor.color,
                  boxShadow: `0 2px 8px ${cursor.color}40`,
                }}
              >
                {cursor.userName}
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// 示例：模拟远程光标（用于演示）
export const MockCursorTracker: React.FC<Omit<CursorTrackerProps, 'onCursorMove' | 'onUserLeave'>> = ({
  isEnabled = true,
  showNames = true,
  cursorSize = 24,
  className,
}) => {
  const [mockCursors, setMockCursors] = useState<RemoteCursor[]>([]);

  useEffect(() => {
    if (!isEnabled) {
      setMockCursors([]);
      return;
    }

    // 创建模拟光标
    const mockUsers: Omit<RemoteCursor, 'x' | 'y'>[] = [
      { id: '1', userId: 'user1', userName: 'Alice', color: getRandomColor('user1') },
      { id: '2', userId: 'user2', userName: 'Bob', color: getRandomColor('user2') },
      { id: '3', userId: 'user3', userName: 'Charlie', color: getRandomColor('user3') },
    ];

    setMockCursors(
      mockUsers.map((user, index) => ({
        ...user,
        x: 200 + index * 150,
        y: 300 + index * 100,
      }))
    );

    // 模拟光标移动
    const interval = setInterval(() => {
      setMockCursors(prev =>
        prev.map(cursor => ({
          ...cursor,
          x: Math.max(100, Math.min(window.innerWidth - 100, cursor.x + (Math.random() - 0.5) * 50)),
          y: Math.max(100, Math.min(window.innerHeight - 100, cursor.y + (Math.random() - 0.5) * 50)),
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isEnabled]);

  return (
    <div className={cn('fixed inset-0 pointer-events-none z-50', className)}>
      <AnimatePresence>
        {mockCursors.map((cursor) => (
          <motion.div
            key={cursor.userId}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              left: cursor.x,
              top: cursor.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* 光标图标 */}
            <svg
              width={cursorSize}
              height={cursorSize}
              viewBox="0 0 24 24"
              fill={cursor.color}
              style={{
                filter: `drop-shadow(0 0 4px ${cursor.color})`,
              }}
            >
              <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19169L11.7841 12.3673H5.65376Z" />
            </svg>

            {/* 用户名称 */}
            {showNames && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-6 top-4 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
                style={{
                  backgroundColor: cursor.color,
                  boxShadow: `0 2px 8px ${cursor.color}40`,
                }}
              >
                {cursor.userName}
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CursorTracker;
