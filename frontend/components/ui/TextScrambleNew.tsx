'use client';

/**
 * Text Scramble Component
 * 文字乱码动画 - 带有赛博朋克风格的文字乱码动画效果
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TextScrambleProps {
  /**
   * 目标文字
   */
  text: string;

  /**
   * 乱码字符集
   * @default "!<>-_\\/[]{}—=+*^?#________"
   */
  chars?: string;

  /**
   * 动画速度（每帧字符数）
   * @default 1
   */
  speed?: number;

  /**
   * 是否循环播放
   * @default false
   */
  loop?: boolean;

  /**
   * 循环间隔（毫秒）
   * @default 3000
   */
  loopInterval?: number;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 触发动画
   * @default true
   */
  trigger?: boolean;
}

export const TextScrambleNew = ({
  text,
  chars = '!<>-_\\/[]{}—=+*^?#________',
  speed = 1,
  loop = false,
  loopInterval = 3000,
  className,
  trigger = true,
}: TextScrambleProps) => {
  const [scrambledText, setScrambledText] = useState(text);

  useEffect(() => {
    if (!trigger) {
      setScrambledText(text);
      return;
    }

    let frame = 0;
    let animationFrameId: number;
    let intervalId: number;

    const animate = () => {
      const progress = frame / (text.length * (3 - speed));
      const currentText = text
        .split('')
        .map((char, index) => {
          if (index < frame / (3 - speed)) {
            return char;
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      setScrambledText(currentText);
      frame += speed;

      if (frame <= text.length * (3 - speed)) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const startAnimation = () => {
      frame = 0;
      animate();
    };

    startAnimation();

    if (loop) {
      intervalId = window.setInterval(startAnimation, loopInterval);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [text, chars, speed, loop, loopInterval, trigger]);

  return (
    <motion.span
      className={cn('font-mono', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {scrambledText}
    </motion.span>
  );
};

export default TextScrambleNew;
