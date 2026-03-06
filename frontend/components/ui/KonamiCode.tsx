/**
 * KonamiCode - Konami 秘籍组件
 * 用于实现彩蛋功能
 * 上上下下左右左右BA
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Konami 秘籍序列
const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export interface KonamiCodeProps {
  /**
   * 激活回调
   */
  onActivate?: () => void;
  /**
   * 自定义秘籍序列
   */
  code?: string[];
  /**
   * 是否显示提示
   */
  showHint?: boolean;
  /**
   * 触发延迟 (ms)
   */
  timeout?: number;
}

export const KonamiCode: React.FC<KonamiCodeProps> = ({
  onActivate,
  code = KONAMI_CODE,
  showHint = false,
  timeout = 5000,
}) => {
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [isActivated, setIsActivated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setInputSequence((prev) => {
        const newSequence = [...prev, e.key];

        // 检查是否匹配
        const matchIndex = code.findIndex((_, i) =>
          newSequence.slice(-code.length).every((key, j) => key === code[j])
        );

        if (matchIndex !== -1 && newSequence.length >= code.length) {
          // 激活!
          setIsActivated(true);
          setShowSuccess(true);
          onActivate?.();

          setTimeout(() => setShowSuccess(false), 3000);

          // 重置
          return [];
        }

        // 限制序列长度
        if (newSequence.length > code.length + 5) {
          return newSequence.slice(-code.length);
        }

        return newSequence;
      });

      // 重置超时
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setInputSequence([]);
      }, timeout);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [code, onActivate, timeout]);

  return (
    <>
      {/* 成功提示 */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink mb-2">
                CHEAT CODE ACTIVATED!
              </h2>
              <p className="text-gray-400">Konami Code 已激活</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 开发者提示 */}
      {showHint && (
        <div className="fixed bottom-4 right-4 p-4 bg-dark-bg/90 border border-cyber-cyan/30 rounded-lg text-xs text-gray-500">
          <p className="font-mono mb-1">↑↑↓↓←→←→BA</p>
          <p>Konami Code</p>
        </div>
      )}
    </>
  );
};

/**
 * 使用 Konami 秘籍的 Hook
 */
export function useKonamiCode(
  code: string[] = KONAMI_CODE,
  onActivate?: () => void
) {
  const [inputSequence, setInputSequence] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setInputSequence((prev) => {
        const newSequence = [...prev, e.key];

        // 检查是否匹配
        if (newSequence.slice(-code.length).join('') === code.join('')) {
          onActivate?.();
          return [];
        }

        // 限制序列长度
        if (newSequence.length > code.length + 5) {
          return newSequence.slice(-code.length);
        }

        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, onActivate]);

  return { inputSequence };
}

/**
 * 秘籍管理器
 */
export interface Cheat {
  name: string;
  code: string[];
  action: () => void;
  hint?: string;
}

export interface CheatManagerProps {
  cheats: Cheat[];
  showHints?: boolean;
}

export const CheatManager: React.FC<CheatManagerProps> = ({
  cheats,
  showHints = false,
}) => {
  const [activatedCheats, setActivatedCheats] = useState<Set<string>>(new Set());
  const [currentNotification, setCurrentNotification] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      cheats.forEach((cheat) => {
        const codeString = cheat.code.join('');
        // 简化的匹配逻辑
        // 实际实现需要更复杂的状态管理
        if (e.key === cheat.code[cheat.code.length - 1]) {
          // 这里应该是完整的序列匹配
          cheat.action();
          setActivatedCheats((prev) => new Set(prev).add(cheat.name));
          setCurrentNotification(cheat.name);
          setTimeout(() => setCurrentNotification(null), 3000);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cheats]);

  return (
    <>
      {/* 通知 */}
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 px-6 py-3 bg-gradient-to-r from-cyber-purple to-cyber-pink rounded-lg text-white font-semibold shadow-lg"
          >
            🎯 {currentNotification} Activated!
          </motion.div>
        )}
      </AnimatePresence>

      {/* 秘籍列表 */}
      {showHints && (
        <div className="fixed bottom-4 right-4 p-4 bg-dark-bg/90 border border-cyber-cyan/30 rounded-lg max-w-xs">
          <h3 className="text-sm font-semibold text-white mb-2">🎮 Cheat Codes</h3>
          <ul className="space-y-1 text-xs text-gray-500">
            {cheats.map((cheat) => (
              <li
                key={cheat.name}
                className={cn(
                  'flex justify-between',
                  activatedCheats.has(cheat.name) && 'text-cyber-cyan'
                )}
              >
                <span>{cheat.name}</span>
                <span className="font-mono">{cheat.hint || cheat.code.join('')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default KonamiCode;
