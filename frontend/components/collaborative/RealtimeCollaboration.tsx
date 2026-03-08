'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Edit3,
  MessageSquare,
  Share2,
  Lock,
  Unlock,
  Save,
  Upload,
  Download,
  Eye,
  Clock,
  UserPlus,
  Sparkles,
  Zap,
  GitBranch,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
export interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: {
    x: number;
    y: number;
    line: number;
    column: number;
  };
  isOnline: boolean;
  lastSeen: Date;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Date;
  position: {
    line: number;
    column: number;
  };
  resolved: boolean;
}

export interface Change {
  id: string;
  authorId: string;
  authorName: string;
  type: 'insert' | 'delete' | 'modify';
  content: string;
  timestamp: Date;
  line: number;
}

export interface RealtimeCollaborationProps {
  className?: string;
  code?: string;
  language?: string;
  readOnly?: boolean;
  showUsers?: boolean;
  showComments?: boolean;
  showChanges?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number;
  onCodeChange?: (code: string) => void;
  onUserJoin?: (userId: string) => void;
  onUserLeave?: (userId: string) => void;
  onCommentAdd?: (comment: Omit<Comment, 'id' | 'timestamp'>) => void;
}

// Avatar Component
const UserAvatar: React.FC<{
  user: Collaborator;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}> = ({ user, size = 'md', showStatus = true }) => {
  const sizeStyles = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  return (
    <div className="relative">
      <div
        className={cn(
          'rounded-full flex items-center justify-center text-white font-semibold',
          sizeStyles[size]
        )}
        style={{ backgroundColor: user.color }}
      >
        {user.name.charAt(0).toUpperCase()}
      </div>
      {showStatus && (
        <div
          className={cn(
            'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-cyber-dark',
            user.isOnline ? 'bg-green-500' : 'bg-gray-500'
          )}
        />
      )}
    </div>
  );
};

