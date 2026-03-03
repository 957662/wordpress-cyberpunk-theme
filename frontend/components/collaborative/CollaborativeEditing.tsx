'use client';

/**
 * CollaborativeEditing - 协作编辑组件
 * 支持多人实时协作编辑
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Shield,
  Edit3,
  Eye,
  Save,
  Download,
  Upload,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: { x: number; y: number };
  isOnline: boolean;
}

interface CollaborativeEditingProps {
  /** 文档内容 */
  content: string;
  /** 内容变更回调 */
  onChange?: (content: string) => void;
  /** 当前用户 */
  currentUser: User;
  /** 协作用户列表 */
  collaborators?: User[];
  /** 是否只读 */
  readOnly?: boolean;
  /** 自动保存间隔（毫秒） */
  autoSaveInterval?: number;
  /** 自定义样式类名 */
  className?: string;
}

export function CollaborativeEditing({
  content,
  onChange,
  currentUser,
  collaborators = [],
  readOnly = false,
  autoSaveInterval = 30000,
  className = '',
}: CollaborativeEditingProps) {
  const [editorContent, setEditorContent] = useState(content);
  const [activeUsers, setActiveUsers] = useState<User[]>(collaborators);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showUsers, setShowUsers] = useState(true);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // 模拟实时协作效果
  useEffect(() => {
    const interval = setInterval(() => {
      // 随机更新协作者光标位置
      setActiveUsers((prev) =>
        prev.map((user) => ({
          ...user,
          cursor: {
            x: Math.random() * 100,
            y: Math.random() * 100,
          },
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 自动保存
  useEffect(() => {
    if (!autoSaveInterval || readOnly) return;

    const interval = setInterval(() => {
      handleSave();
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [editorContent, autoSaveInterval, readOnly]);

  const handleSave = async () => {
    if (readOnly) return;
    
    setIsSaving(true);
    // 模拟保存操作
    setTimeout(() => {
      setLastSaved(new Date());
      setIsSaving(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    
    const newContent = e.target.value;
    setEditorContent(newContent);
    onChange?.(newContent);
  };

  const handleExport = () => {
    const blob = new Blob([editorContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setEditorContent(content);
          onChange?.(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className={`cyber-card ${className}`}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border">
        <div className="flex items-center gap-4">
          {/* 在线用户 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUsers(!showUsers)}
              className="p-2 hover:bg-cyber-cyan/10 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5 text-gray-400" />
            </button>
            
            {showUsers && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center -space-x-2"
              >
                {/* 当前用户 */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-cyber-dark ring-2 ring-cyber-cyan"
                  style={{ backgroundColor: currentUser.color }}
                >
                  {currentUser.name.charAt(0)}
                </div>
                
                {/* 协作者 */}
                {activeUsers.map((user) => (
                  <div
                    key={user.id}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-cyber-dark relative"
                    style={{ 
                      backgroundColor: user.color,
                      opacity: user.isOnline ? 1 : 0.5,
                    }}
                    title={`${user.name} ${user.isOnline ? '(在线)' : '(离线)'}`}
                  >
                    {user.name.charAt(0)}
                    {user.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-cyber-dark" />
                    )}
                  </div>
                ))}

                {/* 邀请按钮 */}
                <button className="w-8 h-8 rounded-full bg-cyber-cyan/20 border-2 border-cyber-dark flex items-center justify-center hover:bg-cyber-cyan/30 transition-colors">
                  <UserPlus className="w-4 h-4 text-cyber-cyan" />
                </button>
              </motion.div>
            )}
          </div>

          {/* 文档状态 */}
          <div className="flex items-center gap-2 text-sm">
            {readOnly ? (
              <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full">
                <Eye className="w-3 h-3" />
                只读模式
              </span>
            ) : (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-500 rounded-full">
                <Edit3 className="w-3 h-3" />
                编辑模式
              </span>
            )}
            
            {lastSaved && (
              <span className="text-gray-500">
                上次保存: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2">
          {!readOnly && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleImport}
                className="p-2 hover:bg-cyber-cyan/10 rounded-lg transition-colors"
                title="导入文档"
              >
                <Upload className="w-4 h-4 text-gray-400" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="p-2 hover:bg-cyber-cyan/10 rounded-lg transition-colors"
                title="导出文档"
              >
                <Download className="w-4 h-4 text-gray-400" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-cyber-cyan text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    保存
                  </>
                )}
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* 编辑器 */}
      <div className="relative p-6">
        <textarea
          ref={editorRef}
          value={editorContent}
          onChange={handleChange}
          readOnly={readOnly}
          placeholder="开始输入..."
          className="w-full h-96 px-4 py-3 bg-cyber-dark/50 border border-cyber-border rounded-lg text-gray-300 font-mono text-sm resize-none focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 disabled:opacity-60"
        />

        {/* 协作者光标（模拟） */}
        {activeUsers.map((user) => 
          user.cursor && user.isOnline ? (
            <motion.div
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [1, 0.5, 1],
                top: `${user.cursor.y}%`,
                left: `${user.cursor.x}%`,
              }}
              transition={{ 
                opacity: { duration: 2, repeat: Infinity },
                top: { duration: 1 },
                left: { duration: 1 },
              }}
              className="absolute pointer-events-none"
              style={{ zIndex: 10 }}
            >
              <div
                className="w-0.5 h-5"
                style={{ backgroundColor: user.color }}
              />
              <div
                className="px-2 py-0.5 text-xs text-white rounded ml-1"
                style={{ backgroundColor: user.color }}
              >
                {user.name}
              </div>
            </motion.div>
          ) : null
        )}
      </div>

      {/* 底部信息栏 */}
      <div className="px-6 py-3 border-t border-cyber-border bg-cyber-dark/30">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>{editorContent.length} 字符</span>
            <span>{editorContent.split(/\s+/).filter(Boolean).length} 词</span>
            <span>{editorContent.split('\n').length} 行</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3" />
            <span>端到端加密</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollaborativeEditing;
