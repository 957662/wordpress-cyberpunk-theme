'use client';

/**
 * Message Center Component - Central messaging hub
 * Displays all conversations with unread counts and allows
 * managing private messages.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Search, MoreVertical, Trash2, Check, CheckCheck } from 'lucide-react';
import { ChatWindow } from '@/components/chat/chat-window';
import { formatDistanceToNow } from 'date-fns';

// Types
interface Conversation {
  id: number;
  other_user: {
    id: number;
    username: string;
    avatar?: string;
    display_name?: string;
  };
  subject?: string;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  created_at: string;
}

interface User {
  id: number;
  username: string;
  avatar?: string;
}

interface MessageCenterProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export function MessageCenter({ isOpen, onClose, currentUser }: MessageCenterProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load conversations
  useEffect(() => {
    if (!isOpen) return;

    const loadConversations = async () => {
      try {
        setIsLoading(true);
        const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
        const response = await fetch(
          `/api/v1/messages/conversations?page=${page}&per_page=20${searchParam}`
        );
        const data = await response.json();
        setConversations(data.items || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, [isOpen, page, searchQuery]);

  // Load unread count
  useEffect(() => {
    if (!isOpen) return;

    const loadUnreadCount = async () => {
      try {
        const response = await fetch('/api/v1/messages/unread-count');
        const data = await response.json();
        setUnreadCount(data.count || 0);
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
    };

    loadUnreadCount();
  }, [isOpen]);

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const username = conv.other_user.username.toLowerCase();
    const displayName = (conv.other_user.display_name || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return username.includes(query) || displayName.includes(query);
  });

  // Handle conversation select
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  // Render conversation item
  const renderConversationItem = (conversation: Conversation) => {
    const otherUser = conversation.other_user;
    const isActive = selectedConversation?.id === conversation.id;

    return (
      <motion.div
        key={conversation.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        onClick={() => handleSelectConversation(conversation)}
        className={`flex items-center gap-3 p-4 cursor-pointer border-b border-cyber-cyan/10 hover:bg-cyber-cyan/5 transition-colors ${
          isActive ? 'bg-cyber-cyan/10 border-l-4 border-l-cyber-cyan' : ''
        }`}
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {otherUser.avatar ? (
            <img
              src={otherUser.avatar}
              alt={otherUser.username}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-cyber-purple/20 flex items-center justify-center">
              <span className="text-cyber-purple font-semibold text-lg">
                {otherUser.username[0].toUpperCase()}
              </span>
            </div>
          )}
          {conversation.unread_count > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-cyan rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-[#0a0a0f]">
                {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-semibold truncate">
              {otherUser.display_name || otherUser.username}
            </h4>
            {conversation.last_message_at && (
              <span className="text-xs text-gray-500 flex-shrink-0">
                {formatDistanceToNow(new Date(conversation.last_message_at), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 truncate">
            {conversation.last_message || 'No messages yet'}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Message Center */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[480px] bg-[#0a0a0f] border-l border-cyber-cyan/30 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-cyan/20 bg-[#16162a]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <MessageSquare className="w-6 h-6 text-cyber-cyan" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyber-cyan rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-[#0a0a0f]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Messages</h2>
                  <p className="text-xs text-gray-400">{total} conversations</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-cyber-cyan/10 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-cyber-cyan" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="px-6 py-4 border-b border-cyber-cyan/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full bg-[#16162a] border border-cyber-cyan/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan/50"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 border-4 border-cyber-cyan/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-400 text-sm">Loading conversations...</p>
                  </div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6">
                  <MessageSquare className="w-16 h-16 text-cyber-cyan/20 mb-4" />
                  <p className="text-gray-400 text-center">
                    {searchQuery ? 'No conversations found' : 'No conversations yet'}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {searchQuery
                      ? 'Try a different search term'
                      : 'Start a conversation with someone!'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-cyber-cyan/10">
                  <AnimatePresence mode="popLayout">
                    {filteredConversations.map(renderConversationItem)}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-cyber-cyan/20 bg-[#16162a]">
              <button
                onClick={() => {
                  // TODO: Open new conversation modal
                }}
                className="w-full bg-cyber-cyan/20 hover:bg-cyber-cyan/30 border border-cyber-cyan/30 text-cyber-cyan font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                New Conversation
              </button>
            </div>
          </motion.div>

          {/* Chat Window (if conversation selected) */}
          <AnimatePresence>
            {selectedConversation && (
              <ChatWindow
                conversationId={selectedConversation.id}
                otherUser={selectedConversation.other_user}
                currentUser={currentUser}
                onClose={handleBackToList}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
