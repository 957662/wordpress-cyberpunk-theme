'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface UseWebSocketOptions {
  onOpen?: (event: WebSocketEventMap['open']) => void;
  onMessage?: (event: WebSocketEventMap['message']) => void;
  onError?: (event: WebSocketEventMap['error']) => void;
  onClose?: (event: WebSocketEventMap['close']) => void;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  heartbeatInterval?: number;
  heartbeatMessage?: string;
}

export interface UseWebSocketReturn {
  websocket: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Event | null;
  sendMessage: (message: string | object) => void;
  sendJsonMessage: <T = any>(data: T) => void;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
}

export function useWebSocket(
  url: string,
  options: UseWebSocketOptions = {}
): UseWebSocketReturn {
  const {
    onOpen,
    onMessage,
    onError,
    onClose,
    reconnectInterval = 3000,
    reconnectAttempts = 5,
    heartbeatInterval = 30000,
    heartbeatMessage = JSON.stringify({ type: 'ping' }),
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Event | null>(null);

  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);

  const clearHeartbeat = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = undefined;
    }
  }, []);

  const startHeartbeat = useCallback(() => {
    clearHeartbeat();
    heartbeatTimeoutRef.current = setInterval(() => {
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(heartbeatMessage);
      }
    }, heartbeatInterval);
  }, [heartbeatInterval, heartbeatMessage, clearHeartbeat]);

  const connect = useCallback(() => {
    if (websocketRef.current?.readyState === WebSocket.OPEN ||
        websocketRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const ws = new WebSocket(url);
      websocketRef.current = ws;

      ws.onopen = (event) => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttemptsRef.current = 0;
        startHeartbeat();
        onOpen?.(event);
      };

      ws.onmessage = (event) => {
        onMessage?.(event);
      };

      ws.onerror = (event) => {
        setError(event);
        onError?.(event);
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);
        clearHeartbeat();
        onClose?.(event);

        // Auto reconnect
        if (reconnectAttemptsRef.current < reconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, reconnectInterval);
        }
      };
    } catch (err) {
      setIsConnecting(false);
      setError(err as Event);
      console.error('WebSocket connection error:', err);
    }
  }, [url, onOpen, onMessage, onError, onClose, reconnectInterval, reconnectAttempts, startHeartbeat, clearHeartbeat]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = undefined;
    }

    clearHeartbeat();

    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
  }, [clearHeartbeat]);

  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    setTimeout(() => connect(), 100);
  }, [disconnect, connect]);

  const sendMessage = useCallback((message: string | object) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      const data = typeof message === 'string' ? message : JSON.stringify(message);
      websocketRef.current.send(data);
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const sendJsonMessage = useCallback(<T = any>(data: T) => {
    sendMessage(JSON.stringify(data));
  }, [sendMessage]);

  // Auto connect on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []); // Only run on mount

  // Update URL when it changes
  useEffect(() => {
    if (isConnected || isConnecting) {
      reconnect();
    }
  }, [url]);

  return {
    websocket: websocketRef.current,
    isConnected,
    isConnecting,
    error,
    sendMessage,
    sendJsonMessage,
    connect,
    disconnect,
    reconnect,
  };
}

export interface WebSocketMessage {
  type: string;
  data?: any;
  id?: string;
  timestamp?: number;
}

export function useWebSocketWithAutoReconnect(
  url: string,
  options: UseWebSocketOptions = {}
) {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  const ws = useWebSocket(url, {
    ...options,
    onMessage: (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
        setMessages((prev) => [...prev, data]);
      } catch {
        // If not JSON, store as string
        const message: WebSocketMessage = {
          type: 'message',
          data: event.data,
          timestamp: Date.now(),
        };
        setLastMessage(message);
        setMessages((prev) => [...prev, message]);
      }
      options.onMessage?.(event);
    },
  });

  const clearMessages = useCallback(() => {
    setMessages([]);
    setLastMessage(null);
  }, []);

  return {
    ...ws,
    messages,
    lastMessage,
    clearMessages,
  };
}

export default useWebSocket;
