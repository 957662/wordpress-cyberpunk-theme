'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useWebSocket } from './useWebSocket';

export interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: { x: number; y: number };
  selection?: { start: number; end: number };
  isOnline: boolean;
  lastSeen: Date;
}

export interface CollaborationOperation {
  type: 'insert' | 'delete' | 'replace' | 'format';
  position: number;
  length?: number;
  content?: string;
  userId: string;
  timestamp: number;
  version: number;
}

export interface UseCollaborationOptions {
  documentId: string;
  userId: string;
  userName: string;
  websocketUrl: string;
  onCollaboratorsChange?: (collaborators: Collaborator[]) => void;
  onOperationReceived?: (operation: CollaborationOperation) => void;
  onUserJoined?: (user: Collaborator) => void;
  onUserLeft?: (userId: string) => void;
}

export interface UseCollaborationReturn {
  collaborators: Collaborator[];
  isCollaborating: boolean;
  sendOperation: (operation: Omit<CollaborationOperation, 'userId' | 'timestamp' | 'version'>) => void;
  sendCursor: (position: { x: number; y: number }) => void;
  sendSelection: (selection: { start: number; end: number }) => void;
  broadcastPresence: () => void;
  disconnect: () => void;
  reconnect: () => void;
  error: Error | null;
}

export function useCollaboration(options: UseCollaborationOptions): UseCollaborationReturn {
  const {
    documentId,
    userId,
    userName,
    websocketUrl,
    onCollaboratorsChange,
    onOperationReceived,
    onUserJoined,
    onUserLeft,
  } = options;

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [version, setVersion] = useState(0);

  const wsUrl = `${websocketUrl}?docId=${documentId}&userId=${userId}&userName=${encodeURIComponent(userName)}`;

  const { sendMessage, isConnected, error, disconnect, reconnect } = useWebSocket(wsUrl, {
    onMessage: (event) => {
      try {
        const message = JSON.parse(event.data);
        handleMessage(message);
      } catch (err) {
        console.error('Failed to parse collaboration message:', err);
      }
    },
  });

  // 生成用户颜色
  const getUserColor = useCallback((userId: string) => {
    const colors = [
      '#00f0ff', // cyan
      '#9d00ff', // purple
      '#ff0080', // pink
      '#f0ff00', // yellow
      '#00ff88', // green
      '#ff6600', // orange
    ];
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  }, []);

  // 处理接收到的消息
  const handleMessage = useCallback((message: any) => {
    switch (message.type) {
      case 'collaborators':
        setCollaborators(message.data.map((user: any) => ({
          ...user,
          color: getUserColor(user.id),
          lastSeen: new Date(user.lastSeen),
        })));
        onCollaboratorsChange?.(message.data);
        break;

      case 'user_joined':
        const newUser: Collaborator = {
          ...message.data,
          color: getUserColor(message.data.id),
          lastSeen: new Date(),
          isOnline: true,
        };
        setCollaborators((prev) => [...prev, newUser]);
        onUserJoined?.(newUser);
        break;

      case 'user_left':
        setCollaborators((prev) => prev.filter((u) => u.id !== message.data.userId));
        onUserLeft?.(message.data.userId);
        break;

      case 'operation':
        const operation: CollaborationOperation = message.data;
        setVersion((prev) => Math.max(prev, operation.version));
        onOperationReceived?.(operation);
        break;

      case 'cursor':
        setCollaborators((prev) =>
          prev.map((u) =>
            u.id === message.data.userId
              ? { ...u, cursor: message.data.cursor }
              : u
          )
        );
        break;

      case 'selection':
        setCollaborators((prev) =>
          prev.map((u) =>
            u.id === message.data.userId
              ? { ...u, selection: message.data.selection }
              : u
          )
        );
        break;

      case 'presence':
        setCollaborators((prev) =>
          prev.map((u) =>
            u.id === message.data.userId
              ? { ...u, isOnline: true, lastSeen: new Date() }
              : u
          )
        );
        break;

      default:
        console.warn('Unknown collaboration message type:', message.type);
    }
  }, [getUserColor, onCollaboratorsChange, onOperationReceived, onUserJoined, onUserLeft]);

  // 发送操作
  const sendOperation = useCallback((operation: Omit<CollaborationOperation, 'userId' | 'timestamp' | 'version'>) => {
    const fullOperation: CollaborationOperation = {
      ...operation,
      userId,
      timestamp: Date.now(),
      version: version + 1,
    };

    sendMessage({
      type: 'operation',
      documentId,
      data: fullOperation,
    });

    setVersion((prev) => prev + 1);
  }, [sendMessage, documentId, userId, version]);

  // 发送光标位置
  const sendCursor = useCallback((position: { x: number; y: number }) => {
    sendMessage({
      type: 'cursor',
      documentId,
      data: {
        userId,
        position,
      },
    });
  }, [sendMessage, documentId, userId]);

  // 发送选中内容
  const sendSelection = useCallback((selection: { start: number; end: number }) => {
    sendMessage({
      type: 'selection',
      documentId,
      data: {
        userId,
        selection,
      },
    });
  }, [sendMessage, documentId, userId]);

  // 广播在线状态
  const broadcastPresence = useCallback(() => {
    sendMessage({
      type: 'presence',
      documentId,
      data: {
        userId,
        timestamp: Date.now(),
      },
    });
  }, [sendMessage, documentId, userId]);

  // 定期广播在线状态
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      broadcastPresence();
    }, 30000); // 每30秒广播一次

    return () => clearInterval(interval);
  }, [isConnected, broadcastPresence]);

  // 处理协作者离线状态
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCollaborators((prev) =>
        prev.map((u) => {
          const timeSinceLastSeen = now.getTime() - u.lastSeen.getTime();
          return {
            ...u,
            isOnline: timeSinceLastSeen < 60000, // 1分钟内视为在线
          };
        })
      );
    }, 10000); // 每10秒检查一次

    return () => clearInterval(interval);
  }, []);

  return {
    collaborators,
    isCollaborating: isConnected,
    sendOperation,
    sendCursor,
    sendSelection,
    broadcastPresence,
    disconnect,
    reconnect,
    error,
  };
}

export default useCollaboration;
