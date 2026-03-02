'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronUp, MessageCircle, Share2, Bookmark } from 'lucide-react';

interface FloatingActionProps {
  onScrollTop?: () => void;
  onContact?: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

export default function FloatingAction({
  onScrollTop,
  onContact,
  onShare,
  onSave,
}: FloatingActionProps) {
  const [showScroll, setShowScroll] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // 监听滚动显示返回顶部按钮
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setShowScroll(window.scrollY > 300);
    });
  }

  const actions = [
    { icon: MessageCircle, label: '联系', onClick: onContact, color: 'text-cyber-cyan' },
    { icon: Share2, label: '分享', onClick: onShare, color: 'text-cyber-purple' },
    { icon: Bookmark, label: '收藏', onClick: onSave, color: 'text-cyber-pink' },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-3">
      {/* 展开的菜单 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col gap-2"
          >
            {actions.map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.1, x: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  action.onClick?.();
                  setIsExpanded(false);
                }}
                className="w-12 h-12 rounded-lg bg-cyber-darker border border-cyber-cyan/30 flex items-center justify-center hover:bg-cyber-cyan/10 transition-colors group"
                title={action.label}
              >
                <action.icon className={`w-5 h-5 ${action.color} group-hover:scale-110 transition-transform`} />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white flex items-center justify-center shadow-lg shadow-cyber-cyan/30 hover:shadow-cyber-cyan/50 transition-shadow"
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-2xl">+</span>
        </motion.div>
      </motion.button>

      {/* 返回顶部按钮 */}
      <AnimatePresence>
        {showScroll && onScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onScrollTop}
            className="w-12 h-12 rounded-lg bg-cyber-dark border border-cyber-cyan/30 flex items-center justify-center hover:bg-cyber-cyan/10 hover:border-cyber-cyan transition-all"
            title="返回顶部"
          >
            <ChevronUp className="w-5 h-5 text-cyber-cyan" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
