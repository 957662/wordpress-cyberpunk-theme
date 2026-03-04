'use client';

/**
 * Chat Window Component - Real-time messaging interface
 * Provides a full-featured chat window with WebSocket support,
 * message history, typing indicators, and more.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Paperclip, MoreVertical, X, Phone, Video } from 'lucide-react';
import { Virtuoso } from 'react-virtuoso';

// Types
interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    id: number;
    username: string;
    avatar?: string;
    display_name?: string;
  };
}

interface User {
  id: number;
  username: string;
  avatar?: string;
  display_name?: string;
  is_online?: boolean;
}

interface ChatWindowProps {
  conversationId: number;
  otherUser: User;
  currentUser: User;
  onClose?: () => void;
}

export function ChatWindow({
  conversationId,
  otherUser,
  currentUser,
  onClose,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: 'LAST',
        behavior: 'smooth',
      });
    }
  }, []);

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/v1/messages/conversations/${conversationId}/messages?page=1&per_page=50`
        );
        const data = await response.json();
        setMessages(data.items || []);
        scrollToBottom();
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();

    // TODO: Setup WebSocket connection
    // const ws = new WebSocket(`ws://localhost:8000/ws/chat/${conversationId}`);
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === 'new_message') {
    //     setMessages((prev) => [...prev, data.message]);
    //     scrollToBottom();
    //   } else if (data.type === 'typing') {
    //     setOtherUserTyping(data.is_typing);
    //   }
    // };
    // return () => ws.close();
  }, [conversationId, scrollToBottom]);

  // Handle typing indicator
  useEffect(() => {
    if (isTyping) {
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Send typing indicator
      // TODO: Send via WebSocket
      // ws.send(JSON.stringify({ type: 'typing', is_typing: true }));

      // Stop typing indicator after 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      const response = await fetch(
        `/api/v1/messages/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: messageContent,
            message_type: 'text',
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const message = await response.json();

      // Add message to list
      setMessages((prev) => [...prev, message]);
      scrollToBottom();

      setIsTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore message on error
      setNewMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render message
  const renderMessage = (message: Message) => {
    const isOwn = message.sender_id === currentUser.id;

    return (
      <div
        key={message.id}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex max-w-[80%] ${isOwn ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
          {/* Avatar */}
          {!isOwn && otherUser.avatar && (
            <img
              src={otherUser.avatar}
              alt={otherUser.username}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          )}

          {/* Message bubble */}
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-cyber-cyan/20 border border-cyber-cyan/30 text-white rounded-br-sm'
                : 'bg-cyber-purple/20 border border-cyber-purple/30 text-white rounded-bl-sm'
            }`}
          >
            <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
            <p className={`text-xs mt-1 ${isOwn ? 'text-cyber-cyan/60' : 'text-cyber-purple/60'}`}>
              {new Date(message.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed bottom-4 right-4 w-96 h-[600px] bg-[#0a0a0f] border border-cyber-cyan/30 rounded-lg shadow-2xl flex flex-col overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-cyan/20 bg-[#16162a]">
        <div className="flex items-center gap-3">
          <div className="relative">
            {otherUser.avatar ? (
              <img
                src={otherUser.avatar}
                alt={otherUser.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-cyber-purple/20 flex items-center justify-center">
                <span className="text-cyber-purple font-semibold">
                  {otherUser.username[0].toUpperCase()}
                </span>
              </div>
            )}
            {otherUser.is_online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0f]" />
            )}
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {otherUser.display_name || otherUser.username}
            </h3>
            <p className="text-xs text-gray-400">
              {otherUserTyping ? 'Typing...' : otherUser.is_online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-cyber-cyan/10 rounded-lg transition-colors">
            <Phone className="w-4 h-4 text-cyber-cyan" />
          </button>
          <button className="p-2 hover:bg-cyber-cyan/10 rounded-lg transition-colors">
            <Video className="w-4 h-4 text-cyber-cyan" />
          </button>
          <button className="p-2 hover:bg-cyber-cyan/10 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-cyber-cyan" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-cyber-cyan/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-400 text-sm">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-400 text-sm">No messages yet</p>
              <p className="text-gray-500 text-xs mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            style={{ height: '100%' }}
            data={messages}
            itemContent={(index, message) => renderMessage(message)}
            initialTopMostItemIndex={messages.length - 1}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-cyber-cyan/20 bg-[#16162a]">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-cyber-cyan/10 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-cyber-cyan" />
          </button>
          <button className="p-2 hover:bg-cyber-cyan/10 rounded-lg transition-colors">
            <Smile className="w-5 h-5 text-cyber-cyan" />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              setIsTyping(true);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-[#0a0a0f] border border-cyber-cyan/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan/50"
            disabled={isSending}
          />

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="p-2 bg-cyber-cyan/20 hover:bg-cyber-cyan/30 border border-cyber-cyan/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-cyber-cyan" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
