/**
 * 文字乱码动画
 * 解密效果的文字动画
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface TextScrambleProps {
  /** 目标文字 */
  text: string;
  /** 字符集 */
  chars?: string;
  /** 动画速度 (ms) */
  speed?: number;
  /** 是否重复动画 */
  repeat?: boolean;
  /** 延迟开始 (ms) */
  delay?: number;
  /** 自定义类名 */
  className?: string;
}

const DEFAULT_CHARS = '!<>-_\\/[]{}—=+*^?#________';

export function TextScramble({
  text,
  chars = DEFAULT_CHARS,
  speed = 50,
  repeat = false,
  delay = 0,
  className,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const scramble = async () => {
    setIsAnimating(true);
    let iteration = 0;
    const maxIterations = text.length * 2;

    const animate = () => {
      return new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          let result = '';
          for (let i = 0; i < text.length; i++) {
            if (i < iteration / 2) {
              result += text[i];
            } else {
              result += chars[Math.floor(Math.random() * chars.length)];
            }
          }

          setDisplayText(result);
          iteration++;

          if (iteration >= maxIterations) {
            clearInterval(interval);
            setDisplayText(text);
            setIsAnimating(false);
            resolve();
          }
        }, speed);
      });
    };

    await animate();

    if (repeat) {
      setTimeout(() => {
        scramble();
      }, 2000);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scramble();
    }, delay);

    return () => clearTimeout(timer);
  }, [text]);

  return (
    <motion.span
      className={className}
      animate={{
        textShadow: isAnimating
          ? [
              '0 0 10px rgba(0, 240, 255, 0)',
              '0 0 20px rgba(0, 240, 255, 0.5)',
              '0 0 10px rgba(0, 240, 255, 0)',
            ]
          : '0 0 10px rgba(0, 240, 255, 0)',
      }}
      transition={{
        duration: 0.5,
        repeat: isAnimating ? Infinity : 0,
      }}
    >
      {displayText}
    </motion.span>
  );
}