// Comment Component
const CommentPanel: React.FC<{
  comments: Comment[];
  onResolve: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ comments, onResolve, onDelete }) => {
  const [newComment, setNewComment] = useState('');

  return (
    <div className="bg-cyber-card border border-cyber-cyan/30 rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyber-cyan" />
          Comments ({comments.length})
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {comments.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            No comments yet
          </div>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                'bg-cyber-dark/50 rounded-lg p-3 border transition-all',
                comment.resolved
                  ? 'border-green-500/30 opacity-60'
                  : 'border-cyber-purple/30'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-xs font-semibold text-cyber-cyan">
                    {comment.authorName}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    Line {comment.position.line}
                  </span>
                </div>
                <div className="flex gap-1">
                  {!comment.resolved && (
                    <button
                      onClick={() => onResolve(comment.id)}
                      className="p-1 hover:bg-green-500/20 rounded transition-all"
                      title="Resolve"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="p-1 hover:bg-red-500/20 rounded transition-all"
                    title="Delete"
                  >
                    <X className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-300">{comment.content}</p>
              {comment.resolved && (
                <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Resolved
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      <div className="relative">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          className="w-full bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan resize-none"
        />
        <button
          disabled={!newComment.trim()}
          className={cn(
            'absolute right-2 bottom-2 p-1.5 rounded-lg transition-all text-xs',
            newComment.trim()
              ? 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-purple'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          )}
        >
          Post
        </button>
      </div>
    </div>
  );
};

// Change History Component
const ChangeHistory: React.FC<{
  changes: Change[];
}> = ({ changes }) => {
  const typeIcons = {
    insert: <Zap className="w-3 h-3 text-green-400" />,
    delete: <X className="w-3 h-3 text-red-400" />,
    modify: <Edit3 className="w-3 h-3 text-yellow-400" />
  };

  return (
    <div className="bg-cyber-card border border-cyber-cyan/30 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
        <GitBranch className="w-4 h-4 text-cyber-cyan" />
        Change History ({changes.length})
      </h3>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {changes.map((change, idx) => (
          <motion.div
            key={change.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-cyber-dark/50 rounded-lg p-3 border border-cyber-cyan/20 hover:border-cyber-cyan/40 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">{typeIcons[change.type]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-cyber-cyan">
                    {change.authorName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(change.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate">
                  Line {change.line}: {change.content}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Cursor Indicator Component
const CursorIndicator: React.FC<{
  collaborator: Collaborator;
}> = ({ collaborator }) => {
  if (!collaborator.cursor) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute pointer-events-none z-10"
      style={{
        left: `${collaborator.cursor.x}px`,
        top: `${collaborator.cursor.y}px`
      }}
    >
      <div
        className="w-0.5 h-5"
        style={{ backgroundColor: collaborator.color }}
      />
      <div
        className="px-2 py-0.5 rounded text-xs text-white ml-1"
        style={{ backgroundColor: collaborator.color }}
      >
        {collaborator.name}
      </div>
    </motion.div>
  );
};

// Main Component
export const RealtimeCollaboration: React.FC<RealtimeCollaborationProps> = ({
  className,
  code = '',
  language = 'typescript',
  readOnly = false,
  showUsers = true,
  showComments = true,
  showChanges = true,
  autoSave = true,
  autoSaveInterval = 30000,
  onCodeChange,
  onUserJoin,
  onUserLeave,
  onCommentAdd
}) => {
  const [content, setContent] = useState(code);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [changes, setChanges] = useState<Change[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save effect
  useEffect(() => {
    if (!autoSave || readOnly) return;

    const interval = setInterval(() => {
      handleSave();
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [content, autoSave, autoSaveInterval, readOnly]);

  // Simulate collaborator movements
  useEffect(() => {
    if (readOnly) return;

    const interval = setInterval(() => {
      setCollaborators(prev =>
        prev.map(user => ({
          ...user,
          cursor: {
            x: Math.random() * 400,
            y: Math.random() * 300,
            line: Math.floor(Math.random() * 50),
            column: Math.floor(Math.random() * 80)
          }
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [readOnly]);

  const handleSave = useCallback(() => {
    if (readOnly) return;
    setIsSaving(true);

    // Simulate save
    setTimeout(() => {
      setLastSaved(new Date());
      setIsSaving(false);
    }, 500);
  }, [readOnly]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    const newContent = e.target.value;
    setContent(newContent);
    onCodeChange?.(newContent);

    // Add to change history
    const change: Change = {
      id: Date.now().toString(),
      authorId: 'current-user',
      authorName: 'You',
      type: 'modify',
      content: newContent.slice(0, 50) + '...',
      timestamp: new Date(),
      line: 1
    };
    setChanges(prev => [change, ...prev].slice(0, 20));
  };

  const handleInviteUser = () => {
    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      name: `User ${collaborators.length + 1}`,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      isOnline: true,
      lastSeen: new Date()
    };
    setCollaborators(prev => [...prev, newCollaborator]);
    onUserJoin?.(newCollaborator.id);
  };

  const handleRemoveUser = (userId: string) => {
    setCollaborators(prev => prev.filter(u => u.id !== userId));
    onUserLeave?.(userId);
  };

  const handleResolveComment = (commentId: string) => {
    setComments(prev =>
      prev.map(c =>
        c.id === commentId ? { ...c, resolved: true } : c
      )
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const exportCode = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn('flex gap-4 h-full', className)}>
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-cyber-cyan/30">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-cyber-cyan" />
              Collaborative Editor
            </h2>
            {readOnly && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-lg">
                <Lock className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-yellow-400">Read-only</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Collaborators */}
            {showUsers && collaborators.length > 0 && (
              <div className="flex items-center gap-2 mr-4">
                <div className="flex -space-x-2">
                  {collaborators.slice(0, 5).map(user => (
                    <UserAvatar key={user.id} user={user} size="sm" />
                  ))}
                  {collaborators.length > 5 && (
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white border-2 border-cyber-dark">
                      +{collaborators.length - 5}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowSharePanel(!showSharePanel)}
                  className="p-2 rounded-lg hover:bg-cyber-cyan/10 transition-all"
                  title="Invite users"
                >
                  <UserPlus className="w-4 h-4 text-cyber-cyan" />
                </button>
              </div>
            )}

            {/* Actions */}
            <button
              onClick={handleSave}
              disabled={readOnly || isSaving}
              className="p-2 rounded-lg hover:bg-cyber-cyan/10 transition-all disabled:opacity-50"
              title="Save"
            >
              <Save className={cn(
                'w-4 h-4',
                isSaving ? 'text-yellow-400 animate-spin' : 'text-cyber-cyan'
              )} />
            </button>
            <button
              onClick={exportCode}
              className="p-2 rounded-lg hover:bg-cyber-cyan/10 transition-all"
              title="Export"
            >
              <Download className="w-4 h-4 text-cyber-cyan" />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-cyber-cyan/10 transition-all"
              title="Share"
            >
              <Share2 className="w-4 h-4 text-cyber-cyan" />
            </button>
          </div>
        </div>

        {/* Save Status */}
        {lastSaved && (
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 relative bg-cyber-card border border-cyber-cyan/30 rounded-xl overflow-hidden">
          <textarea
            ref={editorRef}
            value={content}
            onChange={handleCodeChange}
            readOnly={readOnly}
            placeholder="Start collaborating..."
            className={cn(
              'w-full h-full bg-transparent p-4 font-mono text-sm resize-none focus:outline-none',
              readOnly ? 'text-gray-400 cursor-not-allowed' : 'text-white'
            )}
            style={{
              lineHeight: '1.6',
              tabSize: 2
            }}
          />

          {/* Collaborator Cursors */}
          {collaborators.map(user => (
            <CursorIndicator key={user.id} collaborator={user} />
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 flex flex-col gap-4">
        {/* Collaborators Panel */}
        {showUsers && (
          <div className="bg-cyber-card border border-cyber-cyan/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyber-cyan" />
                Active Users ({collaborators.length})
              </h3>
              <button
                onClick={handleInviteUser}
                className="p-1.5 rounded-lg bg-cyber-cyan/10 hover:bg-cyber-cyan/20 transition-all"
                title="Add user"
              >
                <UserPlus className="w-3.5 h-3.5 text-cyber-cyan" />
              </button>
            </div>

            <div className="space-y-2">
              {collaborators.length === 0 ? (
                <div className="text-center text-gray-500 text-xs py-4">
                  No active collaborators
                </div>
              ) : (
                collaborators.map(user => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-cyber-dark/50 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <UserAvatar user={user} size="sm" />
                      <div>
                        <p className="text-xs font-semibold text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.isOnline ? 'Online' : 'Away'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="p-1 hover:bg-red-500/20 rounded transition-all"
                    >
                      <X className="w-3 h-3 text-red-400" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Comments Panel */}
        {showComments && (
          <CommentPanel
            comments={comments}
            onResolve={handleResolveComment}
            onDelete={handleDeleteComment}
          />
        )}
      </div>

      {/* Share Panel */}
      <AnimatePresence>
        {showSharePanel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowSharePanel(false)}
          >
            <motion.div
              className="bg-cyber-card border border-cyber-cyan/30 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Share Document</h3>
                <button
                  onClick={() => setShowSharePanel(false)}
                  className="p-2 rounded-lg hover:bg-cyber-cyan/10 transition-all"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Share Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value="https://cyberpress.dev/collab/abc123"}
                      readOnly
                      className="flex-1 bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg px-3 py-2 text-sm text-gray-300"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText('https://cyberpress.dev/collab/abc123')}
                      className="px-4 py-2 bg-cyber-cyan text-cyber-dark rounded-lg text-sm font-semibold hover:bg-cyber-purple transition-all"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Permissions
                  </label>
                  <select className="w-full bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg px-3 py-2 text-sm text-white">
                    <option>Can edit</option>
                    <option>Can view</option>
                    <option>Can comment</option>
                  </select>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-cyber-cyan/30 transition-all flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Invite Collaborators
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RealtimeCollaboration;
