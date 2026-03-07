'use client';

/**
 * 打字机效果组件
 * 实现文本逐字显示的动画效果
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TypingEffectProps {
  text: string | string[];
  speed?: number;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
  loop?: boolean;
  onComplete?: () => void;
}

export function TypingEffect({
  text,
  speed = 100,
  deleteSpeed = 50,
  delay = 2000,
  className,
  cursor = true,
  loop = true,
  onComplete,
}: TypingEffectProps) {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const texts = Array.isArray(text) ? text : [text];
  const currentText = texts[textIndex];

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting && displayText === currentText) {
        // 完成输入，暂停
        if (!loop && textIndex === texts.length - 1) {
          onComplete?.();
          return;
        }
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, delay);
      } else if (isDeleting && displayText === '') {
        // 完成删除，切换到下一个文本
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      } else {
        // 输入或删除
        setDisplayText((prev) => {
          if (isDeleting) {
            return prev.slice(0, -1);
          } else {
            return currentText.slice(0, prev.length + 1);
          }
        });
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentText, textIndex, speed, deleteSpeed, delay, loop, texts, onComplete]);

  return (
    <span className={cn('inline-flex', className)}>
      <span className="text-cyber-cyan">{displayText}</span>
      {cursor && (
        <motion.span
          className="inline-block w-0.5 h-5 bg-cyber-cyan ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </span>
  );
}
